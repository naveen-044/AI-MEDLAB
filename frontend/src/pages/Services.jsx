import React from "react";
import { Link } from "react-router-dom";

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
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Our services</p>
        <h2 className="mt-3 text-3xl font-bold text-slate-900">AI-powered medical support</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Care plan
            </div>
            <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
            <p className="mt-3 text-slate-600">{service.description}</p>

            <Link
              to={`/services/${service.id}`}
              className="mt-5 inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              View details
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
