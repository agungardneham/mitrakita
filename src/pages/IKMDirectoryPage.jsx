import React, { useState } from "react";
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

const dummyIKMData = [
  {
    id: 1,
    name: "CV Furniture Jaya Abadi",
    logo: "🪑",
    location: "Jepara, Jawa Tengah",
    kbli: "16211",
    rating: 4.8,
    reviewCount: 124,
    products: [
      { name: "Kursi Jati", capacity: "200 unit/bulan" },
      { name: "Meja Kayu", capacity: "150 unit/bulan" },
      { name: "Lemari Custom", capacity: "80 unit/bulan" },
    ],
    description:
      "Produsen furniture berkualitas tinggi dengan pengalaman lebih dari 15 tahun. Menggunakan kayu jati pilihan dan craftmanship terbaik.",
    email: "info@furniturejaya.com",
    phone: "0291-588123",
    website: "www.furniturejaya.com",
    address: "Jl. Raya Tahunan No. 45, Jepara, Jawa Tengah 59427",
    certifications: ["SNI", "SVLK"],
    serviceType: "Produk",
    establishedYear: 2008,
    employees: 45,
    partnerships: 28,
    favorited: false,
    machines: [
      {
        spesifikasi: "Mesin UV Coating Model UV-3000",
        jumlah: 2,
        kapasitas: "50 unit/jam",
      },
      {
        spesifikasi: "Spray Booth Kabin Semi-Otomatis",
        jumlah: 1,
        kapasitas: "30 unit/jam",
      },
      {
        spesifikasi: "Mesin Amplas & Finishing (Sanding)",
        jumlah: 3,
        kapasitas: "80 unit/jam",
      },
    ],
  },
  {
    id: 2,
    name: "UD Tekstil Nusantara",
    logo: "🧵",
    location: "Bandung, Jawa Barat",
    kbli: "13910",
    rating: 4.6,
    reviewCount: 89,
    products: [
      { name: "Kain Batik", capacity: "5000 meter/bulan" },
      { name: "Seragam Kerja", capacity: "3000 set/bulan" },
      { name: "Textile Custom", capacity: "2000 meter/bulan" },
    ],
    description:
      "Spesialis produksi tekstil dan garmen dengan teknologi modern. Melayani order dalam jumlah besar untuk korporasi.",
    email: "order@tekstilnusantara.com",
    phone: "022-7234567",
    website: "www.tekstilnusantara.com",
    address: "Jl. Soekarno-Hatta No. 789, Bandung, Jawa Barat 40286",
    certifications: ["SNI", "ISO 9001"],
    serviceType: "Produk",
    establishedYear: 2012,
    employees: 120,
    partnerships: 45,
    favorited: false,
    machines: [
      {
        spesifikasi: "Mesin Tenun (Weaving Machine)",
        jumlah: 4,
        kapasitas: "200 m/jam",
      },
      {
        spesifikasi: "Mesin Dyeing (Batch Dyeing)",
        jumlah: 1,
        kapasitas: "500 kg/batch",
      },
      {
        spesifikasi: "Mesin Jahit Industri (High-speed Sewing)",
        jumlah: 8,
        kapasitas: "100 potong/jam",
      },
    ],
  },
  {
    id: 3,
    name: "PT Logam Presisi Indo",
    logo: "⚙️",
    location: "Surabaya, Jawa Timur",
    kbli: "25110",
    rating: 4.9,
    reviewCount: 156,
    products: [
      { name: "Komponen Mesin", capacity: "1000 unit/bulan" },
      { name: "Spare Part", capacity: "2500 unit/bulan" },
      { name: "Custom Fabrication", capacity: "500 unit/bulan" },
    ],
    description:
      "Manufaktur komponen logam presisi tinggi dengan mesin CNC modern. Partner terpercaya industri otomotif dan manufaktur.",
    email: "sales@logampresisi.co.id",
    phone: "031-8765432",
    website: "www.logampresisi.co.id",
    address: "Kawasan Industri SIER Blok B-12, Surabaya, Jawa Timur 60293",
    certifications: ["ISO 9001", "ISO 14001"],
    serviceType: "Produk & Jasa",
    establishedYear: 2005,
    employees: 85,
    partnerships: 62,
    favorited: false,
    machines: [
      {
        spesifikasi: "Mesin CNC Lathe Model CL-500",
        jumlah: 2,
        kapasitas: "120 komponen/hari",
      },
      {
        spesifikasi: "Mesin Press Hidrolik 50T",
        jumlah: 1,
        kapasitas: "300 press/hari",
      },
      {
        spesifikasi: "Peralatan Las MIG/TIG",
        jumlah: 4,
        kapasitas: "Variatif berdasarkan job",
      },
    ],
  },
  {
    id: 4,
    name: "CV Makanan Berkah",
    logo: "🍲",
    location: "Jakarta Timur, DKI Jakarta",
    kbli: "10711",
    rating: 4.7,
    reviewCount: 203,
    products: [
      { name: "Snack Tradisional", capacity: "15 ton/bulan" },
      { name: "Catering", capacity: "500 porsi/hari" },
      { name: "Frozen Food", capacity: "10 ton/bulan" },
    ],
    description:
      "Produsen makanan dan minuman dengan sertifikasi halal dan BPOM. Kapasitas produksi 10 ton per hari.",
    email: "info@makananberkah.id",
    phone: "021-8889999",
    website: "www.makananberkah.id",
    address: "Jl. Raya Bogor KM 23, Jakarta Timur, DKI Jakarta 13720",
    certifications: ["Halal", "BPOM", "HACCP"],
    serviceType: "Produk",
    establishedYear: 2010,
    employees: 68,
    partnerships: 34,
    favorited: false,
    machines: [
      {
        spesifikasi: "Line Produksi Pengemasan 3-lane",
        jumlah: 1,
        kapasitas: "10 ton/hari",
      },
      {
        spesifikasi: "Industrial Mixer 500L",
        jumlah: 2,
        kapasitas: "500 kg/batch",
      },
      { spesifikasi: "Blast Freezer", jumlah: 1, kapasitas: "1000 kg/h" },
    ],
  },
  {
    id: 5,
    name: "UD Kemasan Kreatif",
    logo: "📦",
    location: "Tangerang, Banten",
    kbli: "17011",
    rating: 4.5,
    reviewCount: 78,
    products: [
      { name: "Box Karton", capacity: "50,000 pcs/bulan" },
      { name: "Plastik Kemasan", capacity: "100,000 pcs/bulan" },
      { name: "Label Custom", capacity: "200,000 pcs/bulan" },
    ],
    description:
      "Spesialis packaging custom dengan desain menarik. Melayani industri F&B, kosmetik, dan retail.",
    email: "order@kemasankreatif.com",
    phone: "021-5567788",
    website: "www.kemasankreatif.com",
    address: "Jl. Industri Raya No. 56, Tangerang, Banten 15134",
    certifications: ["SNI"],
    serviceType: "Produk & Jasa",
    establishedYear: 2015,
    employees: 42,
    partnerships: 19,
    favorited: false,
    machines: [
      { spesifikasi: "Mesin Die Cutter", jumlah: 2, kapasitas: "1000 pcs/jam" },
      {
        spesifikasi: "Printing Press (Flexo)",
        jumlah: 1,
        kapasitas: "200 m/menit",
      },
      {
        spesifikasi: "Laminator Roll-to-Roll",
        jumlah: 1,
        kapasitas: "150 m/menit",
      },
    ],
  },
  {
    id: 6,
    name: "CV Kimia Sejahtera",
    logo: "🧪",
    location: "Semarang, Jawa Tengah",
    kbli: "20130",
    rating: 4.8,
    reviewCount: 92,
    products: [
      { name: "Bahan Pembersih", capacity: "20 ton/bulan" },
      { name: "Deterjen Industri", capacity: "25 ton/bulan" },
      { name: "Sabun Cair", capacity: "30,000 liter/bulan" },
    ],
    description:
      "Produsen produk kimia rumah tangga dan industri dengan standar keamanan tinggi.",
    email: "cs@kimiasejahtera.co.id",
    phone: "024-7654321",
    website: "www.kimiasejahtera.co.id",
    address: "Jl. Simongan Raya No. 88, Semarang, Jawa Tengah 50148",
    certifications: ["SNI", "BPOM"],
    serviceType: "Produk",
    establishedYear: 2009,
    employees: 56,
    partnerships: 27,
    favorited: false,
    machines: [
      {
        spesifikasi: "Reactor Stainless 200L",
        jumlah: 2,
        kapasitas: "200 kg/batch",
      },
      { spesifikasi: "Mixer Industri", jumlah: 2, kapasitas: "500 kg/batch" },
      {
        spesifikasi: "Filling Machine Semi-Automatic",
        jumlah: 1,
        kapasitas: "1200 botol/jam",
      },
    ],
  },
  {
    id: 7,
    name: "UD Kerajinan Rotan Asli",
    logo: "🧺",
    location: "Cirebon, Jawa Barat",
    kbli: "16212",
    rating: 4.6,
    reviewCount: 67,
    products: [
      { name: "Keranjang Rotan", capacity: "400 unit/bulan" },
      { name: "Furniture Rotan", capacity: "150 unit/bulan" },
      { name: "Dekorasi", capacity: "600 unit/bulan" },
    ],
    description:
      "Kerajinan rotan handmade dengan kualitas ekspor. Mengerjakan custom design sesuai kebutuhan.",
    email: "info@rotanasli.com",
    phone: "0231-445566",
    website: "www.rotanasli.com",
    address: "Jl. Pangeran Cakrabuana No. 12, Cirebon, Jawa Barat 45122",
    certifications: ["SVLK"],
    serviceType: "Produk",
    establishedYear: 2013,
    employees: 32,
    partnerships: 15,
    favorited: false,
    machines: [
      {
        spesifikasi: "Mesin Tenun Rotan (Semi-Automatic)",
        jumlah: 3,
        kapasitas: "150 unit/hari",
      },
      {
        spesifikasi: "Press Pembentuk Rotan",
        jumlah: 1,
        kapasitas: "200 unit/hari",
      },
      {
        spesifikasi: "Oven Pengering Skala Kecil",
        jumlah: 1,
        kapasitas: "500 kg/hari",
      },
    ],
  },
  {
    id: 8,
    name: "PT Elektronik Mandiri",
    logo: "🔌",
    location: "Bekasi, Jawa Barat",
    kbli: "26101",
    rating: 4.7,
    reviewCount: 134,
    products: [
      { name: "PCB Assembly", capacity: "40,000 unit/bulan" },
      { name: "Komponen Elektronik", capacity: "100,000 unit/bulan" },
      { name: "Wiring Harness", capacity: "25,000 unit/bulan" },
    ],
    description:
      "Manufaktur komponen elektronik untuk industri otomotif dan elektronik konsumer.",
    email: "sales@elektronikmandiri.id",
    phone: "021-8889900",
    website: "www.elektronikmandiri.id",
    address: "Kawasan MM2100 Blok DD-8, Bekasi, Jawa Barat 17520",
    certifications: ["ISO 9001", "ISO 14001", "OHSAS 18001"],
    serviceType: "Produk & Jasa",
    establishedYear: 2007,
    employees: 156,
    partnerships: 71,
    favorited: false,
    machines: [
      {
        spesifikasi: "SMT Line (Pick & Place)",
        jumlah: 2,
        kapasitas: "2000 PCB/hari",
      },
      {
        spesifikasi: "Wave Soldering Machine",
        jumlah: 1,
        kapasitas: "500 PCB/jam",
      },
      {
        spesifikasi: "AOI (Automated Optical Inspection)",
        jumlah: 1,
        kapasitas: "2000 PCB/hari",
      },
    ],
  },
];

const IKMDirectoryPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKbli, setSelectedKbli] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedServiceType, setSelectedServiceType] = useState("");
  const [selectedCertification, setSelectedCertification] = useState("");
  const [minRating, setMinRating] = useState(0);
  const [ikmList, setIkmList] = useState(dummyIKMData);
  const [filteredIkm, setFilteredIkm] = useState(dummyIKMData);
  const [selectedIkm, setSelectedIkm] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
          ikm.products.some((p) =>
            p.toLowerCase().includes(searchQuery.toLowerCase())
          )
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
        ikm.certifications.includes(selectedCertification)
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

  const toggleFavorite = (id) => {
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
              ikm.products.some((p) =>
                p.toLowerCase().includes(searchQuery.toLowerCase())
              ));
        if (selectedKbli) matches = matches && ikm.kbli === selectedKbli;
        if (selectedLocation && selectedLocation !== "Semua")
          matches = matches && ikm.location.includes(selectedLocation);
        if (selectedServiceType && selectedServiceType !== "Semua")
          matches = matches && ikm.serviceType.includes(selectedServiceType);
        if (selectedCertification && selectedCertification !== "Semua")
          matches =
            matches && ikm.certifications.includes(selectedCertification);
        if (minRating > 0) matches = matches && ikm.rating >= minRating;
        return matches;
      })
    );
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredIkm.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredIkm.length / itemsPerPage);

  return (
    <div>
      <Navbar />
      <div className="bg-green-50 min-h-screen">
        {/* Hero Header */}
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 text-white py-16">
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
                      <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center text-4xl">
                        {ikm.logo}
                      </div>
                      <button
                        onClick={() => toggleFavorite(ikm.id)}
                        className="text-2xl transition-transform hover:scale-110"
                      >
                        {ikm.favorited ? "❤️" : "🤍"}
                      </button>
                    </div>

                    <h3
                      className="text-xl font-bold text-gray-800 mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {ikm.name}
                    </h3>

                    <div
                      className="flex items-center text-sm text-gray-600 mb-3"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      <span className="mr-1">📍</span>
                      {ikm.location}
                    </div>

                    <div className="flex items-center mb-4">
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
                        Produk Unggulan:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ikm.products.slice(0, 2).map((product, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {product.name}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedIkm(ikm)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lihat Profil
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
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl font-bold text-center text-gray-800 mb-12"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Statistik Platform
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
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
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
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
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-2xl mx-auto mb-4 flex items-center justify-center">
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
        </div>

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
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4">
                    <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center text-5xl">
                      {selectedIkm.logo}
                    </div>
                    <div>
                      <h2
                        className="text-3xl font-bold mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {selectedIkm.name}
                      </h2>
                      <div className="flex items-center space-x-4 text-green-50">
                        <span className="flex items-center">
                          <span className="mr-1">📍</span>
                          {selectedIkm.location}
                        </span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                          {selectedIkm.rating} ({selectedIkm.reviewCount}{" "}
                          ulasan)
                        </span>
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
                      {selectedIkm.establishedYear}
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
                      {selectedIkm.employees}
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
                      {selectedIkm.partnerships}
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
                      {selectedIkm.certifications.length}
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
                    {selectedIkm.description}
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
                          {selectedIkm.address}
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
                        <a
                          href={`mailto:${selectedIkm.email}`}
                          className="text-green-600 hover:underline"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {selectedIkm.email}
                        </a>
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
                        <a
                          href={`tel:${selectedIkm.phone}`}
                          className="text-green-600 hover:underline"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {selectedIkm.phone}
                        </a>
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
                        <a
                          href={`https://${selectedIkm.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-green-600 hover:underline"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          {selectedIkm.website}
                        </a>
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
                      {selectedIkm.kbli}
                    </span>
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold text-gray-800 mb-3"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Jenis Layanan
                    </h3>
                    <span
                      className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {selectedIkm.serviceType}
                    </span>
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedIkm.products.map((product, idx) => (
                      <div
                        key={idx}
                        className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-green-500 hover:shadow-lg transition"
                      >
                        <div className="w-full h-32 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl mb-3 flex items-center justify-center text-4xl">
                          {selectedIkm.logo}
                        </div>
                        <h4
                          className="font-semibold text-gray-800 text-center"
                          style={{ fontFamily: "Montserrat, sans-serif" }}
                        >
                          {product.name}
                        </h4>
                        <p className="text-center text-gray-600 mb-2 md:text-l lg:text-xl">
                          <span className="block md:inline-block">
                            {product.capacity}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Machines & Equipment */}
                {selectedIkm.machines && selectedIkm.machines.length > 0 && (
                  <div>
                    <h3
                      className="text-xl font-bold text-gray-800 mb-4"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Mesin & Peralatan Produksi
                    </h3>
                    <div className="space-y-3">
                      {selectedIkm.machines.map((machine, idx) => (
                        <div
                          key={idx}
                          className="bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition"
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
                                  {machine.spesifikasi}
                                </h4>
                              </div>
                              <div className="grid grid-cols-2 gap-3 mt-3">
                                <div className="flex items-center">
                                  <span className="text-sm text-gray-600 mr-2">
                                    📊
                                  </span>
                                  <div>
                                    <p className="text-xs text-gray-500">
                                      Jumlah Unit
                                    </p>
                                    <p
                                      className="font-semibold text-gray-800"
                                      style={{
                                        fontFamily: "Montserrat, sans-serif",
                                      }}
                                    >
                                      {machine.jumlah} Unit
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
                                        fontFamily: "Montserrat, sans-serif",
                                      }}
                                    >
                                      {machine.kapasitas}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Certifications */}
                <div>
                  <h3
                    className="text-xl font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Sertifikasi & Standar Mutu
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedIkm.certifications.map((cert, idx) => (
                      <span
                        key={idx}
                        className="bg-yellow-50 border-2 border-yellow-200 text-yellow-700 px-4 py-2 rounded-xl font-semibold flex items-center"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Reviews Section (Placeholder) */}
                <div>
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
                    </div>

                    {/* Sample Reviews */}
                    <div className="space-y-4">
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
                    </div>
                  </div>
                </div>

                {/* Action Buttons: single primary 'Mulai Chat' with WhatsApp icon */}
                <div className="sticky bottom-0 bg-white pt-6 pb-4 border-t border-gray-200">
                  <div className="px-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => {
                        // placeholder: open chat action (to be implemented)
                      }}
                      aria-label="Chat untuk Bermitra via WhatsApp"
                    >
                      {/* WhatsApp SVG icon */}
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
                      className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                      onClick={() => {
                        // placeholder: open email action (to be implemented)
                      }}
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
