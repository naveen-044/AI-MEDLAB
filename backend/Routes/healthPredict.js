import express from "express";
import knowledgeBase from "../symptom_knowledge_base.js";

const router = express.Router({ mergeParams: true });
const getAiServiceUrl = () =>
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8001";

const getLocalPrediction = (rawSymptoms) => {
  if (!knowledgeBase) return null;
  const list = (Array.isArray(rawSymptoms) ? rawSymptoms : [rawSymptoms])
    .flatMap((s) => (typeof s === "string" ? s.split(",") : []))
    .map((s) => s.trim().toLowerCase().replace(/[\s-]+/g, "_"))
    .filter(Boolean);

  let best = "Common Cold";
  let maxScore = -1;

  for (const [disease, info] of Object.entries(knowledgeBase)) {
    const diseaseSymptoms = (info.symptoms || []).map((s) =>
      s.trim().toLowerCase().replace(/[\s-]+/g, "_")
    );
    let matchCount = 0;
    for (const input of list) {
      if (diseaseSymptoms.some((ds) => ds.includes(input) || input.includes(ds))) {
        matchCount++;
      }
    }
    const score = matchCount / (diseaseSymptoms.length || 1) + matchCount * 2;
    if (matchCount > 0 && score > maxScore) {
      maxScore = score;
      best = disease;
    }
  }

  const info = knowledgeBase[best] || {};
  return {
    predicted_disease: best,
    dis_des: info.description || "",
    my_precautions: info.precautions || [],
    rec_diet: info.diet || "[]",
    workout: info.workout || "[]",
  };
};

router.post("/symptoms", async (req, res) => {
  if (process.env.AI_SERVICE_URL) {
    try {
      const response = await fetch(
        `${getAiServiceUrl()}/api/v1/predict-symptoms`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(req.body),
          signal: AbortSignal.timeout(5_000),
        },
      );
      const payload = await response.json();
      if (response.ok && payload.prediction) {
        return res.json({ success: true, data: payload.prediction });
      }
    } catch (err) {
      //
    }
  }

  const localResult = getLocalPrediction(req.body?.data);
  if (localResult) {
    return res.json({ success: true, data: localResult });
  }

  return res.status(503).json({
    success: false,
    message: "The symptom screening service is unavailable. Please try again later.",
  });
});

export default router;
