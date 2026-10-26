import express from "express";
import {
  updateUser,
  deleteUser,
  getAllUsers,
  getSingleUser,
  getUserProfile,
  getMyAppointments,
  createAppointment,
} from "../Controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/profile/me", authenticate, restrict(["patient", "assistant"]), getUserProfile);
router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient", "assistant"]),
  getMyAppointments
);
router.post(
  "/appointments/create-appointment",
  authenticate,
  restrict(["patient", "assistant"]),
  createAppointment
);

router.get("/:id", authenticate, restrict(["patient", "assistant"]), getSingleUser);
router.get("/", authenticate, restrict(["admin"]), getAllUsers);
router.delete("/:id", authenticate, restrict(["patient", "assistant"]), deleteUser);
router.put("/:id", authenticate, restrict(["patient", "assistant"]), updateUser);

export default router;
