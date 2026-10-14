import { useContext, useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { FaArrowLeft, FaCreditCard, FaLock } from "react-icons/fa6";
import { authContext } from "../context/AuthContext.jsx";
import { BASE_URL } from "../config";

const PaymentReview = () => {
  const { doctorId } = useParams();
  const [searchParams] = useSearchParams();
  const { token, role } = useContext(authContext);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    const loadDoctor = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors/${doctorId}`, {
          signal: controller.signal,
        });
        const result = await response.json();
        if (!response.ok || !result.data) {
          throw new Error(result.message || "Doctor details could not be loaded.");
        }
        setDoctor(result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Unable to load appointment details.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    loadDoctor();
    return () => controller.abort();
  }, [doctorId]);

  const startCheckout = async () => {
    if (!token || role !== "patient") {
      setErrorMessage("Sign in with a patient account to continue to checkout.");
      return;
    }
    setSubmitting(true);
    setErrorMessage("");
    try {
      const response = await fetch(
        `${BASE_URL}/bookings/checkout-session/${doctorId}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const result = await response.json();
      if (!response.ok || !result.session?.url) {
        throw new Error(result.message || "Checkout could not be started.");
      }
      window.location.assign(result.session.url);
    } catch (error) {
      setErrorMessage(error.message || "Checkout could not be started.");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section role="status" className="mx-auto max-w-4xl px-5 py-16 text-center text-slate-600">
        Loading appointment details…
      </section>
    );
  }

  if (errorMessage && !doctor) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-14">
        <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800">
          {errorMessage}
        </p>
        <Link to="/doctors" className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-800">
          <FaArrowLeft aria-hidden="true" /> Browse doctors
        </Link>
      </section>
    );
  }

  const price = Number(doctor?.ticketPrice);
  const priceText = Number.isFinite(price)
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price)
    : "Contact clinic";
  const isPatient = Boolean(token && role === "patient");

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        to={`/doctors/${doctor._id || doctor.id}`}
        className="inline-flex items-center gap-2 text-sm font-bold text-cyan-800 hover:text-cyan-950"
      >
        <FaArrowLeft aria-hidden="true" /> Back to doctor
      </Link>
      <div className="mt-6">
        <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-cyan-800">
          Appointment checkout
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Review your booking
        </h1>
        <p className="mt-3 max-w-2xl leading-7 text-slate-600">
          Confirm the consultation details, then continue to secure checkout.
          Payment card information is handled by the payment provider and is
          never collected by this site.
        </p>
      </div>

      {searchParams.get("cancelled") === "1" && (
        <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
          Checkout was cancelled. No payment was confirmed; you can try again below.
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-900">Payment method</h2>
          <div className="mt-5 flex items-start gap-4 rounded-2xl border border-cyan-200 bg-cyan-50/70 p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-cyan-800">
              <FaCreditCard aria-hidden="true" />
            </span>
            <div>
              <p className="font-extrabold text-slate-900">Secure card checkout</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                You will be redirected to the configured payment provider to
                enter card details. Do not send card numbers through this form.
              </p>
            </div>
          </div>
          {!isPatient && (
            <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
              <p>Sign in with a patient account before starting checkout.</p>
              <Link to="/login" className="mt-2 inline-block font-extrabold underline">
                Sign in
              </Link>
            </div>
          )}
          {errorMessage && (
            <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">
              {errorMessage}
            </p>
          )}
          <button
            type="button"
            onClick={startCheckout}
            disabled={submitting || !isPatient}
            className="mt-7 w-full rounded-xl bg-cyan-700 px-5 py-3.5 font-extrabold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Preparing secure checkout…" : `Continue to pay ${priceText}`}
          </button>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
            <FaLock aria-hidden="true" />
            Card data stays with the payment provider
          </div>
        </section>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 sm:p-8">
          <h2 className="text-xl font-extrabold text-slate-900">Appointment summary</h2>
          <div className="mt-5 flex items-center gap-4">
            {doctor.photo ? (
              <img src={doctor.photo} alt="" className="h-16 w-16 rounded-2xl object-cover" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl font-extrabold text-cyan-800">
                {doctor.name?.charAt(0) || "D"}
              </div>
            )}
            <div>
              <p className="font-extrabold text-slate-900">{doctor.name}</p>
              <p className="mt-1 text-sm text-slate-600">
                {doctor.specialization || "Consultation"}
              </p>
            </div>
          </div>
          <dl className="mt-6 space-y-3 border-t border-slate-100 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">Consultation fee</dt>
              <dd className="font-bold text-slate-900">{priceText}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-slate-600">Total due</dt>
              <dd className="font-extrabold text-slate-900">{priceText}</dd>
            </div>
          </dl>
          <p className="mt-5 text-xs leading-5 text-slate-500">
            The final amount is charged only after the payment provider confirms
            a successful payment. If this installation is in demo mode, no
            charge will be made.
          </p>
        </aside>
      </div>
    </section>
  );
};

export default PaymentReview;
