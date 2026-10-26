import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaGraduationCap,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import { BASE_URL } from "../config";

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const qualifications = Array.isArray(doctor?.qualifications)
    ? doctor.qualifications
        .map((item) => {
          if (typeof item === "string") return item;
          if (!item || typeof item !== "object") return "";
          return (
            item.qualification ||
            item.degree ||
            item.name ||
            item.title ||
            ""
          );
        })
        .filter(Boolean)
        .join(", ")
    : "";

  useEffect(() => {
    const controller = new AbortController();

    const loadDoctor = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors/${id}`, {
          signal: controller.signal,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.data) {
          throw new Error(result.message || "Doctor profile could not be found.");
        }
        setDoctor(result.data);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(error.message || "Unable to load this doctor profile.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDoctor();
    return () => controller.abort();
  }, [id]);

  if (loading) {
    return (
      <section
        role="status"
        className="mx-auto max-w-4xl px-5 py-16 text-center text-slate-600"
      >
        Loading doctor profile…
      </section>
    );
  }

  if (errorMessage || !doctor) {
    return (
      <section className="mx-auto max-w-3xl px-5 py-14">
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          {errorMessage || "Doctor profile could not be found."}
        </p>
        <Link
          to="/doctors"
          className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-800"
        >
          <FaArrowLeft aria-hidden="true" /> Back to doctors
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        to="/doctors"
        className="inline-flex items-center gap-2 text-sm font-bold text-cyan-800 hover:text-cyan-950"
      >
        <FaArrowLeft aria-hidden="true" /> All doctors
      </Link>

      <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5">
        <div className="grid md:grid-cols-[0.8fr_1.2fr]">
          <div className="flex min-h-72 items-center justify-center bg-gradient-to-br from-cyan-100 to-amber-50 p-8">
            {doctor.photo ? (
              <img
                src={doctor.photo}
                alt=""
                className="h-52 w-52 rounded-full border-4 border-white object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center rounded-full border-4 border-white bg-white text-8xl text-cyan-700 shadow-lg">
                <FaUserDoctor aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-emerald-800">
                Approved clinician
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
                <FaStar aria-hidden="true" />
                {doctor.averageRating || "New profile"}
              </span>
            </div>
            <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {doctor.name}
            </h1>
            <p className="mt-2 text-lg font-bold text-cyan-800">
              {doctor.specialization || "Medical professional"}
            </p>
            {doctor.bio && (
              <p className="mt-4 leading-7 text-slate-600">{doctor.bio}</p>
            )}

            <div className="mt-7 grid gap-4 border-y border-slate-100 py-5 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <FaGraduationCap
                  aria-hidden="true"
                  className="mt-1 text-lg text-cyan-700"
                />
                <div>
                  <p className="text-sm font-extrabold text-slate-800">
                    Qualifications
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {qualifications || "Contact the clinic for details"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-extrabold text-slate-800">
                  Consultation fee
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {doctor.ticketPrice
                    ? `$${doctor.ticketPrice}`
                    : "Contact the clinic for details"}
                </p>
              </div>
            </div>

            {doctor.about && (
              <div className="mt-6">
                <h2 className="font-extrabold text-slate-900">About</h2>
                <p className="mt-2 whitespace-pre-line leading-7 text-slate-600">
                  {doctor.about}
                </p>
              </div>
            )}

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                to={`/payment/${doctor._id || doctor.id}`}
                className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-6 py-3 font-extrabold text-white transition hover:bg-cyan-800"
              >
                Continue to appointment checkout
              </Link>
              <p className="text-xs text-slate-500">
                Booking availability depends on the clinic.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoctorProfile;
