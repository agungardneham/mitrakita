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
  Mail,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import db from "../firebase-config";
import { collection, query, where, getDocs } from "firebase/firestore";

// ============================================
// USER/INDUSTRY DIRECTORY PAGE COMPONENT
// ============================================

// Note: data will be loaded from Firestore (users with role === 'user')

const UserDirectoryPage = () => {
  const [userList, setUserList] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filterByNeeds, setFilterByNeeds] = useState("");
  const [filterByProduces, setFilterByProduces] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const locations = [
    "Semua",
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Semarang",
    "Yogyakarta",
  ];

  // Fetch users with role 'user' from Firestore and map to UI shape
  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      try {
        const usersQ = query(
          collection(db, "users"),
          where("role", "==", "user")
        );
        const usersSnap = await getDocs(usersQ);
        const mapped = usersSnap.docs.map((d) => {
          const data = d.data() || {};
          // Normalize fields to the shape expected by the UI
          return {
            id: d.id,
            fullName: data.fullName || data.displayName || data.name || "",
            companyName: data.companyName || data.company || data.orgName || "",
            email: data.email || data.emailAddress || "",
            phone:
              data.phone || data.phoneNumber || data.mobile || data.tel || "",
            position: data.position || data.jobTitle || "",
            department: data.department || data.division || "",
            photo: data.photo || data.photoUrl || data.avatar || "👤",
            products: Array.isArray(data.products)
              ? data.products
              : Array.isArray(data.products)
              ? data.products
              : data.products
              ? [String(data.products)]
              : [],
            needs: Array.isArray(data.needs)
              ? data.needs
              : Array.isArray(data.needs)
              ? data.needs
              : data.needs
              ? [String(data.needs)]
              : [],
            location: data.city || data.location || data.address || "",
            partnershipCount:
              typeof data.partnershipCount === "number"
                ? data.partnershipCount
                : Array.isArray(data.partnerships)
                ? data.partnerships.length
                : Array.isArray(data.partnershipHistory)
                ? data.partnershipHistory.length
                : 0,
            verified: !!data.verified,
            partnershipHistory: Array.isArray(data.partnershipHistory)
              ? data.partnershipHistory.map((p) => ({
                  ikmName: p.ikmName || p.ikm_name || p.partnerName || "",
                  product: p.product || p.productName || p.service || "",
                  startDate: p.startDate || p.start_date || p.date || "",
                  duration: p.duration || p.durationText || "",
                }))
              : Array.isArray(data.partnership_history)
              ? data.partnership_history.map((p) => ({
                  ikmName: p.ikmName || p.ikm_name || p.partnerName || "",
                  product: p.product || p.productName || p.service || "",
                  startDate: p.startDate || p.start_date || p.date || "",
                  duration: p.duration || p.durationText || "",
                }))
              : [],
            bio: data.bio || "",
          };
        });

        setUserList(mapped);
        setFilteredUsers(mapped);
      } catch (err) {
        console.error("Error loading users for directory:", err);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter logic
  const applyFilters = () => {
    let filtered = userList;

    if (searchQuery) {
      filtered = filtered.filter(
        (user) =>
          user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.products.some((p) =>
            p.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          user.needs.some((p) =>
            p.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    if (selectedLocation && selectedLocation !== "Semua") {
      filtered = filtered.filter((user) => user.location === selectedLocation);
    }

    if (filterByNeeds) {
      filtered = filtered.filter((user) =>
        user.needs.some((p) =>
          p.toLowerCase().includes(filterByNeeds.toLowerCase())
        )
      );
    }

    if (filterByProduces) {
      filtered = filtered.filter((user) =>
        user.products.some((p) =>
          p.toLowerCase().includes(filterByProduces.toLowerCase())
        )
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedLocation("");
    setFilterByNeeds("");
    setFilterByProduces("");
    setFilteredUsers(userList);
    setCurrentPage(1);
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <div>
      <Navbar />
      <div className="bg-green-50 min-h-screen">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 text-center"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Direktori Industri
            </h1>
            <p
              className="text-xl text-center text-blue-50 mb-8"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Temukan perusahaan dan industri yang membutuhkan produk atau
              layanan dari IKM Anda
            </p>

            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari nama perusahaan, produk yang dihasilkan, atau kebutuhan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl text-gray-800 shadow-2xl focus:outline-none focus:ring-4 focus:ring-yellow-400"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                />
                <button
                  onClick={applyFilters}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-semibold"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Toggle Button */}
            <div className="text-center mt-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition inline-flex items-center space-x-2"
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {locations.map((loc) => (
                      <option key={loc} value={loc === "Semua" ? "" : loc}>
                        {loc}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Filter by Needs */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Butuh Produk/Layanan
                  </label>
                  <input
                    type="text"
                    value={filterByNeeds}
                    onChange={(e) => setFilterByNeeds(e.target.value)}
                    placeholder="Cth: komponen logam"
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                </div>

                {/* Filter by Produces */}
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Memproduksi
                  </label>
                  <input
                    type="text"
                    value={filterByProduces}
                    onChange={(e) => setFilterByProduces(e.target.value)}
                    placeholder="Cth: elektronik"
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={applyFilters}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
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

        {/* Results Count & Info Box */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-4">
            <p
              className="text-gray-600 text-lg mb-4 md:mb-0"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Menampilkan{" "}
              <span className="font-bold text-blue-600">
                {filteredUsers.length}
              </span>{" "}
              perusahaan dari total{" "}
              <span className="font-bold">{userList.length}</span> terdaftar
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-2">
              <p
                className="text-blue-800 text-sm"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                💡 <strong>Tip untuk IKM:</strong> Lihat kolom "Membutuhkan"
                untuk peluang kemitraan
              </p>
            </div>
          </div>
        </div>

        {/* User Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {loadingUsers ? (
            <div className="py-12 text-center text-gray-600">
              Memuat data perusahaan...
            </div>
          ) : currentItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentItems.map((user) => (
                <div
                  key={user.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden">
                          {user.photo &&
                          typeof user.photo === "string" &&
                          (user.photo.startsWith("http") ||
                            user.photo.startsWith("data:")) ? (
                            <img
                              src={user.photo}
                              alt={
                                user.fullName || user.companyName || "avatar"
                              }
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-3xl">{user.photo}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3
                            className="text-lg font-bold text-gray-800 mb-1"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {user.fullName}
                          </h3>
                          <p
                            className="text-sm text-gray-600"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {user.position}
                          </p>
                        </div>
                      </div>
                      {user.verified && (
                        <div className="flex-shrink-0">
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        </div>
                      )}
                    </div>

                    <div className="mb-4">
                      <h4
                        className="text-md font-bold text-gray-800 mb-1"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {user.companyName}
                      </h4>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <span className="mr-1">📍</span>
                        <span>{user.location}</span>
                        <span className="mx-2">•</span>
                        <span>{user.partnershipCount} Kemitraan</span>
                      </div>
                    </div>

                    {/* Produced Products - PENTING */}
                    <div className="mb-4 bg-green-50 rounded-xl p-3">
                      <p
                        className="text-xs font-bold text-green-700 mb-2 flex items-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Memproduksi:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {user.products.slice(0, 3).map((product, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {product}
                          </span>
                        ))}
                        {user.products.length > 3 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold">
                            +{user.products.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Needed Products - SANGAT PENTING */}
                    <div className="mb-4 bg-yellow-50 rounded-xl p-3 border-2 border-yellow-200">
                      <p
                        className="text-xs font-bold text-yellow-700 mb-2 flex items-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <TrendingUp className="w-4 h-4 mr-1" />
                        Membutuhkan:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {user.needs.slice(0, 3).map((product, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {product}
                          </span>
                        ))}
                        {user.needs.length > 3 && (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold">
                            +{user.needs.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedUser(user)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lihat Detail & Hubungi
                    </button>
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
                Tidak Ada Industri Ditemukan
              </h3>
              <p
                className="text-gray-600 mb-6"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Coba sesuaikan filter pencarian Anda
              </p>
              <button
                onClick={resetFilters}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition"
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
                    : "bg-white text-blue-600 hover:bg-blue-50 shadow"
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
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-white text-gray-700 hover:bg-blue-50 shadow"
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
                    : "bg-white text-blue-600 hover:bg-blue-50 shadow"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        {/* User Detail Modal */}
        {selectedUser && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedUser(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-5xl border-4 border-white shadow-lg flex-shrink-0 overflow-hidden">
                      {selectedUser.photo &&
                      typeof selectedUser.photo === "string" &&
                      (selectedUser.photo.startsWith("http") ||
                        selectedUser.photo.startsWith("data:")) ? (
                        <img
                          src={selectedUser.photo}
                          alt={
                            selectedUser.fullName ||
                            selectedUser.companyName ||
                            "avatar"
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-5xl">{selectedUser.photo}</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h2
                        className="text-2xl font-bold mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {selectedUser.fullName}
                      </h2>
                      <p className="text-blue-50 mb-1">
                        {selectedUser.position}
                      </p>
                      <p className="text-blue-100 text-sm">
                        {selectedUser.department}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition flex-shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Company Info */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <Building2 className="w-8 h-8 text-blue-600 mr-3" />
                    <h3
                      className="text-xl font-bold text-gray-800"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedUser.companyName}
                    </h3>
                    {selectedUser.verified && (
                      <CheckCircle className="w-5 h-5 text-blue-600 ml-2" />
                    )}
                  </div>
                  <h2
                    className="text-lg font-normal text-gray-800 mb-4"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {selectedUser.bio}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center">
                      <span className="mr-2">📍</span>
                      <span className="text-gray-700">
                        {selectedUser.location}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-gray-600" />
                      <span className="text-gray-700">
                        {selectedUser.partnershipCount} Kemitraan Aktif
                      </span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-4 flex items-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
                    Informasi Kontak
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="w-8 text-gray-600">📧</span>
                      <div>
                        <p className="text-xs text-gray-500 font-semibold">
                          Email
                        </p>
                        <a
                          href={`mailto:${selectedUser.email}`}
                          className="text-blue-600 hover:underline"
                        >
                          {selectedUser.email}
                        </a>
                      </div>
                    </div>
                    {selectedUser.phone && (
                      <div className="flex items-start">
                        <span className="w-8 text-gray-600">📞</span>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold">
                            Telepon
                          </p>
                          <a
                            href={`tel:${selectedUser.phone}`}
                            className="text-blue-600 hover:underline"
                          >
                            {selectedUser.phone}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Produced Products - Highlighted */}
                <div className="bg-green-50 rounded-2xl border-2 border-green-200 p-6">
                  <h3
                    className="text-lg font-bold text-green-700 mb-4 flex items-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <Package className="w-6 h-6 mr-2" />
                    Produk yang Dihasilkan
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.products.map((product, idx) => (
                      <span
                        key={idx}
                        className="bg-green-100 text-green-700 px-4 py-2 rounded-xl font-semibold text-sm border border-green-300"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Needed Products - Extra Highlighted */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-300 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-lg font-bold text-yellow-700 flex items-center"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      <TrendingUp className="w-6 h-6 mr-2" />
                      Produk/Layanan yang Dibutuhkan
                    </h3>
                    <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-bold">
                      PELUANG!
                    </span>
                  </div>
                  <p
                    className="text-sm text-yellow-700 mb-4 font-semibold"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    💡 Ini adalah peluang kemitraan untuk IKM yang menyediakan
                    produk/layanan berikut:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.needs.map((product, idx) => (
                      <span
                        key={idx}
                        className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-xl font-bold text-sm border-2 border-yellow-400"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
                {/* Histori Kemitraan dengan IKM */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                  <h3
                    className="text-lg font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Histori Kemitraan dengan IKM
                  </h3>
                  {selectedUser.partnershipHistory &&
                  selectedUser.partnershipHistory.length ? (
                    <ul className="space-y-3">
                      {selectedUser.partnershipHistory.map((p, i) => (
                        <li
                          key={i}
                          className="p-3 border rounded-lg bg-gray-50"
                        >
                          <div className="font-semibold text-gray-800">
                            {p.ikmName || "-"}
                          </div>
                          <div className="text-sm text-gray-600">
                            Produk: {p.product || "-"}
                          </div>
                          <div className="text-sm text-gray-500">
                            Mulai:{" "}
                            {p.startDate
                              ? isNaN(Date.parse(p.startDate))
                                ? p.startDate
                                : new Date(p.startDate).toLocaleDateString(
                                    "id-ID"
                                  )
                              : "-"}{" "}
                            • Durasi: {p.duration || "-"}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Belum ada histori kemitraan aktif.
                    </p>
                  )}
                </div>
              </div>

              {/* Sticky Bottom Action Bar */}
              <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 flex gap-4">
                <button
                  onClick={() => {
                    if (selectedUser.email) {
                      // Build email subject
                      const subject = encodeURIComponent(
                        `Proposal Kemitraan dengan ${selectedUser.companyName}`
                      );

                      // Build email body with partnership information
                      const needsList =
                        selectedUser.needs.length > 0
                          ? selectedUser.needs.join(", ")
                          : "produk/layanan yang mereka butuhkan";

                      const productsList =
                        selectedUser.products.length > 0
                          ? selectedUser.products.join(", ")
                          : "produk/layanan mereka";

                      const body = encodeURIComponent(
                        `Halo ${selectedUser.fullName},\n\n` +
                          `Saya menghubungi Anda sebagai pihak yang tertarik untuk melakukan kemitraan dengan ${selectedUser.companyName}.\n\n` +
                          `Informasi Perusahaan Anda:\n` +
                          `- Nama Perusahaan: ${selectedUser.companyName}\n` +
                          `- Lokasi: ${selectedUser.location}\n` +
                          `- Kontak: ${
                            selectedUser.phone || selectedUser.email
                          }\n\n` +
                          `Produk/Layanan yang Anda Hasilkan:\n${productsList}\n\n` +
                          `Produk/Layanan yang Anda Butuhkan:\n${needsList}\n\n` +
                          `Saya percaya bahwa kerjasama antara kita dapat saling menguntungkan. Saya berharap dapat mendiskusikan peluang kemitraan ini lebih lanjut dengan Anda.\n\n` +
                          `Mohon untuk menghubungi saya kembali jika Anda tertarik untuk berdiskusi lebih jauh.\n\n` +
                          `Terima kasih atas waktu dan perhatian Anda.\n\n` +
                          `Salam hormat,\n` +
                          `[Nama Anda]`
                      );

                      window.location.href = `mailto:${selectedUser.email}?subject=${subject}&body=${body}`;
                    }
                  }}
                  className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:shadow-xl transition-all flex items-center justify-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Mail className="w-5 h-5" />
                  <span>Email untuk Bermitra</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};
export default UserDirectoryPage;
