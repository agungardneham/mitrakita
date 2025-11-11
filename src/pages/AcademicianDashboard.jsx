import React from "react";
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
import { useState } from "react";

// ============================================
// ACADEMICIAN DASHBOARD COMPONENT
// ============================================
const AcademicianDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [researchStatus, setResearchStatus] = useState("completed");

  // Profile Data State
  const [profileData, setProfileData] = useState({
    fullName: "Budi Santoso",
    prefixTitle: "Dr.",
    suffixTitle: "M.T.",
    institution: "Institut Teknologi Bandung",
    department: "Teknik Mesin",
    nidn: "0012345678",
    researchField: "Material Science & Manufacturing",
    photo: "👨‍🔬",
    bio: "Peneliti di bidang teknologi manufaktur dengan fokus pada optimalisasi proses produksi dan material engineering.",
    googleScholar: "https://scholar.google.com/citations?user=example",
    researchGate: "https://www.researchgate.net/profile/example",
    researchHistory: [
      {
        year: 2024,
        title:
          "Optimalisasi Proses Finishing Furniture Menggunakan Teknologi UV Coating",
        status: "Selesai",
      },
      {
        year: 2023,
        title: "Pengembangan Material Komposit untuk Industri Otomotif",
        status: "Selesai",
      },
      {
        year: 2023,
        title: "Smart Manufacturing untuk IKM Indonesia",
        status: "Berlangsung",
      },
    ],
  });

  // Research Data State
  const [researches, setResearches] = useState([
    {
      id: 1,
      title:
        "Optimalisasi Proses Finishing Furniture Menggunakan Teknologi UV Coating",
      status: "completed",
      field: "Furniture & Kerajinan",
      year: 2024,
      abstract:
        "Penelitian tentang penggunaan teknologi UV coating untuk meningkatkan efisiensi proses finishing furniture.",
      keywords: ["UV Coating", "Furniture", "Finishing"],
      futureplan: "Implementasi di 10 IKM furniture di Jepara",
      collaboration: "",
      verified: true,
    },
    {
      id: 2,
      title: "Smart Manufacturing untuk IKM Indonesia",
      status: "ongoing",
      field: "Logam & Metalurgi",
      year: 2023,
      abstract:
        "Pengembangan sistem IoT untuk monitoring produksi real-time di IKM logam.",
      keywords: ["IoT", "Smart Factory", "Manufacturing"],
      futureplan: "",
      collaboration:
        "Membutuhkan IKM logam untuk pilot project implementasi sistem",
      verified: false,
    },
  ]);

  // IKM Partnership Requests
  const [partnershipRequests, setPartnershipRequests] = useState([
    {
      id: 1,
      ikmName: "CV Furniture Jaya Abadi",
      researchTitle: "Optimalisasi Proses Finishing Furniture",
      requestDate: "2024-11-01",
      status: "pending",
      description:
        "Kami tertarik untuk mengimplementasikan teknologi UV coating di produksi kami",
    },
    {
      id: 2,
      ikmName: "PT Logam Presisi Indo",
      researchTitle: "Smart Manufacturing",
      requestDate: "2024-11-05",
      status: "pending",
      description: "Ingin menjadi pilot project untuk sistem IoT monitoring",
    },
  ]);

  // Verified Partnerships
  const [verifiedPartnerships, setVerifiedPartnerships] = useState([
    {
      id: 1,
      ikmName: "UD Meubel Berkah",
      researchTitle: "Optimalisasi UV Coating",
      startDate: "2023-06-01",
      endDate: "2024-03-01",
      status: "completed",
      outcome: "Berhasil meningkatkan efisiensi produksi 40%",
    },
  ]);

  const sidebarItems = [
    { id: "overview", label: "Beranda", icon: <Home className="w-5 h-5" /> },
    {
      id: "profile",
      label: "Profil Akademisi",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: "research",
      label: "Penelitian Saya",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "partnerships",
      label: "Kemitraan IKM",
      icon: <Users className="w-5 h-5" />,
    },
    // {
    //   id: "messages",
    //   label: "Pesan",
    //   icon: <MessageCircle className="w-5 h-5" />,
    // },
  ];

  const handleProfileUpdate = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleAddResearch = (newResearch) => {
    setResearches([
      ...researches,
      { ...newResearch, id: researches.length + 1, verified: false },
    ]);
    setShowResearchModal(false);
  };

  const handleVerifyPartnership = (id, action) => {
    const request = partnershipRequests.find((r) => r.id === id);
    if (action === "approve") {
      setVerifiedPartnerships([
        ...verifiedPartnerships,
        {
          id: verifiedPartnerships.length + 1,
          ikmName: request.ikmName,
          researchTitle: request.researchTitle,
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
          status: "active",
          outcome: "",
        },
      ]);
    }
    setPartnershipRequests(partnershipRequests.filter((r) => r.id !== id));
  };

  return (
    <div>
      <Navbar userRole="academician" />
      <div className="flex min-h-screen bg-green-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-2xl">
                {profileData.photo}
              </div>
              <div>
                <h2
                  className="text-lg font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dashboard Akademisi
                </h2>
              </div>
            </div>
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {profileData.prefixTitle} {profileData.fullName}
            </p>
          </div>
          <nav className="px-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  activeTab === item.id
                    ? "bg-blue-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-blue-50"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
            <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-8">
              <LogOut className="w-5 h-5" />
              <span>Keluar</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8 overflow-y-auto">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Selamat Datang, {profileData.prefixTitle} {profileData.fullName}
                ! 👋
              </h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <span className="text-blue-600 text-sm font-semibold">
                      Total
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {researches.length}
                  </h3>
                  <p className="text-gray-600 text-sm">Penelitian</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                    <span className="text-green-600 text-sm font-semibold">
                      Aktif
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {
                      verifiedPartnerships.filter((p) => p.status === "active")
                        .length
                    }
                  </h3>
                  <p className="text-gray-600 text-sm">Kemitraan IKM</p>
                </div>
                {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MessageCircle className="w-8 h-8 text-yellow-600" />
                    <span className="text-yellow-600 text-sm font-semibold">
                      {partnershipRequests.length} Baru
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">5</h3>
                  <p className="text-gray-600 text-sm">Pesan</p>
                </div> */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <span className="text-purple-600 text-sm font-semibold">
                      +15%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">342</h3>
                  <p className="text-gray-600 text-sm">Total Views</p>
                </div>
              </div>

              {/* Pending Partnership Requests */}
              {partnershipRequests.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Permintaan Kemitraan Baru ({partnershipRequests.length})
                  </h2>
                  <div className="space-y-4">
                    {partnershipRequests.slice(0, 3).map((request) => (
                      <div
                        key={request.id}
                        className="border-2 border-yellow-200 bg-yellow-50 rounded-xl p-4"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3
                              className="font-bold text-gray-800"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {request.ikmName}
                            </h3>
                            <p
                              className="text-sm text-gray-600"
                              style={{ fontFamily: "Open Sans, sans-serif" }}
                            >
                              Penelitian: {request.researchTitle}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {request.requestDate}
                          </span>
                        </div>
                        <p
                          className="text-sm text-gray-700 mb-4"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {request.description}
                        </p>
                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              handleVerifyPartnership(request.id, "approve")
                            }
                            className="flex-1 bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Terima
                          </button>
                          <button
                            onClick={() =>
                              handleVerifyPartnership(request.id, "reject")
                            }
                            className="flex-1 bg-red-600 text-white py-2 rounded-xl font-semibold hover:bg-red-700 transition"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Tolak
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2
                  className="text-xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Aksi Cepat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <GraduationCap className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lengkapi Profil
                    </h3>
                    <p className="text-sm text-blue-50">
                      Update informasi akademis Anda
                    </p>
                  </button>
                  <button
                    onClick={() => setShowResearchModal(true)}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <FileText className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Upload Penelitian
                    </h3>
                    <p className="text-sm text-green-50">
                      Publikasikan hasil riset Anda
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab("partnerships")}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Users className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Kelola Kemitraan
                    </h3>
                    <p className="text-sm text-yellow-50">
                      Review permintaan dari IKM
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Profil Akademisi
                </h1>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className={`px-6 py-3 rounded-xl font-semibold transition ${
                    editingProfile
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {editingProfile ? "Batal Edit" : "Edit Profil"}
                </button>
              </div>

              <div className="space-y-6">
                {/* Photo and Basic Info */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Informasi Dasar
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Foto Profil
                      </label>
                      {editingProfile ? (
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-5xl">
                            {profileData.photo}
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                            Unggah Foto
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-5xl">
                          {profileData.photo}
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label
                            className="block text-sm font-semibold text-gray-700 mb-2"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Gelar Depan
                          </label>
                          <input
                            type="text"
                            value={profileData.prefixTitle}
                            onChange={(e) =>
                              handleProfileUpdate("prefixTitle", e.target.value)
                            }
                            disabled={!editingProfile}
                            placeholder="Dr."
                            className={`w-full px-4 py-3 rounded-xl border-2 ${
                              editingProfile
                                ? "border-gray-300 focus:border-blue-500"
                                : "border-gray-200 bg-gray-50"
                            } focus:outline-none`}
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          />
                        </div>
                        <div className="col-span-2">
                          <label
                            className="block text-sm font-semibold text-gray-700 mb-2"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={profileData.fullName}
                            onChange={(e) =>
                              handleProfileUpdate("fullName", e.target.value)
                            }
                            disabled={!editingProfile}
                            className={`w-full px-4 py-3 rounded-xl border-2 ${
                              editingProfile
                                ? "border-gray-300 focus:border-blue-500"
                                : "border-gray-200 bg-gray-50"
                            } focus:outline-none`}
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          />
                        </div>
                      </div>
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Gelar Belakang
                        </label>
                        <input
                          type="text"
                          value={profileData.suffixTitle}
                          onChange={(e) =>
                            handleProfileUpdate("suffixTitle", e.target.value)
                          }
                          disabled={!editingProfile}
                          placeholder="M.T., Ph.D."
                          className={`w-full px-4 py-3 rounded-xl border-2 ${
                            editingProfile
                              ? "border-gray-300 focus:border-blue-500"
                              : "border-gray-200 bg-gray-50"
                          } focus:outline-none`}
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Informasi Akademis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Nama Institusi
                      </label>
                      <input
                        type="text"
                        value={profileData.institution}
                        onChange={(e) =>
                          handleProfileUpdate("institution", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Departemen
                      </label>
                      <input
                        type="text"
                        value={profileData.department}
                        onChange={(e) =>
                          handleProfileUpdate("department", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        NIDN
                      </label>
                      <input
                        type="text"
                        value={profileData.nidn}
                        onChange={(e) =>
                          handleProfileUpdate("nidn", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Bidang Riset
                      </label>
                      <input
                        type="text"
                        value={profileData.researchField}
                        onChange={(e) =>
                          handleProfileUpdate("researchField", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Bio / Deskripsi Singkat
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) =>
                        handleProfileUpdate("bio", e.target.value)
                      }
                      disabled={!editingProfile}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-xl border-2 ${
                        editingProfile
                          ? "border-gray-300 focus:border-blue-500"
                          : "border-gray-200 bg-gray-50"
                      } focus:outline-none`}
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    />
                  </div>
                </div>

                {/* Academic Profiles */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Link Profil Akademis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Google Scholar
                      </label>
                      <input
                        type="url"
                        value={profileData.googleScholar}
                        onChange={(e) =>
                          handleProfileUpdate("googleScholar", e.target.value)
                        }
                        disabled={!editingProfile}
                        placeholder="https://scholar.google.com/citations?user=..."
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        ResearchGate
                      </label>
                      <input
                        type="url"
                        value={profileData.researchGate}
                        onChange={(e) =>
                          handleProfileUpdate("researchGate", e.target.value)
                        }
                        disabled={!editingProfile}
                        placeholder="https://www.researchgate.net/profile/..."
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Research History */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Histori Penelitian
                  </h2>
                  <div className="space-y-3">
                    {profileData.researchHistory.map((research, idx) => (
                      <div
                        key={idx}
                        className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3
                              className="font-bold text-gray-800"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {research.title}
                            </h3>
                            <p
                              className="text-sm text-gray-600 mt-1"
                              style={{ fontFamily: "Open Sans, sans-serif" }}
                            >
                              Status:{" "}
                              <span
                                className={`font-semibold ${
                                  research.status === "Selesai"
                                    ? "text-green-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {research.status}
                              </span>
                            </p>
                          </div>
                          <span className="text-sm font-semibold text-blue-600">
                            {research.year}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save Button */}
                {editingProfile && (
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => setEditingProfile(false)}
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Batal
                    </button>
                    <button
                      onClick={() => {
                        setEditingProfile(false);
                        alert("Profil berhasil diperbarui!");
                      }}
                      className="px-8 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Research Tab */}
          {activeTab === "research" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Penelitian Saya
                </h1>
                <button
                  onClick={() => setShowResearchModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Penelitian</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {researches.map((research) => (
                  <div
                    key={research.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          research.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {research.status === "completed"
                          ? "Selesai"
                          : "Berlangsung"}
                      </span>
                      {research.verified && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Terverifikasi
                        </span>
                      )}
                    </div>

                    <h3
                      className="text-lg font-bold text-gray-800 mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {research.title}
                    </h3>

                    <div className="text-sm text-gray-600 mb-3 space-y-1">
                      <p>
                        <strong>Bidang:</strong> {research.field}
                      </p>
                      <p>
                        <strong>Tahun:</strong> {research.year}
                      </p>
                    </div>

                    <p
                      className="text-sm text-gray-600 mb-3 line-clamp-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {research.abstract}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {research.keywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>

                    {research.status === "completed" && research.futureplan && (
                      <div className="bg-blue-50 rounded-xl p-3 mb-3">
                        <p className="text-xs font-semibold text-blue-700 mb-1">
                          Rencana ke Depan:
                        </p>
                        <p className="text-xs text-blue-600">
                          {research.futureplan}
                        </p>
                      </div>
                    )}

                    {research.status === "ongoing" &&
                      research.collaboration && (
                        <div className="bg-yellow-50 rounded-xl p-3 mb-3">
                          <p className="text-xs font-semibold text-yellow-700 mb-1">
                            Kolaborasi Diharapkan:
                          </p>
                          <p className="text-xs text-yellow-600">
                            {research.collaboration}
                          </p>
                        </div>
                      )}

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                        Edit
                      </button>
                      <button className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Partnerships Tab */}
          {activeTab === "partnerships" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Kemitraan dengan IKM
              </h1>

              {/* Pending Requests */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Permintaan Kemitraan ({partnershipRequests.length})
                  </h2>
                </div>

                {partnershipRequests.length > 0 ? (
                  <div className="space-y-4">
                    {partnershipRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-white rounded-2xl shadow-lg p-6"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3
                                className="text-xl font-bold text-gray-800"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                              >
                                {request.ikmName}
                              </h3>
                              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                                Menunggu Verifikasi
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                              <strong>Penelitian:</strong>{" "}
                              {request.researchTitle}
                            </p>
                            <p className="text-sm text-gray-500 mb-3">
                              Diajukan:{" "}
                              {new Date(request.requestDate).toLocaleDateString(
                                "id-ID",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <p className="text-sm font-semibold text-gray-700 mb-2">
                            Pesan dari IKM:
                          </p>
                          <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {request.description}
                          </p>
                        </div>

                        <div className="flex space-x-3">
                          <button
                            onClick={() =>
                              handleVerifyPartnership(request.id, "approve")
                            }
                            className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center space-x-2"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            <CheckCircle className="w-5 h-5" />
                            <span>Terima Kemitraan</span>
                          </button>
                          <button
                            onClick={() =>
                              handleVerifyPartnership(request.id, "reject")
                            }
                            className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-2"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            <X className="w-5 h-5" />
                            <span>Tolak</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-10 h-10 text-gray-400" />
                    </div>
                    <p
                      className="text-gray-600"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Belum ada permintaan kemitraan baru
                    </p>
                  </div>
                )}
              </div>

              {/* Manual Partnership Entry */}
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Tambah Kemitraan Manual
                </h2>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                  <p
                    className="text-blue-50 mb-4"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Sudah memiliki kemitraan dengan IKM yang belum terdaftar?
                    Tambahkan secara manual untuk dokumentasi.
                  </p>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                    + Tambah Kemitraan Manual
                  </button>
                </div>
              </div>

              {/* Verified Partnerships */}
              <div>
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kemitraan Terverifikasi ({verifiedPartnerships.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {verifiedPartnerships.map((partnership) => (
                    <div
                      key={partnership.id}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3
                          className="text-lg font-bold text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {partnership.ikmName}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            partnership.status === "active"
                              ? "bg-green-100 text-green-700"
                              : partnership.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {partnership.status === "active"
                            ? "Aktif"
                            : partnership.status === "completed"
                            ? "Selesai"
                            : "Tertunda"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Penelitian:</strong> {partnership.researchTitle}
                      </p>

                      <div className="text-xs text-gray-500 mb-3 space-y-1">
                        <p>
                          Mulai:{" "}
                          {new Date(partnership.startDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                        {partnership.endDate && (
                          <p>
                            Selesai:{" "}
                            {new Date(partnership.endDate).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        )}
                      </div>

                      {partnership.outcome && (
                        <div className="bg-green-50 rounded-xl p-3 mb-3">
                          <p className="text-xs font-semibold text-green-700 mb-1">
                            Hasil:
                          </p>
                          <p className="text-xs text-green-600">
                            {partnership.outcome}
                          </p>
                        </div>
                      )}

                      <button className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                        Lihat Detail
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Research Modal */}
        {showResearchModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResearchModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Upload Penelitian Baru
                  </h2>
                  <button
                    onClick={() => setShowResearchModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form
                className="p-6 space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.target);
                  handleAddResearch({
                    title: formData.get("title"),
                    status: researchStatus,
                    field: formData.get("field"),
                    year: parseInt(formData.get("year")),
                    abstract: formData.get("abstract"),
                    keywords: formData
                      .get("keywords")
                      .split(",")
                      .map((k) => k.trim()),
                    futureplan:
                      researchStatus === "completed"
                        ? formData.get("futureplan")
                        : "",
                    collaboration:
                      researchStatus === "ongoing"
                        ? formData.get("collaboration")
                        : "",
                  });
                }}
              >
                {/* Title */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Judul Penelitian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Masukkan judul penelitian lengkap"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Status Penelitian <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setResearchStatus("completed")}
                      className={`p-4 rounded-xl border-2 transition ${
                        researchStatus === "completed"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle
                          className={`w-8 h-8 ${
                            researchStatus === "completed"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p
                        className="font-semibold text-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Selesai
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setResearchStatus("ongoing")}
                      className={`p-4 rounded-xl border-2 transition ${
                        researchStatus === "ongoing"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-300 hover:border-yellow-300"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp
                          className={`w-8 h-8 ${
                            researchStatus === "ongoing"
                              ? "text-yellow-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p
                        className="font-semibold text-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Sedang Berlangsung
                      </p>
                    </button>
                  </div>
                </div>

                {/* Conditional Field based on Status */}
                {researchStatus === "completed" && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <label
                      className="block text-sm font-semibold text-green-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Rencana ke Depan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="futureplan"
                      rows={3}
                      placeholder="Jelaskan rencana implementasi atau pengembangan lebih lanjut..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                )}

                {researchStatus === "ongoing" && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <label
                      className="block text-sm font-semibold text-yellow-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Kolaborasi yang Diharapkan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="collaboration"
                      rows={3}
                      placeholder="Jelaskan jenis IKM atau kolaborasi yang Anda butuhkan..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                )}

                {/* Field and Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Bidang Industri <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="field"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    >
                      <option value="">Pilih bidang industri</option>
                      <option value="Furniture & Kerajinan">
                        Furniture & Kerajinan
                      </option>
                      <option value="Tekstil & Garmen">Tekstil & Garmen</option>
                      <option value="Logam & Metalurgi">
                        Logam & Metalurgi
                      </option>
                      <option value="Kemasan & Packaging">
                        Kemasan & Packaging
                      </option>
                      <option value="Makanan & Minuman">
                        Makanan & Minuman
                      </option>
                      <option value="Kimia & Farmasi">Kimia & Farmasi</option>
                      <option value="Elektronik & Komponen">
                        Elektronik & Komponen
                      </option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tahun Penelitian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      min="2000"
                      max="2025"
                      placeholder="2024"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Abstrak / Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="abstract"
                    rows={5}
                    placeholder="Jelaskan ringkasan penelitian Anda (maksimal 500 kata)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Kata Kunci (Keywords){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    placeholder="Pisahkan dengan koma (contoh: IoT, Monitoring, Kualitas, Logam)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Upload PDF */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Upload Dokumen Abstrak (.pdf){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p
                      className="text-gray-600 mb-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Klik untuk upload atau drag & drop file
                    </p>
                    <p className="text-xs text-gray-500">PDF (Maksimal 10MB)</p>
                    <input type="file" accept=".pdf" className="hidden" />
                  </div>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p
                    className="text-blue-800 text-sm"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    ℹ️ Penelitian Anda akan melalui proses verifikasi oleh admin
                    sebelum dipublikasikan di platform. Proses verifikasi
                    membutuhkan waktu 3-5 hari kerja.
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowResearchModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Kirim untuk Verifikasi
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AcademicianDashboard;
