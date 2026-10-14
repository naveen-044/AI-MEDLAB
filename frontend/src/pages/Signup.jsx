import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight, FaHeartPulse } from "react-icons/fa6";
import { toast } from "react-toastify";
import { BASE_URL } from "../config";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "",
    role: "patient",
  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "We couldn’t create your account.");
      }
      toast.success(result.message || "Your account has been created.");
      navigate("/login");
    } catch (error) {
      setErrorMessage(error.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/5 md:grid md:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col justify-between bg-gradient-to-br from-cyan-100 via-cyan-50 to-amber-50 p-7 sm:p-10">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-xl text-cyan-800 shadow-sm">
            <FaHeartPulse aria-hidden="true" />
          </span>
          <div className="mt-8 md:mt-0">
            <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-cyan-800">
              AI-MedLab
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-slate-900">
              A healthier journey starts here.
            </h1>
            <p className="mt-4 leading-6 text-slate-600">
              Create an account to connect with care and explore health tools.
            </p>
          </div>
          <p className="mt-8 text-sm font-semibold text-slate-500">
            Your information is used to support your account and care journey.
          </p>
        </div>

        <div className="p-6 sm:p-9">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Create an account
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Fill in your details to get started.
          </p>

          <form onSubmit={submitHandler} className="mt-7 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="signup-name" className="mb-2 block text-sm font-bold text-slate-700">Full name</label>
            <input
              id="signup-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              autoComplete="name"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="signup-email" className="mb-2 block text-sm font-bold text-slate-700">Email</label>
            <input
              id="signup-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              autoComplete="email"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="signup-password" className="mb-2 block text-sm font-bold text-slate-700">Password</label>
            <input
              id="signup-password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              autoComplete="new-password"
              minLength={8}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
              required
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Use at least 8 characters.
            </p>
          </div>

          <div>
            <label htmlFor="signup-role" className="mb-2 block text-sm font-bold text-slate-700">Account type</label>
            <select
              id="signup-role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="assistant">Lab Assistant</option>
            </select>
          </div>

          <div>
            <label htmlFor="signup-gender" className="mb-2 block text-sm font-bold text-slate-700">Gender</label>
            <select
              id="signup-gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-cyan-600 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          {errorMessage && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800 sm:col-span-2"
            >
              {errorMessage}
            </p>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-3.5 font-extrabold text-white transition hover:bg-cyan-800 disabled:cursor-wait disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Create account"}
              {!loading && <FaArrowRight aria-hidden="true" />}
            </button>
          </div>
          </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-extrabold text-cyan-800 hover:text-cyan-950">
            Login
          </Link>
        </p>
        </div>
      </div>
    </section>
  );
};

export default Signup;
