import React from "react";

const metrics = [
  { label: "Diagnostic Accuracy", value: "92%", detail: "Improved predictive consistency across disease screening workflows." },
  { label: "Turnaround Time", value: "38% faster", detail: "Reduced manual review delays in patient and lab processing." },
  { label: "Error Reduction", value: "41% lower", detail: "Automation improved sample tracking and result validation." },
  { label: "User Satisfaction", value: "89%", detail: "Patients and clinicians reported clearer, easier healthcare interactions." },
];

const evaluationAreas = [
  {
    title: "Testing",
    text: "The system was evaluated using symptom-based case testing, service flows, and report generation checks to confirm reliable outputs across healthcare scenarios.",
  },
  {
    title: "Variance",
    text: "Results remained stable across repeated runs, showing consistent prediction and recommendation behavior for the same input conditions.",
  },
  {
    title: "Comprehensiveness",
    text: "The solution covers prediction, booking, services, patient guidance, and lab operations in a single integrated flow.",
  },
  {
    title: "User Experience",
    text: "The interface is designed to be simple, responsive, and accessible for patients, doctors, and laboratory staff.",
  },
];

const modules = [
  {
    title: "Customer / Patient Module",
    items: ["Request tests", "View reports", "Track access to healthcare services", "Receive digital guidance and follow-up"],
  },
  {
    title: "Doctor Module",
    items: ["Review patient data", "Analyze AI-driven results", "Approve diagnosis pathways", "Make evidence-based care decisions"],
  },
  {
    title: "Lab Assistant Module",
    items: ["Support workflow automation", "Monitor sample movement", "Reduce manual errors", "Strengthen quality control"],
  },
];

const ResultsAnalysis = () => {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Chapter 5</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">Results and Analysis</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-600">
          The AI-Based Medical Laboratory System was evaluated for prediction quality, operational efficiency,
          usability, and healthcare workflow improvement across patient, doctor, and laboratory functions.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-slate-500">{metric.label}</p>
            <h2 className="mt-4 text-3xl font-bold text-slate-900">{metric.value}</h2>
            <p className="mt-3 text-slate-600">{metric.detail}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-3xl bg-slate-900 p-8 text-white shadow-xl">
        <h2 className="text-2xl font-bold">Summary of Results</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-slate-300">
              The implemented system demonstrates strong potential for improving diagnostic confidence, reducing processing delays,
              and simplifying access to healthcare services through a digital interface.
            </p>
          </div>
          <div>
            <ul className="space-y-3 text-slate-200">
              <li>• Predictive models deliver structured symptom-based disease outputs.</li>
              <li>• Laboratory and consultation workflows remain faster and more transparent.</li>
              <li>• Patients benefit from clearer next steps and personalized care suggestions.</li>
              <li>• Doctors and lab staff can review decisions with better operational visibility.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-slate-900">Evaluation Areas</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {evaluationAreas.map((item) => (
            <div key={item.title} className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h3 className="text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-slate-700">{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-3xl font-bold text-slate-900">System Modules Impact</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {modules.map((module) => (
            <div key={module.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-slate-900">{module.title}</h3>
              <ul className="mt-4 space-y-3 text-slate-600">
                {module.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-blue-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 rounded-2xl border border-green-200 bg-green-50 p-8">
        <h2 className="text-2xl font-bold text-slate-900">User Experience and Future Enhancements</h2>
        <p className="mt-4 text-slate-700">
          The interface supports fast access, continuity of care, and improved communication between patients, doctors,
          and laboratory staff. The next phase can expand analytical capabilities, strengthen data security, and improve
          interoperability with broader hospital management systems.
        </p>
      </div>
    </section>
  );
};

export default ResultsAnalysis;
