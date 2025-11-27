import React, { useState } from "react";
import { Building2, Users, GraduationCap, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LoginPage = ({ setUserRole }) => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const roles = [
    {
      id: "ikm",
      title: "IKM",
      subtitle: "Industri Kecil dan Menengah",
      icon: <Building2 className="w-8 h-8" />,
      gradient: "from-green-600 to-green-500",
      description: "Untuk pemilik usaha kecil dan menengah yang ingin bermitra",
    },
    {
      id: "user",
      title: "Pengguna Umum",
      subtitle: "Industri Pencari Mitra / User",
      icon: <Users className="w-8 h-8" />,
      gradient: "from-blue-600 to-blue-500",
      description: "Untuk industri atau pencari produk dan layanan IKM",
    },
    {
      id: "academician",
      title: "Akademisi",
      subtitle: "Peneliti / Dosen",
      icon: <GraduationCap className="w-8 h-8" />,
      gradient: "from-yellow-500 to-yellow-400",
      description: "Untuk akademisi yang ingin berkolaborasi riset dengan IKM",
    },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!selectedRole) {
      setError("Pilih peran Anda terlebih dahulu.");
      return;
    }
    if (!email || !password) {
      setError("Isi email dan password.");
      return;
    }

    try {
      setIsLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // Get user doc from Firestore to determine role
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDocRef);
      let roleFromDb = null;
      if (userSnap.exists()) {
        const data = userSnap.data();
        roleFromDb = data.role;
      }

      // Validate that selected role matches Firestore role
      if (roleFromDb && roleFromDb !== selectedRole) {
        throw new Error(
          `Login gagal. Pastikan email dan password sesuai dengan peran yang Anda pilih.`
        );
      }

      const roleToUse = roleFromDb || selectedRole;

      // Optionally lift role to parent
      if (setUserRole) setUserRole(roleToUse);

      // Redirect based on role
      if (roleToUse === "ikm") {
        navigate("/dashboard/ikm");
      } else if (roleToUse === "user") {
        navigate("/dashboard/user");
      } else if (roleToUse === "academician") {
        navigate("/dashboard/akademisi");
      } else {
        // default fallback
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      // Handle different Firebase error codes
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError(
          "Login gagal. Pastikan email dan password sesuai dengan peran yang Anda pilih."
        );
      } else if (err.code === "auth/too-many-requests") {
        setError(
          "Terlalu banyak percobaan login gagal. Silakan coba beberapa saat lagi."
        );
      } else if (err.code === "auth/operation-not-allowed") {
        setError(
          "Login gagal. Pastikan email dan password sesuai dengan peran yang Anda pilih."
        );
      } else if (err.message && !err.code) {
        // Custom error messages (dari validasi role mismatch)
        setError(err.message);
      } else {
        setError(
          "Login gagal. Pastikan email dan password sesuai dengan peran yang Anda pilih."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Masuk ke MitraKita
            </h1>
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Terhubung dengan ribuan mitra potensial di seluruh Indonesia
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Role Selection */}
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
                    onClick={() => setSelectedRole(role.id)}
                    className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
                      selectedRole === role.id
                        ? "border-green-600 bg-green-50 shadow-lg"
                        : "border-gray-200 hover:border-green-300 hover:shadow-md"
                    }`}
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
                      {selectedRole === role.id && (
                        <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Masukkan Kredensial
              </h2>

              {!selectedRole && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
                  <p
                    className="text-yellow-800 text-sm"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    ⚠️ Silakan pilih peran Anda terlebih dahulu
                  </p>
                </div>
              )}
              {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-xl text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                {/* Email Input */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    disabled={!selectedRole}
                    className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                      !selectedRole
                        ? "bg-gray-100 cursor-not-allowed"
                        : "border-gray-300"
                    }`}
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password"
                      disabled={!selectedRole}
                      className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                        !selectedRole
                          ? "bg-gray-100 cursor-not-allowed"
                          : "border-gray-300"
                      }`}
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={!selectedRole}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? "👁️" : "👁️‍🗨️"}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      disabled={!selectedRole}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span
                      className="ml-2 text-sm text-gray-600"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Ingat saya
                    </span>
                  </label>
                  <button
                    type="button"
                    className="text-sm text-green-600 hover:text-green-700 font-semibold"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Lupa Password?
                  </button>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={!selectedRole || isLoading}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                    !selectedRole || isLoading
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-600 to-green-500 text-white hover:shadow-xl hover:scale-105"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {isLoading ? "Masuk..." : "Masuk"}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span
                      className="px-4 bg-white text-gray-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      atau
                    </span>
                  </div>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Belum punya akun?{" "}
                    <Link
                      to="/register"
                      className="text-green-600 hover:text-green-700 font-bold"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Daftar Sekarang
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-12 text-center">
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Dengan masuk, Anda menyetujui{" "}
              <a href="#" className="text-green-600 hover:underline">
                Syarat & Ketentuan
              </a>{" "}
              dan{" "}
              <a href="#" className="text-green-600 hover:underline">
                Kebijakan Privasi
              </a>{" "}
              MitraKita
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;
