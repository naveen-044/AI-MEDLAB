import express from "express";

const router = express.Router({ mergeParams: true });
const getAiServiceUrl = () =>
  process.env.AI_SERVICE_URL || "http://127.0.0.1:8001";

router.post("/symptoms", async (req, res) => {
  try {
    const response = await fetch(
      `${getAiServiceUrl()}/api/v1/predict-symptoms`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
        signal: AbortSignal.timeout(95_000),
      },
    );
    const payload = await response.json();
    if (!response.ok) {
      const detail = payload.detail;
      return res.status(response.status).json({
        success: false,
        message:
          typeof detail === "string"
            ? detail
            : detail?.message || "The symptom screening service rejected the request.",
      });
    }
    return res.json({ success: true, data: payload.prediction });
  } catch (error) {
    console.error("Symptom model service request failed:", error.message);
    return res.status(error.name === "TimeoutError" ? 504 : 503).json({
      success: false,
      message:
        error.name === "TimeoutError"
          ? "The symptom screening request timed out."
          : "The screening service is unavailable. Start the FastAPI service and try again.",
    });
  }
});

export default router;
