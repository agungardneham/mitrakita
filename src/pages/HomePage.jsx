import React, { useState } from "react";
import { Link } from "react-router-dom";
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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const HomePage = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const features = [
    {
      icon: <Building2 className="w-8 h-8 text-green-600" />,
      title: "Daftar IKM Terverifikasi",
      description:
        "Akses database IKM yang telah diverifikasi dengan informasi produk dan layanan lengkap",
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "Komunikasi Langsung",
      description:
        "Chat real-time dengan mitra potensial untuk membangun kolaborasi yang efektif",
    },
    {
      icon: <FileText className="w-8 h-8 text-yellow-600" />,
      title: "Hasil Penelitian",
      description:
        "Akses repository penelitian akademis dengan ringkasan AI untuk inovasi industri",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Tracking Kemitraan",
      description:
        "Pantau progress kolaborasi dari order hingga pengiriman secara transparan",
    },
    {
      icon: <Star className="w-8 h-8 text-yellow-500" />,
      title: "Rating & Review",
      description:
        "Sistem penilaian untuk membangun kepercayaan dan kualitas kemitraan",
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-blue-600" />,
      title: "Verifikasi Admin",
      description:
        "Semua konten diverifikasi oleh admin untuk menjamin kualitas dan keamanan",
    },
  ];

  const stats = [
    { number: "1,250+", label: "IKM Terdaftar" },
    { number: "3,400+", label: "Produk Tersedia" },
    { number: "580+", label: "Kemitraan Sukses" },
    { number: "150+", label: "Penelitian" },
  ];

  return (
    <div>
      <Navbar onNavigate={onNavigate} />
      <div className="bg-green-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1
                className="text-5xl md:text-6xl font-bold mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Terhubung. Bermitra. Bertumbuh.
              </h1>
              <p
                className="text-xl md:text-2xl mb-8 text-green-50"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Platform Kemitraan Digital untuk IKM Indonesia
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Cari IKM, produk, atau layanan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white p-3 rounded-xl hover:bg-green-700 transition">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/direktori"
                  className="bg-white text-green-600 px-8 py-3 rounded-2xl font-semibold hover:shadow-2xl transition-all inline-block"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Jelajahi IKM
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-gray-800 px-8 py-3 rounded-2xl font-semibold hover:shadow-2xl transition-all inline-block"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Daftar Sekarang
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 text-center"
              >
                <h3
                  className="text-3xl font-bold text-green-600 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {stat.number}
                </h3>
                <p
                  className="text-gray-600 text-sm"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Fitur Unggulan
            </h2>
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Platform lengkap untuk membangun kemitraan yang berkelanjutan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3
                  className="text-xl font-semibold text-gray-800 mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {feature.title}
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-4xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Cara Kerja
              </h2>
              <p
                className="text-gray-600 text-lg"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Tiga langkah mudah untuk memulai kemitraan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Daftar & Lengkapi Profil
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Buat akun dan lengkapi informasi bisnis Anda untuk verifikasi
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Cari & Hubungi Mitra
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Jelajahi database dan mulai komunikasi dengan mitra potensial
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3
                  className="text-xl font-semibold mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kolaborasi & Bertumbuh
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Bangun kemitraan, track progress, dan kembangkan bisnis Anda
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Siap Membangun Kemitraan?
            </h2>
            <p
              className="text-xl text-green-50 mb-8"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Bergabunglah dengan ribuan IKM dan industri yang telah berkembang
              bersama MitraKita
            </p>
            <Link
              to="/register"
              className="bg-yellow-400 text-gray-800 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105 inline-block"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
