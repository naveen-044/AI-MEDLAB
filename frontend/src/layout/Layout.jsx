import React from "react";
import { Link } from "react-router-dom";
import Routers from "../routes/Routers";

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-white shadow-sm">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold text-blue-700">
            AI-MedLab
          </Link>
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/" className="hover:text-blue-700">Home</Link>
            <Link to="/services" className="hover:text-blue-700">Services</Link>
            <Link to="/results-analysis" className="hover:text-blue-700">Results & Analysis</Link>
            <Link to="/symptom-check" className="hover:text-blue-700">Symptom Check</Link>
            <Link to="/login" className="hover:text-blue-700">Login</Link>
            <Link to="/register" className="hover:text-blue-700">Register</Link>
            <Link to="/contact" className="hover:text-blue-700">Contact</Link>
          </div>
        </nav>
      </header>
      <main>
        <Routers />
      </main>
    </div>
  );
};

export default Layout;
