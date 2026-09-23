import express from "express";
import { spawn } from "child_process";
import multer from "multer";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const diabetesModel = path.join(__dirname, '..', 'aimodels', 'diabetes.pkl');
const heartModel = path.join(__dirname, '..', 'aimodels', 'heart.pkl');
const kidneyModel = path.join(__dirname, '..', 'aimodels', 'kidney.pkl');
const liverModel = path.join(__dirname, '..', 'aimodels', 'liver.pkl');
const breastCancerModel = path.join(__dirname, '..', 'aimodels', 'breast_cancer.pkl');

const pythonScriptPathForDiabetes = path.join(__dirname, '..', 'predict.py');
const pythonScriptPathForHeart = path.join(__dirname, '..', 'heart.py');
const pythonScriptPathForKidney = path.join(__dirname, '..', 'kidney.py');
const pythonScriptPathForLiver = path.join(__dirname, '..', 'liver.py');
const pythonScriptPathForBreastCancer = path.join(__dirname, '..', 'breast-cancer.py');

const runPythonScript = (scriptPath, args, res) => {
  let responseSent = false;
  try {
    const pythonProcess = spawn("python", [scriptPath, ...args]);
    let prediction = "";

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString());
      prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ prediction });
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
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
};


router.post("/diabetes", (req, res) => {
  const data = req.body.data;
  runPythonScript(pythonScriptPathForDiabetes, ["--loads", diabetesModel, JSON.stringify(data)], res);
});

router.post("/heart", (req, res) => {
  const data = req.body.data;
  runPythonScript(pythonScriptPathForHeart, ["--loads", heartModel, JSON.stringify(data)], res);
});

router.post("/kidney", (req, res) => {
  const data = req.body.data;
  runPythonScript(pythonScriptPathForKidney, ["--loads", kidneyModel, JSON.stringify(data)], res);
});

router.post("/liver", (req, res) => {
  const data = req.body.data;
  runPythonScript(pythonScriptPathForLiver, ["--loads", liverModel, JSON.stringify(data)], res);
});

router.post("/breast-cancer", (req, res) => {
  const data = req.body.data;
  runPythonScript(pythonScriptPathForBreastCancer, ["--loads", breastCancerModel, JSON.stringify(data)], res);
});

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.post("/predict-pneumonia", upload.single("image"), (req, res) => {
  try {
    const imagePath = req.file.path;
    const pythonScriptPathForPneumonia = path.join(__dirname, '..', 'pneumonia.py');

    // Using spawn("python", ...) instead of hardcoded path
    const pythonProcess = spawn("python", [
      pythonScriptPathForPneumonia,
      imagePath,
    ]);

    let prediction = "";
    let responseSent = false;

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString());
      prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ prediction });
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
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});

router.post("/predict-malaria", upload.single("image"), (req, res) => {
  try {
    const imagePath = req.file.path;
    const pythonScriptPathForMalaria = path.join(__dirname, '..', 'malaria.py');

    const pythonProcess = spawn("python", [
      pythonScriptPathForMalaria,
      imagePath,
    ]);

    let prediction = "";
    let responseSent = false;

    pythonProcess.stdout.on("data", (data) => {
      console.log("Python script output:", data.toString());
      prediction += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error("Python script error:", data.toString());
    });

    pythonProcess.on("close", (code) => {
      console.log("Python process closed with code:", code);
      console.log("Prediction:", prediction);
      if (!responseSent) {
        res.json({ prediction });
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
      res.status(500).send("Internal Server Error");
      responseSent = true;
    }
  }
});

export default router;
