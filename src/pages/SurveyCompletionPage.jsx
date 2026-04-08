import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CheckCircle, ArrowLeft, Edit3 } from "lucide-react";

const SurveyCompletionPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const db = getFirestore();
  const [loading, setLoading] = useState(true);
  const [hasSurvey, setHasSurvey] = useState(false);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      if (!user?.uid) {
        navigate("/login");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();

        // Check if user has completed survey
        if (userData?.survey) {
          setHasSurvey(true);
        } else {
          // If no survey found, redirect to survey form
          navigate("/dashboard/survey");
        }
      } catch (error) {
        console.error("Error checking survey status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkSurveyStatus();
  }, [user, db, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">
            Memuat informasi survey...
          </p>
        </div>
      </div>
    );
  }

  if (!hasSurvey) {
    return null;
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center py-8 px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Main Message */}
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Survey Berhasil Terisi
            </h1>

            {/* Description */}
            <p
              className="text-lg text-gray-600 mb-8"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Terima kasih atas partisipasi Anda dalam mengisi form survey IKM.
              Data yang Anda masukkan telah kami terima dan akan digunakan untuk
              keperluan pengolahan data direktori IKM.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/dashboard/ikm")}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <ArrowLeft className="w-5 h-5" />
                Kembali ke Dashboard
              </button>
              <button
                onClick={() => navigate("/dashboard/survey?edit=true")}
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:shadow-lg transition-all"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <Edit3 className="w-5 h-5" />
                Edit Jawaban Anda
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SurveyCompletionPage;
