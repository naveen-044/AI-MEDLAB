import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaFlask,
  FaHeartPulse,
  FaLungs,
  FaShieldHeart,
} from "react-icons/fa6";

const capabilities = [
  {
    value: "7",
    label: "screening workflows",
    detail: "Five structured-data models and two image-screening workflows.",
    icon: FaFlask,
    tone: "bg-cyan-50 text-cyan-800",
  },
  {
    value: "41",
    label: "symptom-associated conditions",
    detail: "The current symptom guidance model maps inputs to a listed condition.",
    icon: FaHeartPulse,
    tone: "bg-rose-50 text-rose-700",
  },
  {
    value: "3",
    label: "care roles",
    detail: "Patient, doctor, and lab assistant account roles are supported.",
    icon: FaShieldHeart,
    tone: "bg-emerald-50 text-emerald-800",
  },
  {
    value: "2",
    label: "image workflows",
    detail: "Malaria blood-cell and pneumonia chest X-ray screening endpoints.",
    icon: FaLungs,
    tone: "bg-violet-50 text-violet-700",
  },
];

const modelGroups = [
  {
    title: "Structured health measurements",
    description:
      "Enter the measurements expected by a selected model. The service returns the available model output without converting it into an unsupported probability or clinical claim.",
    items: [
      "Diabetes screening",
      "Heart health",
      "Kidney health",
      "Liver health",
      "Breast screening",
    ],
  },
  {
    title: "Medical-image screening",
    description:
      "Submit a supported image to the relevant screening endpoint. The underlying model and image quality affect its output.",
    items: ["Malaria blood-cell image", "Pneumonia chest X-ray"],
  },
];

const ResultsAnalysis = () => (
  <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-800">
        System overview
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
        Results &amp; analysis
      </h1>
      <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
        A transparent overview of the health-screening tools currently
        represented in AI-MedLab. Counts describe implemented model workflows;
        they are not measures of clinical performance.
      </p>
    </div>

    <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {capabilities.map(({ value, label, detail, icon: Icon, tone }) => (
        <article
          key={label}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <span
            className={`flex h-11 w-11 items-center justify-center rounded-2xl text-lg ${tone}`}
          >
            <Icon aria-hidden="true" />
          </span>
          <p className="mt-5 text-3xl font-extrabold text-slate-900">{value}</p>
          <h2 className="mt-1 font-extrabold capitalize text-slate-800">
            {label}
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">{detail}</p>
        </article>
      ))}
    </div>

    <div className="mt-12 grid gap-5 lg:grid-cols-2">
      {modelGroups.map((group) => (
        <article
          key={group.title}
          className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8"
        >
          <h2 className="text-xl font-extrabold text-slate-900">
            {group.title}
          </h2>
          <p className="mt-3 leading-7 text-slate-600">{group.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {group.items.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </article>
      ))}
    </div>

    <div className="mt-12 rounded-3xl border border-amber-200 bg-amber-50 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <FaShieldHeart
          aria-hidden="true"
          className="mt-1 shrink-0 text-2xl text-amber-800"
        />
        <div>
          <h2 className="text-xl font-extrabold text-amber-950">
            Clinical limitations and safe use
          </h2>
          <p className="mt-3 max-w-4xl leading-7 text-amber-950/80">
            The available project files do not provide independent clinical
            validation, evaluation metrics, or confirmed patient outcomes for
            these models. Model output is informational decision support only;
            it cannot confirm or rule out a disease and must not replace
            professional evaluation. Do not use it to start, stop, or change
            treatment.
          </p>
        </div>
      </div>
    </div>

    <div className="mt-10 flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#eaf8f6] p-6 sm:p-8">
      <div>
        <h2 className="text-xl font-extrabold text-slate-900">
          Explore the available screening tools
        </h2>
        <p className="mt-1 text-slate-600">
          Review the input fields and limitations before continuing.
        </p>
      </div>
      <Link
        to="/health-predict"
        className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-5 py-3 font-extrabold text-white transition hover:bg-cyan-800"
      >
        HealthPredict <FaArrowRight aria-hidden="true" className="text-xs" />
      </Link>
    </div>
  </section>
);

export default ResultsAnalysis;
