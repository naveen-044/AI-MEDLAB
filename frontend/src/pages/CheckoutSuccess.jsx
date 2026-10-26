import { useContext, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { FaCircleCheck, FaCircleExclamation } from "react-icons/fa6";
import { authContext } from "../context/AuthContext.jsx";
import { BASE_URL } from "../config";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const { token } = useContext(authContext);
  const [status, setStatus] = useState("checking");
  const [message, setMessage] = useState("");
  const sessionId = searchParams.get("session_id");
  const isDemo = searchParams.get("mode") === "demo";

  useEffect(() => {
    if (isDemo) {
      setStatus("demo");
      setMessage("This was a demonstration checkout. No payment was collected.");
      return undefined;
    }
    if (!sessionId || !token) {
      setStatus("unverified");
      setMessage(
        !sessionId
          ? "No payment session was provided, so payment cannot be confirmed."
          : "Sign in to the same patient account to verify payment status.",
      );
      return undefined;
    }

    const controller = new AbortController();
    const verifyPayment = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/bookings/checkout-session/${encodeURIComponent(sessionId)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          },
        );
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || "Payment status could not be verified.");
        }
        setStatus(result.paid ? "paid" : "unpaid");
        setMessage(result.message || "Payment status received.");
      } catch (error) {
        if (error.name !== "AbortError") {
          setStatus("unverified");
          setMessage(error.message || "Payment status could not be verified.");
        }
      }
    };
    verifyPayment();
    return () => controller.abort();
  }, [isDemo, sessionId, token]);

  const confirmed = status === "paid";
  const demo = status === "demo";
  const checking = status === "checking";

  return (
    <section className="mx-auto flex min-h-[65vh] max-w-3xl items-center px-5 py-12">
      <div className="w-full rounded-3xl border border-slate-200 bg-white p-7 text-center shadow-lg shadow-slate-900/5 sm:p-12">
        {confirmed ? (
          <FaCircleCheck aria-hidden="true" className="mx-auto text-6xl text-emerald-600" />
        ) : (
          <FaCircleExclamation
            aria-hidden="true"
            className={`mx-auto text-6xl ${demo ? "text-cyan-700" : "text-amber-600"}`}
          />
        )}
        <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.16em] text-cyan-800">
          {checking ? "Verifying checkout" : demo ? "Demo checkout" : "Payment status"}
        </p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">
          {checking
            ? "Checking payment confirmation…"
            : confirmed
              ? "Payment confirmed"
              : demo
                ? "No payment was taken"
                : "Payment not confirmed"}
        </h1>
        <p role="status" className="mx-auto mt-4 max-w-xl leading-7 text-slate-600">
          {message}
        </p>
        {status === "unverified" && !token && sessionId && (
          <Link
            to="/login"
            className="mt-6 inline-flex rounded-full bg-cyan-700 px-6 py-3 font-extrabold text-white hover:bg-cyan-800"
          >
            Sign in to verify
          </Link>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/home"
            className="inline-flex rounded-full bg-cyan-700 px-6 py-3 font-extrabold text-white hover:bg-cyan-800"
          >
            Go to home
          </Link>
          <Link
            to="/doctors"
            className="inline-flex rounded-full border border-slate-200 px-6 py-3 font-extrabold text-slate-700 hover:bg-slate-50"
          >
            Browse doctors
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CheckoutSuccess;
