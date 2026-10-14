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

const forwardJson = async (req, res, target) => {
  try {
    const response = await fetch(`${getAiServiceUrl()}${target}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: AbortSignal.timeout(95_000),
    });
    const payload = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message:
          typeof payload.detail === "string"
            ? payload.detail
            : payload.detail?.message || "The screening service rejected the request.",
        details: typeof payload.detail === "object" ? payload.detail : undefined,
      });
    }
    return res.json({ success: true, prediction: payload.prediction });
  } catch (error) {
    console.error(`AI model service request failed (${target}):`, error.message);
    return res.status(error.name === "TimeoutError" ? 504 : 503).json({
      success: false,
      message:
        error.name === "TimeoutError"
          ? "The screening request timed out."
          : "The screening service is unavailable. Start the FastAPI service and try again.",
    });
  }
};

const forwardImage = async (req, res, modelName) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "Choose an image to upload." });
  }

  try {
    const formData = new FormData();
    formData.append(
      "image",
      new Blob([req.file.buffer], { type: req.file.mimetype }),
      req.file.originalname,
    );
    const response = await fetch(
      `${getAiServiceUrl()}/api/v1/predict-image/${modelName}`,
      { method: "POST", body: formData, signal: AbortSignal.timeout(95_000) },
    );
    const payload = await response.json();
    if (!response.ok) {
      const detail = payload.detail;
      return res.status(response.status).json({
        success: false,
        message:
          typeof detail === "string"
            ? detail
            : detail?.message || "The screening service rejected the image.",
      });
    }
    return res.json({ success: true, prediction: payload.prediction });
  } catch (error) {
    console.error(`AI image service request failed (${modelName}):`, error.message);
    return res.status(error.name === "TimeoutError" ? 504 : 503).json({
      success: false,
      message:
        error.name === "TimeoutError"
          ? "The image screening request timed out."
          : "The screening service is unavailable. Try again later.",
    });
  }
};

for (const modelName of ["diabetes", "heart", "kidney", "liver", "breast-cancer"]) {
  router.post(`/${modelName}`, (req, res) =>
    forwardJson(req, res, `/api/v1/predict/${modelName}`),
  );
}

router.post("/predict-pneumonia", upload.single("image"), (req, res) =>
  forwardImage(req, res, "pneumonia"),
);
router.post("/predict-malaria", upload.single("image"), (req, res) =>
  forwardImage(req, res, "malaria"),
);

export default router;
