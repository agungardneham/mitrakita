import React, { useState } from "react";
import logo from "../assets/MitraKita-LogoTextH-fc.png";
import {
  Search,
  Users,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Building2,
  GraduationCap,
  Menu,
  X,
  Home,
  LayoutDashboard,
  Package,
  MessageCircle,
  Star,
  Upload,
  Settings,
  LogOut,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar = ({ onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoggedIn, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate?.("home")}
          >
            <img
              src={logo}
              alt="MitraKita logo"
              className="w-50 h-auto object-contain"
              loading="lazy"
            />
          </Link>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-green-600 transition font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Beranda
            </Link>
            <Link
              to="/direktori"
              className="text-gray-700 hover:text-green-600 transition font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Direktori IKM
            </Link>
            {isLoggedIn && (
              <Link
                to="/penelitian"
                className="text-gray-700 hover:text-green-600 transition font-medium"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Penelitian
              </Link>
            )}
            <Link
              to="/about"
              className="text-gray-700 hover:text-green-600 transition font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Tentang Kami
            </Link>
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    if (role === "ikm") {
                      navigate("/dashboard/ikm");
                    } else if (role === "user") {
                      navigate("/dashboard/user");
                    } else if (role === "academician") {
                      navigate("/dashboard/akademisi");
                    }
                  }}
                  className="bg-linear-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-2xl hover:shadow-lg transition-all font-semibold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition font-semibold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-linear-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-2xl hover:shadow-lg transition-all font-semibold"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Masuk
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-3 space-y-2">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl transition"
            >
              Beranda
            </Link>
            <Link
              to="/direktori"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl transition"
            >
              Direktori IKM
            </Link>
            {isLoggedIn && (
              <Link
                to="/penelitian"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl transition"
              >
                Penelitian
              </Link>
            )}
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl transition"
            >
              Tentang Kami
            </Link>
            {isLoggedIn ? (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    if (role === "ikm") {
                      navigate("/dashboard/ikm");
                    } else if (role === "user") {
                      navigate("/dashboard/user");
                    } else if (role === "academician") {
                      navigate("/dashboard/akademisi");
                    }
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
                >
                  Dashboard
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition font-semibold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-left px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                Masuk
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
