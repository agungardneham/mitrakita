import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  confirmPasswordReset,
  verifyPasswordResetCode,
} from "firebase/auth";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const oobCode = searchParams.get("oobCode");

  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [validCode, setValidCode] = useState(false);
  const [codeError, setCodeError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Verify password reset code
  useEffect(() => {
    const verifyCode = async () => {
      if (!oobCode) {
        setCodeError("Link tidak valid atau sudah kedaluwarsa.");
        setLoading(false);
        return;
      }

      try {
        const auth = getAuth();
        const userEmail = await verifyPasswordResetCode(auth, oobCode);
        setEmail(userEmail);
        setValidCode(true);
        setLoading(false);
      } catch (error) {
        console.error("Error verifying code:", error);
        if (error.code === "auth/expired-action-code") {
          setCodeError("Link sudah kadaluarsa. Silakan minta email baru.");
        } else if (error.code === "auth/invalid-action-code") {
          setCodeError("Link tidak valid. Silakan minta email baru.");
        } else {
          setCodeError("Link tidak valid atau sudah kedaluwarsa.");
        }
        setLoading(false);
      }
    };

    verifyCode();
  }, [oobCode]);

  // Validate passwords match
  const validatePasswords = () => {
    setPasswordError("");

    if (!newPassword || !confirmPassword) {
      setPasswordError("Silakan isi semua field password.");
      return false;
    }

    if (newPassword.length < 6) {
      setPasswordError("Password harus minimal 6 karakter.");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Password tidak cocok. Silakan coba lagi.");
      return false;
    }

    return true;
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePasswords()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const auth = getAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      setSuccessMessage(
        "Password Anda berhasil direset! Silakan login dengan password baru.",
      );

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error resetting password:", error);
      if (error.code === "auth/weak-password") {
        setPasswordError(
          "Password terlalu lemah. Gunakan kombinasi huruf, angka, dan karakter khusus.",
        );
      } else if (error.code === "auth/expired-action-code") {
        setPasswordError("Link sudah kadaluarsa. Silakan minta email baru.");
      } else {
        setPasswordError("Gagal mereset password. Silakan coba lagi.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-green-50 py-12 px-4 flex items-center justify-center">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-block animate-spin">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-green-600 rounded-full"></div>
              </div>
            </div>
            <p
              className="text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Memverifikasi link Anda...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!validCode) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-green-50 py-12 px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
              <h1
                className="text-2xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Link Tidak Valid
              </h1>
              <p
                className="text-gray-600 mb-6"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                {codeError}
              </p>
              <Link
                to="/login"
                className="inline-block px-6 py-3 bg-linear-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Kembali ke Login
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-linear-to-br from-green-50 via-blue-50 to-green-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Buat Password Baru
            </h1>
            <p
              className="text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Untuk akun {email}
            </p>
          </div>

          {/* Reset Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {successMessage ? (
              <div className="text-center">
                <Check className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h2
                  className="text-xl font-bold text-gray-800 mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Password Berhasil Direset!
                </h2>
                <p
                  className="text-gray-600 mb-6"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {successMessage}
                </p>
                <p
                  className="text-sm text-gray-500"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Anda akan diarahkan ke halaman login dalam beberapa saat...
                </p>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-6">
                {/* Error Message */}
                {passwordError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p
                      className="text-red-700 text-sm"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      ⚠️ {passwordError}
                    </p>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Password Baru
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Masukkan password baru (minimal 6 karakter)"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed pr-10"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isSubmitting}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    >
                      {showPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Konfirmasi Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ulangi password baru Anda"
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed pr-10"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      disabled={isSubmitting}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                    >
                      {showConfirmPassword ? (
                        <Eye className="w-5 h-5" />
                      ) : (
                        <EyeOff className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                    isSubmitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-linear-to-r from-green-600 to-green-500 text-white hover:shadow-xl hover:scale-105"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {isSubmitting ? "Memproses..." : "Perbarui Password"}
                </button>

                {/* Back to Login */}
                <div className="text-center pt-4">
                  <p
                    className="text-gray-600 text-sm"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Kembali ke{" "}
                    <Link
                      to="/login"
                      className="text-green-600 hover:text-green-700 font-bold hover:underline"
                    >
                      halaman login
                    </Link>
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <p
              className="text-blue-800 text-sm"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              💡 Pastikan password baru Anda aman dan unik. Jangan gunakan
              informasi pribadi atau password lama Anda.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPasswordPage;
