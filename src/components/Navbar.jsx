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
import { Link } from "react-router-dom";

// ============================================
// NAVBAR COMPONENT
// ============================================
const Navbar = ({ userRole, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <button
              onClick={() => onNavigate("home")}
              className="text-gray-700 hover:text-green-600 transition font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Beranda
            </button>
            <button
              onClick={() => onNavigate("ikm-list")}
              className="text-gray-700 hover:text-green-600 transition font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Daftar IKM
            </button>
            <button
              onClick={() => onNavigate("research")}
              className="text-gray-700 hover:text-green-600 transition font-medium"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Penelitian
            </button>
            {userRole ? (
              <button
                onClick={() => onNavigate("dashboard")}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-6 py-2 rounded-2xl hover:shadow-lg transition-all font-semibold"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Dashboard
              </button>
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
            <button
              onClick={() => {
                onNavigate("home");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl transition"
            >
              Beranda
            </button>
            <button
              onClick={() => {
                onNavigate("ikm-list");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl transition"
            >
              Daftar IKM
            </button>
            <button
              onClick={() => {
                onNavigate("research");
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 rounded-xl transition"
            >
              Penelitian
            </button>
            {userRole ? (
              <button
                onClick={() => {
                  onNavigate("dashboard");
                  setMobileMenuOpen(false);
                }}
                className="block w-full text-left px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
              >
                Dashboard
              </button>
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
