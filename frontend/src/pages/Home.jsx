import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaCircleCheck,
  FaFlask,
  FaHeartPulse,
  FaShieldHeart,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";

const careHighlights = [
  { value: "7", label: "AI screening tools", icon: FaFlask },
  { value: "40+", label: "conditions in symptom guidance", icon: FaHeartPulse },
  { value: "3", label: "connected care roles", icon: FaUserDoctor },
];

const doctors = [
  {
    name: "Your care team",
    specialty: "Find a clinician to guide your next step",
    style: "bg-[#f6d48c]",
    iconStyle: "bg-[#fff1ce] text-[#956824]",
  },
  {
    name: "Personalized care",
    specialty: "Browse specialists and clinic profiles",
    style: "bg-[#a9dfd9]",
    iconStyle: "bg-[#d8f0e9] text-[#237d78]",
  },
  {
    name: "Informed decisions",
    specialty: "Keep a clinician involved in your care",
    style: "bg-[#d9c5f2]",
    iconStyle: "bg-[#eee4fa] text-[#7954a5]",
  },
];

const Home = () => {
  return (
    <div className="overflow-hidden">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-10 sm:px-8 sm:pt-16 lg:pb-20 lg:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm font-bold text-cyan-800 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Care that puts people first
            </div>
            <h1 className="max-w-2xl text-5xl font-extrabold leading-[1.08] tracking-tight text-slate-900 sm:text-6xl">
              We help patients live a{" "}
              <span className="text-cyan-700">healthy, longer life.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Get clearer health guidance, explore AI-assisted screening, and
              connect with a doctor — all in one welcoming place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/doctors"
                className="inline-flex items-center gap-2 rounded-full bg-cyan-700 px-6 py-3.5 font-bold text-white shadow-lg shadow-cyan-900/10 transition hover:-translate-y-0.5 hover:bg-cyan-800"
              >
                <FaCalendarCheck aria-hidden="true" />
                Find a doctor
              </Link>
              <Link
                to="/health-predict"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-cyan-200 hover:text-cyan-800"
              >
                Explore health tools
                <FaArrowRight aria-hidden="true" className="text-xs" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-slate-600">
              {[
                "Patient-first design",
                "Clinician-guided care",
                "Human-guided health tools",
              ].map(
                (item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <FaCircleCheck
                      aria-hidden="true"
                      className="text-emerald-600"
                    />
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:ml-auto">
            <div className="absolute -right-10 -top-8 h-48 w-48 rounded-full bg-cyan-100/70 blur-3xl" />
            <div className="absolute -bottom-10 left-4 h-48 w-48 rounded-full bg-amber-100/70 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4 sm:gap-5">
              <div className="flex min-h-[250px] flex-col justify-between rounded-[2rem] bg-[#ffe9ba] p-5 sm:min-h-[320px] sm:p-7">
                <span className="w-fit rounded-full bg-white/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-amber-900">
                  Care starts here
                </span>
                <div className="flex h-36 items-center justify-center sm:h-48">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full bg-[#fff5df] text-7xl text-amber-700/80 shadow-inner sm:h-40 sm:w-40 sm:text-8xl">
                    <FaUserDoctor aria-hidden="true" />
                  </div>
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">Meet your care team</p>
                  <p className="mt-1 text-sm text-slate-600">
                    Find a doctor who fits your needs.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:gap-5">
                {doctors.slice(1).map((doctor) => (
                  <div
                    key={doctor.name}
                    className={`flex min-h-[180px] flex-col justify-between rounded-[2rem] ${doctor.style} p-5 sm:min-h-[207px] sm:p-6`}
                  >
                    <div
                      className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${doctor.iconStyle}`}
                    >
                      <FaStethoscope aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-extrabold text-slate-900">{doctor.name}</p>
                      <p className="mt-1 text-sm leading-5 text-slate-700">
                        {doctor.specialty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-7 left-1/2 grid w-[92%] -translate-x-1/2 grid-cols-3 rounded-2xl border border-white/80 bg-white/95 p-4 shadow-xl shadow-slate-900/10 backdrop-blur sm:-bottom-8 sm:p-5">
              {careHighlights.map(({ value, label, icon: Icon }) => (
                <div key={label} className="px-2 text-center sm:px-4">
                  <Icon
                    aria-hidden="true"
                    className="mx-auto mb-1 text-lg text-cyan-700"
                  />
                  <p className="text-lg font-extrabold text-slate-900 sm:text-2xl">
                    {value}
                  </p>
                  <p className="mx-auto mt-1 max-w-24 text-[10px] leading-4 text-slate-500 sm:text-xs">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-16 pt-16 sm:px-8 sm:pt-24 lg:pb-24">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-cyan-700">
              Your health, one step at a time
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              How can we help you today?
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 font-bold text-cyan-800 hover:text-cyan-950"
          >
            See all services <FaArrowRight aria-hidden="true" className="text-xs" />
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "AI health screening",
              description:
                "Explore model-assisted screening for common conditions, with clear clinical guidance.",
              icon: FaFlask,
              color: "bg-cyan-50 text-cyan-800",
              link: "/health-predict",
              action: "Explore health tools",
            },
            {
              title: "Symptom guidance",
              description:
                "Share symptoms to receive an informational prediction and related wellbeing suggestions.",
              icon: FaHeartPulse,
              color: "bg-rose-50 text-rose-700",
              link: "/symptom-check",
              action: "Check symptoms",
            },
            {
              title: "Find a doctor",
              description:
                "Browse clinician profiles and find the right person to discuss your health concerns.",
              icon: FaUserDoctor,
              color: "bg-amber-50 text-amber-800",
              link: "/doctors",
              action: "Meet the care team",
            },
          ].map(({ title, description, icon: Icon, color, link, action }) => (
            <article
              key={title}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${color}`}
              >
                <Icon aria-hidden="true" />
              </div>
              <h3 className="mt-5 text-xl font-extrabold text-slate-900">
                {title}
              </h3>
              <p className="mt-2 min-h-[3rem] leading-6 text-slate-600">
                {description}
              </p>
              <Link
                to={link}
                className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-cyan-800 hover:text-cyan-950"
              >
                {action} <FaArrowRight aria-hidden="true" className="text-xs" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-cyan-100 bg-[#eaf8f6]">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-5 py-10 sm:px-8 md:grid-cols-[1fr_auto] md:py-14">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-xl text-cyan-800 shadow-sm">
              <FaShieldHeart aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">
                Health guidance, with a human touch
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                AI screening is informational—not a medical diagnosis. Share
                results with a qualified healthcare professional before making
                care decisions.
              </p>
            </div>
          </div>
          <Link
            to="/doctors"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200 bg-white px-5 py-3 text-sm font-extrabold text-cyan-800 transition hover:bg-cyan-50"
          >
            Talk to a doctor <FaArrowRight aria-hidden="true" className="text-xs" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
