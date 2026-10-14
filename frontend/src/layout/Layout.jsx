import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaBars, FaHeartPulse, FaXmark } from "react-icons/fa6";
import { useContext } from "react";
import { authContext } from "../context/AuthContext.jsx";
import Routers from "../routes/Routers.jsx";

const navigation = [
  { label: "Home", to: "/" },
  { label: "HealthPredict", to: "/health-predict" },
  { label: "Find a Doctor", to: "/doctors" },
  { label: "Services", to: "/services" },
  { label: "Contact", to: "/contact" },
];

const Layout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, token, dispatch } = useContext(authContext);

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    closeMenu();
  };

  return (
    <div className="min-h-screen bg-[#fffdf7] text-slate-800">
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur">
        <nav
          className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-6 px-5 sm:px-8"
          aria-label="Main navigation"
        >
          <Link
            to="/"
            onClick={closeMenu}
            className="flex shrink-0 items-center gap-2.5 text-xl font-extrabold tracking-tight text-slate-800"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-100 to-emerald-50 text-cyan-700">
              <FaHeartPulse aria-hidden="true" className="text-xl" />
            </span>
            <span>
              AI<span className="text-cyan-700">Med</span>Lab
            </span>
          </Link>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 md:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FaXmark /> : <FaBars />}
          </button>

          <div
            className={`${
              menuOpen
                ? "absolute left-0 right-0 top-[76px] flex flex-col border-b border-slate-200 bg-white p-5 shadow-lg"
                : "hidden"
            } items-stretch gap-1 md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
          >
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-cyan-50 text-cyan-800"
                      : "text-slate-600 hover:bg-slate-50 hover:text-cyan-800"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            {token ? (
              <button
                type="button"
                onClick={handleLogout}
                className="ml-1 rounded-full bg-slate-800 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
              >
                {user?.name ? `Sign out, ${user.name.split(" ")[0]}` : "Sign out"}
              </button>
            ) : (
              <Link
                to="/login"
                onClick={closeMenu}
                className="ml-1 rounded-full bg-cyan-700 px-5 py-2.5 text-center text-sm font-bold text-white transition hover:bg-cyan-800"
              >
                Sign in
              </Link>
            )}
          </div>
        </nav>
      </header>

      <main>
        <Routers />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
          <div>
            <Link to="/" className="text-lg font-extrabold text-slate-800">
              AI<span className="text-cyan-700">Med</span>Lab
            </Link>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-500">
              A connected space for symptom guidance, health screening, and
              finding care. AI results are informational and do not replace a
              clinician.
            </p>
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Quick links</h2>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-500">
              {navigation.slice(1).map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="hover:text-cyan-800"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <p className="self-end text-sm text-slate-400 lg:text-right">
            © {new Date().getFullYear()} AI-MedLab · Built for better-informed
            care
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
