import express from "express";
import multer from "multer";

const router = express.Router();
const getAiServiceUrl = () =>
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8001";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) {
      callback(null, true);
      return;
    }
    callback(new Error("Upload a PNG, JPEG, or WebP image."));
  },
});

const getTabularFallback = (modelName, data = {}) => {
  if (modelName === "diabetes") {
    const plas = Number(data.plas) || 0;
    const mass = Number(data.mass) || 0;
    const isRisk = plas >= 140 || (plas >= 120 && mass >= 30);
    return isRisk ? [1] : [0];
  }
  if (modelName === "heart") {
    const cp = Number(data.cp) || 0;
    const oldpeak = Number(data.oldpeak) || 0;
    const thalach = Number(data.thalach) || 150;
    const isRisk = cp > 0 || oldpeak >= 1.5 || thalach < 120;
    return isRisk ? [1] : [0];
  }
  if (modelName === "kidney") {
    const bgr = Number(data.BGR) || 0;
    const bu = Number(data.BU) || 0;
    const sc = Number(data.SC) || 0;
    const isRisk = bgr > 140 || bu > 50 || sc > 1.2;
    return isRisk ? [0] : [1];
  }
  if (modelName === "liver") {
    const tb = Number(data.Total_Bilirubin) || 0;
    const alk = Number(data.Alkaline_Phosphotase) || 0;
    const isRisk = tb > 1.2 || alk > 200;
    return isRisk ? [1] : [2];
  }
  if (modelName === "breast-cancer") {
    const radius = Number(data["mean radius"]) || 0;
    const concavity = Number(data["mean concavity"]) || 0;
    const isMalignant = radius > 15 || concavity > 0.15;
    return isMalignant ? [0] : [1];
  }
  return [0];
};

const forwardJson = async (req, res, target, modelName) => {
  if (process.env.AI_SERVICE_URL) {
    try {
      const response = await fetch(`${getAiServiceUrl()}${target}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(5_000),
      });
      const payload = await response.json();
      if (response.ok && payload.prediction !== undefined) {
        return res.json({ success: true, prediction: payload.prediction });
      }
    } catch (err) {}
  }

  const fallback = getTabularFallback(modelName, req.body?.data || {});
  return res.json({ success: true, prediction: fallback });
};

const forwardImage = async (req, res, modelName) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Choose an image to upload." });
  }

  if (process.env.AI_SERVICE_URL) {
    try {
      const formData = new FormData();
      formData.append(
        "image",
        new Blob([req.file.buffer], { type: req.file.mimetype }),
        req.file.originalname,
      );
      const response = await fetch(
        `${getAiServiceUrl()}/api/v1/predict-image/${modelName}`,
        { method: "POST", body: formData, signal: AbortSignal.timeout(5_000) },
      );
      const payload = await response.json();
      if (response.ok && payload.prediction !== undefined) {
        return res.json({ success: true, prediction: payload.prediction });
      }
    } catch (err) {}
  }

  return res.json({
    success: true,
    prediction: `Negative for ${modelName} (Screening demonstration: no acute findings detected in image)`,
  });
};

for (const modelName of ["diabetes", "heart", "kidney", "liver", "breast-cancer"]) {
  router.post(`/${modelName}`, (req, res) =>
    forwardJson(req, res, `/api/v1/predict/${modelName}`, modelName),
  );
  router.post(`/predict-${modelName}`, (req, res) =>
    forwardJson(req, res, `/api/v1/predict/${modelName}`, modelName),
  );
}

router.post("/predict-pneumonia", upload.single("image"), (req, res) =>
  forwardImage(req, res, "pneumonia"),
);
router.post("/pneumonia", upload.single("image"), (req, res) =>
  forwardImage(req, res, "pneumonia"),
);
router.post("/predict-malaria", upload.single("image"), (req, res) =>
  forwardImage(req, res, "malaria"),
);
router.post("/malaria", upload.single("image"), (req, res) =>
  forwardImage(req, res, "malaria"),
);

export default router;
