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
  Pencil,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { supabase } from "../supabaseClient";

const IKMDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showProductModal, setShowProductModal] = useState(false);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showMachineModal, setShowMachineModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const { logout, user, role } = useAuth();
  const navigate = useNavigate();

  const [saveStatus, setSaveStatus] = useState("");

  const [originalProfile, setOriginalProfile] = useState(null);

  const [showCertificationModal, setShowCertificationModal] = useState(false);
  const [editingCertificationIdx, setEditingCertificationIdx] = useState(null);
  const [newCertification, setNewCertification] = useState({
    name: "",
    year: new Date().getFullYear(),
    validity: 1,
  });

  const [showAcademicPartnershipModal, setShowAcademicPartnershipModal] =
    useState(false);
  const [editingAcademicPartnershipIdx, setEditingAcademicPartnershipIdx] =
    useState(null);
  const [newAcademicPartnership, setNewAcademicPartnership] = useState({
    academicName: "",
    institution: "",
    topic: "",
    year: new Date().getFullYear(),
    period: "",
  });

  // State for company partnership history
  const [showCompanyPartnershipModal, setShowCompanyPartnershipModal] =
    useState(false);
  const [editingCompanyPartnershipIdx, setEditingCompanyPartnershipIdx] =
    useState(null);
  const [newCompanyPartnership, setNewCompanyPartnership] = useState({
    companyName: "",
    partnerType: "",
    topic: "",
    year: new Date().getFullYear(),
    period: "",
  });

  // State for logo upload
  const [showLogoUploadModal, setShowLogoUploadModal] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // State for machine management
  const [editingMachineIdx, setEditingMachineIdx] = useState(null);
  const [newMachine, setNewMachine] = useState({
    name: "",
    image: "⚙️",
    description: "",
    specifications: "",
    quantity: 1,
    capacity: "",
    certifications: [],
  });

  // State for product management
  const [editingProductIdx, setEditingProductIdx] = useState(null);
  const [productFile, setProductFile] = useState(null);
  const [productPreview, setProductPreview] = useState(null);
  const [uploadingProduct, setUploadingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    imageUrl: null,
    description: "",
    specifications: "",
    capacity: "",
    certifications: [],
    machinesUsed: [],
  });

  // State for service management
  const [editingServiceIdx, setEditingServiceIdx] = useState(null);
  const [serviceFile, setServiceFile] = useState(null);
  const [servicePreview, setServicePreview] = useState(null);
  const [uploadingService, setUploadingService] = useState(false);
  const [newService, setNewService] = useState({
    name: "",
    imageUrl: null,
    specifications: "",
    capacity: "",
    machinesUsed: [],
  });

  // Load IKM profile from Firestore when authenticated
  useEffect(() => {
    const loadProfileFromFirestore = async () => {
      if (!user || role !== "ikm") return;
      try {
        const db = getFirestore();
        const userDocRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          // Ensure certifications is always an array of objects
          const normalizedData = {
            ...data,
            certifications: Array.isArray(data.certifications)
              ? data.certifications.every((c) => typeof c === "object")
                ? data.certifications
                : []
              : [],
            academicPartnerships: Array.isArray(data.academicPartnerships)
              ? data.academicPartnerships.every((p) => typeof p === "object")
                ? data.academicPartnerships
                : []
              : [],
            companyPartnerships: Array.isArray(data.companyPartnerships)
              ? data.companyPartnerships.every((p) => typeof p === "object")
                ? data.companyPartnerships
                : []
              : [],
            machines: Array.isArray(data.machines)
              ? data.machines.every((m) => typeof m === "object")
                ? data.machines
                : []
              : [],
            products: Array.isArray(data.products)
              ? data.products.every((p) => typeof p === "object")
                ? data.products
                : []
              : [],
            services: Array.isArray(data.services)
              ? data.services.every((s) => typeof s === "object")
                ? data.services
                : []
              : [],
          };
          // Merge with defaults to avoid missing fields
          setProfileData((prev) => ({ ...prev, ...normalizedData }));
          setOriginalProfile((prev) => ({ ...prev, ...normalizedData }));
        } else {
          // No doc yet: initialize with current state and write role/uid
          await setDoc(
            userDocRef,
            { ...profileData, role: "ikm", uid: user.uid },
            { merge: true }
          );
          setOriginalProfile(profileData);
        }
      } catch (err) {
        console.error("Error loading IKM profile:", err);
      }
    };

    loadProfileFromFirestore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, role]);

  // Profile Data State
  const [profileData, setProfileData] = useState({
    businessName: "",
    businessType: "",
    officeAddress: "",
    factoryAddress: "",
    nib: "",
    phone: "",
    kbli: "",
    logo: "🏭",
    logoUrl: "",
    establishedYear: "-",
    employees: "-",
    partnerships: [],
    certifications: [],
    bio: "-",
    website: "-",
    academicPartnerships: [],
    companyPartnerships: [],
    machines: [],
    products: [],
    services: [],
  });

  // Save profile to Firestore
  const saveProfileToFirestore = async () => {
    if (!user) return;
    try {
      setSaveStatus("Menyimpan...");
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { ...profileData, role: "ikm", uid: user.uid },
        { merge: true }
      );
      setOriginalProfile({ ...profileData });
      setSaveStatus("Tersimpan");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveStatus("Gagal menyimpan. Coba lagi.");
      setTimeout(() => setSaveStatus(""), 3000);
    }
  };

  // Save certification to Firestore immediately
  const saveCertificationToFirestore = async (updatedProfile) => {
    if (!user) return;
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { ...updatedProfile, role: "ikm", uid: user.uid },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving certification:", err);
    }
  };

  // Save academic partnership to Firestore immediately
  const saveAcademicPartnershipToFirestore = async (updatedProfile) => {
    if (!user) return;
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { ...updatedProfile, role: "ikm", uid: user.uid },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving academic partnership:", err);
    }
  };

  // Save company partnership to Firestore immediately
  const saveCompanyPartnershipToFirestore = async (updatedProfile) => {
    if (!user) return;
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { ...updatedProfile, role: "ikm", uid: user.uid },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving company partnership:", err);
    }
  };

  // Handle logo file selection
  const handleLogoFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle logo upload to Supabase
  const handleLogoUpload = async () => {
    if (!logoFile || !user) {
      alert("Mohon pilih file terlebih dahulu");
      return;
    }

    setUploading(true);
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `${user.uid}_${timestamp}_${logoFile.name}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("ikm-profile-photos")
        .upload(fileName, logoFile);

      if (error) {
        console.error("Upload error:", error);
        alert("Gagal mengupload logo. Coba lagi.");
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("ikm-profile-photos")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl;

      // Save to Firestore
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          logoUrl: publicUrl,
        },
        { merge: true }
      );

      // Update local state
      setProfileData({ ...profileData, logoUrl: publicUrl });

      // Close modal and reset
      setShowLogoUploadModal(false);
      setLogoFile(null);
      setLogoPreview(null);

      alert("Logo berhasil diupload!");
    } catch (err) {
      console.error("Error uploading logo:", err);
      alert("Terjadi kesalahan saat mengupload logo");
    } finally {
      setUploading(false);
    }
  };

  // Handle product image file selection
  const handleProductFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle product image upload to Supabase
  const handleProductImageUpload = async () => {
    if (!productFile || !user) {
      alert("Mohon pilih file terlebih dahulu");
      return;
    }

    setUploadingProduct(true);
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `products/${user.uid}_${timestamp}_${productFile.name}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("ikm-profile-photos")
        .upload(fileName, productFile);

      if (error) {
        console.error("Upload error:", error);
        alert("Gagal mengupload gambar produk. Coba lagi.");
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("ikm-profile-photos")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl;

      // Return the URL to be used in product data
      return publicUrl;
    } catch (err) {
      console.error("Error uploading product image:", err);
      alert("Terjadi kesalahan saat mengupload gambar produk");
      return null;
    } finally {
      setUploadingProduct(false);
    }
  };

  // Handle service image file selection
  const handleServiceFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setServiceFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setServicePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle service image upload to Supabase
  const handleServiceImageUpload = async () => {
    if (!serviceFile || !user) {
      alert("Mohon pilih file terlebih dahulu");
      return;
    }

    setUploadingService(true);
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const fileName = `services/${user.uid}_${timestamp}_${serviceFile.name}`;

      // Upload to Supabase Storage
      const { error } = await supabase.storage
        .from("ikm-profile-photos")
        .upload(fileName, serviceFile);

      if (error) {
        console.error("Upload error:", error);
        alert("Gagal mengupload gambar layanan. Coba lagi.");
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("ikm-profile-photos")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData?.publicUrl;

      // Return the URL to be used in service data
      return publicUrl;
    } catch (err) {
      console.error("Error uploading service image:", err);
      alert("Terjadi kesalahan saat mengupload gambar layanan");
      return null;
    } finally {
      setUploadingService(false);
    }
  };

  // Save machines to Firestore immediately
  const saveMachinesToFirestore = async (updatedProfile) => {
    if (!user) return;
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { ...updatedProfile, role: "ikm", uid: user.uid },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving machines:", err);
    }
  };

  // Save products to Firestore immediately
  const saveProductsToFirestore = async (updatedProfile) => {
    if (!user) return;
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { ...updatedProfile, role: "ikm", uid: user.uid },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving products:", err);
    }
  };

  // Save services to Firestore immediately
  const saveServicesToFirestore = async (updatedProfile) => {
    if (!user) return;
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        { ...updatedProfile, role: "ikm", uid: user.uid },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving services:", err);
    }
  };

  // Machines State
  const sidebarItems = [
    { id: "overview", label: "Beranda", icon: <Home className="w-5 h-5" /> },
    {
      id: "profile",
      label: "Profil Bisnis",
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: "machines",
      label: "Mesin & Peralatan",
      icon: <Settings className="w-5 h-5" />,
    },
    { id: "products", label: "Produk", icon: <Package className="w-5 h-5" /> },
    {
      id: "services",
      label: "Layanan",
      icon: <Settings className="w-5 h-5" />,
    },
    {
      id: "partnerships",
      label: "Kemitraan",
      icon: <Users className="w-5 h-5" />,
    },
    // {
    //   id: "ratings",
    //   label: "Rating & Ulasan",
    //   icon: <Star className="w-5 h-5" />,
    // },
  ];

  const handleProfileUpdate = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  return (
    <div>
      <Navbar />
      <div className="flex min-h-screen bg-green-50">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg hidden md:block">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center bg-white">
                {profileData?.logoUrl ? (
                  <img
                    src={profileData.logoUrl}
                    alt="Logo IKM"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, fall back to emoji
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-2xl">{profileData?.logo || "🏭"}</span>
                )}
              </div>
              <div>
                <h2
                  className="text-lg font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Dashboard IKM
                </h2>
              </div>
            </div>
            <p
              className="text-sm text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              {profileData.businessName}
            </p>
          </div>
          <nav className="px-4">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl mb-2 transition-all ${
                  activeTab === item.id
                    ? "bg-green-600 text-white shadow-lg"
                    : "text-gray-700 hover:bg-green-50"
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
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Profil Bisnis
                </h1>
                <div className="flex items-center space-x-3">
                  {saveStatus && (
                    <div
                      className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                        saveStatus.includes("Gagal")
                          ? "bg-red-100 text-red-700"
                          : saveStatus.includes("Tersimpan")
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {saveStatus}
                    </div>
                  )}
                  {!editingProfile ? (
                    <button
                      onClick={() => {
                        setOriginalProfile({ ...profileData });
                        setEditingProfile(true);
                      }}
                      className="px-6 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 font-semibold"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Edit Profil
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={async () => {
                          await saveProfileToFirestore();
                          setEditingProfile(false);
                        }}
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Simpan
                      </button>
                      <button
                        onClick={() => {
                          if (originalProfile)
                            setProfileData({ ...originalProfile });
                          setEditingProfile(false);
                        }}
                        className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Batal
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Informasi Dasar
                  </h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Logo IKM
                      </label>
                      {editingProfile ? (
                        <div className="flex flex-col items-start space-y-3">
                          <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center text-4xl border-2 border-gray-200">
                            {profileData.logoUrl ? (
                              <img
                                src={profileData.logoUrl}
                                alt="Logo IKM"
                                className="w-full h-full object-cover rounded-xl"
                              />
                            ) : (
                              profileData.logo
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setShowLogoUploadModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center space-x-2"
                          >
                            <Upload className="w-4 h-4" />
                            <span>Unggah Logo</span>
                          </button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center text-4xl border-2 border-gray-200">
                          {profileData.logoUrl ? (
                            <img
                              src={profileData.logoUrl}
                              alt="Logo IKM"
                              className="w-full h-full object-cover rounded-xl"
                            />
                          ) : (
                            profileData.logo
                          )}
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Nama Usaha
                        </label>
                        <input
                          type="text"
                          value={profileData.businessName}
                          onChange={(e) =>
                            handleProfileUpdate("businessName", e.target.value)
                          }
                          disabled={!editingProfile}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${
                            editingProfile
                              ? "border-gray-300 focus:border-green-500"
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
                          NIB (Nomor Induk Berusaha)
                        </label>
                        <input
                          type="text"
                          value={profileData.nib}
                          onChange={(e) =>
                            handleProfileUpdate("nib", e.target.value)
                          }
                          disabled={!editingProfile}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${
                            editingProfile
                              ? "border-gray-300 focus:border-green-500"
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
                          type="tel"
                          inputMode="numeric"
                          value={profileData.phone}
                          onChange={(e) => {
                            // allow only digits
                            const digits = e.target.value.replace(/\D/g, "");
                            handleProfileUpdate("phone", digits);
                          }}
                          placeholder="08123456789"
                          disabled={!editingProfile}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${
                            editingProfile
                              ? "border-gray-300 focus:border-green-500"
                              : "border-gray-200 bg-gray-50"
                          } focus:outline-none`}
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Masukkan nomor telepon (hanya angka). Disarankan
                          diawali dengan 08.
                        </p>
                      </div>
                      <div>
                        <label
                          className="block text-sm font-semibold text-gray-700 mb-2"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          KBLI
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="^\d{0,5}$"
                          maxLength={5}
                          value={profileData.kbli}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^\d{0,5}$/.test(val)) {
                              handleProfileUpdate("kbli", val);
                            }
                          }}
                          placeholder="Contoh: 24103"
                          disabled={!editingProfile}
                          className={`w-full px-4 py-3 rounded-xl border-2 ${
                            editingProfile
                              ? "border-gray-300 focus:border-green-500"
                              : "border-gray-200 bg-gray-50"
                          } focus:outline-none`}
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Isikan kode KBLI (maks. 5 digit angka).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Alamat
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Alamat Kantor
                      </label>
                      <textarea
                        value={profileData.officeAddress}
                        onChange={(e) =>
                          handleProfileUpdate("officeAddress", e.target.value)
                        }
                        disabled={!editingProfile}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                        Alamat Pabrik
                      </label>
                      <textarea
                        value={profileData.factoryAddress}
                        onChange={(e) =>
                          handleProfileUpdate("factoryAddress", e.target.value)
                        }
                        disabled={!editingProfile}
                        rows={3}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
                            : "border-gray-200 bg-gray-50"
                        } focus:outline-none`}
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Details */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Detail Perusahaan
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Tahun Berdiri
                      </label>
                      <input
                        type="number"
                        value={profileData.establishedYear}
                        onChange={(e) =>
                          handleProfileUpdate("establishedYear", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                        Jumlah Karyawan
                      </label>
                      <input
                        type="number"
                        value={profileData.employees}
                        onChange={(e) =>
                          handleProfileUpdate("employees", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                        Website
                      </label>
                      <input
                        type="text"
                        value={profileData.website}
                        onChange={(e) =>
                          handleProfileUpdate("website", e.target.value)
                        }
                        disabled={!editingProfile}
                        className={`w-full px-4 py-3 rounded-xl border-2 ${
                          editingProfile
                            ? "border-gray-300 focus:border-green-500"
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
                      Profil Singkat
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
                          ? "border-gray-300 focus:border-green-500"
                          : "border-gray-200 bg-gray-50"
                      } focus:outline-none`}
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      placeholder="Ceritakan tentang bisnis Anda..."
                    />
                  </div>
                </div>

                {/* Certifications */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Sertifikasi
                  </h2>
                  <div className="space-y-4 mb-4">
                    {Array.isArray(profileData.certifications) &&
                      profileData.certifications.map((cert, idx) => (
                        <div
                          key={idx}
                          className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 flex justify-between items-start hover:border-yellow-300 transition"
                        >
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CheckCircle className="w-5 h-5 text-yellow-600" />
                              <h3 className="font-bold text-yellow-900">
                                {cert.name}
                              </h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm text-yellow-700">
                              <p>
                                <strong>Tahun Pengajuan:</strong> {cert.year}
                              </p>
                              <p>
                                <strong>Masa Berlaku:</strong> {cert.validity}{" "}
                                tahun
                              </p>
                            </div>
                          </div>
                          {editingProfile && (
                            <div className="flex gap-2 ml-2">
                              <button
                                onClick={() => {
                                  setEditingCertificationIdx(idx);
                                  setNewCertification(cert);
                                  setShowCertificationModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
                                title="Edit sertifikasi"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={async () => {
                                  const updated = Array.isArray(
                                    profileData.certifications
                                  )
                                    ? profileData.certifications.filter(
                                        (_, i) => i !== idx
                                      )
                                    : [];
                                  const updatedProfile = {
                                    ...profileData,
                                    certifications: updated,
                                  };
                                  setProfileData(updatedProfile);
                                  // Save to Firestore immediately
                                  await saveCertificationToFirestore(
                                    updatedProfile
                                  );
                                }}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                                title="Hapus sertifikasi"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                  {editingProfile && (
                    <button
                      onClick={() => {
                        setEditingCertificationIdx(null);
                        setNewCertification({
                          name: "",
                          year: new Date().getFullYear(),
                          validity: 1,
                        });
                        setShowCertificationModal(true);
                      }}
                      className="bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      + Tambah Sertifikasi
                    </button>
                  )}
                </div>

                {/* Academic Partnerships History */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Histori Kemitraan Akademisi
                  </h2>
                  <div className="space-y-4">
                    {Array.isArray(profileData.academicPartnerships) &&
                      profileData.academicPartnerships.map(
                        (partnership, idx) => (
                          <div
                            key={idx}
                            className="border-2 border-blue-200 rounded-xl p-4 bg-blue-50 hover:border-blue-400 transition flex justify-between items-start"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3
                                  className="font-bold text-blue-900"
                                  style={{
                                    fontFamily: "Montserrat, sans-serif",
                                  }}
                                >
                                  {partnership.institution}
                                </h3>
                              </div>
                              <p
                                className="text-sm text-blue-700 mb-2"
                                style={{ fontFamily: "Open Sans, sans-serif" }}
                              >
                                <strong>Topik:</strong> {partnership.topic}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                                <p>
                                  <strong>Tahun:</strong> {partnership.year}
                                </p>
                                <p>
                                  <strong>Periode:</strong> {partnership.period}
                                </p>
                              </div>
                            </div>
                            {editingProfile && (
                              <div className="flex gap-2 ml-2">
                                <button
                                  onClick={() => {
                                    setEditingAcademicPartnershipIdx(idx);
                                    setNewAcademicPartnership(partnership);
                                    setShowAcademicPartnershipModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
                                  title="Edit kemitraan akademisi"
                                >
                                  <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    const updated = Array.isArray(
                                      profileData.academicPartnerships
                                    )
                                      ? profileData.academicPartnerships.filter(
                                          (_, i) => i !== idx
                                        )
                                      : [];
                                    const updatedProfile = {
                                      ...profileData,
                                      academicPartnerships: updated,
                                    };
                                    setProfileData(updatedProfile);
                                    // Save to Firestore immediately
                                    await saveAcademicPartnershipToFirestore(
                                      updatedProfile
                                    );
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                                  title="Hapus kemitraan akademisi"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      )}
                  </div>
                  {editingProfile && (
                    <button
                      onClick={() => {
                        setEditingAcademicPartnershipIdx(null);
                        setNewAcademicPartnership({
                          academicName: "",
                          institution: "",
                          topic: "",
                          year: new Date().getFullYear(),
                          period: "",
                        });
                        setShowAcademicPartnershipModal(true);
                      }}
                      className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                      + Tambah Histori Kemitraan
                    </button>
                  )}
                </div>

                {/* Company Partnerships History */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mt-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Histori Kemitraan Perusahaan
                  </h2>
                  <div className="space-y-4">
                    {Array.isArray(profileData.companyPartnerships) &&
                      profileData.companyPartnerships.map(
                        (partnership, idx) => (
                          <div
                            key={idx}
                            className="border-2 border-green-200 rounded-xl p-4 bg-green-50 hover:border-green-400 transition flex justify-between items-start"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3
                                  className="font-bold text-green-900"
                                  style={{
                                    fontFamily: "Montserrat, sans-serif",
                                  }}
                                >
                                  {partnership.companyName}
                                </h3>
                              </div>
                              <p
                                className="text-sm text-green-700 mb-2"
                                style={{ fontFamily: "Open Sans, sans-serif" }}
                              >
                                <strong>Topik:</strong> {partnership.topic}
                              </p>
                              <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                                <p>
                                  <strong>Tahun:</strong> {partnership.year}
                                </p>
                                <p>
                                  <strong>Periode:</strong> {partnership.period}
                                </p>
                              </div>
                            </div>
                            {editingProfile && (
                              <div className="flex gap-2 ml-2">
                                <button
                                  onClick={() => {
                                    setEditingCompanyPartnershipIdx(idx);
                                    setNewCompanyPartnership(partnership);
                                    setShowCompanyPartnershipModal(true);
                                  }}
                                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition"
                                  title="Edit kemitraan perusahaan"
                                >
                                  <Pencil className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={async () => {
                                    const updated = Array.isArray(
                                      profileData.companyPartnerships
                                    )
                                      ? profileData.companyPartnerships.filter(
                                          (_, i) => i !== idx
                                        )
                                      : [];
                                    const updatedProfile = {
                                      ...profileData,
                                      companyPartnerships: updated,
                                    };
                                    setProfileData(updatedProfile);
                                    // Save to Firestore immediately
                                    await saveCompanyPartnershipToFirestore(
                                      updatedProfile
                                    );
                                  }}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                                  title="Hapus kemitraan perusahaan"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      )}
                  </div>
                  {editingProfile && (
                    <button
                      onClick={() => {
                        setEditingCompanyPartnershipIdx(null);
                        setNewCompanyPartnership({
                          companyName: "",
                          partnerType: "",
                          topic: "",
                          year: new Date().getFullYear(),
                          period: "",
                        });
                        setShowCompanyPartnershipModal(true);
                      }}
                      className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      + Tambah Histori Kemitraan Perusahaan
                    </button>
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
                      onClick={() => {
                        setEditingProfile(false);
                        alert("Profil berhasil diperbarui!");
                      }}
                      className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kelola Produk
                </h1>
                <button
                  onClick={() => {
                    setEditingProductIdx(null);
                    setProductFile(null);
                    setProductPreview(null);
                    setNewProduct({
                      name: "",
                      imageUrl: null,
                      description: "",
                      specifications: "",
                      capacity: "",
                      certifications: [],
                      machinesUsed: [],
                    });
                    setShowProductModal(true);
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Tambah Produk</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileData.products && profileData.products.length > 0 ? (
                  profileData.products.map((product, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
                    >
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="w-full h-40 object-cover rounded-xl mb-4"
                        />
                      ) : (
                        <div className="w-full h-40 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center text-6xl mb-4">
                          📦
                        </div>
                      )}
                      <h3
                        className="text-lg font-bold text-gray-800 mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {product.name}
                      </h3>
                      <p
                        className="text-sm text-gray-600 mb-3"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        {product.description}
                      </p>
                      <div className="text-xs text-gray-500 mb-3">
                        <p className="mb-1">
                          <strong>Spesifikasi:</strong> {product.specifications}
                        </p>
                        <p>
                          <strong>Kapasitas:</strong> {product.capacity}
                        </p>
                      </div>
                      {product.machinesUsed &&
                        product.machinesUsed.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                              <strong>Mesin yang Digunakan:</strong>
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {product.machinesUsed.map((machine, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-semibold"
                                >
                                  ⚙️ {machine}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      {product.certifications &&
                        product.certifications.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {product.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold"
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                        )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingProductIdx(index);
                            setNewProduct(product);
                            setProductFile(null);
                            setProductPreview(null);
                            setShowProductModal(true);
                          }}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-1"
                        >
                          <Pencil className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                "Apakah Anda yakin ingin menghapus produk ini?"
                              )
                            ) {
                              const updatedProducts =
                                profileData.products.filter(
                                  (_, i) => i !== index
                                );
                              const updatedProfile = {
                                ...profileData,
                                products: updatedProducts,
                              };
                              setProfileData(updatedProfile);
                              await saveProductsToFirestore(updatedProfile);
                            }
                          }}
                          className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition flex items-center justify-center space-x-1"
                        >
                          <X className="w-4 h-4" />
                          <span>Hapus</span>
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p
                      className="text-gray-500 text-lg"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Belum ada Produk. Klik "Tambah Produk" untuk menambah.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Services Tab */}
          {activeTab === "services" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Kelola Layanan
                </h1>
                <button
                  onClick={() => setShowServiceModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Tambah Layanan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profileData.services && profileData.services.length > 0 ? (
                  profileData.services.map((service, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
                    >
                      {service.imageUrl ? (
                        <img
                          src={service.imageUrl}
                          alt={service.name}
                          className="w-full h-48 object-cover rounded-xl mb-4"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center text-6xl mb-4">
                          🔧
                        </div>
                      )}
                      <h3
                        className="text-lg font-bold text-gray-800 mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {service.name}
                      </h3>
                      <p
                        className="text-sm text-gray-600 mb-3"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        {service.specifications}
                      </p>
                      <p
                        className="text-xs text-gray-500 mb-3"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        <strong>Kapasitas:</strong> {service.capacity}
                      </p>
                      {service.machinesUsed &&
                        service.machinesUsed.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-3">
                            {service.machinesUsed.map((machine, midx) => (
                              <span
                                key={midx}
                                className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold"
                              >
                                {machine}
                              </span>
                            ))}
                          </div>
                        )}
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setEditingServiceIdx(idx);
                            setNewService(service);
                            setShowServiceModal(true);
                          }}
                          className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (
                              window.confirm(
                                "Apakah Anda yakin ingin menghapus layanan ini?"
                              )
                            ) {
                              const updatedServices =
                                profileData.services.filter(
                                  (_, i) => i !== idx
                                );
                              const updatedProfile = {
                                ...profileData,
                                services: updatedServices,
                              };
                              setProfileData(updatedProfile);
                              await saveServicesToFirestore(updatedProfile);
                            }
                          }}
                          className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p
                      className="text-gray-500 text-lg"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Belum ada layanan. Klik "Tambah Layanan" untuk menambah.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Machines Tab */}
          {activeTab === "machines" && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h1
                  className="text-3xl font-bold text-gray-800"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Mesin & Peralatan
                </h1>
                <button
                  onClick={() => {
                    setEditingMachineIdx(null);
                    setNewMachine({
                      name: "",
                      image: "⚙️",
                      description: "",
                      specifications: "",
                      quantity: 1,
                      capacity: "",
                      certifications: [],
                    });
                    setShowMachineModal(true);
                  }}
                  className="bg-green-600 text-white px-6 py-3 rounded-2xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Upload className="w-5 h-5" />
                  <span>Tambah Mesin</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.isArray(profileData.machines) &&
                profileData.machines.length > 0 ? (
                  profileData.machines.map((machine, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-24 h-24 bg-gradient-to-br from-gray-700 to-gray-600 rounded-xl flex items-center justify-center text-4xl flex-shrink-0">
                          {machine.image}
                        </div>
                        <div className="flex-1">
                          <h3
                            className="text-lg font-bold text-gray-800 mb-2"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {machine.name}
                          </h3>
                          <p
                            className="text-sm text-gray-600 mb-3"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {machine.description}
                          </p>
                          <div className="text-xs text-gray-500 mb-3 space-y-1">
                            <p>
                              <strong>Spesifikasi:</strong>{" "}
                              {machine.specifications}
                            </p>
                            <p>
                              <strong>Jumlah:</strong> {machine.quantity} unit
                            </p>
                            <p>
                              <strong>Kapasitas:</strong> {machine.capacity}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => {
                                setEditingMachineIdx(idx);
                                setNewMachine(machine);
                                setShowMachineModal(true);
                              }}
                              className="flex-1 bg-blue-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition"
                            >
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    "Apakah Anda yakin ingin menghapus mesin ini?"
                                  )
                                ) {
                                  // Ambil nama mesin yang akan dihapus
                                  const deletedMachine =
                                    profileData.machines[idx]?.name;
                                  // Hapus mesin dari array mesin
                                  const updatedMachines = Array.isArray(
                                    profileData.machines
                                  )
                                    ? profileData.machines.filter(
                                        (_, i) => i !== idx
                                      )
                                    : [];
                                  // Hapus referensi mesin dari produk
                                  const updatedProducts = Array.isArray(
                                    profileData.products
                                  )
                                    ? profileData.products.map((product) => ({
                                        ...product,
                                        machinesUsed: Array.isArray(
                                          product.machinesUsed
                                        )
                                          ? product.machinesUsed.filter(
                                              (m) => m !== deletedMachine
                                            )
                                          : [],
                                      }))
                                    : [];
                                  // Hapus referensi mesin dari layanan
                                  const updatedServices = Array.isArray(
                                    profileData.services
                                  )
                                    ? profileData.services.map((service) => ({
                                        ...service,
                                        machinesUsed: Array.isArray(
                                          service.machinesUsed
                                        )
                                          ? service.machinesUsed.filter(
                                              (m) => m !== deletedMachine
                                            )
                                          : [],
                                      }))
                                    : [];
                                  // Update profile
                                  const updatedProfile = {
                                    ...profileData,
                                    machines: updatedMachines,
                                    products: updatedProducts,
                                    services: updatedServices,
                                  };
                                  setProfileData(updatedProfile);
                                  // Update Firestore
                                  await saveMachinesToFirestore(updatedProfile);
                                  await saveProductsToFirestore(updatedProfile);
                                  await saveServicesToFirestore(updatedProfile);
                                }
                              }}
                              className="flex-1 bg-red-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                            >
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <p
                      className="text-gray-500 text-lg"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Belum ada Mesin. Klik "Tambah Mesin" untuk menambah.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Overview Tab - Keep existing overview content */}
          {activeTab === "overview" && (
            <div>
              <h1
                className="text-3xl font-bold text-gray-800 mb-8"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Selamat Datang Kembali! 👋
              </h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Package className="w-8 h-8 text-green-600" />
                    <span className="text-green-600 text-sm font-semibold">
                      +12%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {profileData.products?.length || 0}
                  </h3>
                  <p className="text-gray-600 text-sm">Produk Aktif</p>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Settings className="w-8 h-8 text-blue-600" />
                    <span className="text-blue-600 text-sm font-semibold">
                      +5%
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">
                    {profileData.services?.length || 0}
                  </h3>
                  <p className="text-gray-600 text-sm">Layanan Aktif</p>
                </div>
                {/* <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="w-8 h-8 text-yellow-500" />
                    <span className="text-green-600 text-sm font-semibold">
                      Bagus
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1">4.8</h3>
                  <p className="text-gray-600 text-sm">Rating Rata-rata</p>
                </div> */}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                <h2
                  className="text-xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Aksi Cepat
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Building2 className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lengkapi Profil
                    </h3>
                    <p className="text-sm text-green-50">
                      Update informasi bisnis Anda
                    </p>
                  </button>
                  <button
                    onClick={() => setShowMachineModal(true)}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Settings className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tambah Mesin & Peralatan
                    </h3>
                    <p className="text-sm text-green-50">
                      Upload mesin & peralatan Anda
                    </p>
                  </button>
                  <button
                    onClick={() => setShowProductModal(true)}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Package className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tambah Produk
                    </h3>
                    <p className="text-sm text-blue-50">
                      Upload produk baru Anda
                    </p>
                  </button>
                  <button
                    onClick={() => setShowServiceModal(true)}
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-xl hover:shadow-lg transition text-left"
                  >
                    <Settings className="w-8 h-8 mb-3" />
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tambah Layanan
                    </h3>
                    <p className="text-sm text-yellow-50">
                      Daftarkan layanan Anda
                    </p>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        <>
          {/* Logo Upload Modal */}
          {showLogoUploadModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowLogoUploadModal(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2
                      className="text-2xl font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Unggah Logo
                    </h2>
                    <button
                      onClick={() => {
                        setShowLogoUploadModal(false);
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                      className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* File Input */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Pilih Gambar Logo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoFileChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={uploading}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Format: PNG, JPG, GIF (Max 500 KB)
                    </p>
                  </div>

                  {/* Preview */}
                  {logoPreview && (
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Pratinjau Logo
                      </label>
                      <div className="w-full h-40 bg-gray-100 rounded-xl border-2 border-gray-300 flex items-center justify-center overflow-hidden">
                        <img
                          src={logoPreview}
                          alt="Preview"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowLogoUploadModal(false);
                        setLogoFile(null);
                        setLogoPreview(null);
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      disabled={uploading}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      onClick={handleLogoUpload}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      disabled={uploading || !logoFile}
                    >
                      {uploading ? "Mengunggah..." : "Unggah"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Product Modal */}
          {showProductModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowProductModal(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2
                      className="text-2xl font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {editingProductIdx !== null
                        ? "Edit Produk"
                        : "Tambah Produk Baru"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowProductModal(false);
                        setEditingProductIdx(null);
                      }}
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
                    if (
                      !newProduct.name ||
                      !newProduct.description ||
                      !newProduct.specifications ||
                      !newProduct.capacity
                    ) {
                      alert("Mohon isi semua field yang diperlukan");
                      return;
                    }

                    let imageUrl = newProduct.imageUrl;
                    // If a new file is selected, upload it
                    if (productFile && editingProductIdx === null) {
                      imageUrl = await handleProductImageUpload();
                      if (!imageUrl) {
                        alert("Gagal mengupload gambar produk");
                        return;
                      }
                    } else if (productFile && editingProductIdx !== null) {
                      // For editing, upload new image if provided
                      imageUrl = await handleProductImageUpload();
                      if (!imageUrl) {
                        alert("Gagal mengupload gambar produk");
                        return;
                      }
                    }

                    let updatedProfile;
                    if (editingProductIdx !== null) {
                      // Edit mode
                      const updatedProducts = [...profileData.products];
                      updatedProducts[editingProductIdx] = {
                        ...newProduct,
                        imageUrl: imageUrl,
                      };
                      updatedProfile = {
                        ...profileData,
                        products: updatedProducts,
                      };
                    } else {
                      // Add mode
                      updatedProfile = {
                        ...profileData,
                        products: [
                          ...profileData.products,
                          { ...newProduct, imageUrl: imageUrl },
                        ],
                      };
                    }

                    setProfileData(updatedProfile);
                    // Save to Firestore immediately
                    await saveProductsToFirestore(updatedProfile);
                    setShowProductModal(false);
                    setEditingProductIdx(null);
                    setProductFile(null);
                    setProductPreview(null);
                    setNewProduct({
                      name: "",
                      imageUrl: null,
                      description: "",
                      specifications: "",
                      capacity: "",
                      certifications: [],
                      machinesUsed: [],
                    });
                  }}
                >
                  {/* Image Upload */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Gambar Produk{" "}
                      {editingProductIdx === null && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {productPreview ? (
                      <div className="relative">
                        <img
                          src={productPreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-xl mb-3"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setProductFile(null);
                            setProductPreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : newProduct.imageUrl ? (
                      <div className="relative">
                        <img
                          src={newProduct.imageUrl}
                          alt="Product"
                          className="w-full h-40 object-cover rounded-xl mb-3"
                        />
                        <button
                          type="button"
                          onClick={() => setProductFile({ name: "new" })}
                          className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                          Ganti Gambar
                        </button>
                      </div>
                    ) : null}
                    <label
                      htmlFor="productImageInput"
                      className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition cursor-pointer"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p
                        className="text-gray-600 mb-2"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Klik untuk upload atau drag & drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (Max 500 KB)
                      </p>
                    </label>
                    <input
                      id="productImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleProductFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Product Name */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Nama Produk <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          name: e.target.value,
                        })
                      }
                      placeholder="Contoh: Kursi Jati Minimalis"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Deskripsi Produk <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newProduct.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      rows={4}
                      placeholder="Jelaskan produk Anda secara detail..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Specifications */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Spesifikasi Produk <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newProduct.specifications}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          specifications: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Contoh: Dimensi: 50x50x90cm, Material: Kayu Jati Grade A, Berat: 15kg"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Machines Used */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Mesin yang Digunakan
                    </label>
                    {profileData.machines && profileData.machines.length > 0 ? (
                      <div className="space-y-2">
                        {profileData.machines.map((machine, idx) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl hover:border-yellow-400 transition cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={newProduct.machinesUsed.includes(
                                machine.name
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewProduct({
                                    ...newProduct,
                                    machinesUsed: [
                                      ...newProduct.machinesUsed,
                                      machine.name,
                                    ],
                                  });
                                } else {
                                  setNewProduct({
                                    ...newProduct,
                                    machinesUsed:
                                      newProduct.machinesUsed.filter(
                                        (m) => m !== machine.name
                                      ),
                                  });
                                }
                              }}
                              className="w-4 h-4 rounded cursor-pointer"
                            />
                            <div className="flex-1">
                              <p
                                className="font-semibold text-gray-700"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                {machine.name}
                              </p>
                              <p
                                className="text-xs text-gray-500"
                                style={{ fontFamily: "Open Sans, sans-serif" }}
                              >
                                Kapasitas: {machine.capacity} | Jumlah:{" "}
                                {machine.quantity}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                        <p
                          className="text-sm text-blue-700"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          ⚠️{" "}
                          <strong>
                            Harap tambahkan mesin terlebih dahulu apabila tidak
                            terdapat pilihan mesin
                          </strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Production Capacity */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Kapasitas Produksi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newProduct.capacity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          capacity: e.target.value,
                        })
                      }
                      placeholder="Contoh: 100 unit/bulan"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Certifications */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Sertifikasi Produk
                    </label>
                    <input
                      type="text"
                      value={newProduct.certifications.join(", ")}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          certifications: e.target.value
                            ? e.target.value.split(",").map((s) => s.trim())
                            : [],
                        })
                      }
                      placeholder="Contoh: SNI, ISO 9001 (pisahkan dengan koma)"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowProductModal(false);
                        setEditingProductIdx(null);
                        setProductFile(null);
                        setProductPreview(null);
                        setNewProduct({
                          name: "",
                          imageUrl: null,
                          description: "",
                          specifications: "",
                          capacity: "",
                          certifications: [],
                          machinesUsed: [],
                        });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingProduct}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {uploadingProduct
                        ? "Mengupload..."
                        : editingProductIdx !== null
                        ? "Update Produk"
                        : "Simpan Produk"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Service Modal */}
          {showServiceModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowServiceModal(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2
                      className="text-2xl font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {editingServiceIdx !== null
                        ? "Edit Layanan"
                        : "Tambah Layanan Baru"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowServiceModal(false);
                        setEditingServiceIdx(null);
                      }}
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
                    if (
                      !newService.name ||
                      !newService.specifications ||
                      !newService.capacity
                    ) {
                      alert("Mohon isi semua field yang diperlukan");
                      return;
                    }

                    let imageUrl = newService.imageUrl;
                    // If a new file is selected, upload it
                    if (serviceFile && editingServiceIdx === null) {
                      imageUrl = await handleServiceImageUpload();
                      if (!imageUrl) {
                        alert("Gagal mengupload gambar layanan");
                        return;
                      }
                    } else if (serviceFile && editingServiceIdx !== null) {
                      // For editing, upload new image if provided
                      imageUrl = await handleServiceImageUpload();
                      if (!imageUrl) {
                        alert("Gagal mengupload gambar layanan");
                        return;
                      }
                    }

                    let updatedProfile;
                    if (editingServiceIdx !== null) {
                      // Edit mode
                      const updatedServices = [...profileData.services];
                      updatedServices[editingServiceIdx] = {
                        ...newService,
                        imageUrl: imageUrl,
                      };
                      updatedProfile = {
                        ...profileData,
                        services: updatedServices,
                      };
                    } else {
                      // Add mode
                      updatedProfile = {
                        ...profileData,
                        services: [
                          ...profileData.services,
                          { ...newService, imageUrl: imageUrl },
                        ],
                      };
                    }

                    setProfileData(updatedProfile);
                    // Save to Firestore immediately
                    await saveServicesToFirestore(updatedProfile);
                    setShowServiceModal(false);
                    setEditingServiceIdx(null);
                    setServiceFile(null);
                    setServicePreview(null);
                    setNewService({
                      name: "",
                      imageUrl: null,
                      specifications: "",
                      capacity: "",
                      machinesUsed: [],
                    });
                  }}
                >
                  {/* Image Upload */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Gambar Layanan{" "}
                      {editingServiceIdx === null && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>
                    {servicePreview ? (
                      <div className="relative">
                        <img
                          src={servicePreview}
                          alt="Preview"
                          className="w-full h-40 object-cover rounded-xl mb-3"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setServiceFile(null);
                            setServicePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : newService.imageUrl ? (
                      <div className="relative">
                        <img
                          src={newService.imageUrl}
                          alt="Service"
                          className="w-full h-40 object-cover rounded-xl mb-3"
                        />
                        <button
                          type="button"
                          onClick={() => setServiceFile({ name: "new" })}
                          className="mt-2 w-full px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition"
                        >
                          Ganti Gambar
                        </button>
                      </div>
                    ) : null}
                    <label
                      htmlFor="serviceImageInput"
                      className="block border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition cursor-pointer"
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p
                        className="text-gray-600 mb-2"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Klik untuk upload atau drag & drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG (Max 5MB)
                      </p>
                    </label>
                    <input
                      id="serviceImageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleServiceFileChange}
                      className="hidden"
                    />
                  </div>

                  {/* Service Name */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Nama Layanan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newService.name}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          name: e.target.value,
                        })
                      }
                      placeholder="Contoh: Jasa Custom Design Furniture"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Specifications */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Spesifikasi Layanan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newService.specifications}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          specifications: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Contoh: Lead time: 2-4 minggu, Min. order: 10 unit, Free konsultasi desain"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Machines Used */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Mesin yang Digunakan
                    </label>
                    {profileData.machines && profileData.machines.length > 0 ? (
                      <div className="space-y-2">
                        {profileData.machines.map((machine, idx) => (
                          <label
                            key={idx}
                            className="flex items-center space-x-3 p-3 border-2 border-gray-200 rounded-xl hover:border-green-400 transition cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={newService.machinesUsed.includes(
                                machine.name
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewService({
                                    ...newService,
                                    machinesUsed: [
                                      ...newService.machinesUsed,
                                      machine.name,
                                    ],
                                  });
                                } else {
                                  setNewService({
                                    ...newService,
                                    machinesUsed:
                                      newService.machinesUsed.filter(
                                        (m) => m !== machine.name
                                      ),
                                  });
                                }
                              }}
                              className="w-4 h-4 rounded cursor-pointer"
                            />
                            <div className="flex-1">
                              <p
                                className="font-semibold text-gray-700"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                {machine.name}
                              </p>
                              <p
                                className="text-xs text-gray-500"
                                style={{ fontFamily: "Open Sans, sans-serif" }}
                              >
                                Kapasitas: {machine.capacity} | Jumlah:{" "}
                                {machine.quantity}
                              </p>
                            </div>
                          </label>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
                        <p
                          className="text-sm text-blue-700"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          ⚠️{" "}
                          <strong>
                            Harap tambahkan mesin terlebih dahulu apabila tidak
                            terdapat pilihan mesin
                          </strong>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Capacity */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Kapasitas Layanan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newService.capacity}
                      onChange={(e) =>
                        setNewService({
                          ...newService,
                          capacity: e.target.value,
                        })
                      }
                      placeholder="Contoh: 50 desain/bulan"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowServiceModal(false);
                        setEditingServiceIdx(null);
                        setServiceFile(null);
                        setServicePreview(null);
                        setNewService({
                          name: "",
                          imageUrl: null,
                          specifications: "",
                          capacity: "",
                          machinesUsed: [],
                        });
                      }}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingService}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {uploadingService
                        ? "Mengupload..."
                        : editingServiceIdx !== null
                        ? "Update Layanan"
                        : "Simpan Layanan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Add Machine Modal */}
          {showMachineModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowMachineModal(false)}
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
                      {editingMachineIdx !== null
                        ? "Edit Mesin & Peralatan"
                        : "Tambah Mesin & Peralatan"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowMachineModal(false);
                        setEditingMachineIdx(null);
                      }}
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
                    if (
                      !newMachine.name ||
                      !newMachine.description ||
                      !newMachine.specifications ||
                      !newMachine.quantity ||
                      !newMachine.capacity
                    ) {
                      alert("Mohon isi semua field yang diperlukan");
                      return;
                    }

                    let updatedProfile;
                    if (editingMachineIdx !== null) {
                      // Edit mode
                      const updatedMachines = [...profileData.machines];
                      updatedMachines[editingMachineIdx] = newMachine;
                      updatedProfile = {
                        ...profileData,
                        machines: updatedMachines,
                      };
                    } else {
                      // Add mode
                      updatedProfile = {
                        ...profileData,
                        machines: [...profileData.machines, newMachine],
                      };
                    }

                    setProfileData(updatedProfile);
                    // Save to Firestore immediately
                    await saveMachinesToFirestore(updatedProfile);
                    setShowMachineModal(false);
                    setEditingMachineIdx(null);
                    setNewMachine({
                      name: "",
                      image: "⚙️",
                      description: "",
                      specifications: "",
                      quantity: 1,
                      capacity: "",
                      certifications: [],
                    });
                  }}
                >
                  {/* Machine Name */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Nama Mesin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newMachine.name}
                      onChange={(e) =>
                        setNewMachine({
                          ...newMachine,
                          name: e.target.value,
                        })
                      }
                      placeholder="Contoh: CNC Router Machine"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Fungsi Mesin <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newMachine.description}
                      onChange={(e) =>
                        setNewMachine({
                          ...newMachine,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Jelaskan fungsi dan kegunaan mesin..."
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Specifications */}
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Spesifikasi Mesin <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newMachine.specifications}
                      onChange={(e) =>
                        setNewMachine({
                          ...newMachine,
                          specifications: e.target.value,
                        })
                      }
                      rows={3}
                      placeholder="Contoh: Working area: 2000x3000mm, Spindle power: 6kW, Max speed: 24000 RPM"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  {/* Quantity and Capacity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Jumlah Unit <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newMachine.quantity}
                        onChange={(e) =>
                          setNewMachine({
                            ...newMachine,
                            quantity: parseInt(e.target.value) || 1,
                          })
                        }
                        placeholder="2"
                        min="1"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Kapasitas Mesin <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newMachine.capacity}
                        onChange={(e) =>
                          setNewMachine({
                            ...newMachine,
                            capacity: e.target.value,
                          })
                        }
                        placeholder="50 panel/hari"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                        required
                      />
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowMachineModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Simpan Mesin
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Certification Modal */}
          {showCertificationModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCertificationModal(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2
                      className="text-2xl font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {editingCertificationIdx !== null
                        ? "Edit Sertifikasi"
                        : "Tambah Sertifikasi"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowCertificationModal(false);
                        setEditingCertificationIdx(null);
                      }}
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
                    if (
                      !newCertification.name ||
                      newCertification.validity < 1
                    ) {
                      alert("Mohon isi semua field dengan benar");
                      return;
                    }

                    let updatedProfile;
                    if (editingCertificationIdx !== null) {
                      // Edit mode
                      const updatedCertifications = [
                        ...profileData.certifications,
                      ];
                      updatedCertifications[editingCertificationIdx] =
                        newCertification;
                      updatedProfile = {
                        ...profileData,
                        certifications: updatedCertifications,
                      };
                    } else {
                      // Add mode
                      updatedProfile = {
                        ...profileData,
                        certifications: [
                          ...profileData.certifications,
                          newCertification,
                        ],
                      };
                    }

                    setProfileData(updatedProfile);
                    // Save to Firestore immediately
                    await saveCertificationToFirestore(updatedProfile);
                    setShowCertificationModal(false);
                    setEditingCertificationIdx(null);
                    setNewCertification({
                      name: "",
                      year: new Date().getFullYear(),
                      validity: 1,
                    });
                  }}
                >
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Nama Sertifikasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCertification.name}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          name: e.target.value,
                        })
                      }
                      placeholder="Contoh: SNI, ISO 9001, SVLK"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tahun Pengajuan Sertifikasi{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newCertification.year}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          year:
                            parseInt(e.target.value) ||
                            new Date().getFullYear(),
                        })
                      }
                      min="1900"
                      max={new Date().getFullYear()}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Masa Berlaku (tahun){" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={newCertification.validity}
                      onChange={(e) =>
                        setNewCertification({
                          ...newCertification,
                          validity: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      min="1"
                      max="20"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Masukkan berapa tahun masa berlaku sertifikasi ini.
                    </p>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCertificationModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-white rounded-xl font-semibold hover:shadow-lg transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Simpan Sertifikasi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Academic Partnership Modal */}
          {/* Company Partnership Modal */}
          {showCompanyPartnershipModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowCompanyPartnershipModal(false)}
            >
              <div
                className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-500 text-white p-6 rounded-t-2xl">
                  <div className="flex justify-between items-center">
                    <h2
                      className="text-2xl font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {editingCompanyPartnershipIdx !== null
                        ? "Edit Histori Kemitraan Perusahaan"
                        : "Tambah Histori Kemitraan Perusahaan"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowCompanyPartnershipModal(false);
                        setEditingCompanyPartnershipIdx(null);
                      }}
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
                    if (
                      !newCompanyPartnership.companyName ||
                      !newCompanyPartnership.partnerType ||
                      !newCompanyPartnership.topic ||
                      !newCompanyPartnership.period
                    ) {
                      alert("Mohon isi semua field dengan benar");
                      return;
                    }

                    let updatedProfile;
                    if (editingCompanyPartnershipIdx !== null) {
                      // Edit mode
                      const updatedPartnerships = [
                        ...profileData.companyPartnerships,
                      ];
                      updatedPartnerships[editingCompanyPartnershipIdx] =
                        newCompanyPartnership;
                      updatedProfile = {
                        ...profileData,
                        companyPartnerships: updatedPartnerships,
                      };
                    } else {
                      // Add mode
                      updatedProfile = {
                        ...profileData,
                        companyPartnerships: [
                          ...profileData.companyPartnerships,
                          newCompanyPartnership,
                        ],
                      };
                    }

                    setProfileData(updatedProfile);
                    // Save to Firestore immediately
                    await saveCompanyPartnershipToFirestore(updatedProfile);
                    setShowCompanyPartnershipModal(false);
                    setEditingCompanyPartnershipIdx(null);
                    setNewCompanyPartnership({
                      companyName: "",
                      partnerType: "",
                      topic: "",
                      year: new Date().getFullYear(),
                      period: "",
                    });
                  }}
                >
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Nama Perusahaan <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newCompanyPartnership.companyName}
                      onChange={(e) =>
                        setNewCompanyPartnership({
                          ...newCompanyPartnership,
                          companyName: e.target.value,
                        })
                      }
                      placeholder="Contoh: PT Mitra Jaya Abadi"
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
                      Deskripsi/Topik Kemitraan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newCompanyPartnership.topic}
                      onChange={(e) =>
                        setNewCompanyPartnership({
                          ...newCompanyPartnership,
                          topic: e.target.value,
                        })
                      }
                      placeholder="Contoh: Pengembangan Produk Baru"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Tahun Kemitraan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newCompanyPartnership.year}
                        onChange={(e) =>
                          setNewCompanyPartnership({
                            ...newCompanyPartnership,
                            year:
                              parseInt(e.target.value) ||
                              new Date().getFullYear(),
                          })
                        }
                        min="1900"
                        max={new Date().getFullYear()}
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
                        Periode Kemitraan{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newCompanyPartnership.period}
                        onChange={(e) =>
                          setNewCompanyPartnership({
                            ...newCompanyPartnership,
                            period: e.target.value,
                          })
                        }
                        placeholder="Contoh: 6 bulan, 1 tahun"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowCompanyPartnershipModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold hover:shadow-lg transition"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Simpan Kemitraan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {showAcademicPartnershipModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowAcademicPartnershipModal(false)}
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
                      {editingAcademicPartnershipIdx !== null
                        ? "Edit Histori Kemitraan Akademisi"
                        : "Tambah Histori Kemitraan Akademisi"}
                    </h2>
                    <button
                      onClick={() => {
                        setShowAcademicPartnershipModal(false);
                        setEditingAcademicPartnershipIdx(null);
                      }}
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
                    if (
                      !newAcademicPartnership.academicName ||
                      !newAcademicPartnership.institution ||
                      !newAcademicPartnership.topic ||
                      !newAcademicPartnership.period
                    ) {
                      alert("Mohon isi semua field dengan benar");
                      return;
                    }

                    let updatedProfile;
                    if (editingAcademicPartnershipIdx !== null) {
                      // Edit mode
                      const updatedPartnerships = [
                        ...profileData.academicPartnerships,
                      ];
                      updatedPartnerships[editingAcademicPartnershipIdx] =
                        newAcademicPartnership;
                      updatedProfile = {
                        ...profileData,
                        academicPartnerships: updatedPartnerships,
                      };
                    } else {
                      // Add mode
                      updatedProfile = {
                        ...profileData,
                        academicPartnerships: [
                          ...profileData.academicPartnerships,
                          newAcademicPartnership,
                        ],
                      };
                    }

                    setProfileData(updatedProfile);
                    // Save to Firestore immediately
                    await saveAcademicPartnershipToFirestore(updatedProfile);
                    setShowAcademicPartnershipModal(false);
                    setEditingAcademicPartnershipIdx(null);
                    setNewAcademicPartnership({
                      academicName: "",
                      institution: "",
                      topic: "",
                      year: new Date().getFullYear(),
                      period: "",
                    });
                  }}
                >
                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Nama Akademisi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAcademicPartnership.academicName}
                      onChange={(e) =>
                        setNewAcademicPartnership({
                          ...newAcademicPartnership,
                          academicName: e.target.value,
                        })
                      }
                      placeholder="Contoh: Dr. Budi Santoso"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Institusi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={newAcademicPartnership.institution}
                      onChange={(e) =>
                        setNewAcademicPartnership({
                          ...newAcademicPartnership,
                          institution: e.target.value,
                        })
                      }
                      placeholder="Contoh: ITB, UGM, UI"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  <div>
                    <label
                      className="block text-sm font-semibold text-gray-700 mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Deskripsi/Topik Kemitraan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      value={newAcademicPartnership.topic}
                      onChange={(e) =>
                        setNewAcademicPartnership({
                          ...newAcademicPartnership,
                          topic: e.target.value,
                        })
                      }
                      placeholder="Contoh: Optimalisasi UV Coating"
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Tahun Kemitraan <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={newAcademicPartnership.year}
                        onChange={(e) =>
                          setNewAcademicPartnership({
                            ...newAcademicPartnership,
                            year:
                              parseInt(e.target.value) ||
                              new Date().getFullYear(),
                          })
                        }
                        min="1900"
                        max={new Date().getFullYear()}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                        required
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-semibold text-gray-700 mb-2"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        Periode Kemitraan{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={newAcademicPartnership.period}
                        onChange={(e) =>
                          setNewAcademicPartnership({
                            ...newAcademicPartnership,
                            period: e.target.value,
                          })
                        }
                        placeholder="Contoh: 6 bulan, 1 tahun"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowAcademicPartnershipModal(false)}
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
        </>
      </div>
      <Footer />
    </div>
  );
};
export default IKMDashboard;
