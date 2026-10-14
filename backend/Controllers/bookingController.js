import User from "../models/UserSchema.js";
import Doctor from "../models/DoctorSchema.js";
import Booking from "../models/BookingSchema.js";
import Stripe from "stripe";

const clientSiteUrl = () =>
  (process.env.CLIENT_SITE_URL || "http://localhost:5173").replace(/\/$/, "");

export const getCheckoutSession = async (req, res) => {
  try {
    const [doctor, user] = await Promise.all([
      Doctor.findById(req.params.doctorId),
      User.findById(req.userId),
    ]);
    if (!doctor || !user) {
      return res.status(404).json({
        success: false,
        message: !doctor ? "Doctor could not be found." : "Patient account could not be found.",
      });
    }
    const price = Number(doctor.ticketPrice);
    if (!Number.isFinite(price) || price <= 0) {
      return res.status(422).json({
        success: false,
        message: "This doctor's consultation fee is not available for checkout.",
      });
    }

    const clientUrl = clientSiteUrl();
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("Stripe is not configured; creating a clearly labeled demo booking.");
      const sessionId = `demo_${Date.now()}_${doctor.id}`;
      await Booking.create({
        doctor: doctor._id,
        user: user._id,
        ticketPrice: doctor.ticketPrice,
        session: sessionId,
        isPaid: false,
      });
      return res.status(200).json({
        success: true,
        demo: true,
        message: "Demo checkout only. No payment has been collected.",
        session: {
          url: `${clientUrl}/checkout-success?mode=demo&session_id=${encodeURIComponent(sessionId)}`,
        },
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const productData = {
      name: `Appointment with ${doctor.name}`,
      description: doctor.bio || doctor.specialization || "Doctor appointment",
    };
    if (typeof doctor.photo === "string" && /^https:\/\/[^/]+/.test(doctor.photo)) {
      productData.images = [doctor.photo];
    }
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${clientUrl}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${clientUrl}/payment/${doctor.id}?cancelled=1`,
      customer_email: user.email,
      client_reference_id: req.params.doctorId,
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(price * 100),
            product_data: productData,
          },
          quantity: 1,
        },
      ],
    });

    await Booking.create({
      doctor: doctor._id,
      user: user._id,
      ticketPrice: doctor.ticketPrice,
      session: session.id,
      isPaid: false,
    });
    return res.status(200).json({ success: true, demo: false, session });
  } catch (error) {
    console.error("Could not create checkout session:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to create checkout. Please try again.",
    });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  const { sessionId } = req.params;
  try {
    const booking = await Booking.findOne({
      session: sessionId,
      user: req.userId,
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "No booking was found for this checkout session.",
      });
    }
    if (sessionId.startsWith("demo_")) {
      return res.json({
        success: true,
        paid: false,
        demo: true,
        message: "Demo checkout completed. No payment was collected.",
      });
    }
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(503).json({
        success: false,
        message: "Payment verification is not configured.",
      });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    if (paid && !booking.isPaid) {
      booking.isPaid = true;
      await booking.save();
    }
    return res.json({
      success: true,
      paid,
      demo: false,
      message: paid
        ? "Your payment was verified."
        : "Payment is not marked as complete by the payment provider.",
    });
  } catch (error) {
    console.error("Could not verify checkout session:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to verify payment status.",
    });
  }
};
