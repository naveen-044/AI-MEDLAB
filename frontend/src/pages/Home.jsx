import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-10 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-10 text-white shadow-xl md:grid-cols-2 md:p-16">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-blue-100">AI-Based Medical Laboratory System</p>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            Smarter diagnosis, faster care, and transparent lab workflows.
          </h1>
          <p className="mt-6 max-w-xl text-blue-50">
            AI-MedLab connects patients, doctors, and lab support into a single digital healthcare system for diagnostic guidance,
            digital services, and efficient medical reporting.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/services" className="rounded-full bg-white px-6 py-3 font-semibold text-blue-700 hover:bg-blue-50">
              Explore Services
            </Link>
            <Link to="/results-analysis" className="rounded-full border border-white px-6 py-3 font-semibold text-white hover:bg-white/10">
              Results & Analysis
            </Link>
            <Link to="/symptom-check" className="rounded-full border border-white px-6 py-3 font-semibold text-white hover:bg-white/10">
              Symptom Check
            </Link>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
          <div className="grid gap-4">
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">Disease detection</p>
              <h2 className="mt-2 text-3xl font-bold">7 major conditions</h2>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">Care quality</p>
              <h2 className="mt-2 text-3xl font-bold">99.9% monitoring</h2>
            </div>
            <div className="rounded-xl bg-white/10 p-4">
              <p className="text-sm text-blue-100">Support</p>
              <h2 className="mt-2 text-3xl font-bold">24/7 guidance</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">AI Diagnostics</h3>
          <p className="mt-3 text-slate-600">Get on-demand insight for major medical conditions and lab-driven decision support.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Clinical Workflow</h3>
          <p className="mt-3 text-slate-600">Support doctor and patient coordination through simple, structured healthcare modules.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-slate-900">Patient Care</h3>
          <p className="mt-3 text-slate-600">Improve outcomes with clearer guidance, monitoring, and digital follow-up services.</p>
        </div>
      </div>

      <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Project sections</p>
            <h2 className="mt-3 text-3xl font-bold text-slate-900">System modules documented in the PDF</h2>
          </div>
          <Link to="/results-analysis" className="rounded-full bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">
            View Results & Analysis
          </Link>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-blue-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-700">User Interface</p>
            <p className="mt-3 text-slate-700">Responsive patient and doctor portal with accessible healthcare navigation.</p>
          </div>
          <div className="rounded-2xl bg-cyan-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-cyan-700">Services</p>
            <p className="mt-3 text-slate-700">AI-guided medical support for disease screening and personalized recommendations.</p>
          </div>
          <div className="rounded-2xl bg-emerald-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-700">Payment</p>
            <p className="mt-3 text-slate-700">Secure digital interaction for healthcare transactions and service bookings.</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-700">Results</p>
            <p className="mt-3 text-slate-700">Summary metrics, evaluation, usability review, and future improvement roadmap.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
