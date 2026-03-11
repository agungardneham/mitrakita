import React, { useState } from "react";
import { X } from "lucide-react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPasswordModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setMessageType("");

    if (!email) {
      setMessage("Silakan masukkan email Anda.");
      setMessageType("error");
      return;
    }

    try {
      setIsLoading(true);
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setMessage(
        "Email reset password telah dikirim. Silakan periksa inbox Anda.",
      );
      setMessageType("success");
      setEmail("");

      // Auto-close modal after 3 seconds on success
      setTimeout(() => {
        onClose();
        setMessage("");
        setMessageType("");
      }, 3000);
    } catch (error) {
      console.error("Error sending reset email:", error);
      if (error.code === "auth/user-not-found") {
        setMessage("Email tidak ditemukan dalam sistem kami.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Format email tidak valid.");
      } else if (error.code === "auth/too-many-requests") {
        setMessage(
          "Terlalu banyak percobaan. Silakan coba beberapa saat lagi.",
        );
      } else {
        setMessage("Gagal mengirim email. Silakan coba lagi nanti.");
      }
      setMessageType("error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Lupa Password?
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Description */}
        <p
          className="text-gray-600 text-sm mb-6"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          Masukkan email Anda dan kami akan mengirimkan link untuk mereset
          password Anda.
        </p>

        {/* Messages */}
        {message && (
          <div
            className={`mb-6 p-4 rounded-xl text-sm ${
              messageType === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
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
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
              style={{ fontFamily: "Open Sans, sans-serif" }}
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:border-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-3 rounded-xl bg-linear-to-r from-green-600 to-green-500 text-white font-semibold hover:shadow-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              {isLoading ? "Mengirim..." : "Kirim"}
            </button>
          </div>
        </form>

        {/* Info */}
        <p
          className="text-gray-500 text-xs text-center mt-6"
          style={{ fontFamily: "Open Sans, sans-serif" }}
        >
          Jika Anda tidak menerima email dalam beberapa menit, silakan periksa
          folder spam.
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
