import { Link } from "react-router-dom";
import { FaArrowRight, FaHeartPulse, FaShieldHeart } from "react-icons/fa6";
import { healthTools } from "../data/healthTools";

const HealthPredict = () => {
  return (
    <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-cyan-700">
          HealthPredict
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Health screening tools
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
          Choose a screening module to enter measurements or submit an image.
          Results are informational and should always be reviewed with a
          qualified healthcare professional.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {healthTools.map(({ id, title, description, icon: Icon, tone, type }) => (
          <article
            key={id}
            className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-cyan-200 hover:shadow-lg"
          >
            <span
              className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${tone}`}
            >
              <Icon aria-hidden="true" />
            </span>
            <span className="mt-5 text-xs font-bold uppercase tracking-wide text-slate-400">
              {type === "image" ? "Image screening" : "Health measurements"}
            </span>
            <h2 className="mt-2 text-xl font-extrabold text-slate-900">
              {title}
            </h2>
            <p className="mt-2 flex-1 leading-6 text-slate-600">
              {description}
            </p>
            <Link
              to={`/health-predict/${id}`}
              className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-cyan-50 px-4 py-2.5 text-sm font-extrabold text-cyan-800 transition group-hover:bg-cyan-700 group-hover:text-white"
            >
              Open screening <FaArrowRight aria-hidden="true" className="text-xs" />
            </Link>
          </article>
        ))}
        <article className="flex flex-col rounded-3xl border border-cyan-100 bg-[#eaf8f6] p-6">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-cyan-800">
            <FaHeartPulse aria-hidden="true" />
          </span>
          <span className="mt-5 text-xs font-bold uppercase tracking-wide text-cyan-700">
            Symptom guidance
          </span>
          <h2 className="mt-2 text-xl font-extrabold text-slate-900">
            Describe how you feel
          </h2>
          <p className="mt-2 flex-1 leading-6 text-slate-600">
            Enter symptoms to receive an AI-generated informational result and
            general care suggestions.
          </p>
          <Link
            to="/symptom-check"
            className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-cyan-800 transition hover:bg-cyan-700 hover:text-white"
          >
            Check symptoms <FaArrowRight aria-hidden="true" className="text-xs" />
          </Link>
        </article>
      </div>

      <aside className="mt-10 flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-950">
        <FaShieldHeart aria-hidden="true" className="mt-1 shrink-0 text-xl" />
        <div>
          <h2 className="font-extrabold">Decision support, not a diagnosis</h2>
          <p className="mt-1 text-sm leading-6 text-amber-900">
            These models have not been established as a substitute for medical
            evaluation. Do not use a screening result to start, stop, or change
            treatment.
          </p>
        </div>
      </aside>
    </section>
  );
};

export default HealthPredict;
