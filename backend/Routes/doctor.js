import express from "express";
import {
  updateDoctor,
  deleteDoctor,
  getAllDoctors,
  getSingleDoctor,
  getDoctorProfile,
} from "../Controllers/doctorController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";
import reviewRouter from "./review.js";

const router = express.Router();

router.use("/:doctorId/reviews", reviewRouter);

router.get("/profile/me", authenticate, restrict(["doctor"]), (req, res) => {
  getDoctorProfile(req, res);
});

router.get("/", getAllDoctors);
router.get("/:id", getSingleDoctor);
router.delete("/:id", authenticate, restrict(["doctor"]), deleteDoctor);
router.put("/:id", authenticate, restrict(["doctor"]), updateDoctor);

export default router;
