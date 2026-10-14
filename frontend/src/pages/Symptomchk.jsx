import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCircleCheck,
  FaHeartPulse,
  FaShieldHeart,
  FaStethoscope,
} from "react-icons/fa6";
import { BASE_URL } from "../config";

const suggestedSymptoms = [
  "headache",
  "fatigue",
  "cough",
  "nausea",
  "high fever",
  "joint pain",
];

const toList = (value) => {
  if (Array.isArray(value)) return value.flat(Infinity).filter(Boolean);
  if (typeof value !== "string" || !value.trim()) return [];
  const normalized = value.trim();
  try {
    const parsed = JSON.parse(normalized);
    if (Array.isArray(parsed)) return parsed.flatMap((item) => toList(item));
    if (typeof parsed === "string" && parsed !== normalized) {
      return toList(parsed);
    }
  } catch {
    // Some project datasets are stored as Python-style list strings.
  }

  if (normalized.includes("Name: workout")) {
    return normalized
      .split(/\r?\n/)
      .filter((line) => !/Name: workout|dtype: object/.test(line))
      .map((line) => line.replace(/^\s*\d+\s+/, "").trim())
      .filter(Boolean);
  }

  if (normalized.startsWith("[") && normalized.endsWith("]")) {
    const quotedItems = [...normalized.matchAll(/'([^']*)'/g)].map(
      (match) => match[1],
    );
    if (quotedItems.length) return quotedItems;
  }

  return normalized
    .split(/\r?\n/)
    .map((item) => item.replace(/^\s*\d+\s+/, "").trim())
    .filter(Boolean);
};

const Symptomchk = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);

  const addSymptom = (symptom) => {
    const current = symptoms
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean);
    if (!current.includes(symptom)) {
      setSymptoms([...current, symptom].join(", "));
    }
  };

  const handlePrediction = async (event) => {
    event.preventDefault();
    const normalizedSymptoms = symptoms
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    if (!normalizedSymptoms.length) {
      setErrorMessage("Enter at least one symptom to continue.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setResult(null);

    try {
      const response = await fetch(`${BASE_URL}/symptoms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: normalizedSymptoms }),
      });
      const responseBody = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(
          responseBody.message || "The symptom screening could not be completed.",
        );
      }

      const prediction = responseBody.data;
      if (!prediction?.predicted_disease) {
        throw new Error("The screening service returned no prediction.");
      }
      setResult(prediction);
    } catch (error) {
      setErrorMessage(
        error.message || "Unable to reach the screening service. Try again later.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mx-auto max-w-3xl text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-2xl text-rose-700">
          <FaHeartPulse aria-hidden="true" />
        </span>
        <p className="mt-5 text-sm font-extrabold uppercase tracking-[0.17em] text-cyan-800">
          AI-assisted symptom guidance
        </p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Health care center
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Describe the symptoms you are experiencing. You can enter more than
          one, separated by commas.
        </p>
      </div>

      <form
        onSubmit={handlePrediction}
        className="mx-auto mt-8 max-w-4xl rounded-3xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5 sm:p-8"
      >
        <label
          htmlFor="symptoms"
          className="mb-2 block text-sm font-extrabold text-slate-800"
        >
          What symptoms are you experiencing?
        </label>
        <textarea
          id="symptoms"
          name="symptoms"
          rows={4}
          value={symptoms}
          onChange={(event) => setSymptoms(event.target.value)}
          placeholder="For example: headache, fatigue, nausea"
          className="w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-600 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          required
        />
        <div className="mt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Common symptoms
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestedSymptoms.map((symptom) => (
              <button
                key={symptom}
                type="button"
                onClick={() => addSymptom(symptom)}
                className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-semibold capitalize text-slate-600 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800"
              >
                + {symptom}
              </button>
            ))}
          </div>
        </div>

        {errorMessage && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800"
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 px-5 py-3.5 font-extrabold text-white transition hover:bg-cyan-800 disabled:cursor-wait disabled:opacity-60"
        >
          {isLoading ? "Reviewing your symptoms…" : "Get symptom guidance"}
          {!isLoading && <FaArrowRight aria-hidden="true" />}
        </button>
      </form>

      {result && (
        <section
          aria-live="polite"
          className="mx-auto mt-8 max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5"
        >
          <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 p-6 sm:p-8">
            <p className="text-sm font-extrabold uppercase tracking-wide text-cyan-800">
              Demonstration model screening result
            </p>
            <h2 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {result.predicted_disease}
            </h2>
            <p className="mt-2 max-w-2xl leading-6 text-slate-600">
              This is a model-generated suggestion based on the symptoms
              entered, not a diagnosis.
            </p>
          </div>

          <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-8">
            <article className="rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:col-span-2">
              <h3 className="flex items-center gap-2 font-extrabold text-slate-900">
                <FaStethoscope aria-hidden="true" className="text-cyan-700" />
                About this result
              </h3>
              <p className="mt-2 leading-6 text-slate-600">
                {result.dis_des || "No additional information is available."}
              </p>
            </article>
            {[
              ["Precautions", result.my_precautions],
              ["General wellbeing", result.rec_diet],
              ["Activity suggestions", result.workout],
            ].map(([title, value]) => {
              const items = toList(value);
              if (!items.length) return null;
              return (
                <article
                  key={title}
                  className="rounded-2xl border border-slate-100 bg-white p-5"
                >
                  <h3 className="font-extrabold text-slate-900">{title}</h3>
                  <ul className="mt-3 space-y-2">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-sm leading-6 text-slate-600"
                      >
                        <FaCircleCheck
                          aria-hidden="true"
                          className="mt-1 shrink-0 text-emerald-600"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          <div className="flex items-start gap-3 border-t border-amber-200 bg-amber-50 p-5 text-sm leading-6 text-amber-950 sm:p-6">
            <FaShieldHeart aria-hidden="true" className="mt-1 shrink-0" />
            <p>
              This information is educational and cannot confirm or rule out a
              condition. It is not medical advice. Please consult a qualified
              clinician, especially if symptoms are severe or worsening.
            </p>
          </div>
        </section>
      )}

      <div className="mx-auto mt-8 flex max-w-4xl flex-wrap items-center justify-between gap-4 rounded-2xl border border-cyan-100 bg-[#eaf8f6] p-5">
        <p className="font-bold text-slate-800">
          Prefer to speak with a clinician?
        </p>
        <Link
          to="/doctors"
          className="inline-flex items-center gap-2 font-extrabold text-cyan-800 hover:text-cyan-950"
        >
          Find a doctor <FaArrowRight aria-hidden="true" className="text-xs" />
        </Link>
      </div>
    </section>
  );
};

export default Symptomchk;
