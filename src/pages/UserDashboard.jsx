import React, { useState, useEffect } from "react";
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
  Heart,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

// ============================================
// USER/INDUSTRY DASHBOARD COMPONENT
// ============================================
const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [editingProfile, setEditingProfile] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showManualPartnershipModal, setShowManualPartnershipModal] =
    useState(false);
  const [manualPartnershipTarget, setManualPartnershipTarget] =
    useState("active");

  // Profile Data State
  const [profileData, setProfileData] = useState({
    fullName: "",
    companyName: "",
    position: "",
    department: "",
    photo: "👨‍💼",
    phoneNumber: "",
    products: "",
    needs: "",
    bio: "",
    city: "",
  });

  // IKM Partnership Requests
  const [partnershipRequests, setPartnershipRequests] = useState([
    {},
    // {
    //   id: 2,
    //   ikmName: "PT Logam Presisi Indo",
    //   product: "Komponen Logam Custom",
    //   requestDate: "2024-11-10",
    //   status: "pending",
    //   description:
    //     "Manufaktur komponen logam presisi dengan teknologi CNC untuk kebutuhan produksi Anda",
    //   deliveryTime: "2-3 minggu",
    // },
  ]);

  // Active Partnerships
  // Default to empty array so new users (no partnerships yet) show 0
  const [activePartnerships, setActivePartnerships] = useState([]);

  // Completed Partnerships
  const [completedPartnerships, setCompletedPartnerships] = useState([
    {
      // id: 1,
      // ikmName: "UD Meubel Berkah",
      // product: "Furniture Ruang Meeting",
      // startDate: "2023-08-01",
      // endDate: "2024-02-28",
      // status: "completed",
      // orderCount: 3,
      // rating: 4.7,
      // review: "Kualitas produk sangat baik dan pengiriman tepat waktu",
    },
  ]);

  // Photo Upload Modal State
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);

  // IKM Favorit State
  const [favoritedIkmList, setFavoritedIkmList] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState(false);
  const [selectedIkmForModal, setSelectedIkmForModal] = useState(null);

  // Handle select file for upload
  const handlePhotoFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    setPhotoFile(file);
  };

  // Upload to Supabase and save URL to Firestore
  const handleUploadProfilePhoto = async () => {
    if (!photoFile) {
      alert("Silakan pilih file foto terlebih dahulu.");
      return;
    }
    if (!user) {
      alert("Silakan login terlebih dahulu.");
      return;
    }
    setUploadingPhoto(true);
    try {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `profile_${user.uid}_${Date.now()}.${fileExt}`;
      const { data, error: uploadError } = await supabase.storage
        .from("user-profile-photos")
        .upload(fileName, photoFile, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicData } = supabase.storage
        .from("user-profile-photos")
        .getPublicUrl(data.path);

      const photoUrl = publicData.publicUrl;

      // Save URL to Firestore under users/{uid}.photo
      const { getFirestore, doc, setDoc } = await import("firebase/firestore");
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { photo: photoUrl }, { merge: true });

      // Update local state
      setProfileData((prev) => ({ ...prev, photo: photoUrl }));
      setShowPhotoModal(false);
      setPhotoFile(null);
      alert("Foto profil berhasil diunggah.");
    } catch (err) {
      console.error("Error uploading profile photo:", err);
      alert("Gagal mengunggah foto. Silakan coba lagi.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const sidebarItems = [
    { id: "overview", label: "Beranda", icon: <Home className="w-5 h-5" /> },
    {
      id: "profile",
      label: "Edit Profil",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: "ikm-directory",
      label: "Cari IKM",
      icon: <Search className="w-5 h-5" />,
    },
    {
      id: "partnerships",
      label: "Kemitraan",
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: "favorites",
      label: "IKM Favorit",
      icon: <Heart className="w-5 h-5" />,
    },
  ];

  const handleProfileUpdate = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  // Partnership history state and edit helpers
  const [partnershipHistory, setPartnershipHistory] = useState([]);
  const [editingHistoryId, setEditingHistoryId] = useState(null);
  const [editingHistoryData, setEditingHistoryData] = useState(null);

  // Add a history entry (used by profile's "Tambah Kemitraan" or manual modal target)
  const handleAddHistoryPartnership = async (partnershipData) => {
    const newEntry = {
      id: Date.now(),
      ...partnershipData,
      status: partnershipData.status || "completed",
    };

    setPartnershipHistory((prev) => [...prev, newEntry]);
    setShowManualPartnershipModal(false);

    if (!user) return;
    try {
      const { getFirestore, doc, updateDoc, arrayUnion } = await import(
        "firebase/firestore"
      );
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      // write to camelCase field only
      await updateDoc(userDocRef, {
        partnershipHistory: arrayUnion(newEntry),
      });
    } catch (err) {
      console.error("Error saving partnership history (primary):", err);
      try {
        const { getFirestore, doc, getDoc, setDoc } = await import(
          "firebase/firestore"
        );
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const snap = await getDoc(userDocRef);
        const existingCamel =
          snap.exists() && Array.isArray(snap.data().partnershipHistory)
            ? snap.data().partnershipHistory
            : [];
        const merged = [...existingCamel, newEntry];
        await setDoc(
          userDocRef,
          { partnershipHistory: merged },
          { merge: true }
        );
      } catch (err2) {
        console.error("Error saving partnership history (fallback):", err2);
      }
    }
  };

  // Edit history
  const handleEditHistoryPartnership = (history) => {
    setEditingHistoryId(history.id);
    setEditingHistoryData(history);
  };

  // Save edited history
  const handleSaveEditedHistory = async () => {
    if (!editingHistoryId || !editingHistoryData) return;

    setPartnershipHistory((prev) =>
      prev.map((h) => (h.id === editingHistoryId ? editingHistoryData : h))
    );

    if (!user) {
      setEditingHistoryId(null);
      setEditingHistoryData(null);
      return;
    }

    try {
      const { getFirestore, doc, getDoc, setDoc } = await import(
        "firebase/firestore"
      );
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists() && Array.isArray(snap.data().partnershipHistory)) {
        const updated = snap
          .data()
          .partnershipHistory.map((h) =>
            h.id === editingHistoryId ? editingHistoryData : h
          );
        await setDoc(
          userDocRef,
          { partnershipHistory: updated },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Error updating partnership history:", err);
    }

    setEditingHistoryId(null);
    setEditingHistoryData(null);
  };

  // Delete a partnership entry from history (and active if present)
  const handleDeleteHistoryPartnership = async (historyId) => {
    setPartnershipHistory((prev) => prev.filter((h) => h.id !== historyId));
    setActivePartnerships((prev) => prev.filter((a) => a.id !== historyId));

    if (!user) return;
    try {
      const { getFirestore, doc, getDoc, setDoc } = await import(
        "firebase/firestore"
      );
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        // Ambil data dari field camelCase (database menggunakan camelCase)
        const historyCamel = Array.isArray(snap.data().partnershipHistory)
          ? snap.data().partnershipHistory
          : [];
        const activeCamel = Array.isArray(snap.data().activePartnerships)
          ? snap.data().activePartnerships
          : [];

        // Filter item yang akan dihapus
        const historyUpdated = historyCamel.filter((h) => h.id !== historyId);
        const activeUpdated = activeCamel.filter((a) => a.id !== historyId);

        // Simpan hanya ke camelCase fields (hindari penulisan snake_case)
        await setDoc(
          userDocRef,
          {
            partnershipHistory: historyUpdated,
            activePartnerships: activeUpdated,
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Error deleting partnership history:", err);
    }
  };

  // Load profile & partnerships from Firestore on mount/user change
  useEffect(() => {
    const loadUserData = async () => {
      if (!user) return;
      try {
        const { getFirestore, doc, getDoc } = await import(
          "firebase/firestore"
        );
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setProfileData((prev) => ({ ...prev, ...data }));
          // load camelCase fields from Firestore (database uses camelCase)
          const loadedActive = Array.isArray(data.activePartnerships)
            ? data.activePartnerships
            : [];
          const loadedHistory = Array.isArray(data.partnershipHistory)
            ? data.partnershipHistory
            : [];

          if (loadedActive.length) setActivePartnerships(loadedActive);
          if (loadedHistory.length) setPartnershipHistory(loadedHistory);
          if (Array.isArray(data.completedPartnerships)) {
            setCompletedPartnerships(data.completedPartnerships);
          }
        }
      } catch (err) {
        console.error("Error loading user data:", err);
      }
    };

    loadUserData();
  }, [user]);

  // Save profile data to Firestore
  const saveProfileToFirestore = async (overrideData) => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk menyimpan profil.");
      return;
    }
    try {
      const { getFirestore, doc, setDoc } = await import("firebase/firestore");
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      // allow passing overrideData (e.g., latest profileData), else use state
      await setDoc(userDocRef, overrideData || profileData, { merge: true });
    } catch (err) {
      console.error("Error saving profile to Firestore:", err);
      throw err;
    }
  };

  const handleVerifyPartnership = (id, action) => {
    const request = partnershipRequests.find((r) => r.id === id);
    if (!request) return;
    if (action === "approve") {
      setActivePartnerships([
        ...activePartnerships,
        {
          id: Date.now(),
          ikmName: request.ikmName,
          product: request.product,
          startDate: new Date().toISOString().split("T")[0],
          status: "active",
          orderCount: 0,
          lastOrder: "-",
          rating: 0,
        },
      ]);
    }
    setPartnershipRequests(partnershipRequests.filter((r) => r.id !== id));
  };

  const handleAddManualPartnership = async (partnershipData) => {
    const newPartnership = {
      id: Date.now(),
      ...partnershipData,
      status: "active",
    };

    setActivePartnerships((prev) => [...prev, newPartnership]);
    // Also add to history for unified management
    setPartnershipHistory((prev) => [...prev, newPartnership]);
    setShowManualPartnershipModal(false);

    if (!user) return;
    try {
      const { getFirestore, doc, updateDoc, arrayUnion } = await import(
        "firebase/firestore"
      );
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      // update camelCase fields only
      await updateDoc(userDocRef, {
        activePartnerships: arrayUnion(newPartnership),
        partnershipHistory: arrayUnion(newPartnership),
      });
    } catch (err) {
      console.error("Error saving partnership to Firestore (primary):", err);
      // fallback: merge and set both keys
      try {
        const { getFirestore, doc, getDoc, setDoc } = await import(
          "firebase/firestore"
        );
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const snap = await getDoc(userDocRef);
        const existingActiveCamel =
          snap.exists() && Array.isArray(snap.data().activePartnerships)
            ? snap.data().activePartnerships
            : [];
        const existingHistoryCamel =
          snap.exists() && Array.isArray(snap.data().partnershipHistory)
            ? snap.data().partnershipHistory
            : [];
        const mergedActive = [...existingActiveCamel, newPartnership];
        const mergedHistory = [...existingHistoryCamel, newPartnership];

        await setDoc(
          userDocRef,
          {
            activePartnerships: mergedActive,
            partnershipHistory: mergedHistory,
          },
          { merge: true }
        );
      } catch (err2) {
        console.error(
          "Error saving partnership to Firestore (fallback):",
          err2
        );
      }
    }
  };

  const mergedPartnerships = React.useMemo(() => {
    const ids = new Set(partnershipHistory.map((h) => h.id));
    const activeNotInHistory = activePartnerships.filter((a) => !ids.has(a.id));
    return [...partnershipHistory, ...activeNotInHistory];
  }, [partnershipHistory, activePartnerships]);

  // Fetch IKM Favorit from Firestore and load IKM data
  useEffect(() => {
    const fetchFavoritedIkm = async () => {
      if (!user) return;
      setLoadingFavorites(true);
      try {
        const { getFirestore, doc, getDoc } = await import(
          "firebase/firestore"
        );
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        let favoritedIds = [];
        if (userSnap.exists() && Array.isArray(userSnap.data().favoritedIkm)) {
          favoritedIds = userSnap.data().favoritedIkm;
        }
        if (favoritedIds.length === 0) {
          setFavoritedIkmList([]);
          setLoadingFavorites(false);
          return;
        }
        // Fetch each IKM doc by ID
        const promises = favoritedIds.map(async (ikmId) => {
          const ikmDocRef = doc(db, "ikm", ikmId);
          const ikmSnap = await getDoc(ikmDocRef);
          return ikmSnap.exists()
            ? { id: ikmSnap.id, ...ikmSnap.data() }
            : null;
        });
        const ikmListRaw = await Promise.all(promises);
        const ikmList = ikmListRaw.filter(Boolean);
        setFavoritedIkmList(ikmList);
      } catch (err) {
        console.error("Error fetching favorited IKM:", err);
        setFavoritedIkmList([]);
      }
      setLoadingFavorites(false);
    };
    fetchFavoritedIkm();
  }, [user]);

  return (
    <div>
      <Navbar userRole="industry" />
      <div className="flex min-h-screen bg-green-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-2xl overflow-hidden">
                {typeof profileData.photo === "string" &&
                (profileData.photo.indexOf("http") === 0 ||
                  profileData.photo.indexOf("data:") === 0) ? (
                  <img
                    src={profileData.photo}
                    alt="avatar"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // hide broken image; fallback will show below
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span>{profileData.photo || "👨‍💼"}</span>
                )}
              </div>
              <div>
                <h2
                  className="text-lg font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dashboard User
                </h2>
              </div>
            </div>
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {profileData.companyName}
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
                Selamat Datang, {profileData.fullName}! 👋
              </h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Users className="w-8 h-8 text-blue-600" />
                    <span className="text-blue-600 text-sm font-semibold">
                      Aktif
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {activePartnerships.length}
                  </h3>
                  <p className="text-gray-600 text-sm">Kemitraan IKM</p>
                </div>
              </div>

              {/* Pending Partnership Requests */}
              {/* {partnershipRequests.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Pengajuan Kemitraan dari IKM ({partnershipRequests.length})
                  </h2>
                  <div className="space-y-4">
                    {partnershipRequests.slice(0, 2).map((request) => (
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
                              Produk: {request.product}
                            </p>
                          </div>
                          <span className="text-xs text-gray-500">
                            {request.requestDate}
                          </span>
                        </div>
                        <p
                          className="text-sm text-gray-700 mb-3"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {request.description}
                        </p>
                        <div className="bg-white rounded-lg p-3 mb-4">
                          <p className="text-xs text-gray-500 mb-1">
                            Waktu Pengiriman yang Diusulkan
                          </p>
                          <p className="text-sm font-semibold text-gray-800">
                            {request.deliveryTime}
                          </p>
                        </div>
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
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Building2 className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lengkapi Profil
                    </h3>
                    <p className="text-sm text-blue-50">
                      Update informasi perusahaan
                    </p>
                  </button>
                  <button
                    onClick={() => setActiveTab("ikm-directory")}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Search className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Cari IKM
                    </h3>
                    <p className="text-sm text-green-50">
                      Temukan mitra potensial
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
                      Review permintaan IKM
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
                  Edit Profil
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
                {/* Personal Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Informasi Pribadi
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
                          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-5xl overflow-hidden">
                            {typeof profileData.photo === "string" &&
                            (profileData.photo.indexOf("http") === 0 ||
                              profileData.photo.indexOf("data:") === 0) ? (
                              <img
                                src={profileData.photo}
                                alt="avatar"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <span className="text-5xl">
                                {profileData.photo || "👨‍💼"}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => setShowPhotoModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                          >
                            Unggah Foto
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center text-5xl overflow-hidden">
                          {typeof profileData.photo === "string" &&
                          (profileData.photo.indexOf("http") === 0 ||
                            profileData.photo.indexOf("data:") === 0) ? (
                            <img
                              src={profileData.photo}
                              alt="avatar"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <span className="text-5xl">
                              {profileData.photo || "👨‍💼"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            handleProfileUpdate("fullName", e.target.value)
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
                          Nomor Telepon
                        </label>
                        <input
                          type="text"
                          value={profileData.phoneNumber || ""}
                          onChange={(e) =>
                            handleProfileUpdate("phoneNumber", e.target.value)
                          }
                          disabled={!editingProfile}
                          placeholder="08xxxxxxx"
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

                {/* Company Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Informasi Perusahaan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Nama Perusahaan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={profileData.companyName}
                        placeholder="Isi dengan nama perusahaan Anda"
                        onChange={(e) =>
                          handleProfileUpdate("companyName", e.target.value)
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
                        Jabatan
                      </label>
                      <input
                        type="text"
                        value={profileData.position}
                        placeholder="Isi dengan jabatan Anda di perusahaan"
                        onChange={(e) =>
                          handleProfileUpdate("position", e.target.value)
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
                        Departemen / Divisi
                      </label>
                      <input
                        type="text"
                        value={profileData.department}
                        placeholder="Isi dengan departemen/divisi tempat Anda bekerja"
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
                        Lokasi Perusahaan
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        placeholder="Isi dengan kota/provinsi tempat perusahaan Anda"
                        onChange={(e) =>
                          handleProfileUpdate("city", e.target.value)
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
                </div>

                {/* Products & Services */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Produk & Kebutuhan
                  </h2>
                  <div className="space-y-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Produk yang Dihasilkan{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={profileData.products}
                        onChange={(e) =>
                          handleProfileUpdate("products", e.target.value)
                        }
                        disabled={!editingProfile}
                        rows={3}
                        placeholder="Contoh: Komponen elektronik, PCB Assembly, Wiring Harness"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Pisahkan dengan koma untuk produk yang lebih dari satu
                      </p>
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Produk/Layanan yang Dibutuhkan{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={profileData.needs}
                        onChange={(e) =>
                          handleProfileUpdate("needs", e.target.value)
                        }
                        disabled={!editingProfile}
                        rows={3}
                        placeholder="Contoh: Komponen logam presisi, kemasan custom, furniture kantor"
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-blue-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ini membantu IKM menemukan perusahaan Anda
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Deskripsi Singkat
                  </h2>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleProfileUpdate("bio", e.target.value)}
                    disabled={!editingProfile}
                    rows={4}
                    placeholder="Ceritakan tentang perusahaan dan pengalaman Anda..."
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editingProfile
                        ? "border-gray-300 focus:border-blue-500"
                        : "border-gray-200 bg-gray-50"
                    } focus:outline-none`}
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                </div>

                {/* Histori Kemitraan IKM */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Histori Kemitraan IKM
                  </h2>
                  {mergedPartnerships.length === 0 ? (
                    <div className="bg-blue-50 rounded-xl p-6 text-center mb-6">
                      <p
                        className="text-gray-600 mb-0"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Belum Ada Data Histori Kemitraan dengan IKM
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {mergedPartnerships.map((h) => (
                        <div
                          key={h.id}
                          className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
                        >
                          {editingHistoryId === h.id ? (
                            <div className="space-y-3">
                              <input
                                type="text"
                                value={editingHistoryData.ikmName}
                                onChange={(e) =>
                                  setEditingHistoryData({
                                    ...editingHistoryData,
                                    ikmName: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Nama IKM"
                              />
                              <input
                                type="text"
                                value={editingHistoryData.product}
                                onChange={(e) =>
                                  setEditingHistoryData({
                                    ...editingHistoryData,
                                    product: e.target.value,
                                  })
                                }
                                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                placeholder="Produk/Layanan"
                              />
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="date"
                                  value={editingHistoryData.startDate}
                                  onChange={(e) =>
                                    setEditingHistoryData({
                                      ...editingHistoryData,
                                      startDate: e.target.value,
                                    })
                                  }
                                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                />
                                <input
                                  type="text"
                                  value={editingHistoryData.duration}
                                  onChange={(e) =>
                                    setEditingHistoryData({
                                      ...editingHistoryData,
                                      duration: e.target.value,
                                    })
                                  }
                                  className="px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                  placeholder="Durasi"
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => {
                                    setEditingHistoryId(null);
                                    setEditingHistoryData(null);
                                  }}
                                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-400 transition"
                                  style={{
                                    fontFamily: "Montserrat, sans-serif",
                                  }}
                                >
                                  Batal
                                </button>
                                <button
                                  onClick={handleSaveEditedHistory}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                                  style={{
                                    fontFamily: "Montserrat, sans-serif",
                                  }}
                                >
                                  Simpan
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="font-semibold text-gray-800 text-lg">
                                  {h.ikmName}
                                </div>
                                <div className="text-sm text-gray-600 mt-1">
                                  Produk: {h.product}
                                </div>
                                <div className="text-sm text-gray-500 mt-1">
                                  Mulai:{" "}
                                  {h.startDate
                                    ? new Date(h.startDate).toLocaleDateString(
                                        "id-ID"
                                      )
                                    : "-"}{" "}
                                  • Durasi: {h.duration}
                                </div>
                              </div>
                              {editingProfile && (
                                <div className="flex space-x-2 ml-4">
                                  <button
                                    onClick={() =>
                                      handleEditHistoryPartnership(h)
                                    }
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition"
                                    style={{
                                      fontFamily: "Montserrat, sans-serif",
                                    }}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDeleteHistoryPartnership(h.id)
                                    }
                                    className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition"
                                    style={{
                                      fontFamily: "Montserrat, sans-serif",
                                    }}
                                  >
                                    Hapus
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {editingProfile && (
                    <div className="flex justify-end">
                      <button
                        onClick={() => {
                          setManualPartnershipTarget("history");
                          setShowManualPartnershipModal(true);
                        }}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        + Tambah Kemitraan
                      </button>
                    </div>
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
                      onClick={async () => {
                        try {
                          await saveProfileToFirestore();
                          setEditingProfile(false);
                          alert("Profil berhasil diperbarui!");
                        } catch (err) {
                          alert(
                            "Gagal menyimpan profil. Silakan coba lagi atau hubungi admin."
                          );
                        }
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

          {/* Partnerships Tab */}
          {activeTab === "partnerships" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Kelola Kemitraan IKM
              </h1>

              {/* Pending Requests */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2
                    className="text-2xl font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Pengajuan dari IKM ({partnershipRequests.length})
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
                              <strong>Produk:</strong> {request.product}
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
                            Penawaran dari IKM:
                          </p>
                          <p
                            className="text-sm text-gray-600 mb-3"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {request.description}
                          </p>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white rounded-lg p-3">
                              <p className="text-xs text-gray-500 mb-1">
                                Waktu Pengiriman
                              </p>
                              <p className="text-sm font-semibold text-gray-800">
                                {request.deliveryTime}
                              </p>
                            </div>
                          </div>
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
                      Belum ada pengajuan kemitraan dari IKM
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
                  Tambah Kemitraan Baru
                </h2>
                <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl p-6 text-white">
                  <p
                    className="text-blue-50 mb-4"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Tambahkan data kemitraan baru Anda dengan IKM yang telah
                    terdaftar untuk dokumentasi dan tracking.
                  </p>
                  <button
                    onClick={() => setShowManualPartnershipModal(true)}
                    className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                  >
                    + Tambah Kemitraan Baru
                  </button>
                </div>
              </div>

              {/* Active Partnerships */}
              <div className="mb-8">
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kemitraan Aktif ({activePartnerships.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activePartnerships.map((partnership) => (
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
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Aktif
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-4">
                        <strong>Produk:</strong> {partnership.product}
                      </p>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Total Pesanan
                          </p>
                          <p className="text-lg font-bold text-gray-800">
                            {partnership.orderCount}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        <span>
                          Sejak:{" "}
                          {new Date(partnership.startDate).toLocaleDateString(
                            "id-ID"
                          )}
                        </span>
                        <span>
                          Order terakhir:{" "}
                          {partnership.lastOrder === "-"
                            ? "-"
                            : new Date(
                                partnership.lastOrder
                              ).toLocaleDateString("id-ID")}
                        </span>
                      </div>

                      {partnership.rating > 0 && (
                        <div className="flex items-center mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(partnership.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-semibold text-gray-700">
                            {partnership.rating}
                          </span>
                        </div>
                      )}

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition">
                          Lihat Detail
                        </button>
                        <button className="flex-1 bg-green-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                          Buat Pesanan
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Completed Partnerships */}
              <div>
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kemitraan Selesai ({completedPartnerships.length})
                </h2>

                <div className="space-y-4">
                  {completedPartnerships.map((partnership) => (
                    <div
                      key={partnership.id}
                      className="bg-white rounded-2xl shadow-lg p-6"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3
                              className="text-lg font-bold text-gray-800"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {partnership.ikmName}
                            </h3>
                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                              Selesai
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            <strong>Produk:</strong> {partnership.product}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">
                            Total Pesanan
                          </p>
                          <p className="text-sm font-bold text-gray-800">
                            {partnership.orderCount}
                          </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-xs text-gray-500 mb-1">Durasi</p>
                          <p className="text-sm font-bold text-gray-800">
                            6 bulan
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center mb-4">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(partnership.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-semibold text-gray-700">
                          {partnership.rating}
                        </span>
                      </div>

                      {partnership.review && (
                        <div className="bg-green-50 rounded-xl p-3">
                          <p className="text-xs font-semibold text-green-700 mb-1">
                            Review Anda:
                          </p>
                          <p className="text-xs text-green-600">
                            {partnership.review}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* IKM Directory Tab */}
          {activeTab === "ikm-directory" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Cari IKM Mitra
              </h1>
              <p
                className="text-gray-600 mb-8"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Temukan IKM yang sesuai dengan kebutuhan produk dan layanan Anda
              </p>
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p
                  className="text-gray-600 mb-6"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Fitur pencarian IKM akan segera tersedia
                </p>
                <button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Jelajahi Direktori IKM
                </button>
              </div>
            </div>
          )}

          {/* IKM Favorit Tab */}
          {activeTab === "favorites" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                IKM Favorit Saya
              </h1>
              {loadingFavorites ? (
                <div className="text-center py-12 text-gray-500">
                  Memuat data IKM favorit...
                </div>
              ) : favoritedIkmList.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-10 h-10 text-gray-400" />
                  </div>
                  <p
                    className="text-gray-600"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Belum ada IKM yang difavoritkan
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favoritedIkmList.map((ikm) => (
                    <div
                      key={ikm.id}
                      className="bg-white rounded-2xl shadow-lg p-6 flex flex-col"
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl overflow-hidden">
                          {ikm.logo ? (
                            <img
                              src={ikm.logo}
                              alt={ikm.name}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.style.display = "none")
                              }
                            />
                          ) : (
                            <span role="img" aria-label="logo">
                              🏭
                            </span>
                          )}
                        </div>
                        <div>
                          <h2
                            className="text-lg font-bold text-gray-800"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {ikm.name}
                          </h2>
                          <p className="text-sm text-gray-500">
                            {ikm.location || "-"}
                          </p>
                        </div>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-gray-600">
                          Produk:
                        </span>{" "}
                        <span className="text-sm">
                          {ikm.products ? ikm.products.join(", ") : "-"}
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-xs font-semibold text-gray-600">
                          Layanan:
                        </span>{" "}
                        <span className="text-sm">
                          {ikm.services ? ikm.services.join(", ") : "-"}
                        </span>
                      </div>
                      <div className="mt-auto flex justify-end">
                        <button
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                          onClick={() => setSelectedIkmForModal(ikm)}
                        >
                          Lihat Profil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Modal for IKM detail */}
              {selectedIkmForModal && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedIkmForModal(null)}
                >
                  <div
                    className="bg-white rounded-2xl max-w-2xl w-full p-8 relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="absolute top-4 right-4 text-gray-500 hover:bg-gray-100 rounded-full p-2"
                      onClick={() => setSelectedIkmForModal(null)}
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <div className="flex items-center space-x-6 mb-6">
                      <div className="w-20 h-20 rounded-xl bg-gray-100 flex items-center justify-center text-4xl overflow-hidden">
                        {selectedIkmForModal.logo ? (
                          <img
                            src={selectedIkmForModal.logo}
                            alt={selectedIkmForModal.name}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.currentTarget.style.display = "none")
                            }
                          />
                        ) : (
                          <span role="img" aria-label="logo">
                            🏭
                          </span>
                        )}
                      </div>
                      <div>
                        <h2
                          className="text-2xl font-bold text-gray-800"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {selectedIkmForModal.name}
                        </h2>
                        <p className="text-gray-500">
                          {selectedIkmForModal.location || "-"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-gray-600">
                        Produk:
                      </span>{" "}
                      <span className="text-sm">
                        {selectedIkmForModal.products
                          ? selectedIkmForModal.products.join(", ")
                          : "-"}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-gray-600">
                        Layanan:
                      </span>{" "}
                      <span className="text-sm">
                        {selectedIkmForModal.services
                          ? selectedIkmForModal.services.join(", ")
                          : "-"}
                      </span>
                    </div>
                    <div className="mb-4">
                      <span className="text-xs font-semibold text-gray-600">
                        Sertifikasi:
                      </span>{" "}
                      <span className="text-sm">
                        {selectedIkmForModal.certifications
                          ? selectedIkmForModal.certifications.join(", ")
                          : "-"}
                      </span>
                    </div>
                    <div className="sticky bottom-0 bg-white pt-4 flex justify-end">
                      <a
                        href={`mailto:${selectedIkmForModal.email}`}
                        className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition mr-2"
                      >
                        Email untuk Bermitra
                      </a>
                      <button
                        className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                        onClick={() => setSelectedIkmForModal(null)}
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual Partnership Modal */}
          {showManualPartnershipModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowManualPartnershipModal(false)}
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
                      Tambah Kemitraan Manual
                    </h2>
                    <button
                      onClick={() => setShowManualPartnershipModal(false)}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <form
                  className="p-6 space-y-6"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const payload = {
                      ikmName: formData.get("ikmName"),
                      product: formData.get("product"),
                      startDate: formData.get("startDate"),
                      // Capture duration from the form; keep orderCount/totalValue
                      // with sensible defaults for compatibility with existing UI.
                      duration: formData.get("duration") || "",
                      orderCount: 0,
                      totalValue: "",
                      lastOrder: "-",
                      rating: 0,
                    };
                    try {
                      if (manualPartnershipTarget === "history") {
                        await handleAddHistoryPartnership(payload);
                      } else {
                        await handleAddManualPartnership(payload);
                      }
                      setShowManualPartnershipModal(false);
                      alert(
                        "Data kemitraan sudah tersimpan. Terima kasih sudah mengisi."
                      );
                    } catch (err) {
                      console.error("Error saving manual partnership:", err);
                      alert(
                        "Terjadi kesalahan saat menyimpan data. Silakan coba lagi."
                      );
                    }
                  }}
                >
                  {/* IKM Name */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Nama IKM <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="ikmName"
                      placeholder="Contoh: CV Furniture Jaya Abadi"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Product/Service */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Produk/Layanan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="product"
                      placeholder="Contoh: Meja dan Kursi Kantor"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Start Date */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tanggal Mulai Kemitraan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Durasi Kemitraan (replaces order count / total value inputs) */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Durasi Kemitraan (Opsional)
                    </label>
                    <input
                      type="text"
                      name="duration"
                      placeholder="Contoh: 6 bulan"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    />
                  </div>

                  {/* (Removed last order date input; duration above replaces it) */}

                  {/* Info Box */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <p
                      className="text-blue-800 text-sm"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      ℹ️ Data kemitraan manual akan disimpan untuk keperluan
                      dokumentasi dan tracking.
                    </p>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowManualPartnershipModal(false)}
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
                      Simpan Kemitraan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Photo Upload Modal */}
          {showPhotoModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPhotoModal(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-lg w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Unggah Foto Profil</h2>
                  <button
                    onClick={() => setShowPhotoModal(false)}
                    className="text-gray-600 hover:bg-gray-100 rounded-full p-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Unggah foto profil Anda. Format yang disarankan: JPG/PNG,
                  ukuran maksimal 2MB.
                </p>

                <div className="space-y-4">
                  <div className="border-dashed border-2 border-gray-200 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16V4m0 0L3 8m4-4 4 4M17 8v8a4 4 0 01-4 4H7"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          Pilih Foto Profil
                        </p>
                        <p className="text-xs text-gray-500">
                          Format JPG/PNG. Maksimal 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <label className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer hover:bg-blue-700">
                        Pilih File
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoFileChange}
                          className="hidden"
                        />
                      </label>
                      <div className="text-sm text-gray-700">
                        {photoFile ? (
                          <span className="font-medium">{photoFile.name}</span>
                        ) : (
                          <span className="text-gray-400">
                            Belum ada file dipilih
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {photoFile && (
                    <div className="border rounded-lg p-3 mt-4">
                      <p className="text-sm font-semibold">Preview:</p>
                      <img
                        src={URL.createObjectURL(photoFile)}
                        alt="preview"
                        className="mt-2 max-h-48 object-contain"
                      />
                    </div>
                  )}

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => {
                        setPhotoFile(null);
                        setShowPhotoModal(false);
                      }}
                      className="px-4 py-2 bg-gray-200 rounded-lg"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleUploadProfilePhoto}
                      disabled={uploadingPhoto}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      {uploadingPhoto ? "Mengunggah..." : "Unggah Foto"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserDashboard;
