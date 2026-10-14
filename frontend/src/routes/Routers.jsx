import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Services from "../pages/Services";
import ServiceDetail from "../pages/ServiceDetail";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Symptomchk from "../pages/Symptomchk";
import Contact from "../pages/Contact";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import CheckoutSuccess from "../pages/CheckoutSuccess";
import ResultsAnalysis from "../pages/ResultsAnalysis";
import HealthPredict from "../pages/HealthPredict";
import PredictionForm from "../pages/PredictionForm";
import FindDoctor from "../pages/FindDoctor";
import DoctorProfile from "../pages/DoctorProfile";
import PaymentReview from "../pages/PaymentReview";
import NotFound from "../pages/NotFound";

const Routers = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/services" element={<Services />} />
      <Route path="/services/:slug" element={<ServiceDetail />} />
      <Route path="/health-predict" element={<HealthPredict />} />
      <Route path="/health-predict/:type" element={<PredictionForm />} />
      <Route path="/doctors" element={<FindDoctor />} />
      <Route path="/doctors/:id" element={<DoctorProfile />} />
      <Route path="/payment/:doctorId" element={<PaymentReview />} />
      <Route path="/results-analysis" element={<ResultsAnalysis />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="/symptom-check" element={<Symptomchk />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
      <Route path="/checkout-success" element={<CheckoutSuccess />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Routers;
