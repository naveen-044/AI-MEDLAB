import { Link, useParams } from "react-router-dom";
import { services } from "./Services";

const ServiceDetail = () => {
  const { slug } = useParams();
  const service = services.find((item) => item.id === slug);

  if (!service) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-700">
          Service not found.
        </div>
        <Link to="/services" className="mt-6 inline-block rounded-full bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700">
          Back to services
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-4xl px-6 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Care plan</p>
        <h1 className="mt-3 text-4xl font-bold text-slate-900">{service.title}</h1>
        <p className="mt-5 text-lg text-slate-600">{service.detail}</p>

        <div className="mt-8 rounded-2xl bg-blue-50 p-5 text-slate-700">
          <p className="font-medium">{service.description}</p>
        </div>

        <Link
          to="/services"
          className="mt-8 inline-flex rounded-full bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Back to services
        </Link>
      </div>
    </section>
  );
};

export default ServiceDetail;
