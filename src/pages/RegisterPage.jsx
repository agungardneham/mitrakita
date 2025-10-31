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

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Common fields
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",

    // IKM specific
    businessName: "",
    businessType: "",
    address: "",
    province: "",
    city: "",
    npwp: "",
    nib: "",

    // User specific
    fullName: "",
    companyName: "",
    position: "",

    // Academician specific
    institution: "",
    department: "",
    nidn: "",
    researchField: "",
  });

  const roles = [
    {
      id: "ikm",
      title: "IKM",
      subtitle: "Industri Kecil dan Menengah",
      icon: <Building2 className="w-8 h-8" />,
      gradient: "from-green-600 to-green-500",
      description:
        "Daftarkan bisnis IKM Anda untuk bermitra dengan industri besar",
    },
    {
      id: "user",
      title: "Pengguna Umum",
      subtitle: "Industri Besar / Pencari Mitra",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-blue-600 to-blue-500",
      description: "Cari dan hubungi IKM untuk kebutuhan produk dan layanan",
    },
    {
      id: "academician",
      title: "Akademisi",
      subtitle: "Peneliti / Dosen",
      icon: <GraduationCap className="w-8 h-8" />,
      gradient: "from-yellow-500 to-yellow-400",
      description: "Kolaborasi riset dan transfer teknologi dengan IKM",
    },
  ];

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setStep(2);
  };

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      alert("Password tidak cocok!");
      return;
    }
    // In real app: send to backend API
    alert(
      `Pendaftaran berhasil sebagai ${selectedRole}! Silakan cek email untuk verifikasi.`
    );
    navigate("/login");
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Daftar ke MitraKita
            </h1>
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Bergabunglah dengan ekosistem kemitraan industri Indonesia
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div
                className={`flex items-center ${
                  step >= 1 ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 1
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span
                  className="ml-2 font-semibold hidden sm:inline"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Pilih Peran
                </span>
              </div>
              <div className="w-16 h-1 bg-gray-300">
                <div
                  className={`h-full ${
                    step >= 2 ? "bg-green-600" : "bg-gray-300"
                  } transition-all`}
                ></div>
              </div>
              <div
                className={`flex items-center ${
                  step >= 2 ? "text-green-600" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    step >= 2
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span
                  className="ml-2 font-semibold hidden sm:inline"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Isi Data
                </span>
              </div>
            </div>
          </div>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Pilih Peran Anda
              </h2>
              <div className="space-y-4">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className="w-full text-left p-6 rounded-2xl border-2 border-gray-200 hover:border-green-300 hover:shadow-lg transition-all"
                  >
                    <div className="flex items-start space-x-4">
                      <div
                        className={`w-14 h-14 bg-gradient-to-br ${role.gradient} rounded-xl flex items-center justify-center text-white flex-shrink-0`}
                      >
                        {role.icon}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-xl font-bold text-gray-800 mb-1"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {role.title}
                        </h3>
                        <p
                          className="text-sm text-gray-600 mb-2 font-semibold"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {role.subtitle}
                        </p>
                        <p
                          className="text-sm text-gray-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {role.description}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-8 text-center">
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Sudah punya akun?{" "}
                  <Link
                    to="/login"
                    className="text-green-600 hover:text-green-700 font-bold"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Masuk di sini
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Registration Form */}
          {step === 2 && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2
                  className="text-2xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Lengkapi Data{" "}
                  {selectedRole === "ikm"
                    ? "IKM"
                    : selectedRole === "user"
                    ? "Pengguna"
                    : "Akademisi"}
                </h2>
                <button
                  onClick={() => setStep(1)}
                  className="text-gray-600 hover:text-gray-800 text-sm font-semibold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  ← Ubah Peran
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Common Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder="nama@email.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="08123456789"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Password <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder="Minimal 8 karakter"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Konfirmasi Password{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      placeholder="Ulangi password"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                </div>

                {/* IKM Specific Fields */}
                {selectedRole === "ikm" && (
                  <>
                    <div className="border-t border-gray-200 pt-6">
                      <h3
                        className="text-lg font-bold text-gray-800 mb-4"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Informasi Bisnis
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Nama Usaha <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.businessName}
                          onChange={(e) =>
                            handleInputChange("businessName", e.target.value)
                          }
                          placeholder="CV/UD/PT Nama Usaha"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Jenis Usaha <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.businessType}
                          onChange={(e) =>
                            handleInputChange("businessType", e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        >
                          <option value="">Pilih jenis usaha</option>
                          <option value="furniture">
                            Furniture & Kerajinan
                          </option>
                          <option value="textile">Tekstil & Garmen</option>
                          <option value="food">Makanan & Minuman</option>
                          <option value="metal">Logam & Metalurgi</option>
                          <option value="packaging">Kemasan & Packaging</option>
                          <option value="other">Lainnya</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label
                        className="block text-gray-700 font-semibold mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Alamat Lengkap <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Jalan, Kelurahan, Kecamatan"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          NPWP
                        </label>
                        <input
                          type="text"
                          value={formData.npwp}
                          onChange={(e) =>
                            handleInputChange("npwp", e.target.value)
                          }
                          placeholder="00.000.000.0-000.000"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          NIB (Nomor Induk Berusaha)
                        </label>
                        <input
                          type="text"
                          value={formData.nib}
                          onChange={(e) =>
                            handleInputChange("nib", e.target.value)
                          }
                          placeholder="1234567890123"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* User Specific Fields */}
                {selectedRole === "user" && (
                  <>
                    <div className="border-t border-gray-200 pt-6">
                      <h3
                        className="text-lg font-bold text-gray-800 mb-4"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Informasi Pribadi & Perusahaan
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          placeholder="Nama lengkap Anda"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Nama Perusahaan{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.companyName}
                          onChange={(e) =>
                            handleInputChange("companyName", e.target.value)
                          }
                          placeholder="PT/CV Nama Perusahaan"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Jabatan <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.position}
                          onChange={(e) =>
                            handleInputChange("position", e.target.value)
                          }
                          placeholder="Jabatan di perusahaan"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                {/* Academician Specific Fields */}
                {selectedRole === "academician" && (
                  <>
                    <div className="border-t border-gray-200 pt-6">
                      <h3
                        className="text-lg font-bold text-gray-800 mb-4"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Informasi Akademisi
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Nama Institusi <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.institution}
                          onChange={(e) =>
                            handleInputChange("institution", e.target.value)
                          }
                          placeholder="Nama universitas atau institusi"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Departemen <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                          placeholder="Departemen atau fakultas"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          NIDN <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.nidn}
                          onChange={(e) =>
                            handleInputChange("nidn", e.target.value)
                          }
                          placeholder="Nomor Induk Dosen Nasional"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        />
                      </div>
                      <div>
                        <label
                          className="block text-gray-700 font-semibold mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Bidang Riset <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.researchField}
                          onChange={(e) =>
                            handleInputChange("researchField", e.target.value)
                          }
                          placeholder="Bidang penelitian utama Anda"
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required
                        />
                      </div>
                    </div>
                  </>
                )}
                <button
                  type="submit"
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-2xl hover:shadow-lg transition-all font-bold text-lg"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Daftar Sekarang
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default RegisterPage;
