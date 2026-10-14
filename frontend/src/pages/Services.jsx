import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa6";
import { healthTools } from "../data/healthTools";

export const services = [
  {
    id: "heart-care",
    title: "Heart Care",
    description: "Monitor cardiovascular risks and treatment pathways.",
    detail: "AI-guided heart monitoring helps detect risks earlier and supports more informed treatment decisions.",
  },
  {
    id: "kidney-care",
    title: "Kidney Care",
    description: "Track kidney health and support better long-term outcomes.",
    detail: "Personalized kidney care recommendations help patients monitor trends and act before complications worsen.",
  },
  {
    id: "liver-care",
    title: "Liver Care",
    description: "Support diagnosis and care planning for liver conditions.",
    detail: "Clinical insight and structured follow-up improve evaluation and treatment planning for liver health concerns.",
  },
  {
    id: "cancer-screening",
    title: "Cancer Screening",
    description: "Assist clinical decisions with AI-guided insights.",
    detail: "Early screening support helps match patients to the right evaluation path and improve care planning.",
  },
  {
    id: "malaria-detection",
    title: "Malaria Detection",
    description: "Fast screening workflows for patient triage and monitoring.",
    detail: "Rapid symptom and risk analysis supports faster triage and more efficient monitoring for malaria cases.",
  },
  {
    id: "pneumonia-analysis",
    title: "Pneumonia Analysis",
    description: "Review patterns and recommendations with clinician oversight.",
    detail: "AI-assisted pattern recognition supports clinicians with data-driven decision support while keeping review in human hands.",
  },
];

const Services = () => {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto mb-10 max-w-3xl text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-700">
          Care for every step
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Medical services
        </h1>
        <p className="mt-4 leading-7 text-slate-600">
          Explore doctor consultations, symptom guidance, and AI-assisted health
          screening tools.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {healthTools.map(({ id, title, description, icon: Icon, tone, type }) => (
          <article
            key={id}
            className="flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${tone}`}
              >
                <Icon aria-hidden="true" />
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {type === "image" ? "Image" : "Health values"}
              </span>
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-slate-900">
              {title}
            </h2>
            <p className="mt-2 flex-1 leading-6 text-slate-600">
              {description}
            </p>
            <Link
              to={`/health-predict/${id}`}
              className="mt-5 inline-flex items-center gap-2 font-extrabold text-cyan-800 hover:text-cyan-950"
            >
              Learn more <FaArrowRight aria-hidden="true" className="text-xs" />
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-5 rounded-3xl bg-[#eaf8f6] p-6 sm:p-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900">
            Looking for a care provider?
          </h2>
          <p className="mt-1 text-slate-600">
            Browse approved doctor profiles and specialties.
          </p>
        </div>
        <Link
          to="/doctors"
          className="rounded-full bg-cyan-700 px-5 py-3 font-bold text-white hover:bg-cyan-800"
        >
          Find a doctor
        </Link>
      </div>
    </section>
  );
};

export default Services;
