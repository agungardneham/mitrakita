import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// ============================================
// USER/INDUSTRY DASHBOARD COMPONENT
// ============================================
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showManualPartnershipModal, setShowManualPartnershipModal] =
    useState(false);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    fullName: "Ahmad Wijaya",
    companyName: "PT Industri Maju Sejahtera",
    position: "Procurement Manager",
    department: "Supply Chain & Procurement",
    photo: "👨‍💼",
    producedProducts: "Komponen elektronik, PCB Assembly, Wiring Harness",
    neededProducts: "Komponen logam presisi, kemasan custom, furniture kantor",
    bio: "Profesional di bidang procurement dengan pengalaman 10+ tahun dalam menjalin kemitraan strategis dengan supplier lokal.",
  });

  // IKM Partnership Requests
  const [partnershipRequests, setPartnershipRequests] = useState([
    {
      id: 1,
      ikmName: "CV Furniture Jaya Abadi",
      product: "Meja dan Kursi Kantor",
      requestDate: "2024-11-08",
      status: "pending",
      description:
        "Kami siap menyediakan furniture kantor berkualitas tinggi sesuai spesifikasi yang Anda butuhkan",
      deliveryTime: "3-4 minggu",
    },
    {
      id: 2,
      ikmName: "PT Logam Presisi Indo",
      product: "Komponen Logam Custom",
      requestDate: "2024-11-10",
      status: "pending",
      description:
        "Manufaktur komponen logam presisi dengan teknologi CNC untuk kebutuhan produksi Anda",
      deliveryTime: "2-3 minggu",
    },
  ]);

  // Active Partnerships
  const [activePartnerships, setActivePartnerships] = useState([
    {
      id: 1,
      ikmName: "UD Kemasan Kreatif",
      product: "Box Karton Custom",
      startDate: "2024-06-01",
      status: "active",
      orderCount: 5,
      lastOrder: "2024-10-15",
      rating: 4.8,
    },
    {
      id: 2,
      ikmName: "CV Elektronik Mandiri",
      product: "PCB Assembly",
      startDate: "2024-03-15",
      status: "active",
      orderCount: 12,
      lastOrder: "2024-11-05",
      rating: 4.9,
    },
  ]);

  // Completed Partnerships
  const [completedPartnerships, setCompletedPartnerships] = useState([
    {
      id: 1,
      ikmName: "UD Meubel Berkah",
      product: "Furniture Ruang Meeting",
      startDate: "2023-08-01",
      endDate: "2024-02-28",
      status: "completed",
      orderCount: 3,
      rating: 4.7,
      review: "Kualitas produk sangat baik dan pengiriman tepat waktu",
    },
  ]);

  const sidebarItems = [
    { id: "overview", label: "Beranda", icon: <Home className="w-5 h-5" /> },
    {
      id: "profile",
      label: "Profil Perusahaan",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: "ikm-directory",
      label: "Cari IKM",
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: "partnerships",
      label: "Kemitraan",
      icon: <Users className="w-5 h-5" />,
    },
    { id: "orders", label: "Pesanan", icon: <Package className="w-5 h-5" /> },
  ];

  const handleProfileUpdate = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleVerifyPartnership = (id, action) => {
    const request = partnershipRequests.find((r) => r.id === id);
    if (action === "approve") {
      setActivePartnerships([
        ...activePartnerships,
        {
          id: activePartnerships.length + 1,
          ikmName: request.ikmName,
          product: request.product,
          startDate: new Date().toISOString().split("T")[0],
          status: "active",
          orderCount: 0,
          lastOrder: "-",
          rating: 0,
        },
      ]);
    }
    setPartnershipRequests(partnershipRequests.filter((r) => r.id !== id));
  };

  const handleAddManualPartnership = (partnershipData) => {
    setActivePartnerships([
      ...activePartnerships,
      {
        id: activePartnerships.length + 1,
        ...partnershipData,
        status: "active",
      },
    ]);
    setShowManualPartnershipModal(false);
  };

  return (
    <div>
      <Navbar userRole="industry" />
      <div className="flex min-h-screen bg-green-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-2xl">
                {profileData.photo}
              </div>
              <div>
                <h2
                  className="text-lg font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dashboard User
                </h2>
              </div>
            </div>
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {profileData.companyName}
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
            <button
              onClick={async () => {
                await logout();
                navigate("/");
              }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all mt-8 font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
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
                Selamat Datang, {profileData.fullName}! 👋
              </h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                    <span className="text-blue-600 text-sm font-semibold">
                      Aktif
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {activePartnerships.length}
                  </h3>
                  <p className="text-gray-600 text-sm">Kemitraan IKM</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-8 h-8 text-green-600" />
                    <span className="text-green-600 text-sm font-semibold">
                      Total
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {activePartnerships.reduce(
                      (sum, p) => sum + p.orderCount,
                      0
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">Pesanan</p>
                </div>
              </div>

              {/* Pending Partnership Requests */}
              {partnershipRequests.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Pengajuan Kemitraan dari IKM ({partnershipRequests.length})
                  </h2>
                  <div className="space-y-4">
                    {partnershipRequests.slice(0, 2).map((request) => (
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
                              Produk: {request.product}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {request.requestDate}
                          </span>
                        </div>
                        <p
                          className="text-sm text-gray-700 mb-3"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {request.description}
                        </p>
                        <div className="bg-white rounded-lg p-3 mb-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Waktu Pengiriman yang Diusulkan
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {request.deliveryTime}
                          </p>
                        </div>
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
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Building2 className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lengkapi Profil
                    </h3>
                    <p className="text-sm text-blue-50">
                      Update informasi perusahaan
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab("ikm-directory")}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Search className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Cari IKM
                    </h3>
                    <p className="text-sm text-green-50">
                      Temukan mitra potensial
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
                      Review permintaan IKM
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
                  Profil Perusahaan
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
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Informasi Pribadi
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
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-5xl">
                            {profileData.photo}
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                            Unggah Foto
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-5xl">
                          {profileData.photo}
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Nama Lengkap <span className="text-red-500">*</span>
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
                  </div>
                </div>

                {/* Company Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Informasi Perusahaan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Nama Perusahaan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileData.companyName}
                        onChange={(e) =>
                          handleProfileUpdate("companyName", e.target.value)
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
                        Jabatan
                      </label>
                      <input
                        type="text"
                        value={profileData.position}
                        onChange={(e) =>
                          handleProfileUpdate("position", e.target.value)
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
                        Departemen / Divisi
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
                  </div>
                </div>

                {/* Products & Services */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Produk & Kebutuhan
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Produk yang Dihasilkan{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={profileData.producedProducts}
                        onChange={(e) =>
                          handleProfileUpdate(
                            "producedProducts",
                            e.target.value
                          )
                        }
                        disabled={!editingProfile}
                        rows={3}
                        placeholder="Contoh: Komponen elektronik, PCB Assembly, Wiring Harness"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Pisahkan dengan koma untuk multiple products
                      </p>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Produk/Layanan yang Dibutuhkan{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={profileData.neededProducts}
                        onChange={(e) =>
                          handleProfileUpdate("neededProducts", e.target.value)
                        }
                        disabled={!editingProfile}
                        rows={3}
                        placeholder="Contoh: Komponen logam presisi, kemasan custom, furniture kantor"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ini membantu IKM menemukan perusahaan Anda
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Deskripsi Singkat
                  </h2>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                    disabled={!editingProfile}
                    rows={4}
                    placeholder="Ceritakan tentang perusahaan dan pengalaman Anda..."
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editingProfile
                        ? "border-gray-300 focus:border-blue-500"
                        : "border-gray-200 bg-gray-50"
                    } focus:outline-none`}
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
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

          {/* Partnerships Tab */}
          {activeTab === "partnerships" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Kelola Kemitraan IKM
              </h1>

              {/* Pending Requests */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Pengajuan dari IKM ({partnershipRequests.length})
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
                              <strong>Produk:</strong> {request.product}
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
                            Penawaran dari IKM:
                          </p>
                          <p
                            className="text-sm text-gray-600 mb-3"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {request.description}
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Waktu Pengiriman
                              </p>
                              <p className="text-sm font-semibold text-gray-800">
                                {request.deliveryTime}
                              </p>
                            </div>
                          </div>
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
                      Belum ada pengajuan kemitraan dari IKM
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
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
                  <p
                    className="text-blue-50 mb-4"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Sudah memiliki kemitraan dengan IKM yang belum terdaftar di
                    platform? Tambahkan secara manual untuk dokumentasi dan
                    tracking.
                  </p>
                  <button
                    onClick={() => setShowManualPartnershipModal(true)}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    + Tambah Kemitraan Manual
                  </button>
                </div>
              </div>

              {/* Active Partnerships */}
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kemitraan Aktif ({activePartnerships.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activePartnerships.map((partnership) => (
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
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aktif
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Produk:</strong> {partnership.product}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Total Pesanan
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            {partnership.orderCount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        <span>
                          Sejak:{" "}
                          {new Date(partnership.startDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                        <span>
                          Order terakhir:{" "}
                          {partnership.lastOrder === "-"
                            ? "-"
                            : new Date(
                                partnership.lastOrder
                              ).toLocaleDateString("id-ID")}
                        </span>
                      </div>

                      {partnership.rating > 0 && (
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(partnership.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-semibold text-gray-700">
                            {partnership.rating}
                          </span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                          Lihat Detail
                        </button>
                        <button className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                          Buat Pesanan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Partnerships */}
              <div>
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kemitraan Selesai ({completedPartnerships.length})
                </h2>

                <div className="space-y-4">
                  {completedPartnerships.map((partnership) => (
                    <div
                      key={partnership.id}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3
                              className="text-lg font-bold text-gray-800"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {partnership.ikmName}
                            </h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Selesai
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Produk:</strong> {partnership.product}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Total Pesanan
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {partnership.orderCount}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Durasi</p>
                          <p className="text-sm font-bold text-gray-800">
                            6 bulan
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(partnership.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-semibold text-gray-700">
                          {partnership.rating}
                        </span>
                      </div>

                      {partnership.review && (
                        <div className="bg-green-50 rounded-xl p-3">
                          <p className="text-xs font-semibold text-green-700 mb-1">
                            Review Anda:
                          </p>
                          <p className="text-xs text-green-600">
                            {partnership.review}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* IKM Directory Tab */}
          {activeTab === "ikm-directory" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Cari IKM Mitra
              </h1>
              <p
                className="text-gray-600 mb-8"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Temukan IKM yang sesuai dengan kebutuhan produk dan layanan Anda
              </p>
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p
                  className="text-gray-600 mb-6"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Fitur pencarian IKM akan segera tersedia
                </p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Jelajahi Direktori IKM
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Manual Partnership Modal */}
        {showManualPartnershipModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowManualPartnershipModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Tambah Kemitraan Manual
                  </h2>
                  <button
                    onClick={() => setShowManualPartnershipModal(false)}
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
                  handleAddManualPartnership({
                    ikmName: formData.get("ikmName"),
                    product: formData.get("product"),
                    startDate: formData.get("startDate"),
                    orderCount: parseInt(formData.get("orderCount")) || 0,
                    totalValue: formData.get("totalValue"),
                    lastOrder: formData.get("lastOrder") || "-",
                    rating: 0,
                  });
                }}
              >
                {/* IKM Name */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Nama IKM <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="ikmName"
                    placeholder="Contoh: CV Furniture Jaya Abadi"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Product/Service */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Produk/Layanan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="product"
                    placeholder="Contoh: Meja dan Kursi Kantor"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Start Date */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Tanggal Mulai Kemitraan{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Jumlah Pesanan (Opsional)
                    </label>
                    <input
                      type="number"
                      name="orderCount"
                      min="0"
                      placeholder="0"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Total Nilai (Opsional)
                    </label>
                    <input
                      type="text"
                      name="totalValue"
                      placeholder="Rp 0"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    />
                  </div>
                </div>

                {/* Last Order Date */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Tanggal Pesanan Terakhir (Opsional)
                  </label>
                  <input
                    type="date"
                    name="lastOrder"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p
                    className="text-blue-800 text-sm"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    ℹ️ Data kemitraan manual akan disimpan untuk keperluan
                    dokumentasi dan tracking. Anda dapat memberikan rating
                    setelah kemitraan ditambahkan.
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowManualPartnershipModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Simpan Kemitraan
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

export default UserDashboard;
