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
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import db from "../firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";

const IKMDirectoryPage = () => {
  // State declarations
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKbli, setSelectedKbli] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedCertification, setSelectedCertification] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [ikmList, setIkmList] = useState([]);
  const [filteredIkm, setFilteredIkm] = useState([]);
  const [selectedIkm, setSelectedIkm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [favoriteCounts, setFavoriteCounts] = useState({});

  const { role, isLoggedIn, user } = useAuth();

  // Fetch favorite counts for all IKM
  useEffect(() => {
    const fetchFavoriteCounts = async () => {
      try {
        const q = query(collection(db, "users"));
        const querySnapshot = await getDocs(q);
        const counts = {};
        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (Array.isArray(data.favoritedIkm)) {
            data.favoritedIkm.forEach((ikmId) => {
              counts[ikmId] = (counts[ikmId] || 0) + 1;
            });
          }
        });
        setFavoriteCounts(counts);
      } catch (err) {
        console.error("Error fetching favorite counts:", err);
      }
    };
    fetchFavoriteCounts();
  }, [ikmList]);

  // Derived flags to decide which labels to show in "Jenis Layanan"
  const hasProducts = (() => {
    if (!selectedIkm) return false;
    if (Array.isArray(selectedIkm.products) && selectedIkm.products.length)
      return true;
    if (
      Array.isArray(selectedIkm.productList) &&
      selectedIkm.productList.length
    )
      return true;
    return false;
  })();

  const hasServices = (() => {
    if (!selectedIkm) return false;
    if (Array.isArray(selectedIkm.services) && selectedIkm.services.length)
      return true;
    if (
      Array.isArray(selectedIkm.serviceList) &&
      selectedIkm.serviceList.length
    )
      return true;
    if (
      Array.isArray(selectedIkm.services_offered) &&
      selectedIkm.services_offered.length
    )
      return true;
    // sometimes serviceType is a descriptive string like "Jasa" or "Produk & Jasa"
    if (
      selectedIkm.serviceType &&
      typeof selectedIkm.serviceType === "string" &&
      selectedIkm.serviceType.toLowerCase().includes("jasa")
    )
      return true;
    return false;
  })();

  // Detail popup for individual product/service
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Open mail client to send partnership email to target address
  const openMailTo = (email, businessName) => {
    if (!email) {
      window.alert("Email tidak tersedia untuk IKM ini.");
      return;
    }
    const subject = `Permintaan Kemitraan`;
    const body = `Yth. ${
      businessName || "Tim"
    },\n\nSaya tertarik untuk membahas kemungkinan bermitra dengan perusahaan Anda. Mohon informasikan ketersediaan untuk berdiskusi lebih lanjut.`;
    const mailto = `mailto:${encodeURIComponent(
      email
    )}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  const normalizePhone = (phone) => {
    if (!phone) return null;
    const digits = String(phone).trim().replace(/\D+/g, "");
    if (!digits) return null;
    return digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  };

  // Helpers to render the full detail object in a readable key/value layout
  const formatKey = (k) =>
    String(k)
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());

  const labelForKey = (k) => {
    if (!k) return "";
    const key = String(k).toLowerCase();
    const map = {
      spesifikasi: "Spesifikasi",
      spec: "Spesifikasi",
      specifications: "Spesifikasi",
      description: "Deskripsi",
      desc: "Deskripsi",
      detail: "Deskripsi",
      certifications: "Sertifikasi",
      certification: "Sertifikasi",
      sertifikasi: "Sertifikasi",
      capacity: "Kapasitas",
      kapasitas: "Kapasitas",
      capacityinfo: "Kapasitas",
      machines: "Mesin",
      machine: "Mesin",
      machines_used: "Mesin yang Digunakan",
      machinesused: "Mesin yang Digunakan",
      "machines used": "Mesin yang Digunakan",
      jumlah: "Kuantitas",
      quantity: "Kuantitas",
      qty: "Kuantitas",
      price: "Harga",
      berat: "Berat",
    };
    return map[key] || formatKey(k);
  };

  const renderValue = (v) => {
    if (v === null || v === undefined)
      return <span className="text-gray-500">-</span>;
    if (
      typeof v === "string" ||
      typeof v === "number" ||
      typeof v === "boolean"
    )
      return <span>{String(v)}</span>;
    if (Array.isArray(v))
      return (
        <ul className="list-disc ml-5 space-y-1">
          {v.map((item, i) => (
            <li key={i} className="text-sm text-gray-700">
              {typeof item === "object" ? JSON.stringify(item) : String(item)}
            </li>
          ))}
        </ul>
      );
    if (typeof v === "object")
      return (
        <div className="bg-gray-50 border rounded p-2">
          {Object.entries(v).map(([kk, vv]) => (
            <div key={kk} className="flex">
              <div className="w-36 text-xs text-gray-600">{formatKey(kk)}</div>
              <div className="flex-1 text-sm text-gray-700">
                {typeof vv === "object" ? JSON.stringify(vv) : String(vv)}
              </div>
            </div>
          ))}
        </div>
      );
    return <span>{String(v)}</span>;
  };

  const toggleFavorite = async (id) => {
    if (!isLoggedIn || !(role === "user" || role === "academician")) {
      window.alert(
        "Silakan login sebagai User atau Akademisi untuk menandai favorit."
      );
      return;
    }

    // Optimistic UI update
    const prevIkmList = ikmList;
    const updated = ikmList.map((ikm) =>
      ikm.id === id ? { ...ikm, favorited: !ikm.favorited } : ikm
    );
    setIkmList(updated);
    setFilteredIkm(
      updated.filter((ikm) => {
        let matches = true;
        if (searchQuery)
          matches =
            matches &&
            (ikm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              (Array.isArray(ikm.products) &&
                ikm.products.some((p) =>
                  typeof p === "string"
                    ? p.toLowerCase().includes(searchQuery.toLowerCase())
                    : p.name?.toLowerCase().includes(searchQuery.toLowerCase())
                )));
        if (selectedKbli) matches = matches && ikm.kbli === selectedKbli;
        if (selectedLocation && selectedLocation !== "Semua")
          matches = matches && ikm.location.includes(selectedLocation);
        if (selectedServiceType && selectedServiceType !== "Semua")
          matches = matches && ikm.serviceType.includes(selectedServiceType);
        if (selectedCertification && selectedCertification !== "Semua")
          matches =
            matches &&
            (Array.isArray(ikm.certifications)
              ? ikm.certifications.some((c) =>
                  typeof c === "string"
                    ? c === selectedCertification
                    : c.name === selectedCertification
                )
              : false);
        if (minRating > 0) matches = matches && ikm.rating >= minRating;
        return matches;
      })
    );

    // Update Firestore: add or remove from users/{uid}.favoritedIkm
    try {
      const userRef = doc(db, "users", user.uid);
      const isNowFavorited = updated.find((i) => i.id === id)?.favorited;
      if (isNowFavorited) {
        await updateDoc(userRef, { favoritedIkm: arrayUnion(id) });
      } else {
        await updateDoc(userRef, { favoritedIkm: arrayRemove(id) });
      }
    } catch (error) {
      console.error("Error updating favorited IKM:", error);
      window.alert("Gagal menyimpan favorit. Silakan coba lagi.");
      // revert UI on error
      setIkmList(prevIkmList);
      setFilteredIkm(
        prevIkmList.filter((ikm) => {
          let matches = true;
          if (searchQuery)
            matches =
              matches &&
              (ikm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (Array.isArray(ikm.products) &&
                  ikm.products.some((p) =>
                    typeof p === "string"
                      ? p.toLowerCase().includes(searchQuery.toLowerCase())
                      : p.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase())
                  )));
          if (selectedKbli) matches = matches && ikm.kbli === selectedKbli;
          if (selectedLocation && selectedLocation !== "Semua")
            matches = matches && ikm.location.includes(selectedLocation);
          if (selectedServiceType && selectedServiceType !== "Semua")
            matches = matches && ikm.serviceType.includes(selectedServiceType);
          if (selectedCertification && selectedCertification !== "Semua")
            matches =
              matches &&
              (Array.isArray(ikm.certifications)
                ? ikm.certifications.some((c) =>
                    typeof c === "string"
                      ? c === selectedCertification
                      : c.name === selectedCertification
                  )
                : false);
          if (minRating > 0) matches = matches && ikm.rating >= minRating;
          return matches;
        })
      );
    }
  };

  // Firestore fetch logic
  useEffect(() => {
    const fetchIKMProfiles = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "ikm"));
        const querySnapshot = await getDocs(q);
        const ikmData = [];
        querySnapshot.forEach((doc) => {
          ikmData.push({ id: doc.id, ...doc.data() });
        });
        setIkmList(ikmData);
        setFilteredIkm(ikmData);
      } catch (error) {
        console.error("Error fetching IKM profiles:", error);
      }
    };
    fetchIKMProfiles();
  }, []);

  // Sync favorites from Firestore for the logged-in user so UI reflects stored favorites
  useEffect(() => {
    const syncFavorites = async () => {
      if (!ikmList || ikmList.length === 0) return;

      // If user not logged in, clear local favorited flags
      if (!user || !isLoggedIn) {
        const anyFav = ikmList.some((i) => i.favorited);
        if (anyFav) {
          const cleared = ikmList.map((i) => ({ ...i, favorited: false }));
          setIkmList(cleared);
          setFilteredIkm(cleared);
        }
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);
        const data = userSnap.exists() ? userSnap.data() : {};
        const fav = Array.isArray(data.favoritedIkm) ? data.favoritedIkm : [];

        const updated = ikmList.map((ikm) => ({
          ...ikm,
          favorited: fav.includes(ikm.id),
        }));
        setIkmList(updated);

        // Recompute filtered list according to current filters
        const recomputed = updated.filter((ikm) => {
          let matches = true;
          if (searchQuery)
            matches =
              matches &&
              (ikm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (Array.isArray(ikm.products) &&
                  ikm.products.some((p) =>
                    typeof p === "string"
                      ? p.toLowerCase().includes(searchQuery.toLowerCase())
                      : p.name
                          ?.toLowerCase()
                          .includes(searchQuery.toLowerCase())
                  )));
          if (selectedKbli) matches = matches && ikm.kbli === selectedKbli;
          if (selectedLocation && selectedLocation !== "Semua")
            matches = matches && ikm.location.includes(selectedLocation);
          if (selectedServiceType && selectedServiceType !== "Semua")
            matches = matches && ikm.serviceType.includes(selectedServiceType);
          if (selectedCertification && selectedCertification !== "Semua")
            matches =
              matches &&
              (Array.isArray(ikm.certifications)
                ? ikm.certifications.some((c) =>
                    typeof c === "string"
                      ? c === selectedCertification
                      : c.name === selectedCertification
                  )
                : false);
          if (minRating > 0) matches = matches && ikm.rating >= minRating;
          return matches;
        });
        setFilteredIkm(recomputed);
      } catch (err) {
        console.error("Error syncing favorited IKM:", err);
      }
    };

    syncFavorites();
  }, [
    user,
    isLoggedIn,
    ikmList,
    searchQuery,
    selectedKbli,
    selectedLocation,
    selectedServiceType,
    selectedCertification,
    minRating,
  ]);

  const kbliOptions = [
    { label: "Semua", value: "" },
    { label: "Furniture & Kerajinan", value: "16211" },
    { label: "Tekstil & Garmen", value: "13910" },
    { label: "Logam & Metalurgi", value: "25110" },
    { label: "Makanan & Minuman", value: "10711" },
    { label: "Kemasan & Packaging", value: "17011" },
    { label: "Kimia & Farmasi", value: "20130" },
    { label: "Elektronik & Komponen", value: "26101" },
  ];
  const locations = [
    "Semua",
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "Jawa Timur",
    "Banten",
  ];
  const serviceTypes = ["Semua", "Produk", "Jasa", "Produk & Jasa"];
  const certifications = [
    "Semua",
    "SNI",
    "Halal",
    "ISO 9001",
    "BPOM",
    "HACCP",
    "SVLK",
  ];

  // Filter logic
  const applyFilters = () => {
    let filtered = ikmList;

    if (searchQuery) {
      filtered = filtered.filter(
        (ikm) =>
          ikm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (Array.isArray(ikm.products) &&
            ikm.products.some((p) =>
              typeof p === "string"
                ? p.toLowerCase().includes(searchQuery.toLowerCase())
                : p.name?.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
    }

    if (selectedKbli) {
      filtered = filtered.filter((ikm) => ikm.kbli === selectedKbli);
    }

    if (selectedLocation && selectedLocation !== "Semua") {
      filtered = filtered.filter((ikm) =>
        ikm.location.includes(selectedLocation)
      );
    }

    if (selectedServiceType && selectedServiceType !== "Semua") {
      filtered = filtered.filter((ikm) =>
        ikm.serviceType.includes(selectedServiceType)
      );
    }

    if (selectedCertification && selectedCertification !== "Semua") {
      filtered = filtered.filter((ikm) =>
        Array.isArray(ikm.certifications)
          ? ikm.certifications.some((c) =>
              typeof c === "string"
                ? c === selectedCertification
                : c.name === selectedCertification
            )
          : false
      );
    }

    if (minRating > 0) {
      filtered = filtered.filter((ikm) => ikm.rating >= minRating);
    }

    setFilteredIkm(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedKbli("");
    setSelectedLocation("");
    setSelectedServiceType("");
    setSelectedCertification("");
    setMinRating(0);
    setFilteredIkm(ikmList);
    setCurrentPage(1);
  };
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIkm.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIkm.length / itemsPerPage);

  const selectedIkmPhoneForWa = selectedIkm
    ? normalizePhone(selectedIkm.phone)
    : null;

  return (
    <div>
      <Navbar />
      <div className="bg-green-50 min-h-screen">
        {/* Hero Header */}
        <div className="bg-linear-to-br from-green-600 via-green-500 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 text-center"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Direktori IKM
            </h1>
            <p
              className="text-xl text-center text-green-50 mb-8"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Temukan mitra industri kecil dan menengah yang siap berkolaborasi
              dengan Anda
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama IKM atau produk..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                />
                <button
                  onClick={applyFilters}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition font-semibold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Toggle Button (Mobile) */}
            <div className="text-center mt-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-green-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-flex items-center space-x-2"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <span>
                  {showFilters ? "Sembunyikan Filter" : "Tampilkan Filter"}
                </span>
                {showFilters ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div className="bg-white shadow-md py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Category Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    KBLI
                  </label>
                  <select
                    value={selectedKbli}
                    onChange={(e) => setSelectedKbli(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {kbliOptions.map((opt) => (
                      <option key={opt.value || "semua"} value={opt.value}>
                        {opt.label} {opt.value ? `(${opt.value})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Location Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Lokasi
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc === "Semua" ? "" : loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Service Type Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Jenis Layanan
                  </label>
                  <select
                    value={selectedServiceType}
                    onChange={(e) => setSelectedServiceType(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {serviceTypes.map((type) => (
                      <option key={type} value={type === "Semua" ? "" : type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Certification Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Sertifikasi
                  </label>
                  <select
                    value={selectedCertification}
                    onChange={(e) => setSelectedCertification(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {certifications.map((cert) => (
                      <option key={cert} value={cert === "Semua" ? "" : cert}>
                        {cert}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rating Filter */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Rating Minimum
                  </label>
                  <select
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    <option value={0}>Semua Rating</option>
                    <option value={4}>4+ Bintang</option>
                    <option value={4.5}>4.5+ Bintang</option>
                    <option value={4.7}>4.7+ Bintang</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={applyFilters}
                  className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Terapkan Filter
                </button>
                <button
                  onClick={resetFilters}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p
            className="text-gray-600 text-lg"
            style={{ fontFamily: "Open Sans, sans-serif" }}
          >
            Menampilkan{" "}
            <span className="font-bold text-green-600">
              {filteredIkm.length}
            </span>{" "}
            IKM dari total <span className="font-bold">{ikmList.length}</span>{" "}
            IKM terdaftar
          </p>
        </div>

        {/* IKM Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((ikm) => (
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
                      {isLoggedIn &&
                      (role === "user" || role === "academician") ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleFavorite(ikm.id)}
                            className="text-2xl transition-transform hover:scale-110"
                            aria-label={
                              ikm.favorited ? "Unfavorite" : "Favorite"
                            }
                          >
                            {ikm.favorited ? "❤️" : "🤍"}
                          </button>
                          <span
                            className="text-sm font-semibold text-gray-600"
                            title="Jumlah favorit"
                          >
                            {favoriteCounts[ikm.id] || 0}
                          </span>
                        </div>
                      ) : null}
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

                    {/* <div className="flex items-center mb-4">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(ikm.rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className="ml-2 text-sm font-semibold text-gray-700"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {ikm.rating} ({ikm.reviewCount} ulasan)
                      </span>
                    </div> */}

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
                              style={{ fontFamily: "Open Sans, sans-serif" }}
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
                        onClick={() => setSelectedIkm(ikm)}
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
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3
                className="text-2xl font-bold text-gray-800 mb-2"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Tidak Ada IKM Ditemukan
              </h3>
              <p
                className="text-gray-600 mb-6"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Coba sesuaikan filter pencarian Anda
              </p>
              <button
                onClick={resetFilters}
                className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-green-600 hover:bg-green-50 shadow"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                ← Prev
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-10 h-10 rounded-xl font-semibold transition ${
                    currentPage === idx + 1
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-green-50 shadow"
                  }`}
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-xl font-semibold transition ${
                  currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-white text-green-600 hover:bg-green-50 shadow"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* Statistics Section */}
        {/* <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl font-bold text-center text-gray-800 mb-12"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Statistik Platform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-green-600 to-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-4xl font-bold text-green-600 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  1,240+
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  IKM terdaftar dari 34 provinsi di Indonesia
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-blue-600 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-4xl font-bold text-blue-600 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  70%
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  IKM telah memiliki sertifikasi produk resmi
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-linear-to-br from-yellow-500 to-yellow-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3
                  className="text-4xl font-bold text-yellow-600 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  300+
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Kemitraan sukses terbentuk melalui MitraKita
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* IKM Detail Modal */}
        {selectedIkm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedIkm(null)}
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
                      {selectedIkm.logoUrl ? (
                        <img
                          src={selectedIkm.logoUrl}
                          alt={`${selectedIkm.businessName} logo`}
                          className="w-full h-full object-cover"
                        />
                      ) : selectedIkm.logo ? (
                        <span>{selectedIkm.logo}</span>
                      ) : (
                        <span>🏭</span>
                      )}
                    </div>
                    <div>
                      <h2
                        className="text-3xl font-bold mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {selectedIkm.businessName}
                      </h2>
                      <div className="flex items-center space-x-4 text-green-50">
                        {selectedIkm?.officeAddress && (
                          <span className="flex items-center">
                            <span className="mr-1">📍</span>
                            {selectedIkm.officeAddress}
                          </span>
                        )}
                        {/* {selectedIkm?.rating && (
                          <span className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {selectedIkm.rating} (
                            {selectedIkm?.reviewCount || 0} ulasan)
                          </span>
                        )} */}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedIkm(null)}
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
                      {selectedIkm?.establishedYear || "-"}
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
                      {selectedIkm?.employees || "-"}
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
                      {selectedIkm?.partnerships || 0}
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
                      {Array.isArray(selectedIkm?.certifications)
                        ? selectedIkm.certifications.length
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
                    {selectedIkm?.bio ||
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
                          {selectedIkm?.officeAddress ||
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
                        {selectedIkm?.email ? (
                          <a
                            href={`mailto:${selectedIkm.email}`}
                            className="text-green-600 hover:underline"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {selectedIkm.email}
                          </a>
                        ) : (
                          <span
                            className="text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
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
                        {selectedIkm?.phone ? (
                          <a
                            href={`tel:${selectedIkm.phone}`}
                            className="text-green-600 hover:underline"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {selectedIkm.phone}
                          </a>
                        ) : (
                          <span
                            className="text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
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
                        {selectedIkm?.website ? (
                          <a
                            href={`https://${selectedIkm.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:underline"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {selectedIkm.website}
                          </a>
                        ) : (
                          <span
                            className="text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            Website tidak tersedia
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category & Service Type */}
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
                      {selectedIkm?.kbli || "-"}
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
                      {hasProducts && (
                        <span
                          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Produk
                        </span>
                      )}
                      {hasServices && (
                        <span
                          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          Layanan
                        </span>
                      )}
                      {!hasProducts && !hasServices && (
                        <span
                          className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {selectedIkm.serviceType || "-"}
                        </span>
                      )}
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
                    const products = Array.isArray(selectedIkm.products)
                      ? selectedIkm.products
                      : Array.isArray(selectedIkm.productList)
                      ? selectedIkm.productList
                      : [];
                    const services = Array.isArray(selectedIkm.services)
                      ? selectedIkm.services
                      : Array.isArray(selectedIkm.serviceList)
                      ? selectedIkm.serviceList
                      : Array.isArray(selectedIkm.services_offered)
                      ? selectedIkm.services_offered
                      : [];

                    const serviceFallback =
                      !services.length && selectedIkm.serviceType
                        ? [selectedIkm.serviceType]
                        : [];

                    const combinedServices = [...services, ...serviceFallback];

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
                                    : product.name || product.title || "Produk";
                                const capacity =
                                  product && typeof product === "object"
                                    ? product.capacity ||
                                      product.capacityInfo ||
                                      product.description ||
                                      ""
                                    : "";
                                return (
                                  <div
                                    key={`p-${idx}`}
                                    className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-lg transition"
                                  >
                                    <div className="w-full h-32 bg-linear-to-br from-green-100 to-blue-100 rounded-xl mb-3 flex items-center justify-center text-4xl overflow-hidden">
                                      {(() => {
                                        const prodImg =
                                          product && typeof product === "object"
                                            ? product.imageUrl ||
                                              product.image ||
                                              product.photo ||
                                              product.logoUrl ||
                                              null
                                            : null;
                                        if (prodImg) {
                                          return (
                                            <img
                                              src={prodImg}
                                              alt={
                                                (typeof product === "object" &&
                                                  (product.name ||
                                                    product.title)) ||
                                                `${selectedIkm.businessName} product`
                                              }
                                              className="w-full h-full object-cover"
                                            />
                                          );
                                        }
                                        if (selectedIkm.logoUrl) {
                                          return (
                                            <img
                                              src={selectedIkm.logoUrl}
                                              alt={`${selectedIkm.businessName} logo`}
                                              className="w-full h-full object-cover"
                                            />
                                          );
                                        }
                                        if (selectedIkm.logo)
                                          return (
                                            <span>{selectedIkm.logo}</span>
                                          );
                                        return <span>🏭</span>;
                                      })()}
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
                                      ) : selectedIkm.logoUrl ? (
                                        <img
                                          src={selectedIkm.logoUrl}
                                          alt={`${selectedIkm.businessName} logo`}
                                          className="w-full h-full object-cover"
                                        />
                                      ) : selectedIkm.logo ? (
                                        <span className="text-3xl">
                                          {selectedIkm.logo}
                                        </span>
                                      ) : (
                                        <span className="text-3xl">🏭</span>
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
                              Tidak ada data produk atau layanan yang tersedia.
                            </p>
                          )}
                      </div>
                    );
                  })()}
                </div>
                {/* Machines & Equipment */}
                {(() => {
                  const machines = Array.isArray(selectedIkm?.machines)
                    ? selectedIkm.machines
                    : Array.isArray(selectedIkm?.machineList)
                    ? selectedIkm.machineList
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
                                    <span className="text-2xl mr-3">⚙️</span>
                                    <h4
                                      className="font-bold text-gray-800"
                                      style={{
                                        fontFamily: "Montserrat, sans-serif",
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
                                          {quantity ? `${quantity} Unit` : "-"}
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
                    {Array.isArray(selectedIkm.certifications) &&
                      selectedIkm.certifications.map((cert, idx) => (
                        <span
                          key={idx}
                          className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-4 py-2 rounded-xl font-semibold flex items-center"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
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
                      ))}
                  </div>
                </div>

                {/* Product/Service Detail Popup */}
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
                                <span className="font-semibold">
                                  Kapasitas:
                                </span>{" "}
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
                                <h5 className="font-semibold">
                                  Detail Lengkap
                                </h5>
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
                                            {labelForKey(key)}
                                          </div>
                                          <div className="flex-1">
                                            {renderValue(val)}
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

                {/* Reviews Section (Placeholder) */}
                {/* <div>
                  <h3
                    className="text-xl font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Rating & Ulasan
                  </h3>
                  <div className="bg-green-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <p
                          className="text-5xl font-bold text-green-600"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {selectedIkm.rating}
                        </p>
                        <div className="flex items-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(selectedIkm.rating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p
                          className="text-sm text-gray-600 mt-2"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          Berdasarkan {selectedIkm.reviewCount} ulasan
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: "85%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">5★</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: "10%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">4★</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: "3%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">3★</span>
                        </div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: "1%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">2★</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: "1%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">1★</span>
                        </div>
                      </div>
                    </div> */}

                {/* Sample Reviews */}
                {/* <div className="space-y-4">
                      <div className="bg-white rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p
                              className="font-bold text-gray-800"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              PT Industri Maju
                            </p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 text-yellow-400 fill-yellow-400"
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            2 minggu lalu
                          </span>
                        </div>
                        <p
                          className="text-gray-700"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          Kualitas produk sangat baik dan pengiriman tepat
                          waktu. Sangat profesional dalam berkomunikasi.
                          Recommended!
                        </p>
                      </div>
                      <div className="bg-white rounded-xl p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p
                              className="font-bold text-gray-800"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              CV Berkah Jaya
                            </p>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < 4
                                      ? "text-yellow-400 fill-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">
                            1 bulan lalu
                          </span>
                        </div>
                        <p
                          className="text-gray-700"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          Pelayanan ramah dan responsif.
                        </p>
                      </div>
                    </div> */}
                {/* </div>
                </div> */}

                {/* Action Buttons: single primary 'Mulai Chat' with WhatsApp icon */}
                <div className="sticky bottom-0 bg-white pt-6 pb-4 border-t border-gray-200">
                  <div className="px-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedIkmPhoneForWa ? (
                      <a
                        href={`https://wa.me/${selectedIkmPhoneForWa}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full"
                      >
                        <button
                          className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                          aria-label="Chat untuk Bermitra via WhatsApp"
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
                      </a>
                    ) : (
                      <button
                        className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                        onClick={() =>
                          window.alert("Nomor telepon tidak tersedia.")
                        }
                        aria-label="Chat untuk Bermitra via WhatsApp"
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
                    )}
                    <button
                      className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() =>
                        openMailTo(
                          selectedIkm?.email,
                          selectedIkm?.businessName
                        )
                      }
                      aria-label="Email untuk Bermitra"
                    >
                      {/* Mail SVG icon */}
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
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default IKMDirectoryPage;
