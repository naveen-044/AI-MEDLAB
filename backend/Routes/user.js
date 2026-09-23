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

router.get("/:id", authenticate, restrict(["patient", "assistant"]), getSingleUser); // Fetch a single user
router.get("/", authenticate, restrict(["admin"]), getAllUsers); // Fetch all users
router.delete("/:id", authenticate, restrict(["patient", "assistant"]), deleteUser); // Delete a user
router.put("/:id", authenticate, restrict(["patient", "assistant"]), updateUser); // Update a user
router.get("/profile/me", authenticate, restrict(["patient", "assistant"]), getUserProfile); // get userProfile
router.get(
  "/appointments/my-appointments",
  authenticate,
  restrict(["patient", "assistant"]),
  getMyAppointments
); // get myappointments
router.post(
  "/appointments/create-appointment",
  authenticate,
  restrict(["patient", "assistant"]),
  createAppointment
); // create appointment

export default router;
