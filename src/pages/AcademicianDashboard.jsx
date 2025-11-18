import React from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { supabase } from "../supabaseClient";

// ============================================
// ACADEMICIAN DASHBOARD COMPONENT
// ============================================
const AcademicianDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showResearchModal, setShowResearchModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const { logout, user } = useAuth();
  const navigate = useNavigate();

  // Profile Data State
  const [profileData, setProfileData] = useState({
    fullName: "Budi Santoso",
    prefixTitle: "Dr.",
    suffixTitle: "M.T.",
    institution: "Institut Teknologi Bandung",
    department: "Teknik Mesin",
    nidn: "0012345678",
    researchField: "Material Science & Manufacturing",
    photo: "👨‍🔬",
    bio: "Peneliti di bidang teknologi manufaktur dengan fokus pada optimalisasi proses produksi dan material engineering.",
    googleScholar: "https://scholar.google.com/citations?user=example",
    researchGate: "https://www.researchgate.net/profile/example",
    researchHistory: [
      {
        year: 2024,
        title:
          "Optimalisasi Proses Finishing Furniture Menggunakan Teknologi UV Coating",
        status: "Selesai",
      },
      {
        year: 2023,
        title: "Pengembangan Material Komposit untuk Industri Otomotif",
        status: "Selesai",
      },
      {
        year: 2023,
        title: "Smart Manufacturing untuk IKM Indonesia",
        status: "Berlangsung",
      },
    ],
  });

  // Load profile from Firestore when user is available
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          // Normalize photo field: prefer photoUrl from Firestore
          const merged = { ...data };
          // Prefer photoUrl (supabase upload) over legacy `photo` field so uploaded images are shown
          if (data.photoUrl) {
            merged.photo = data.photoUrl;
          } else if (data.photo) {
            merged.photo = data.photo;
          }
          // Merge fetched data into local state, keep defaults for missing fields
          setProfileData((prev) => ({ ...prev, ...merged }));
          // If researches exist in Firestore, load them into state
          if (Array.isArray(data.researches)) {
            setResearches(data.researches);
          }
        }
      } catch (err) {
        console.error("Error loading academician profile:", err);
      }
    };

    loadProfile();
  }, [user]);

  // Save profile data to Firestore
  const saveProfileToFirestore = async () => {
    if (!user) {
      alert("User tidak ditemukan. Silakan login kembali.");
      return;
    }
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      // Save/merge profileData into user document
      await setDoc(
        userDocRef,
        { ...profileData, role: "academician", uid: user.uid },
        { merge: true }
      );
      alert("Profil berhasil diperbaharui.");
    } catch (err) {
      console.error("Error saving academician profile:", err);
      alert("Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.");
    }
  };

  // Research Data State
  const [researches, setResearches] = useState([
    {
      id: 1,
      title:
        "Optimalisasi Proses Finishing Furniture Menggunakan Teknologi UV Coating",
      status: "completed",
      field: "Furniture & Kerajinan",
      year: 2024,
      abstract:
        "Penelitian tentang penggunaan teknologi UV coating untuk meningkatkan efisiensi proses finishing furniture.",
      keywords: ["UV Coating", "Furniture", "Finishing"],
      futureplan: "Implementasi di 10 IKM furniture di Jepara",
      collaboration: "",
      verified: true,
    },
    {
      id: 2,
      title: "Smart Manufacturing untuk IKM Indonesia",
      status: "ongoing",
      field: "Logam & Metalurgi",
      year: 2023,
      abstract:
        "Pengembangan sistem IoT untuk monitoring produksi real-time di IKM logam.",
      keywords: ["IoT", "Smart Factory", "Manufacturing"],
      futureplan: "",
      collaboration:
        "Membutuhkan IKM logam untuk pilot project implementasi sistem",
      verified: false,
    },
  ]);

  // IKM Partnership Requests
  const [partnershipRequests, setPartnershipRequests] = useState([
    {
      id: 1,
      ikmName: "CV Furniture Jaya Abadi",
      researchTitle: "Optimalisasi Proses Finishing Furniture",
      requestDate: "2024-11-01",
      status: "pending",
      description:
        "Kami tertarik untuk mengimplementasikan teknologi UV coating di produksi kami",
    },
    {
      id: 2,
      ikmName: "PT Logam Presisi Indo",
      researchTitle: "Smart Manufacturing",
      requestDate: "2024-11-05",
      status: "pending",
      description: "Ingin menjadi pilot project untuk sistem IoT monitoring",
    },
  ]);

  // Verified Partnerships
  const [verifiedPartnerships, setVerifiedPartnerships] = useState([
    {
      id: 1,
      ikmName: "UD Meubel Berkah",
      researchTitle: "Optimalisasi UV Coating",
      startDate: "2023-06-01",
      endDate: "2024-03-01",
      status: "completed",
      outcome: "Berhasil meningkatkan efisiensi produksi 40%",
    },
  ]);

  const sidebarItems = [
    { id: "overview", label: "Beranda", icon: <Home className="w-5 h-5" /> },
    {
      id: "profile",
      label: "Profil Akademisi",
      icon: <GraduationCap className="w-5 h-5" />,
    },
    {
      id: "research",
      label: "Penelitian Saya",
      icon: <FileText className="w-5 h-5" />,
    },
    {
      id: "partnerships",
      label: "Kemitraan IKM",
      icon: <Users className="w-5 h-5" />,
    },
    // {
    //   id: "messages",
    //   label: "Pesan",
    //   icon: <MessageCircle className="w-5 h-5" />,
    // },
  ];

  const handleProfileUpdate = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  // Research modal & form state for add/edit
  const [editingResearchId, setEditingResearchId] = useState(null);
  const [researchForm, setResearchForm] = useState({
    title: "",
    status: "completed",
    field: "",
    year: new Date().getFullYear(),
    abstract: "",
    keywords: "",
    futureplan: "",
    collaboration: "",
    pdfUrl: null,
  });
  const [researchPdfFile, setResearchPdfFile] = useState(null);
  const [uploadingResearchFile, setUploadingResearchFile] = useState(false);

  // persist researches array to Firestore
  const saveResearchesToFirestore = async (updatedResearches) => {
    if (!user) return;
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { researches: updatedResearches },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving researches:", err);
    }
  };

  const openNewResearchModal = () => {
    setEditingResearchId(null);
    setResearchForm({
      title: "",
      status: "completed",
      field: "",
      year: new Date().getFullYear(),
      abstract: "",
      keywords: "",
      futureplan: "",
      collaboration: "",
      pdfUrl: null,
    });
    setResearchPdfFile(null);
    setShowResearchModal(true);
  };

  const openEditResearchModal = (research) => {
    setEditingResearchId(research.id);
    setResearchForm({
      title: research.title || "",
      status: research.status || "completed",
      field: research.field || "",
      year: research.year || new Date().getFullYear(),
      abstract: research.abstract || "",
      keywords: (research.keywords || []).join(", "),
      futureplan: research.futureplan || "",
      collaboration: research.collaboration || "",
      pdfUrl: research.pdfUrl || research.pdf || null,
    });
    setResearchPdfFile(null);
    setShowResearchModal(true);
  };

  const handleDeleteResearch = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus penelitian ini?"))
      return;
    const updated = researches.filter((r) => r.id !== id);
    setResearches(updated);
    await saveResearchesToFirestore(updated);
  };

  const handleDownloadResearch = async (research) => {
    const url = research.pdfUrl || research.pdf || null;
    if (!url) {
      alert("Tidak ada dokumen abstrak untuk diunduh.");
      return;
    }
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error("Gagal mengunduh file");
      const blob = await res.blob();
      const safeTitle = (research.title || "abstract")
        .replace(/[^a-z0-9.\-_]/gi, "_")
        .slice(0, 120);
      const filename = safeTitle.endsWith(".pdf")
        ? safeTitle
        : `${safeTitle}.pdf`;
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error("Error downloading research PDF:", err);
      // Fallback: open in new tab
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const submitResearchForm = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }

    const timestamp = Date.now();
    let pdfUrl = researchForm.pdfUrl || null;

    if (researchPdfFile) {
      setUploadingResearchFile(true);
      try {
        const fileName = `abstracts/${user.uid}_${timestamp}_${researchPdfFile.name}`;
        const { error } = await supabase.storage
          .from("academician-research")
          .upload(fileName, researchPdfFile);
        if (error) {
          console.error("Upload error:", error);
          alert("Gagal mengupload file PDF. Coba lagi.");
          setUploadingResearchFile(false);
          return;
        }
        const { data: publicUrlData } = supabase.storage
          .from("academician-research")
          .getPublicUrl(fileName);
        pdfUrl = publicUrlData?.publicUrl;
      } catch (err) {
        console.error("Error uploading research PDF:", err);
        alert("Terjadi kesalahan saat mengupload PDF");
        setUploadingResearchFile(false);
        return;
      } finally {
        setUploadingResearchFile(false);
      }
    }

    const keywordsArr = researchForm.keywords
      ? researchForm.keywords.split(",").map((k) => k.trim())
      : [];

    if (editingResearchId) {
      const updated = researches.map((r) =>
        r.id === editingResearchId
          ? {
              ...r,
              title: researchForm.title,
              status: researchForm.status,
              field: researchForm.field,
              year: parseInt(researchForm.year),
              abstract: researchForm.abstract,
              keywords: keywordsArr,
              futureplan: researchForm.futureplan,
              collaboration: researchForm.collaboration,
              pdfUrl: pdfUrl || r.pdfUrl || r.pdf,
            }
          : r
      );
      setResearches(updated);
      await saveResearchesToFirestore(updated);
    } else {
      const newResearch = {
        id:
          researches.length > 0
            ? Math.max(...researches.map((r) => r.id)) + 1
            : 1,
        title: researchForm.title,
        status: researchForm.status,
        field: researchForm.field,
        year: parseInt(researchForm.year),
        abstract: researchForm.abstract,
        keywords: keywordsArr,
        futureplan: researchForm.futureplan,
        collaboration: researchForm.collaboration,
        pdfUrl: pdfUrl,
        verified: false,
      };
      const updated = [newResearch, ...researches];
      setResearches(updated);
      await saveResearchesToFirestore(updated);
    }

    setShowResearchModal(false);
    setEditingResearchId(null);
    setResearchPdfFile(null);
    setResearchForm({
      title: "",
      status: "completed",
      field: "",
      year: new Date().getFullYear(),
      abstract: "",
      keywords: "",
      futureplan: "",
      collaboration: "",
      pdfUrl: null,
    });
  };

  const handleVerifyPartnership = (id, action) => {
    const request = partnershipRequests.find((r) => r.id === id);
    if (action === "approve") {
      setVerifiedPartnerships([
        ...verifiedPartnerships,
        {
          id: verifiedPartnerships.length + 1,
          ikmName: request.ikmName,
          researchTitle: request.researchTitle,
          startDate: new Date().toISOString().split("T")[0],
          endDate: "",
          status: "active",
          outcome: "",
        },
      ]);
    }
    setPartnershipRequests(partnershipRequests.filter((r) => r.id !== id));
  };

  return (
    <div>
      <Navbar userRole="academician" />
      <div className="flex min-h-screen bg-green-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <img
                src={profileData.photo}
                alt="Profil"
                className="w-12 h-12 object-cover rounded-xl"
              />
              <div>
                <h2
                  className="text-lg font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dashboard Akademisi
                </h2>
              </div>
            </div>
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {profileData.frontDegree} {profileData.academicianName}{" "}
              {profileData.backDegree}
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
                Selamat Datang, {profileData.frontDegree}{" "}
                {profileData.academicianName} {profileData.backDegree}! 👋
              </h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <FileText className="w-8 h-8 text-blue-600" />
                    <span className="text-blue-600 text-sm font-semibold">
                      Total
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {researches.length}
                  </h3>
                  <p className="text-gray-600 text-sm">Penelitian</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-green-600" />
                    <span className="text-green-600 text-sm font-semibold">
                      Aktif
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {
                      verifiedPartnerships.filter((p) => p.status === "active")
                        .length
                    }
                  </h3>
                  <p className="text-gray-600 text-sm">Kemitraan IKM</p>
                </div>
                {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <MessageCircle className="w-8 h-8 text-yellow-600" />
                    <span className="text-yellow-600 text-sm font-semibold">
                      {partnershipRequests.length} Baru
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">5</h3>
                  <p className="text-gray-600 text-sm">Pesan</p>
                </div> */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    <span className="text-purple-600 text-sm font-semibold">
                      +15%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">342</h3>
                  <p className="text-gray-600 text-sm">Total Views</p>
                </div>
              </div>

              {/* Pending Partnership Requests */}
              {/* {partnershipRequests.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Permintaan Kemitraan Baru ({partnershipRequests.length})
                  </h2>
                  <div className="space-y-4">
                    {partnershipRequests.slice(0, 3).map((request) => (
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
                              Penelitian: {request.researchTitle}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {request.requestDate}
                          </span>
                        </div>
                        <p
                          className="text-sm text-gray-700 mb-4"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {request.description}
                        </p>
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
              )} */}

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
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <GraduationCap className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lengkapi Profil
                    </h3>
                    <p className="text-sm text-blue-50">
                      Update informasi akademis Anda
                    </p>
                  </button>
                  <button
                    onClick={() => setShowResearchModal(true)}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <FileText className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Upload Penelitian
                    </h3>
                    <p className="text-sm text-green-50">
                      Publikasikan hasil riset Anda
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
                      Review permintaan dari IKM
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
                  Profil Akademisi
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
                {/* Photo and Basic Info */}
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
                        Foto Profil
                      </label>
                      {editingProfile ? (
                        <div className="flex items-center space-x-4">
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-5xl overflow-hidden">
                            {profileData.photo &&
                            typeof profileData.photo === "string" &&
                            profileData.photo.startsWith("http") ? (
                              <img
                                src={profileData.photo}
                                alt="Profil"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-5xl">
                                {profileData.photo}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col space-y-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setPhotoFile(file);
                                  const reader = new FileReader();
                                  reader.onloadend = () =>
                                    setPhotoPreview(reader.result);
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                            {photoPreview && (
                              <div className="w-24 h-24 rounded-xl overflow-hidden">
                                <img
                                  src={photoPreview}
                                  alt="Preview"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <button
                                onClick={async () => {
                                  if (!photoFile || !user) {
                                    alert(
                                      "Pilih file terlebih dahulu atau login."
                                    );
                                    return;
                                  }
                                  setUploadingPhoto(true);
                                  try {
                                    const timestamp = Date.now();
                                    const fileName = `${user.uid}_${timestamp}_${photoFile.name}`;
                                    const { error } = await supabase.storage
                                      .from("academician-profile-photos")
                                      .upload(fileName, photoFile);
                                    if (error) {
                                      console.error("Upload error:", error);
                                      alert(
                                        "Gagal mengupload foto. Coba lagi."
                                      );
                                      return;
                                    }

                                    const { data: publicUrlData } =
                                      supabase.storage
                                        .from("academician-profile-photos")
                                        .getPublicUrl(fileName);

                                    const publicUrl = publicUrlData?.publicUrl;

                                    // Save to Firestore
                                    const db = getFirestore();
                                    const userDocRef = doc(
                                      db,
                                      "users",
                                      user.uid
                                    );
                                    await setDoc(
                                      userDocRef,
                                      { photoUrl: publicUrl },
                                      { merge: true }
                                    );

                                    // Update local state
                                    setProfileData((prev) => ({
                                      ...prev,
                                      photo: publicUrl,
                                    }));
                                    setPhotoFile(null);
                                    setPhotoPreview(null);
                                    alert("Foto profil berhasil diupload");
                                  } catch (err) {
                                    console.error(
                                      "Error uploading academician photo:",
                                      err
                                    );
                                    alert(
                                      "Terjadi kesalahan saat mengupload foto"
                                    );
                                  } finally {
                                    setUploadingPhoto(false);
                                  }
                                }}
                                disabled={uploadingPhoto || !photoFile}
                                className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                              >
                                {uploadingPhoto
                                  ? "Mengunggah..."
                                  : "Unggah Foto"}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-5xl overflow-hidden">
                          {profileData.photo &&
                          typeof profileData.photo === "string" &&
                          profileData.photo.startsWith("http") ? (
                            <img
                              src={profileData.photo}
                              alt="Profil"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-5xl">{profileData.photo}</div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label
                            className="block text-sm font-semibold text-gray-700 mb-2"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Gelar Depan
                          </label>
                          <input
                            type="text"
                            value={profileData.frontDegree}
                            onChange={(e) =>
                              handleProfileUpdate("frontDegree", e.target.value)
                            }
                            disabled={!editingProfile}
                            placeholder="Dr."
                            className={`w-full px-4 py-3 rounded-xl border-2 ${
                              editingProfile
                                ? "border-gray-300 focus:border-blue-500"
                                : "border-gray-200 bg-gray-50"
                            } focus:outline-none`}
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          />
                        </div>
                        <div className="col-span-2">
                          <label
                            className="block text-sm font-semibold text-gray-700 mb-2"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Nama Lengkap
                          </label>
                          <input
                            type="text"
                            value={profileData.academicianName}
                            onChange={(e) =>
                              handleProfileUpdate(
                                "academicianName",
                                e.target.value
                              )
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
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Gelar Belakang
                        </label>
                        <input
                          type="text"
                          value={profileData.backDegree}
                          onChange={(e) =>
                            handleProfileUpdate("backDegree", e.target.value)
                          }
                          disabled={!editingProfile}
                          placeholder="M.T., Ph.D."
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

                {/* Academic Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Informasi Akademis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Nama Institusi
                      </label>
                      <input
                        type="text"
                        value={profileData.institution}
                        onChange={(e) =>
                          handleProfileUpdate("institution", e.target.value)
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
                        Departemen
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
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        NIDN
                      </label>
                      <input
                        type="text"
                        value={profileData.nidn}
                        onChange={(e) =>
                          handleProfileUpdate("nidn", e.target.value)
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
                        Bidang Riset
                      </label>
                      <input
                        type="text"
                        value={profileData.researchField}
                        onChange={(e) =>
                          handleProfileUpdate("researchField", e.target.value)
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
                  <div className="mt-6">
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Bio / Deskripsi Singkat
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
                          ? "border-gray-300 focus:border-blue-500"
                          : "border-gray-200 bg-gray-50"
                      } focus:outline-none`}
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    />
                  </div>
                </div>

                {/* Academic Profiles */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Link Profil Akademis
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Google Scholar
                      </label>
                      <input
                        type="url"
                        value={profileData.googleScholar}
                        onChange={(e) =>
                          handleProfileUpdate("googleScholar", e.target.value)
                        }
                        disabled={!editingProfile}
                        placeholder="https://scholar.google.com/citations?user=..."
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
                        ResearchGate
                      </label>
                      <input
                        type="url"
                        value={profileData.researchGate}
                        onChange={(e) =>
                          handleProfileUpdate("researchGate", e.target.value)
                        }
                        disabled={!editingProfile}
                        placeholder="https://www.researchgate.net/profile/..."
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

                {/* Research History */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Histori Penelitian
                  </h2>
                  <div className="space-y-3">
                    {(researches && researches.length > 0
                      ? researches
                      : profileData.researchHistory
                    ).map((research, idx) => {
                      const displayStatus =
                        research.status === "completed"
                          ? "Selesai"
                          : research.status === "ongoing"
                          ? "Berlangsung"
                          : research.status || "-";
                      const statusColor =
                        displayStatus === "Selesai"
                          ? "text-green-600"
                          : "text-yellow-600";
                      return (
                        <div
                          key={idx}
                          className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 transition"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3
                                className="font-bold text-gray-800"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                {research.title}
                              </h3>
                              <p
                                className="text-sm text-gray-600 mt-1"
                                style={{ fontFamily: "Open Sans, sans-serif" }}
                              >
                                Status:{" "}
                                <span
                                  className={`font-semibold ${statusColor}`}
                                >
                                  {displayStatus}
                                </span>
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-blue-600">
                              {research.year}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
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
                      onClick={async () => {
                        await saveProfileToFirestore();
                        setEditingProfile(false);
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

          {/* Research Tab */}
          {activeTab === "research" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Penelitian Saya
                </h1>
                <button
                  onClick={openNewResearchModal}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Upload Penelitian</span>
                </button>
              </div>

              {researches.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-10 h-10 text-gray-400" />
                  </div>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Belum ada Penelitian. Klik{" "}
                    <span className="font-semibold">"Upload Penelitian"</span>{" "}
                    untuk menambah.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {researches.map((research) => (
                    <div
                      key={research.id}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            research.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {research.status === "completed"
                            ? "Selesai"
                            : "Berlangsung"}
                        </span>
                        {research.verified && (
                          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Terverifikasi
                          </span>
                        )}
                      </div>

                      <h3
                        className="text-lg font-bold text-gray-800 mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {research.title}
                      </h3>

                      <div className="text-sm text-gray-600 mb-3 space-y-1">
                        <p>
                          <strong>Bidang:</strong> {research.field}
                        </p>
                        <p>
                          <strong>Tahun:</strong> {research.year}
                        </p>
                      </div>

                      <p
                        className="text-sm text-gray-600 mb-3 line-clamp-2"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        {research.abstract}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {research.keywords.map((keyword, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>

                      {research.status === "completed" &&
                        research.futureplan && (
                          <div className="bg-blue-50 rounded-xl p-3 mb-3">
                            <p className="text-xs font-semibold text-blue-700 mb-1">
                              Rencana ke Depan:
                            </p>
                            <p className="text-xs text-blue-600">
                              {research.futureplan}
                            </p>
                          </div>
                        )}

                      {research.status === "ongoing" &&
                        research.collaboration && (
                          <div className="bg-yellow-50 rounded-xl p-3 mb-3">
                            <p className="text-xs font-semibold text-yellow-700 mb-1">
                              Kolaborasi Diharapkan:
                            </p>
                            <p className="text-xs text-yellow-600">
                              {research.collaboration}
                            </p>
                          </div>
                        )}

                      <div className="flex space-x-2">
                        <button
                          onClick={() => openEditResearchModal(research)}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteResearch(research.id)}
                          className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                        >
                          Hapus
                        </button>
                        <button
                          onClick={() => handleDownloadResearch(research)}
                          disabled={!(research.pdfUrl || research.pdf)}
                          className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold text-white transition ${
                            {
                              true: "bg-green-600 hover:bg-green-700",
                            }[String(!!(research.pdfUrl || research.pdf))] ||
                            "bg-gray-300 cursor-not-allowed"
                          }`}
                        >
                          Unduh Dokumen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Partnerships Tab */}
          {activeTab === "partnerships" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Kemitraan dengan IKM
              </h1>

              {/* Pending Requests */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Permintaan Kemitraan ({partnershipRequests.length})
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
                              <strong>Penelitian:</strong>{" "}
                              {request.researchTitle}
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
                            Pesan dari IKM:
                          </p>
                          <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {request.description}
                          </p>
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
                      Belum ada permintaan kemitraan baru
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
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                  <p
                    className="text-blue-50 mb-4"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Sudah memiliki kemitraan dengan IKM yang belum terdaftar?
                    Tambahkan secara manual untuk dokumentasi.
                  </p>
                  <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition">
                    + Tambah Kemitraan Manual
                  </button>
                </div>
              </div>

              {/* Verified Partnerships */}
              <div>
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kemitraan Terverifikasi ({verifiedPartnerships.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {verifiedPartnerships.map((partnership) => (
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
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            partnership.status === "active"
                              ? "bg-green-100 text-green-700"
                              : partnership.status === "completed"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {partnership.status === "active"
                            ? "Aktif"
                            : partnership.status === "completed"
                            ? "Selesai"
                            : "Tertunda"}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        <strong>Penelitian:</strong> {partnership.researchTitle}
                      </p>

                      <div className="text-xs text-gray-500 mb-3 space-y-1">
                        <p>
                          Mulai:{" "}
                          {new Date(partnership.startDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </p>
                        {partnership.endDate && (
                          <p>
                            Selesai:{" "}
                            {new Date(partnership.endDate).toLocaleDateString(
                              "id-ID"
                            )}
                          </p>
                        )}
                      </div>

                      {partnership.outcome && (
                        <div className="bg-green-50 rounded-xl p-3 mb-3">
                          <p className="text-xs font-semibold text-green-700 mb-1">
                            Hasil:
                          </p>
                          <p className="text-xs text-green-600">
                            {partnership.outcome}
                          </p>
                        </div>
                      )}

                      <button className="w-full bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                        Lihat Detail
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Add Research Modal */}
        {showResearchModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResearchModal(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <h2
                    className="text-2xl font-bold"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Upload Penelitian Baru
                  </h2>
                  <button
                    onClick={() => setShowResearchModal(false)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form className="p-6 space-y-6" onSubmit={submitResearchForm}>
                {/* Title */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Judul Penelitian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={researchForm.title}
                    onChange={(e) =>
                      setResearchForm({
                        ...researchForm,
                        title: e.target.value,
                      })
                    }
                    placeholder="Masukkan judul penelitian lengkap"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Status */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Status Penelitian <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setResearchForm({
                          ...researchForm,
                          status: "completed",
                        })
                      }
                      className={`p-4 rounded-xl border-2 transition ${
                        researchForm.status === "completed"
                          ? "border-green-500 bg-green-50"
                          : "border-gray-300 hover:border-green-300"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <CheckCircle
                          className={`w-8 h-8 ${
                            researchForm.status === "completed"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p
                        className="font-semibold text-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Selesai
                      </p>
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setResearchForm({ ...researchForm, status: "ongoing" })
                      }
                      className={`p-4 rounded-xl border-2 transition ${
                        researchForm.status === "ongoing"
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-300 hover:border-yellow-300"
                      }`}
                    >
                      <div className="flex items-center justify-center mb-2">
                        <TrendingUp
                          className={`w-8 h-8 ${
                            researchForm.status === "ongoing"
                              ? "text-yellow-600"
                              : "text-gray-400"
                          }`}
                        />
                      </div>
                      <p
                        className="font-semibold text-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Sedang Berlangsung
                      </p>
                    </button>
                  </div>
                </div>

                {/* Conditional Field based on Status */}
                {researchForm.status === "completed" && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <label
                      className="block text-sm font-semibold text-green-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Rencana ke Depan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="futureplan"
                      value={researchForm.futureplan}
                      onChange={(e) =>
                        setResearchForm({
                          ...researchForm,
                          futureplan: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Jelaskan rencana implementasi atau pengembangan lebih lanjut..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                )}

                {researchForm.status === "ongoing" && (
                  <div className="bg-yellow-50 rounded-xl p-4">
                    <label
                      className="block text-sm font-semibold text-yellow-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Kolaborasi yang Diharapkan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="collaboration"
                      value={researchForm.collaboration}
                      onChange={(e) =>
                        setResearchForm({
                          ...researchForm,
                          collaboration: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Jelaskan jenis IKM atau kolaborasi yang Anda butuhkan..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                )}

                {/* Field and Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Bidang / Area Penelitian{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="field"
                      value={researchForm.field}
                      onChange={(e) =>
                        setResearchForm({
                          ...researchForm,
                          field: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tahun Penelitian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={researchForm.year}
                      onChange={(e) =>
                        setResearchForm({
                          ...researchForm,
                          year: e.target.value,
                        })
                      }
                      min="2000"
                      max="2025"
                      placeholder="2024"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                </div>

                {/* Abstract */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Abstrak / Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="abstract"
                    value={researchForm.abstract}
                    onChange={(e) =>
                      setResearchForm({
                        ...researchForm,
                        abstract: e.target.value,
                      })
                    }
                    rows={5}
                    placeholder="Jelaskan ringkasan penelitian Anda (maksimal 500 kata)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Keywords */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Kata Kunci (Keywords){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="keywords"
                    value={researchForm.keywords}
                    onChange={(e) =>
                      setResearchForm({
                        ...researchForm,
                        keywords: e.target.value,
                      })
                    }
                    placeholder="Pisahkan dengan koma (contoh: IoT, Monitoring, Kualitas, Logam)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Upload PDF */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Upload Dokumen Abstrak (.pdf){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <label className="relative block border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-green-500 transition cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p
                      className="text-gray-600 mb-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Pilih file PDF abstrak (maks 10MB)
                    </p>

                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) =>
                        setResearchPdfFile(e.target.files?.[0] || null)
                      }
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <p className="text-xs text-gray-500 mt-2">
                      {researchPdfFile
                        ? researchPdfFile.name
                        : researchForm.pdfUrl
                        ? "File terunggah"
                        : "Belum ada file"}
                    </p>
                  </label>
                </div>

                {/* Info Box */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <p
                    className="text-blue-800 text-sm"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    ℹ️ Penelitian Anda akan melalui proses verifikasi oleh admin
                    sebelum dipublikasikan di platform. Proses verifikasi
                    membutuhkan waktu 3-5 hari kerja.
                  </p>
                </div>

                {/* Submit Buttons */}
                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowResearchModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingResearchFile}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {uploadingResearchFile
                      ? "Mengunggah..."
                      : "Kirim untuk Verifikasi"}
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

export default AcademicianDashboard;
