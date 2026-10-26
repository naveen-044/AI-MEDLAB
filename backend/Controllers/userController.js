import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";
import { connectDB } from "../db.js";

export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    await connectDB();
    const updated = await User.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update",
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await connectDB();
    await User.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Successfully deleted",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};

export const getSingleUser = async (req, res) => {
  const id = req.params.id;
  try {
    await connectDB();
    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Found",
      data: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Failed to find user",
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    await connectDB();
    const users = await User.find({}).select("-password");
    return res.status(200).json({
      success: true,
      message: "Users Found",
      data: users || [],
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: "Users Found",
      data: [],
    });
  }
};

export const getUserProfile = async (req, res) => {
  const userId = req.userId;

  try {
    await connectDB();
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const { password, ...rest } = user._doc;

    return res.status(200).json({
      success: true,
      message: "Profile info is getting",
      data: { ...rest },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong, cannot get this",
    });
  }
};

export const getMyAppointments = async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find({ user: req.userId });
    const doctorIds = bookings
      .map((el) => el.doctor?._id || el.doctor?.id || el.doctor)
      .filter(Boolean);
    const doctors = await Doctor.find({ _id: { $in: doctorIds } }).select(
      "-password"
    );
    return res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: doctors || [],
    });
  } catch (error) {
    return res.status(200).json({
      success: true,
      message: "Appointments are getting",
      data: [],
    });
  }
};

export const createAppointment = async (req, res) => {
  try {
    await connectDB();
    const { doctorId, ...appointmentData } = req.body;
    if (!doctorId) {
      return res.status(400).json({
        success: false,
        message: "Doctor ID is required",
      });
    }

    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(400).json({
        success: false,
        message: "This Doctor is not available now",
      });
    }
    const appointment = {
      patientName: appointmentData.patientName,
      patientGender: appointmentData.patientGender,
      payment: appointmentData.payment,
      price: appointmentData.price,
      bookedOn: appointmentData.bookedOn,
      testName: appointmentData.testName,
      testResult: appointmentData.testResult,
    };
    doctor.appointments.push(appointment);

    await doctor.save();
    return res.status(200).json({
      success: true,
      data: doctor,
      message: "Appoint booking done",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
