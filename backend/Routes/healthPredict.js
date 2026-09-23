import express from "express";
import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router({ mergeParams: true });

const pythonScriptPathForSymptoms = path.join(__dirname, '..', 'symptoms.py');
const symptomsModel = path.join(__dirname, '..', 'aimodels', 'svc.pkl');

router.post("/symptoms", (req, res) => {
  let responseSent = false;
  try {
    const data = req.body.data;
    console.log({ dataInString: JSON.stringify({ data }) });
    const pythonProcess = spawn("python", [
      pythonScriptPathForSymptoms,
      "--loads",
      symptomsModel,
      JSON.stringify({ data }),
    ]);
    let prediction;
    pythonProcess.stdout.on("data", (data) => {
      const dataString = data.toString();
      console.log("Python script output===========:", JSON.parse(dataString));
      prediction = JSON.parse(dataString);
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ data: prediction });
        responseSent = true;
      }
    });
    pythonProcess.on("error", (error) => {
      console.error("Python process error:", error);
      if (!responseSent) {
        res.status(500).send("Internal Server Error");
        responseSent = true;
      }
    });
  } catch (error) {
    console.error("Error:", error);
    if (!responseSent) {
      responseSent = true;
      return res.status(500).send("Internal Server Error");
    }
  }
});

export default router;
