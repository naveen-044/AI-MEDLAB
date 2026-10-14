import { Link } from "react-router-dom";
import { FaArrowLeft, FaHeartPulse } from "react-icons/fa6";

const NotFound = () => (
  <section className="mx-auto max-w-3xl px-5 py-16 text-center sm:py-24">
    <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-50 text-2xl text-cyan-800">
      <FaHeartPulse aria-hidden="true" />
    </span>
    <p className="mt-6 text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-800">
      Page not found
    </p>
    <h1 className="mt-2 text-4xl font-extrabold text-slate-900">
      Let’s get you back on track.
    </h1>
    <p className="mt-4 text-slate-600">
      That page may have moved, or the link may be out of date.
    </p>
    <Link
      to="/"
      className="mt-7 inline-flex items-center gap-2 rounded-full bg-cyan-700 px-6 py-3 font-extrabold text-white hover:bg-cyan-800"
    >
      <FaArrowLeft aria-hidden="true" /> Back to home
    </Link>
  </section>
);

export default NotFound;
