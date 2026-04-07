import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { supabase } from "../supabaseClient";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import formConfig from "../formIkm.json";

const IKMSurvey = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  const [formData, setFormData] = useState({});
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("");
  const [fileUploads, setFileUploads] = useState({});
  const [uploadProgress, setUploadProgress] = useState({});

  // Load existing survey data from Firebase
  useEffect(() => {
    const loadSurveyData = async () => {
      if (!user?.uid) return;
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const userData = userDoc.data();
        if (userData?.survey) {
          setFormData(userData.survey);
        }
        setLoadingData(false);
      } catch (error) {
        console.error("Error loading survey data:", error);
        setLoadingData(false);
      }
    };
    loadSurveyData();
  }, [user, db]);

  // Handle text, textarea, and select input
  const handleInputChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle radio button change
  const handleRadioChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  // Handle checkbox change
  const handleCheckboxChange = (fieldName, value) => {
    const currentValues = formData[fieldName] || [];
    const updatedValues = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value];
    setFormData((prev) => ({
      ...prev,
      [fieldName]: updatedValues,
    }));
  };

  // Handle nested fields (array of fields like marketplace links)
  const handleNestedFieldChange = (parentField, fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      [parentField]: {
        ...prev[parentField],
        [fieldName]: value,
      },
    }));
  };

  // Handle file upload
  const handleFileChange = async (fieldName, file) => {
    if (!file) return;

    setUploadProgress((prev) => ({
      ...prev,
      [fieldName]: 0,
    }));

    try {
      const fileName = `${user.uid}/survey/${fieldName}_${Date.now()}_${file.name}`;
      const { data, error } = await supabase.storage
        .from("survey-files")
        .upload(fileName, file, {
          onUploadProgress: (progress) => {
            const percentComplete = (progress.loaded / progress.total) * 100;
            setUploadProgress((prev) => ({
              ...prev,
              [fieldName]: percentComplete,
            }));
          },
        });

      if (error) throw error;

      const { data: publicUrlData } = supabase.storage
        .from("survey-files")
        .getPublicUrl(fileName);

      setFileUploads((prev) => ({
        ...prev,
        [fieldName]: {
          url: publicUrlData.publicUrl,
          name: file.name,
          path: fileName,
        },
      }));

      setFormData((prev) => ({
        ...prev,
        [fieldName]: publicUrlData.publicUrl,
      }));

      setSubmitStatus("File berhasil diupload!");
      setTimeout(() => setSubmitStatus(""), 3000);
    } catch (error) {
      console.error("File upload error:", error);
      setSubmitStatus("Gagal mengupload file!");
      setTimeout(() => setSubmitStatus(""), 3000);
    }
  };

  // Check if field should be shown based on conditions
  const shouldShowField = (field) => {
    if (!field.conditional) return true;

    const conditionalField = field.conditional.field;
    const conditionalValue = field.conditional.value;
    const fieldValue = formData[conditionalField];

    if (Array.isArray(fieldValue)) {
      return fieldValue.includes(conditionalValue);
    }
    return fieldValue === conditionalValue;
  };

  // Validate form
  const validateForm = () => {
    const errors = [];
    formConfig.fields.forEach((field) => {
      if (field.required && shouldShowField(field)) {
        const value = formData[field.name];
        if (!value || (Array.isArray(value) && value.length === 0)) {
          errors.push(`${field.name} wajib diisi`);
        }
      }
    });
    return errors;
  };

  // Save survey data to Firebase and Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      setSubmitStatus(errors[0]);
      setTimeout(() => setSubmitStatus(""), 5000);
      return;
    }

    setSaving(true);
    try {
      // Save to Firebase
      await setDoc(
        doc(db, "users", user.uid),
        {
          survey: formData,
          surveySubmittedAt: new Date(),
        },
        { merge: true },
      );

      setSubmitStatus(
        "Survey berhasil disimpan! Anda akan dialihkan kembali...",
      );
      setTimeout(() => {
        navigate("/dashboard/ikm");
      }, 2000);
    } catch (error) {
      console.error("Error saving survey:", error);
      setSubmitStatus("Gagal menyimpan survey. Silakan coba lagi.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-700 font-semibold">Memuat data survey...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-green-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/dashboard/ikm")}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Kembali ke Dashboard
            </button>

            <h1
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-2"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Form Survey IKM
            </h1>
            <p
              className="text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Lengkapi informasi detail tentang usaha Anda untuk meningkatkan
              profil bisnis
            </p>
          </div>

          {/* Status Messages */}
          {submitStatus && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-gap-3 ${
                submitStatus.includes("berhasil") ||
                submitStatus.includes("success")
                  ? "bg-green-50 border border-green-200 text-green-700"
                  : "bg-red-50 border border-red-200 text-red-700"
              }`}
            >
              {submitStatus.includes("berhasil") ||
              submitStatus.includes("success") ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <span>{submitStatus}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8 space-y-8"
          >
            {formConfig.fields.map((field, idx) => {
              if (!shouldShowField(field)) return null;

              return (
                <div key={idx} className="space-y-3">
                  {/* Text, Textarea, Select Fields */}
                  {["text", "textarea", "select"].includes(field.type) && (
                    <>
                      <label
                        className="block text-gray-700 font-semibold"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {field.name}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>

                      {field.type === "textarea" ? (
                        <textarea
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
                          placeholder={field.placeholder || ""}
                          rows={4}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required={field.required}
                        />
                      ) : field.type === "select" ? (
                        <select
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required={field.required}
                        >
                          <option value="">
                            {field.placeholder || "Pilih opsi"}
                          </option>
                          {field.options.map((option) => (
                            <option
                              key={
                                typeof option === "string"
                                  ? option
                                  : option.value
                              }
                              value={
                                typeof option === "string"
                                  ? option
                                  : option.value
                              }
                            >
                              {typeof option === "string"
                                ? option
                                : option.label || option.value}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData[field.name] || ""}
                          onChange={(e) =>
                            handleInputChange(field.name, e.target.value)
                          }
                          placeholder={field.placeholder || ""}
                          className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                          required={field.required}
                        />
                      )}
                    </>
                  )}

                  {/* Radio Fields */}
                  {field.type === "radio" && (
                    <>
                      <label
                        className="block text-gray-700 font-semibold"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {field.name}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="space-y-2 mt-3">
                        {field.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={field.name}
                              value={option.value}
                              checked={formData[field.name] === option.value}
                              onChange={(e) =>
                                handleRadioChange(field.name, e.target.value)
                              }
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                              required={field.required}
                            />
                            <span
                              className="ml-3 text-gray-700"
                              style={{ fontFamily: "Open Sans, sans-serif" }}
                            >
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Checkbox Fields */}
                  {field.type === "checkbox" && (
                    <>
                      <label
                        className="block text-gray-700 font-semibold"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {field.name}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="space-y-2 mt-3">
                        {field.options.map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={option.value}
                              checked={(formData[field.name] || []).includes(
                                option.value,
                              )}
                              onChange={(e) =>
                                handleCheckboxChange(field.name, e.target.value)
                              }
                              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <span
                              className="ml-3 text-gray-700"
                              style={{ fontFamily: "Open Sans, sans-serif" }}
                            >
                              {option.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </>
                  )}

                  {/* File Upload Fields */}
                  {field.type === "file" && (
                    <>
                      <label
                        className="block text-gray-700 font-semibold"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {field.name}
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </label>
                      <div className="mt-3">
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              {uploadProgress[field.name] ? (
                                <>
                                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-sm font-semibold text-green-600">
                                      {Math.round(uploadProgress[field.name])}%
                                    </span>
                                  </div>
                                  <p
                                    className="text-sm text-gray-600"
                                    style={{
                                      fontFamily: "Open Sans, sans-serif",
                                    }}
                                  >
                                    Mengupload...
                                  </p>
                                </>
                              ) : fileUploads[field.name] ? (
                                <>
                                  <CheckCircle className="w-8 h-8 text-green-600 mb-2" />
                                  <p
                                    className="text-sm text-green-600 font-semibold"
                                    style={{
                                      fontFamily: "Open Sans, sans-serif",
                                    }}
                                  >
                                    {fileUploads[field.name].name}
                                  </p>
                                  <p
                                    className="text-xs text-gray-500"
                                    style={{
                                      fontFamily: "Open Sans, sans-serif",
                                    }}
                                  >
                                    Klik untuk mengganti file
                                  </p>
                                </>
                              ) : (
                                <>
                                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                  <p
                                    className="text-sm text-gray-600"
                                    style={{
                                      fontFamily: "Open Sans, sans-serif",
                                    }}
                                  >
                                    Klik untuk upload file
                                  </p>
                                  <p
                                    className="text-xs text-gray-500"
                                    style={{
                                      fontFamily: "Open Sans, sans-serif",
                                    }}
                                  >
                                    {field.accept}
                                  </p>
                                </>
                              )}
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              accept={field.accept}
                              onChange={(e) =>
                                handleFileChange(
                                  field.name,
                                  e.target.files?.[0],
                                )
                              }
                              required={field.required}
                            />
                          </label>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Nested Fields (Marketplace Links) */}
                  {field.fields && (
                    <>
                      <label
                        className="block text-gray-700 font-semibold"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {field.name}
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                        {field.fields.map((nestedField) => (
                          <div key={nestedField.name}>
                            <label
                              className="block text-gray-600 text-sm font-medium mb-2"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {nestedField.name}
                            </label>
                            <input
                              type="text"
                              value={
                                formData[field.name]?.[nestedField.name] || ""
                              }
                              onChange={(e) =>
                                handleNestedFieldChange(
                                  field.name,
                                  nestedField.name,
                                  e.target.value,
                                )
                              }
                              placeholder={`Link ${nestedField.name}`}
                              className="w-full px-4 py-2 rounded-lg border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                              style={{ fontFamily: "Open Sans, sans-serif" }}
                            />
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              );
            })}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard/ikm")}
                  className="flex-1 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 px-6 py-3 rounded-xl font-bold text-lg transition-all ${
                    saving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 text-white hover:shadow-lg hover:bg-green-700"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {saving ? "Menyimpan..." : "Simpan Survey"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IKMSurvey;
