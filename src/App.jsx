import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import AboutUsPage from "./pages/AboutUsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import IKMDirectoryPage from "./pages/IKMDirectoryPage";
import ResearchPage from "./pages/ResearchPage";
import IKMDashboard from "./pages/IKMDashboard";
import AcademicianDashboard from "./pages/AcademicianDashboard";
import UserDashboard from "./pages/UserDashboard";

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Default route: HomePage will render at `/` */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/direktori" element={<IKMDirectoryPage />} />
          <Route path="/penelitian" element={<ResearchPage />} />
          <Route path="/dashboard/ikm" element={<IKMDashboard />} />
          <Route
            path="/dashboard/akademisi"
            element={<AcademicianDashboard />}
          />
          <Route path="/dashboard/user" element={<UserDashboard />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
