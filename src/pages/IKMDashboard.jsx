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

const IKMDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    businessName: "CV Furniture Jaya Abadi",
    businessType: "Furniture & Kerajinan",
    officeAddress: "Jl. Raya Tahunan No. 45, Jepara",
    factoryAddress: "Kawasan Industri Jepara Blok A-12",
    nib: "1234567890123",
    logo: "🪑",
    establishedYear: 2008,
    employees: 45,
    partnerships: 28,
    certifications: 2,
    certificationDetails: ["SNI", "SVLK"],
    bio: "Produsen furniture berkualitas tinggi dengan pengalaman lebih dari 15 tahun. Menggunakan kayu jati pilihan dan craftmanship terbaik.",
    website: "www.furniturejaya.com",
    academicPartnerships: [
      { institution: "ITB", year: 2023, topic: "Optimalisasi UV Coating" },
      { institution: "UGM", year: 2022, topic: "Sustainable Wood Treatment" },
    ],
  });

  // Products State
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Kursi Jati Minimalis",
      image: "🪑",
      description: "Kursi kayu jati solid dengan desain minimalis modern",
      specifications: "Dimensi: 50x50x90cm, Material: Kayu Jati Grade A",
      capacity: "100 unit/bulan",
      certifications: ["SNI"],
    },
  ]);

  // Services State
  const [services, setServices] = useState([
    {
      id: 1,
      name: "Custom Furniture Design",
      image: "✏️",
      description:
        "Layanan desain dan pembuatan furniture custom sesuai kebutuhan",
      specifications: "Lead time: 2-4 minggu, Min. order: 10 unit",
      certifications: [],
    },
  ]);

  // Machines State
  const [machines, setMachines] = useState([
    {
      id: 1,
      name: "CNC Router Machine",
      image: "⚙️",
      description: "Mesin CNC untuk cutting dan carving presisi tinggi",
      specifications: "Working area: 2000x3000mm, Spindle power: 6kW",
      quantity: 2,
      capacity: "50 panel/hari per unit",
      certifications: [],
    },
  ]);

  const sidebarItems = [
    { id: "overview", label: "Beranda", icon: <Home className="w-5 h-5" /> },
    {
      id: "profile",
      label: "Profil Bisnis",
      icon: <Building2 className="w-5 h-5" />,
    },
    { id: "products", label: "Produk", icon: <Package className="w-5 h-5" /> },
    {
      id: "services",
      label: "Layanan",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "machines",
      label: "Mesin & Peralatan",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "messages",
      label: "Pesan",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      id: "partnerships",
      label: "Kemitraan",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "ratings",
      label: "Rating & Ulasan",
      icon: <Star className="w-5 h-5" />,
    },
  ];

  const handleProfileUpdate = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleAddProduct = (newProduct) => {
    setProducts([...products, { ...newProduct, id: products.length + 1 }]);
    setShowProductModal(false);
  };

  const handleAddService = (newService) => {
    setServices([...services, { ...newService, id: services.length + 1 }]);
    setShowServiceModal(false);
  };

  const handleAddMachine = (newMachine) => {
    setMachines([...machines, { ...newMachine, id: machines.length + 1 }]);
    setShowMachineModal(false);
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-green-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center text-2xl">
                {profileData.logo}
              </div>
              <div>
                <h2
                  className="text-lg font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dashboard IKM
                </h2>
              </div>
            </div>
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {profileData.businessName}
            </p>
          </div>
          <nav className="px-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  activeTab === item.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-green-50"
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
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Profil Bisnis
                </h1>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className={`px-6 py-3 rounded-xl font-semibold transition ${
                    editingProfile
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {editingProfile ? "Batal Edit" : "Edit Profil"}
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
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
                        Logo IKM
                      </label>
                      {editingProfile ? (
                        <div className="flex items-center space-x-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center text-4xl">
                            {profileData.logo}
                          </div>
                          <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                            Unggah Logo
                          </button>
                        </div>
                      ) : (
                        <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center text-4xl">
                          {profileData.logo}
                        </div>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Nama Usaha
                      </label>
                      <input
                        type="text"
                        value={profileData.businessName}
                        onChange={(e) =>
                          handleProfileUpdate("businessName", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                        Jenis Usaha
                      </label>
                      <select
                        value={profileData.businessType}
                        onChange={(e) =>
                          handleProfileUpdate("businessType", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        <option value="Furniture & Kerajinan">
                          Furniture & Kerajinan
                        </option>
                        <option value="Tekstil & Garmen">
                          Tekstil & Garmen
                        </option>
                        <option value="Logam & Metalurgi">
                          Logam & Metalurgi
                        </option>
                        <option value="Makanan & Minuman">
                          Makanan & Minuman
                        </option>
                        <option value="Kemasan & Packaging">
                          Kemasan & Packaging
                        </option>
                      </select>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        NIB (Nomor Induk Berusaha)
                      </label>
                      <input
                        type="text"
                        value={profileData.nib}
                        onChange={(e) =>
                          handleProfileUpdate("nib", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Alamat
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Alamat Kantor
                      </label>
                      <textarea
                        value={profileData.officeAddress}
                        onChange={(e) =>
                          handleProfileUpdate("officeAddress", e.target.value)
                        }
                        disabled={!editingProfile}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                        Alamat Pabrik
                      </label>
                      <textarea
                        value={profileData.factoryAddress}
                        onChange={(e) =>
                          handleProfileUpdate("factoryAddress", e.target.value)
                        }
                        disabled={!editingProfile}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Detail Perusahaan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Tahun Berdiri
                      </label>
                      <input
                        type="number"
                        value={profileData.establishedYear}
                        onChange={(e) =>
                          handleProfileUpdate("establishedYear", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                        Jumlah Karyawan
                      </label>
                      <input
                        type="number"
                        value={profileData.employees}
                        onChange={(e) =>
                          handleProfileUpdate("employees", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                        Website
                      </label>
                      <input
                        type="text"
                        value={profileData.website}
                        onChange={(e) =>
                          handleProfileUpdate("website", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                      Profil Singkat
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
                          ? "border-gray-300 focus:border-green-500"
                          : "border-gray-200 bg-gray-50"
                      } focus:outline-none`}
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      placeholder="Ceritakan tentang bisnis Anda..."
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Sertifikasi
                  </h2>
                  <div className="flex flex-wrap gap-3 mb-4">
                    {profileData.certificationDetails.map((cert, idx) => (
                      <span
                        key={idx}
                        className="bg-yellow-100 border-2 border-yellow-200 text-yellow-700 px-4 py-2 rounded-xl font-semibold flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{cert}</span>
                        {editingProfile && (
                          <button className="text-red-600 hover:text-red-700 ml-2">
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {editingProfile && (
                    <button className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition">
                      + Tambah Sertifikasi
                    </button>
                  )}
                </div>

                {/* Academic Partnerships History */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Histori Kemitraan Akademisi
                  </h2>
                  <div className="space-y-4">
                    {profileData.academicPartnerships.map(
                      (partnership, idx) => (
                        <div
                          key={idx}
                          className="border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 transition"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3
                                className="font-bold text-gray-800"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                {partnership.institution}
                              </h3>
                              <p
                                className="text-sm text-gray-600"
                                style={{ fontFamily: "Open Sans, sans-serif" }}
                              >
                                {partnership.topic}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-green-600">
                              {partnership.year}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                  {editingProfile && (
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition">
                      + Tambah Histori Kemitraan
                    </button>
                  )}
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
                      className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kelola Produk
                </h1>
                <button
                  onClick={() => setShowProductModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Tambah Produk</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
                  >
                    <div className="w-full h-40 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center text-6xl mb-4">
                      {product.image}
                    </div>
                    <h3
                      className="text-lg font-bold text-gray-800 mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {product.name}
                    </h3>
                    <p
                      className="text-sm text-gray-600 mb-3"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {product.description}
                    </p>
                    <div className="text-xs text-gray-500 mb-3">
                      <p className="mb-1">
                        <strong>Spesifikasi:</strong> {product.specifications}
                      </p>
                      <p>
                        <strong>Kapasitas:</strong> {product.capacity}
                      </p>
                    </div>
                    {product.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {product.certifications.map((cert, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold"
                          >
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                        Edit
                      </button>
                      <button className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition">
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kelola Layanan
                </h1>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Tambah Layanan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                        {service.image}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold text-gray-800 mb-2"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {service.name}
                        </h3>
                        <p
                          className="text-sm text-gray-600 mb-3"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {service.description}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          <strong>Spesifikasi:</strong> {service.specifications}
                        </p>
                        {service.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {service.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                            Edit
                          </button>
                          <button className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition">
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Machines Tab */}
          {activeTab === "machines" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Mesin & Peralatan
                </h1>
                <button
                  onClick={() => setShowMachineModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Tambah Mesin</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {machines.map((machine) => (
                  <div
                    key={machine.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                        {machine.image}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-lg font-bold text-gray-800 mb-2"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {machine.name}
                        </h3>
                        <p
                          className="text-sm text-gray-600 mb-3"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {machine.description}
                        </p>
                        <div className="text-xs text-gray-500 mb-3 space-y-1">
                          <p>
                            <strong>Spesifikasi:</strong>{" "}
                            {machine.specifications}
                          </p>
                          <p>
                            <strong>Jumlah:</strong> {machine.quantity} unit
                          </p>
                          <p>
                            <strong>Kapasitas:</strong> {machine.capacity}
                          </p>
                        </div>
                        {machine.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {machine.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                            Edit
                          </button>
                          <button className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition">
                            Hapus
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Overview Tab - Keep existing overview content */}
          {activeTab === "overview" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Selamat Datang Kembali! 👋
              </h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-8 h-8 text-green-600" />
                    <span className="text-green-600 text-sm font-semibold">
                      +12%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {products.length}
                  </h3>
                  <p className="text-gray-600 text-sm">Produk Aktif</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Settings className="w-8 h-8 text-blue-600" />
                    <span className="text-blue-600 text-sm font-semibold">
                      +5%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {services.length}
                  </h3>
                  <p className="text-gray-600 text-sm">Layanan Aktif</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MessageCircle className="w-8 h-8 text-yellow-600" />
                    <span className="text-yellow-600 text-sm font-semibold">
                      2 Baru
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">8</h3>
                  <p className="text-gray-600 text-sm">Pesan Belum Dibaca</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <span className="text-green-600 text-sm font-semibold">
                      Bagus
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">4.8</h3>
                  <p className="text-gray-600 text-sm">Rating Rata-rata</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2
                  className="text-xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Aksi Cepat
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Building2 className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lengkapi Profil
                    </h3>
                    <p className="text-sm text-green-50">
                      Update informasi bisnis Anda
                    </p>
                  </button>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Package className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tambah Produk
                    </h3>
                    <p className="text-sm text-blue-50">
                      Upload produk baru Anda
                    </p>
                  </button>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Settings className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tambah Layanan
                    </h3>
                    <p className="text-sm text-yellow-50">
                      Daftarkan layanan Anda
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        {showProductModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowProductModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Tambah Produk Baru
                  </h2>
                  <button
                    onClick={() => setShowProductModal(false)}
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
                  handleAddProduct({
                    name: formData.get("name"),
                    image: "📦",
                    description: formData.get("description"),
                    specifications: formData.get("specifications"),
                    capacity: formData.get("capacity"),
                    certifications: formData.get("certifications")
                      ? formData
                          .get("certifications")
                          .split(",")
                          .map((s) => s.trim())
                      : [],
                  });
                }}
              >
                {/* Image Upload */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Gambar Produk <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p
                      className="text-gray-600 mb-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Klik untuk upload atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Nama Produk <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Contoh: Kursi Jati Minimalis"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Deskripsi Produk <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Jelaskan produk Anda secara detail..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Specifications */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Spesifikasi Produk <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="specifications"
                    rows={3}
                    placeholder="Contoh: Dimensi: 50x50x90cm, Material: Kayu Jati Grade A, Berat: 15kg"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Production Capacity */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Kapasitas Produksi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="capacity"
                    placeholder="Contoh: 100 unit/bulan"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Certifications */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Sertifikasi Produk
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    placeholder="Contoh: SNI, ISO 9001 (pisahkan dengan koma)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowProductModal(false)}
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
                    Simpan Produk
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Service Modal */}
        {showServiceModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowServiceModal(false)}
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
                    Tambah Layanan Baru
                  </h2>
                  <button
                    onClick={() => setShowServiceModal(false)}
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
                  handleAddService({
                    name: formData.get("name"),
                    image: "🔧",
                    description: formData.get("description"),
                    specifications: formData.get("specifications"),
                    certifications: formData.get("certifications")
                      ? formData
                          .get("certifications")
                          .split(",")
                          .map((s) => s.trim())
                      : [],
                  });
                }}
              >
                {/* Image Upload */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Gambar Layanan <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p
                      className="text-gray-600 mb-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Klik untuk upload atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
                  </div>
                </div>

                {/* Service Name */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Nama Layanan <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Contoh: Jasa Custom Design Furniture"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Deskripsi Layanan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Jelaskan layanan yang Anda tawarkan..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Specifications */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Spesifikasi Layanan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="specifications"
                    rows={3}
                    placeholder="Contoh: Lead time: 2-4 minggu, Min. order: 10 unit, Free konsultasi desain"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Certifications */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Sertifikasi Layanan
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    placeholder="Contoh: ISO 9001, Certified Professional (pisahkan dengan koma)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowServiceModal(false)}
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
                    Simpan Layanan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Machine Modal */}
        {showMachineModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowMachineModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-gray-700 to-gray-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Tambah Mesin & Peralatan
                  </h2>
                  <button
                    onClick={() => setShowMachineModal(false)}
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
                  handleAddMachine({
                    name: formData.get("name"),
                    image: "⚙️",
                    description: formData.get("description"),
                    specifications: formData.get("specifications"),
                    quantity: formData.get("quantity"),
                    capacity: formData.get("capacity"),
                    certifications: formData.get("certifications")
                      ? formData
                          .get("certifications")
                          .split(",")
                          .map((s) => s.trim())
                      : [],
                  });
                }}
              >
                {/* Image Upload */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Gambar Mesin <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-gray-500 transition cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p
                      className="text-gray-600 mb-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Klik untuk upload atau drag & drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (Max 5MB)</p>
                  </div>
                </div>

                {/* Machine Name */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Nama Mesin <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Contoh: CNC Router Machine"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Deskripsi Mesin <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    rows={3}
                    placeholder="Jelaskan fungsi dan kegunaan mesin..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Specifications */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Spesifikasi Mesin <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="specifications"
                    rows={3}
                    placeholder="Contoh: Working area: 2000x3000mm, Spindle power: 6kW, Max speed: 24000 RPM"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Quantity and Capacity */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Jumlah Unit <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      placeholder="2"
                      min="1"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Kapasitas Mesin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="capacity"
                      placeholder="50 panel/hari"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Sertifikasi Mesin
                  </label>
                  <input
                    type="text"
                    name="certifications"
                    placeholder="Contoh: CE, ISO 9001 (pisahkan dengan koma)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowMachineModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Simpan Mesin
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
export default IKMDashboard;
