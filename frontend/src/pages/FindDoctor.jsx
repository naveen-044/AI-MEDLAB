import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaMagnifyingGlass,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import { BASE_URL } from "../config";

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadDoctors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors`, {
          signal: controller.signal,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(result.message || "Unable to load doctor profiles.");
        }
        setDoctors(Array.isArray(result.data) ? result.data : []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setErrorMessage(
            error.message || "Unable to load doctor profiles. Try again later.",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDoctors();
    return () => controller.abort();
  }, []);

  const filteredDoctors = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return doctors;
    return doctors.filter((doctor) =>
      `${doctor.name || ""} ${doctor.specialization || ""}`
        .toLowerCase()
        .includes(query),
    );
  }, [doctors, search]);

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="rounded-3xl bg-gradient-to-r from-cyan-50 via-white to-amber-50 px-6 py-10 sm:px-10">
        <p className="text-sm font-extrabold uppercase tracking-[0.17em] text-cyan-800">
          Your care team
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Find a doctor
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">
          Browse approved clinician profiles and find someone to discuss your
          health concerns with.
        </p>
        <label className="mt-7 flex max-w-xl items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm focus-within:border-cyan-500 focus-within:ring-4 focus-within:ring-cyan-100">
          <FaMagnifyingGlass
            aria-hidden="true"
            className="shrink-0 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name or specialty"
            aria-label="Search doctors by name or specialty"
            className="min-h-12 w-full border-0 bg-transparent outline-none placeholder:text-slate-400"
          />
        </label>
      </div>

      <div className="mb-5 mt-10 flex items-center justify-between gap-4">
        <h2 className="text-xl font-extrabold text-slate-900">
          {search ? "Search results" : "Available doctors"}
        </h2>
        {!loading && !errorMessage && (
          <span className="text-sm font-medium text-slate-500">
            {filteredDoctors.length}{" "}
            {filteredDoctors.length === 1 ? "profile" : "profiles"}
          </span>
        )}
      </div>

      {loading && (
        <div
          role="status"
          className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-600"
        >
          Loading doctor profiles…
        </div>
      )}
      {errorMessage && (
        <p
          role="alert"
          className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-800"
        >
          {errorMessage}
        </p>
      )}
      {!loading && !errorMessage && filteredDoctors.length === 0 && (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <FaUserDoctor
            aria-hidden="true"
            className="mx-auto text-4xl text-cyan-700"
          />
          <h3 className="mt-4 text-xl font-extrabold text-slate-900">
            {search ? "No matching doctors" : "No doctor profiles yet"}
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-slate-600">
            {search
              ? "Try searching by a different name or specialty."
              : "Approved doctor profiles will appear here when they are available."}
          </p>
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="mt-4 font-bold text-cyan-800 hover:text-cyan-950"
            >
              Clear search
            </button>
          )}
        </div>
      )}
      {!loading && !errorMessage && filteredDoctors.length > 0 && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDoctors.map((doctor) => (
            <article
              key={doctor._id}
              className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex min-h-48 items-center justify-center bg-gradient-to-br from-cyan-100 to-amber-50">
                {doctor.photo ? (
                  <img
                    src={doctor.photo}
                    alt=""
                    className="h-36 w-36 rounded-full border-4 border-white object-cover shadow-md"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-white text-5xl text-cyan-700 shadow-md">
                    <FaUserDoctor aria-hidden="true" />
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900">
                      {doctor.name}
                    </h3>
                    <p className="mt-1 text-sm font-semibold text-cyan-800">
                      {doctor.specialization || "Medical professional"}
                    </p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                    <FaStar aria-hidden="true" />
                    {doctor.averageRating || "New"}
                  </span>
                </div>
                {doctor.about && (
                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                    {doctor.about}
                  </p>
                )}
                <Link
                  to={`/doctors/${doctor._id}`}
                  className="mt-5 inline-flex items-center gap-2 font-bold text-cyan-800 hover:text-cyan-950"
                >
                  View profile <FaArrowRight aria-hidden="true" className="text-xs" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default FindDoctor;
