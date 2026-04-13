import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import db from "../firebase-config";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft, Edit2, ExternalLink, X } from "lucide-react";
import formConfig from "../formIkm.json";

const AdminSurveyDetailPage = () => {
  const { ikmId } = useParams();
  const navigate = useNavigate();
  const [ikmData, setIkmData] = useState(null);
  const [surveyData, setSurveyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingSurveyData, setEditingSurveyData] = useState({});
  const [savingChanges, setSavingChanges] = useState(false);

  // Fetch IKM survey data
  useEffect(() => {
    const fetchSurveyData = async () => {
      if (!ikmId) {
        navigate("/admin/dashboard?tab=survey");
        return;
      }

      try {
        setLoading(true);
        const userDoc = await getDoc(doc(db, "users", ikmId));
        const userData = userDoc.data();

        if (userData && userData.survey) {
          setIkmData({
            uid: ikmId,
            businessName: userData.businessName || "N/A",
            fullName: userData.fullName || "N/A",
            email: userData.email || "N/A",
            phone: userData.phone || "N/A",
          });
          setSurveyData(userData.survey);
          setEditingSurveyData({ ...userData.survey });
        } else {
          // No survey found, redirect back
          navigate("/admin/dashboard?tab=survey");
        }
      } catch (error) {
        console.error("Error fetching survey data:", error);
        navigate("/admin/dashboard?tab=survey");
      } finally {
        setLoading(false);
      }
    };

    fetchSurveyData();
  }, [ikmId, navigate]);

  // Sort survey data by numbering (01., 02., etc.)
  const getSortedSurveyData = () => {
    if (!surveyData) return [];

    const entries = Object.entries(surveyData);

    return entries.sort((a, b) => {
      const aLabel = a[0];
      const bLabel = b[0];

      // Extract numbering from field names
      const aMatch = aLabel.match(/^(\d+)\./);
      const bMatch = bLabel.match(/^(\d+)\./);

      if (aMatch && bMatch) {
        return parseInt(aMatch[1]) - parseInt(bMatch[1]);
      }

      // If no numbering, keep original order
      return 0;
    });
  };

  // Get field config from formIkm.json
  const getFieldConfig = (fieldName) => {
    return formConfig.fields.find((field) => field.name === fieldName);
  };

  // Check if value is an image URL
  const isImageUrl = (value) => {
    if (typeof value !== "string") return false;
    return (
      value.startsWith("http") && /\.(jpeg|jpg|gif|png|webp)$/i.test(value)
    );
  };

  // Check if value is a file URL (not image)
  const isFileUrl = (value) => {
    if (typeof value !== "string") return false;
    return value.startsWith("http") && !isImageUrl(value);
  };

  // Render survey field value
  const renderSurveyValue = (fieldName, value) => {
    const fieldConfig = getFieldConfig(fieldName);

    if (isImageUrl(value)) {
      return (
        <div className="mt-3 flex flex-col gap-3">
          <div className="relative inline-block">
            <img
              src={value}
              alt={fieldName}
              className="max-w-xs h-auto rounded-lg border border-gray-300 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => setSelectedImage(value)}
            />
            <button
              onClick={() => setSelectedImage(value)}
              className="absolute top-2 right-2 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
              title="Lihat ukuran penuh"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
          {isEditing && (
            <p className="text-xs text-gray-500 italic">
              File image tidak dapat diedit. Hapus URL di field untuk menghapus
              referensi.
            </p>
          )}
        </div>
      );
    }

    if (isFileUrl(value)) {
      return (
        <div className="mt-2">
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-sm"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat File
          </a>
          {isEditing && (
            <p className="text-xs text-gray-500 italic mt-1">
              File tidak dapat diedit. Hapus URL untuk menghapus referensi.
            </p>
          )}
        </div>
      );
    }

    // Render radio field with options
    if (fieldConfig && fieldConfig.type === "radio" && fieldConfig.options) {
      const selectedOption = fieldConfig.options.find(
        (opt) => opt.value === value,
      );

      return (
        <div className="mt-3 space-y-3">
          <div className="text-sm font-medium text-gray-700">
            Pilihan Terpilih:{" "}
            <span className="font-semibold text-blue-600">
              {selectedOption?.label || value || "—"}
            </span>
          </div>
          {!isEditing && (
            <div className="space-y-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <p className="text-xs font-medium text-gray-600 mb-2">
                Pilihan Tersedia:
              </p>
              {fieldConfig.options.map((option) => (
                <div key={option.value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    id={`option-${option.value}`}
                    name={fieldName}
                    value={option.value}
                    checked={value === option.value}
                    disabled
                    className="cursor-not-allowed"
                  />
                  <label
                    htmlFor={`option-${option.value}`}
                    className="text-sm text-gray-700 cursor-not-allowed"
                  >
                    {option.label}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    // Render select field with options
    if (fieldConfig && fieldConfig.type === "select" && fieldConfig.options) {
      const selectedOption = fieldConfig.options.find(
        (opt) => opt.value === value,
      );

      return (
        <div className="mt-2">
          <div className="text-sm font-medium text-gray-700">
            {selectedOption?.label || value || "—"}
          </div>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return value.join(", ");
    }

    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2);
    }

    return value || "—";
  };

  // Render editable form field
  const renderFieldEdit = (fieldName, value) => {
    const fieldConfig = getFieldConfig(fieldName);

    // Read-only fields should not be editable
    if (fieldConfig?.readonly) {
      return renderSurveyValue(fieldName, value);
    }

    // Render radio field with interactive options
    if (fieldConfig && fieldConfig.type === "radio" && fieldConfig.options) {
      return (
        <div className="mt-3 space-y-3">
          <div className="space-y-2">
            {fieldConfig.options.map((option) => (
              <div key={option.value} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={`edit-option-${option.value}`}
                  name={fieldName}
                  value={option.value}
                  checked={editingSurveyData[fieldName] === option.value}
                  onChange={(e) => handleEditField(fieldName, e.target.value)}
                  className="cursor-pointer"
                />
                <label
                  htmlFor={`edit-option-${option.value}`}
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Render select field with dropdown
    if (fieldConfig && fieldConfig.type === "select" && fieldConfig.options) {
      return (
        <select
          value={editingSurveyData[fieldName] || ""}
          onChange={(e) => handleEditField(fieldName, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Pilih --</option>
          {fieldConfig.options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    // Render textarea field
    if (fieldConfig && fieldConfig.type === "textarea") {
      return (
        <textarea
          value={editingSurveyData[fieldName] || ""}
          onChange={(e) => handleEditField(fieldName, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
        />
      );
    }

    // Render file field
    if (fieldConfig && fieldConfig.type === "file") {
      return (
        <div className="space-y-2">
          <input
            type="text"
            value={editingSurveyData[fieldName] || ""}
            onChange={(e) => handleEditField(fieldName, e.target.value)}
            placeholder="Masukkan URL file..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {editingSurveyData[fieldName] &&
            isFileUrl(editingSurveyData[fieldName]) && (
              <a
                href={editingSurveyData[fieldName]}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Lihat File
              </a>
            )}
        </div>
      );
    }

    // Default: render text input
    return (
      <input
        type="text"
        value={editingSurveyData[fieldName] || ""}
        onChange={(e) => handleEditField(fieldName, e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    );
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    setSavingChanges(true);
    try {
      const { updateDoc } = await import("firebase/firestore");

      await updateDoc(doc(db, "users", ikmId), {
        survey: editingSurveyData,
        surveyUpdatedAt: new Date(),
      });

      setSurveyData(editingSurveyData);
      setIsEditing(false);
      alert("Survey berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating survey:", error);
      alert("Gagal memperbarui survey. Silakan coba lagi.");
    } finally {
      setSavingChanges(false);
    }
  };

  // Handle field edit
  const handleEditField = (fieldName, value) => {
    setEditingSurveyData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-semibold">Memuat data survey...</p>
        </div>
      </div>
    );
  }

  if (!ikmData || !surveyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-semibold">
            Data survey tidak ditemukan
          </p>
        </div>
      </div>
    );
  }

  const sortedSurveyData = getSortedSurveyData();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard?tab=survey")}
                className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 hover:bg-gray-100 transition-colors"
                title="Kembali"
              >
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </button>
              <div>
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {ikmData.businessName}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Kontak: {ikmData.fullName} ({ikmData.email})
                </p>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-yellow-500 to-yellow-400 text-white rounded-lg hover:shadow-lg font-semibold transition-all"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <Edit2 className="w-4 h-4" />
                Edit Survey
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {!isEditing ? (
          // View Mode
          <div className="space-y-8">
            {sortedSurveyData.map(([fieldName, value], index) => (
              <div
                key={fieldName}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-lg font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {fieldName}
                  </h3>
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full text-blue-700 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>
                <div className="text-gray-700 break-all">
                  {renderSurveyValue(fieldName, value)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Edit Mode
          <div className="space-y-8">
            {sortedSurveyData.map(([fieldName, value], index) => (
              <div
                key={fieldName}
                className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className="text-lg font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {fieldName}
                  </h3>
                  <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 rounded-full text-yellow-700 font-semibold text-sm">
                    {index + 1}
                  </span>
                </div>

                <div className="text-gray-700">
                  {renderFieldEdit(fieldName, value)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {isEditing && (
          <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200">
            <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditingSurveyData({ ...surveyData });
                }}
                className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-all"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Batal
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={savingChanges}
                className="px-6 py-3 bg-linear-to-r from-green-600 to-green-500 text-white rounded-lg hover:shadow-lg font-semibold flex items-center gap-2 disabled:opacity-50 transition-all"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {savingChanges ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        )}

        {/* Extra padding for edit button bar */}
        {isEditing && <div className="h-20" />}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSurveyDetailPage;
