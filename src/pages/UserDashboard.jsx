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
  const [selectedDetail, setSelectedDetail] = useState(null);

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
      if (!user) {
        setFavoritedIkmList([]);
        return;
      }
      setLoadingFavorites(true);
      try {
        const { getFirestore, doc, getDoc, collection, query, where, getDocs } =
          await import("firebase/firestore");
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
        // Fetch all IKM profiles from users collection with role 'ikm'
        const q = query(collection(db, "users"), where("role", "==", "ikm"));
        const querySnapshot = await getDocs(q);
        const ikmData = [];
        querySnapshot.forEach((docSnap) => {
          const ikm = { id: docSnap.id, ...docSnap.data() };
          if (favoritedIds.includes(docSnap.id)) {
            ikmData.push(ikm);
          }
        });
        setFavoritedIkmList(ikmData);
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
                IKM Favorit
              </h1>

              {favoritedIkmList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoritedIkmList.map((ikm) => (
                    <div
                      key={ikm.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
                    >
                      {/* Card Header */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-16 h-16 bg-linear-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-4xl overflow-hidden">
                            {ikm.logoUrl ? (
                              <img
                                src={ikm.logoUrl}
                                alt={`${ikm.name} logo`}
                                className="w-full h-full object-cover"
                              />
                            ) : ikm.logo ? (
                              <span>{ikm.logo}</span>
                            ) : (
                              <span>🏭</span>
                            )}
                          </div>
                          <span className="text-2xl">❤️</span>
                        </div>

                        <h3
                          className="text-xl font-bold text-gray-800 mb-2"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {ikm.businessName}
                        </h3>

                        <div
                          className="flex items-center text-sm text-gray-600 mb-3"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          <span className="mr-1">📍</span>
                          {ikm.officeAddress}
                        </div>

                        <div className="mb-4">
                          <span
                            className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            KBLI {ikm.kbli}
                          </span>
                        </div>

                        <div className="mb-4">
                          <p
                            className="text-sm text-gray-600 font-semibold mb-2"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Produk:
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {Array.isArray(ikm.products) &&
                              ikm.products.slice(0, 2).map((product, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg"
                                  style={{
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  {typeof product === "string"
                                    ? product
                                    : product.name}
                                </span>
                              ))}
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => setSelectedIkmForModal(ikm)}
                            className="flex-1 bg-linear-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Lihat Profil
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl shadow-lg">
                  <div className="text-6xl mb-4">🤍</div>
                  <h3
                    className="text-2xl font-bold text-gray-800 mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Belum Ada IKM Favorit
                  </h3>
                  <p
                    className="text-gray-600 mb-6"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Kunjungi Direktori IKM dan tandai IKM favorit Anda dengan
                    menekan ikon ❤️
                  </p>
                  <Link
                    to="/direktori"
                    className="inline-block bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Jelajahi Direktori IKM
                  </Link>
                </div>
              )}

              {/* IKM Detail Modal */}
              {selectedIkmForModal && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedIkmForModal(null)}
                >
                  <div
                    className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="sticky top-0 bg-linear-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-5xl overflow-hidden">
                            {selectedIkmForModal.logoUrl ? (
                              <img
                                src={selectedIkmForModal.logoUrl}
                                alt={`${selectedIkmForModal.businessName} logo`}
                                className="w-full h-full object-cover"
                              />
                            ) : selectedIkmForModal.logo ? (
                              <span>{selectedIkmForModal.logo}</span>
                            ) : (
                              <span>🏭</span>
                            )}
                          </div>
                          <div>
                            <h2
                              className="text-3xl font-bold mb-2"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {selectedIkmForModal.businessName}
                            </h2>
                            <div className="flex items-center space-x-4 text-green-50">
                              {selectedIkmForModal?.officeAddress && (
                                <span className="flex items-center">
                                  <span className="mr-1">📍</span>
                                  {selectedIkmForModal.officeAddress}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedIkmForModal(null)}
                          className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition"
                        >
                          <X className="w-6 h-6" />
                        </button>
                      </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-6 space-y-6">
                      {/* Quick Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-green-50 rounded-xl p-4 text-center">
                          <p
                            className="text-2xl font-bold text-green-600"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {selectedIkmForModal?.establishedYear || "-"}
                          </p>
                          <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            Tahun Berdiri
                          </p>
                        </div>
                        <div className="bg-blue-50 rounded-xl p-4 text-center">
                          <p
                            className="text-2xl font-bold text-blue-600"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {selectedIkmForModal?.employees || "-"}
                          </p>
                          <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            Karyawan
                          </p>
                        </div>
                        <div className="bg-yellow-50 rounded-xl p-4 text-center">
                          <p
                            className="text-2xl font-bold text-yellow-600"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {selectedIkmForModal?.partnerships || 0}
                          </p>
                          <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            Kemitraan
                          </p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-4 text-center">
                          <p
                            className="text-2xl font-bold text-purple-600"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {Array.isArray(selectedIkmForModal?.certifications)
                              ? selectedIkmForModal.certifications.length
                              : 0}
                          </p>
                          <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            Sertifikasi
                          </p>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <h3
                          className="text-xl font-bold text-gray-800 mb-3"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Tentang Perusahaan
                        </h3>
                        <p
                          className="text-gray-700 leading-relaxed"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {selectedIkmForModal?.bio ||
                            "Informasi tentang perusahaan tidak tersedia"}
                        </p>
                      </div>

                      {/* Contact Information */}
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h3
                          className="text-xl font-bold text-gray-800 mb-4"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Informasi Kontak
                        </h3>
                        <div className="space-y-3">
                          <div className="flex items-start">
                            <span className="w-8 text-gray-600">📍</span>
                            <div>
                              <p
                                className="font-semibold text-gray-700"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                Alamat
                              </p>
                              <p
                                className="text-gray-600"
                                style={{ fontFamily: "Open Sans, sans-serif" }}
                              >
                                {selectedIkmForModal?.officeAddress ||
                                  "Alamat tidak tersedia"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="w-8 text-gray-600">📧</span>
                            <div>
                              <p
                                className="font-semibold text-gray-700"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                Email
                              </p>
                              {selectedIkmForModal?.email ? (
                                <a
                                  href={`mailto:${selectedIkmForModal.email}`}
                                  className="text-green-600 hover:underline"
                                  style={{
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  {selectedIkmForModal.email}
                                </a>
                              ) : (
                                <span
                                  className="text-gray-600"
                                  style={{
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  Email tidak tersedia
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="w-8 text-gray-600">📞</span>
                            <div>
                              <p
                                className="font-semibold text-gray-700"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                Telepon
                              </p>
                              {selectedIkmForModal?.phone ? (
                                <a
                                  href={`tel:${selectedIkmForModal.phone}`}
                                  className="text-green-600 hover:underline"
                                  style={{
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  {selectedIkmForModal.phone}
                                </a>
                              ) : (
                                <span
                                  className="text-gray-600"
                                  style={{
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  Telepon tidak tersedia
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="w-8 text-gray-600">🌐</span>
                            <div>
                              <p
                                className="font-semibold text-gray-700"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                Website
                              </p>
                              {selectedIkmForModal?.website ? (
                                <a
                                  href={`https://${selectedIkmForModal.website}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-green-600 hover:underline"
                                  style={{
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  {selectedIkmForModal.website}
                                </a>
                              ) : (
                                <span
                                  className="text-gray-600"
                                  style={{
                                    fontFamily: "Open Sans, sans-serif",
                                  }}
                                >
                                  Website tidak tersedia
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* KBLI & Service Type */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3
                            className="text-lg font-bold text-gray-800 mb-3"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            KBLI
                          </h3>
                          <span
                            className="inline-block bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {selectedIkmForModal?.kbli || "-"}
                          </span>
                        </div>

                        <div>
                          <h3
                            className="text-lg font-bold text-gray-800 mb-3"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            Jenis Layanan
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {(() => {
                              const products = Array.isArray(
                                selectedIkmForModal?.products
                              )
                                ? selectedIkmForModal.products
                                : Array.isArray(
                                    selectedIkmForModal?.productList
                                  )
                                ? selectedIkmForModal.productList
                                : [];
                              const services = Array.isArray(
                                selectedIkmForModal?.services
                              )
                                ? selectedIkmForModal.services
                                : Array.isArray(
                                    selectedIkmForModal?.serviceList
                                  )
                                ? selectedIkmForModal.serviceList
                                : Array.isArray(
                                    selectedIkmForModal?.services_offered
                                  )
                                ? selectedIkmForModal.services_offered
                                : [];

                              const hasProducts = products.length > 0;
                              const hasServices = services.length > 0;

                              return (
                                <>
                                  {hasProducts && (
                                    <span
                                      className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold"
                                      style={{
                                        fontFamily: "Montserrat, sans-serif",
                                      }}
                                    >
                                      Produk
                                    </span>
                                  )}
                                  {hasServices && (
                                    <span
                                      className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold"
                                      style={{
                                        fontFamily: "Montserrat, sans-serif",
                                      }}
                                    >
                                      Layanan
                                    </span>
                                  )}
                                  {!hasProducts && !hasServices && (
                                    <span
                                      className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold"
                                      style={{
                                        fontFamily: "Montserrat, sans-serif",
                                      }}
                                    >
                                      {selectedIkmForModal?.serviceType || "-"}
                                    </span>
                                  )}
                                </>
                              );
                            })()}
                          </div>
                        </div>
                      </div>

                      {/* Products & Services */}
                      <div>
                        <h3
                          className="text-xl font-bold text-gray-800 mb-4"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Produk & Layanan
                        </h3>

                        {(() => {
                          const products = Array.isArray(
                            selectedIkmForModal.products
                          )
                            ? selectedIkmForModal.products
                            : Array.isArray(selectedIkmForModal.productList)
                            ? selectedIkmForModal.productList
                            : [];
                          const services = Array.isArray(
                            selectedIkmForModal.services
                          )
                            ? selectedIkmForModal.services
                            : Array.isArray(selectedIkmForModal.serviceList)
                            ? selectedIkmForModal.serviceList
                            : Array.isArray(
                                selectedIkmForModal.services_offered
                              )
                            ? selectedIkmForModal.services_offered
                            : [];

                          const serviceFallback =
                            !services.length && selectedIkmForModal.serviceType
                              ? [selectedIkmForModal.serviceType]
                              : [];

                          const combinedServices = [
                            ...services,
                            ...serviceFallback,
                          ];

                          return (
                            <div className="space-y-4">
                              {products.length > 0 && (
                                <div>
                                  <h4 className="text-lg font-semibold mb-2">
                                    Produk
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {products.map((product, idx) => {
                                      const name =
                                        typeof product === "string"
                                          ? product
                                          : product.name ||
                                            product.title ||
                                            "Produk";
                                      const capacity =
                                        product && typeof product === "object"
                                          ? product.capacity ||
                                            product.capacityInfo ||
                                            product.description ||
                                            ""
                                          : "";
                                      const prodImg =
                                        product && typeof product === "object"
                                          ? product.imageUrl ||
                                            product.image ||
                                            product.photo ||
                                            product.logoUrl ||
                                            null
                                          : null;
                                      return (
                                        <div
                                          key={`p-${idx}`}
                                          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-lg transition"
                                        >
                                          <div className="w-full h-32 bg-linear-to-br from-green-100 to-blue-100 rounded-xl mb-3 flex items-center justify-center text-4xl overflow-hidden">
                                            {prodImg ? (
                                              <img
                                                src={prodImg}
                                                alt={
                                                  (typeof product ===
                                                    "object" &&
                                                    (product.name ||
                                                      product.title)) ||
                                                  `${selectedIkmForModal.businessName} product`
                                                }
                                                className="w-full h-full object-cover"
                                              />
                                            ) : selectedIkmForModal.logoUrl ? (
                                              <img
                                                src={
                                                  selectedIkmForModal.logoUrl
                                                }
                                                alt={`${selectedIkmForModal.businessName} logo`}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : selectedIkmForModal.logo ? (
                                              <span>
                                                {selectedIkmForModal.logo}
                                              </span>
                                            ) : (
                                              <span>🏭</span>
                                            )}
                                          </div>
                                          <h5 className="font-semibold text-gray-800 text-center mb-2">
                                            {name}
                                          </h5>
                                          {capacity && (
                                            <p className="text-center text-gray-600">
                                              {capacity}
                                            </p>
                                          )}
                                          <div className="mt-3 flex justify-center">
                                            <button
                                              onClick={() =>
                                                setSelectedDetail({
                                                  kind: "product",
                                                  item: product,
                                                })
                                              }
                                              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition"
                                            >
                                              Detail
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {combinedServices.length > 0 && (
                                <div>
                                  <h4 className="text-lg font-semibold mb-2">
                                    Layanan
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {combinedServices.map((svc, idx) => {
                                      const title =
                                        typeof svc === "string"
                                          ? svc
                                          : svc.name || svc.title || "Layanan";
                                      const desc =
                                        svc && typeof svc === "object"
                                          ? svc.description || svc.detail || ""
                                          : "";
                                      const capacity =
                                        svc && typeof svc === "object"
                                          ? svc.capacity ||
                                            svc.capacityInfo ||
                                            svc.capacity_range ||
                                            svc.capacityRange ||
                                            ""
                                          : "";
                                      const img =
                                        svc && typeof svc === "object"
                                          ? svc.imageUrl ||
                                            svc.logoUrl ||
                                            svc.photo ||
                                            null
                                          : null;

                                      return (
                                        <div
                                          key={`s-${idx}`}
                                          className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-500 hover:shadow-lg transition"
                                        >
                                          <div className="w-full h-28 bg-linear-to-br from-gray-50 to-blue-50 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
                                            {img ? (
                                              <img
                                                src={img}
                                                alt={`${title} image`}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : selectedIkmForModal.logoUrl ? (
                                              <img
                                                src={
                                                  selectedIkmForModal.logoUrl
                                                }
                                                alt={`${selectedIkmForModal.businessName} logo`}
                                                className="w-full h-full object-cover"
                                              />
                                            ) : selectedIkmForModal.logo ? (
                                              <span className="text-3xl">
                                                {selectedIkmForModal.logo}
                                              </span>
                                            ) : (
                                              <span className="text-3xl">
                                                🏭
                                              </span>
                                            )}
                                          </div>

                                          <h5 className="font-semibold text-gray-800 text-center mb-2">
                                            {title}
                                          </h5>
                                          {capacity && (
                                            <p className="text-center text-gray-600 mb-1">
                                              {capacity}
                                            </p>
                                          )}
                                          {desc && (
                                            <p className="text-center text-gray-600">
                                              {desc}
                                            </p>
                                          )}
                                          <div className="mt-3 flex justify-center">
                                            <button
                                              onClick={() =>
                                                setSelectedDetail({
                                                  kind: "service",
                                                  item: svc,
                                                })
                                              }
                                              className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold hover:bg-gray-200 transition"
                                            >
                                              Detail
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}

                              {products.length === 0 &&
                                combinedServices.length === 0 && (
                                  <p className="text-gray-600">
                                    Tidak ada data produk atau layanan yang
                                    tersedia.
                                  </p>
                                )}
                            </div>
                          );
                        })()}
                      </div>

                      {/* Machines & Equipment */}
                      {(() => {
                        const machines = Array.isArray(
                          selectedIkmForModal?.machines
                        )
                          ? selectedIkmForModal.machines
                          : Array.isArray(selectedIkmForModal?.machineList)
                          ? selectedIkmForModal.machineList
                          : [];

                        if (!machines.length) return null;

                        return (
                          <div>
                            <h3
                              className="text-xl font-bold text-gray-800 mb-4"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              Mesin & Peralatan Produksi
                            </h3>
                            <div className="space-y-3">
                              {machines.map((machine, idx) => {
                                const name =
                                  (machine &&
                                    (machine.name ||
                                      machine.spesifikasi ||
                                      machine.spec ||
                                      machine.title ||
                                      machine.model)) ||
                                  `Mesin ${idx + 1}`;
                                const capacity =
                                  machine &&
                                  (machine.kapasitas ||
                                    machine.capacity ||
                                    machine.capacityInfo ||
                                    machine.kapasitas_produksi ||
                                    machine.capacity_range ||
                                    "");
                                const quantity =
                                  machine &&
                                  (machine.jumlah ||
                                    machine.quantity ||
                                    machine.qty ||
                                    machine.count ||
                                    machine.unit ||
                                    "");

                                return (
                                  <div
                                    key={idx}
                                    className="bg-linear-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <div className="flex items-center mb-2">
                                          <span className="text-2xl mr-3">
                                            ⚙️
                                          </span>
                                          <h4
                                            className="font-bold text-gray-800"
                                            style={{
                                              fontFamily:
                                                "Montserrat, sans-serif",
                                            }}
                                          >
                                            {name}
                                          </h4>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3 mt-3">
                                          <div className="flex items-center">
                                            <span className="text-sm text-gray-600 mr-2">
                                              📊
                                            </span>
                                            <div>
                                              <p className="text-xs text-gray-500">
                                                Kuantitas
                                              </p>
                                              <p
                                                className="font-semibold text-gray-800"
                                                style={{
                                                  fontFamily:
                                                    "Montserrat, sans-serif",
                                                }}
                                              >
                                                {quantity
                                                  ? `${quantity} Unit`
                                                  : "-"}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center">
                                            <span className="text-sm text-gray-600 mr-2">
                                              ⚡
                                            </span>
                                            <div>
                                              <p className="text-xs text-gray-500">
                                                Kapasitas
                                              </p>
                                              <p
                                                className="font-semibold text-blue-600"
                                                style={{
                                                  fontFamily:
                                                    "Montserrat, sans-serif",
                                                }}
                                              >
                                                {capacity || "-"}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })()}

                      {/* Certifications */}
                      <div>
                        <h3
                          className="text-xl font-bold text-gray-800 mb-4"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          Sertifikasi & Standar Mutu
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {Array.isArray(selectedIkmForModal.certifications) &&
                            selectedIkmForModal.certifications.map(
                              (cert, idx) => (
                                <span
                                  key={idx}
                                  className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-4 py-2 rounded-xl font-semibold flex items-center"
                                  style={{
                                    fontFamily: "Montserrat, sans-serif",
                                  }}
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  {typeof cert === "string"
                                    ? cert
                                    : cert.name
                                    ? `${cert.name}${
                                        cert.year ? ` (${cert.year})` : ""
                                      }`
                                    : JSON.stringify(cert)}
                                </span>
                              )
                            )}
                        </div>
                      </div>
                    </div>

                    {/* Sticky Footer */}
                    <div className="sticky bottom-0 bg-white pt-6 pb-4 border-t border-gray-200">
                      <div className="px-6 flex gap-4">
                        <button
                          onClick={() =>
                            (window.location.href = `https://wa.me/${selectedIkmForModal?.phone}`)
                          }
                          className="flex items-center justify-center gap-2 w-1/2 bg-green-600 text-white py-3 rounded-2xl font-semibold hover:bg-green-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                            aria-hidden="true"
                          >
                            <path d="M20.52 3.48A11.94 11.94 0 0012 0C5.37 0 .02 5.36.02 12a11.3 11.3 0 001.59 5.6L0 24l6.7-1.74A11.94 11.94 0 0012 24c6.63 0 12-5.36 12-12 0-3.2-1.25-6.2-3.48-8.52zM12 21.5c-1.2 0-2.38-.32-3.42-.93l-.24-.14-3.98 1.02 1.06-3.88-.15-.25A9.5 9.5 0 012.5 12 9.5 9.5 0 0112 2.5c5.24 0 9.5 4.26 9.5 9.5S17.24 21.5 12 21.5z" />
                            <path d="M17.6 14.2c-.3-.15-1.78-.88-2.06-.98-.28-.1-.48-.15-.68.15s-.78.98-.96 1.18c-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.49-.9-.8-1.5-1.78-1.68-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2 0-.38-.05-.53-.06-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52l-.58-.01c-.2 0-.53.07-.8.35s-1.05 1.03-1.05 2.5 1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.14 4.54 3.02 1.3 3.02.87 3.57.82.55-.05 1.78-.72 2.03-1.42.25-.7.25-1.3.18-1.42-.07-.12-.27-.2-.58-.35z" />
                          </svg>
                          <span>Chat untuk Bermitra</span>
                        </button>

                        <button
                          className="flex items-center justify-center gap-2 w-1/2 bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 hover:shadow-lg active:scale-95 transition-all duration-200"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                          onClick={() => {
                            const subject = "Permintaan Kemitraan";
                            const body = `Yth. ${selectedIkmForModal?.businessName},\n\nSaya tertarik untuk membahas kemungkinan bermitra dengan perusahaan Anda.`;
                            window.location.href = `mailto:${
                              selectedIkmForModal?.email
                            }?subject=${encodeURIComponent(
                              subject
                            )}&body=${encodeURIComponent(body)}`;
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            className="w-6 h-6"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4h16v16H4V4zm0 0l8 8 8-8"
                            />
                          </svg>
                          <span>Email untuk Bermitra</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Product/Service Detail Popup (same behavior as directory) */}
              {selectedDetail && (
                <div
                  className="fixed inset-0 z-60 flex items-center justify-center p-4"
                  onClick={() => setSelectedDetail(null)}
                >
                  <div
                    className="bg-white rounded-2xl w-full max-w-xl p-6 shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-xl font-bold text-gray-800">
                        {(() => {
                          const it = selectedDetail.item;
                          if (typeof it === "string") return it;
                          return (
                            it.name ||
                            it.title ||
                            it.spesifikasi ||
                            it.model ||
                            "Detail"
                          );
                        })()}
                      </h4>
                      <button
                        onClick={() => setSelectedDetail(null)}
                        className="text-gray-500 hover:text-gray-700"
                        aria-label="Close detail"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(() => {
                        const it = selectedDetail.item;
                        const title =
                          typeof it === "string"
                            ? it
                            : it.name || it.title || it.spesifikasi || "-";
                        const desc =
                          it && typeof it === "object"
                            ? it.description || it.detail || it.desc || ""
                            : "";
                        const capacity =
                          it && typeof it === "object"
                            ? it.capacity ||
                              it.kapasitas ||
                              it.capacityInfo ||
                              ""
                            : "";
                        const img =
                          it && typeof it === "object"
                            ? it.imageUrl || it.photo || it.logoUrl || null
                            : null;

                        return (
                          <div>
                            {img && (
                              <div className="w-full h-40 mb-3 overflow-hidden rounded-lg">
                                <img
                                  src={img}
                                  alt={title}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Kapasitas:</span>{" "}
                              {capacity || "-"}
                            </p>
                            {desc && (
                              <div>
                                <h5 className="font-semibold mt-3">
                                  Deskripsi
                                </h5>
                                <p className="text-gray-700 mt-1">{desc}</p>
                              </div>
                            )}
                            <div className="mt-4">
                              <h5 className="font-semibold">Detail Lengkap</h5>
                              <div className="mt-2 text-sm text-gray-700 space-y-2">
                                {it && typeof it === "object" ? (
                                  Object.entries(it)
                                    .filter(([key]) => {
                                      const kk = String(key).toLowerCase();
                                      const hidden = [
                                        "name",
                                        "title",
                                        "imageurl",
                                        "image",
                                        "photo",
                                        "logourl",
                                      ];
                                      return !hidden.includes(kk);
                                    })
                                    .map(([key, val]) => (
                                      <div key={key} className="flex">
                                        <div className="w-36 text-xs text-gray-600">
                                          {key}
                                        </div>
                                        <div className="flex-1">
                                          {typeof val === "object"
                                            ? JSON.stringify(val)
                                            : String(val)}
                                        </div>
                                      </div>
                                    ))
                                ) : (
                                  <div className="text-gray-500">-</div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
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
