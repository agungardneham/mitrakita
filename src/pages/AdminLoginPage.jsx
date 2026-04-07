import React, { useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { adminLogin } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Masukkan username dan password.");
      return;
    }

    try {
      setIsLoading(true);
      const isSuccess = adminLogin(username, password);

      if (isSuccess) {
        // Redirect to admin dashboard
        navigate("/admin/dashboard");
      } else {
        setError("Username atau password tidak sesuai.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Terjadi kesalahan saat login. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* <Navbar /> */}
      <div className="flex-1 bg-linear-to-br from-green-50 via-blue-50 to-green-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-linear-to-br from-green-600 to-green-500 rounded-2xl">
                <ShieldAlert className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Admin Login
            </h1>
            <p
              className="text-gray-600 text-lg"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Akses panel administrasi MitraKita
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">
                <div className="flex items-start gap-3">
                  <Lock className="w-5 h-5 mt-0.5 shrink-0" />
                  <div>{error}</div>
                </div>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Username Input */}
              <div>
                <label
                  className="block text-gray-700 font-semibold mb-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                  required
                  disabled={isLoading}
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
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                  isLoading
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-linear-to-r from-green-600 to-green-500 text-white hover:shadow-xl hover:scale-105 active:scale-95"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {isLoading ? "Masuk..." : "Masuk ke Admin"}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p
                className="text-blue-800 text-xs md:text-sm flex items-start gap-2"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                <Lock className="w-4 h-4 mt-0.5 shrink-0" />
                <span>
                  Halaman ini dilindungi. Pastikan Anda menggunakan koneksi
                  aman.
                </span>
              </p>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8">
            <p
              className="text-gray-600 text-sm"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Kembali ke{" "}
              <a
                href="/"
                className="text-green-600 hover:text-green-700 font-semibold"
              >
                halaman utama
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default AdminLoginPage;
