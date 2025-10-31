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
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const dummyResearchData = [
  {
    id: 1,
    title:
      "Optimalisasi Proses Finishing Furniture Menggunakan Teknologi UV Coating",
    author: "Dr. Budi Santoso, M.T.",
    institution: "Institut Teknologi Bandung",
    year: 2024,
    field: "Furniture & Kerajinan",
    type: "Terapan",
    trl: 7,
    abstract:
      "Penelitian ini mengembangkan metode finishing furniture menggunakan teknologi UV coating yang lebih efisien dan ramah lingkungan. Hasil uji coba menunjukkan peningkatan kecepatan produksi hingga 40% dengan kualitas hasil yang lebih baik.",
    fullAbstract:
      "Industri furniture Indonesia menghadapi tantangan dalam proses finishing yang memakan waktu lama dan menggunakan bahan kimia berbahaya. Penelitian ini bertujuan mengembangkan metode finishing menggunakan teknologi UV coating yang lebih cepat, efisien, dan ramah lingkungan. Melalui eksperimen pada 100 sampel produk furniture, hasil menunjukkan bahwa teknologi UV coating dapat mengurangi waktu finishing dari 24 jam menjadi hanya 2 jam, meningkatkan ketahanan produk terhadap goresan hingga 60%, dan mengurangi emisi VOC hingga 85%. Teknologi ini siap diterapkan pada industri kecil menengah dengan investasi mesin yang terjangkau.",
    keywords: ["UV Coating", "Furniture", "Finishing", "Ramah Lingkungan"],
    summary:
      "Metode baru menggunakan sinar UV untuk mengeringkan cat furniture dalam 2 jam (sebelumnya 24 jam), lebih kuat, dan tidak berbahaya bagi lingkungan.",
    views: 342,
    downloads: 89,
    collaborations: 5,
    aiSummaryGenerated: false,
  },
  {
    id: 2,
    title:
      "Pengembangan Tekstil Antibakteri dari Ekstrak Daun Sirih untuk Industri Garmen",
    author: "Prof. Dr. Siti Nurhaliza, M.Sc.",
    institution: "Universitas Gadjah Mada",
    year: 2024,
    field: "Tekstil & Garmen",
    type: "Terapan",
    trl: 6,
    abstract:
      "Riset ini berhasil mengembangkan tekstil dengan sifat antibakteri alami menggunakan ekstrak daun sirih. Tekstil terbukti efektif membunuh 99.9% bakteri penyebab bau dan aman untuk kulit sensitif.",
    fullAbstract:
      "Meningkatnya kesadaran konsumen terhadap produk kesehatan mendorong kebutuhan tekstil dengan sifat antibakteri. Penelitian ini mengeksplorasi potensi ekstrak daun sirih sebagai agen antibakteri alami pada tekstil. Melalui metode pad-dry-cure, ekstrak daun sirih berhasil difiksasi pada serat katun dan polyester. Hasil pengujian mikrobiologi menunjukkan efektivitas antibakteri hingga 99.9% terhadap Staphylococcus aureus dan E. coli. Sifat antibakteri bertahan hingga 50 kali pencucian. Tekstil ini cocok untuk pakaian olahraga, seragam medis, dan produk garmen lainnya. Biaya produksi hanya meningkat 15% dari tekstil konvensional.",
    keywords: ["Tekstil", "Antibakteri", "Daun Sirih", "Garmen"],
    summary:
      "Kain yang direndam ekstrak daun sirih bisa membunuh bakteri penyebab bau badan hingga 99.9% dan tahan sampai 50 kali cuci.",
    views: 478,
    downloads: 124,
    collaborations: 8,
    aiSummaryGenerated: false,
  },
  {
    id: 3,
    title:
      "Sistem Monitoring Kualitas Produksi Real-Time Berbasis IoT untuk IKM Logam",
    author: "Dr. Ir. Ahmad Fauzi, M.Eng.",
    institution: "Institut Teknologi Sepuluh Nopember",
    year: 2023,
    field: "Logam & Metalurgi",
    type: "Terapan",
    trl: 8,
    abstract:
      "Sistem IoT ini memungkinkan monitoring kualitas produksi secara real-time dengan akurasi 95%. Dapat mendeteksi cacat produksi sejak dini dan mengurangi produk gagal hingga 30%.",
    fullAbstract:
      "Industri logam kecil menengah sering mengalami masalah kualitas produk yang tidak konsisten akibat keterbatasan sistem monitoring. Penelitian ini mengembangkan sistem monitoring berbasis IoT yang terintegrasi dengan sensor kualitas, kamera AI, dan dashboard analytics. Sistem mampu mendeteksi 15 jenis cacat produksi secara otomatis dengan akurasi 95%. Data real-time memungkinkan operator mengambil keputusan cepat untuk koreksi proses. Implementasi pada 3 IKM pilot menunjukkan penurunan reject rate dari 12% menjadi 4% dalam 3 bulan. Investasi sistem dapat balik modal dalam 18 bulan.",
    keywords: ["IoT", "Monitoring", "Kualitas", "Logam", "Smart Factory"],
    summary:
      "Sensor pintar yang dipasang di mesin produksi bisa mendeteksi produk cacat secara otomatis dan mengirim notifikasi ke handphone operator.",
    views: 623,
    downloads: 198,
    collaborations: 12,
    aiSummaryGenerated: false,
  },
  {
    id: 4,
    title:
      "Formulasi Kemasan Biodegradable dari Limbah Kulit Singkong untuk Industri Pangan",
    author: "Dr. Rahma Wijayanti, S.T., M.T.",
    institution: "Universitas Brawijaya",
    year: 2024,
    field: "Kemasan & Packaging",
    type: "Terapan",
    trl: 6,
    abstract:
      "Kemasan ramah lingkungan dari kulit singkong yang dapat terurai dalam 90 hari. Kekuatan dan ketahanan air setara dengan plastik konvensional namun 100% biodegradable.",
    fullAbstract:
      "Masalah sampah plastik kemasan mendorong pencarian alternatif material biodegradable. Penelitian ini memanfaatkan limbah kulit singkong yang melimpah sebagai bahan baku kemasan. Melalui proses ekstraksi pati, modifikasi kimia, dan pembentukan film, dihasilkan kemasan dengan tensile strength 45 MPa dan water resistance hingga 72 jam. Kemasan dapat terurai sempurna dalam 90 hari di kondisi kompos. Uji packaging pada produk makanan kering menunjukkan kemasan mampu menjaga kesegaran produk sama dengan plastik PE. Biaya produksi 20% lebih tinggi namun dapat bersaing dengan premium eco-packaging.",
    keywords: ["Biodegradable", "Kemasan", "Singkong", "Ramah Lingkungan"],
    summary:
      "Kemasan makanan dari kulit singkong yang bisa hancur sendiri dalam 3 bulan, tidak mencemari lingkungan, dan sama kuatnya dengan plastik biasa.",
    views: 556,
    downloads: 167,
    collaborations: 9,
    aiSummaryGenerated: false,
  },
  {
    id: 5,
    title:
      "Penggunaan Enzim Alami untuk Meningkatkan Daya Tahan Produk Makanan Tanpa Pengawet",
    author: "Prof. Dr. Hendra Kusuma, M.Si.",
    institution: "Universitas Airlangga",
    year: 2023,
    field: "Makanan & Minuman",
    type: "Dasar",
    trl: 5,
    abstract:
      "Penelitian tentang enzim alami dari buah-buahan tropis yang dapat memperpanjang masa simpan produk makanan hingga 200% tanpa pengawet kimia.",
    fullAbstract:
      "Konsumen semakin menghindari makanan dengan pengawet sintetis. Penelitian ini mengeksplorasi potensi enzim lisosom dari ekstrak nanas, pepaya, dan jambu biji sebagai pengawet alami. Enzim ini efektif menghambat pertumbuhan mikroba pembusuk tanpa mengubah rasa dan tekstur makanan. Pengujian pada 8 jenis produk makanan menunjukkan perpanjangan masa simpan 2-3 kali lipat. Enzim stabil pada suhu ruang dan pH 4-7. Aplikasi potensial pada produk bakery, snack, dan frozen food. Biaya ekstraksi enzim masih tinggi dan perlu optimasi untuk skala industri.",
    keywords: ["Enzim", "Pengawet Alami", "Makanan", "Food Safety"],
    summary:
      "Cairan dari buah nanas dan pepaya bisa membuat makanan tahan lama 2-3 kali lipat tanpa pakai bahan pengawet kimia.",
    views: 412,
    downloads: 103,
    collaborations: 6,
    aiSummaryGenerated: false,
  },
  {
    id: 6,
    title:
      "Implementasi Machine Learning untuk Prediksi Demand Produksi di IKM Tekstil",
    author: "Dr. Dimas Prasetyo, S.Kom., M.Kom.",
    institution: "Universitas Indonesia",
    year: 2024,
    field: "Tekstil & Garmen",
    type: "Terapan",
    trl: 7,
    abstract:
      "Sistem AI yang dapat memprediksi permintaan pasar dengan akurasi 87%, membantu IKM mengurangi overstock hingga 40% dan meningkatkan efisiensi produksi.",
    fullAbstract:
      "Fluktuasi permintaan pasar menyebabkan IKM tekstil sering mengalami overstock atau stockout. Penelitian ini mengembangkan model machine learning berbasis Random Forest dan LSTM untuk prediksi demand. Model dilatih menggunakan data historis penjualan, tren fashion, musim, dan faktor ekonomi. Akurasi prediksi mencapai 87% untuk forecast 3 bulan ke depan. Implementasi pada 5 IKM menunjukkan pengurangan inventory cost 35% dan peningkatan service level 25%. Sistem dapat diakses melalui dashboard web yang user-friendly. Rekomendasi produksi otomatis membantu planning produksi lebih optimal.",
    keywords: ["Machine Learning", "Demand Forecasting", "Tekstil", "AI"],
    summary:
      "Komputer pintar yang bisa menebak berapa banyak baju yang akan laku bulan depan dengan tingkat ketepatan 87%, sehingga pabrik tidak perlu menumpuk stok berlebihan.",
    views: 789,
    downloads: 234,
    collaborations: 15,
    aiSummaryGenerated: false,
  },
];

// Dummy IKM Data for Collaboration
const dummyCollaborationIKM = [
  {
    id: 1,
    name: "CV Furniture Jaya Abadi",
    field: "Furniture & Kerajinan",
    status: "Aktif",
    research: "Optimalisasi Proses Finishing",
    progress: 75,
  },
  {
    id: 2,
    name: "UD Tekstil Nusantara",
    field: "Tekstil & Garmen",
    status: "Diajukan",
    research: "Tekstil Antibakteri",
    progress: 15,
  },
  {
    id: 3,
    name: "PT Logam Presisi Indo",
    field: "Logam & Metalurgi",
    status: "Selesai",
    research: "Sistem Monitoring IoT",
    progress: 100,
  },
];

const ResearchPage = () => {
  const [activeTab, setActiveTab] = useState("feed"); // feed, upload, collaboration
  const [researchList] = useState(dummyResearchData);
  const [filteredResearch, setFilteredResearch] = useState(dummyResearchData);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [aiSummaryLoading, setAiSummaryLoading] = useState(false);

  const fields = [
    "Semua",
    "Furniture & Kerajinan",
    "Tekstil & Garmen",
    "Logam & Metalurgi",
    "Kemasan & Packaging",
    "Makanan & Minuman",
  ];
  const years = ["Semua", "2024", "2023", "2022", "2021"];
  const types = ["Semua", "Terapan", "Dasar", "Eksperimental"];

  // Filter Research
  const applyFilters = () => {
    let filtered = researchList;

    if (searchQuery) {
      filtered = filtered.filter(
        (research) =>
          research.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          research.author.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedField && selectedField !== "Semua") {
      filtered = filtered.filter(
        (research) => research.field === selectedField
      );
    }

    if (selectedYear && selectedYear !== "Semua") {
      filtered = filtered.filter(
        (research) => research.year === parseInt(selectedYear)
      );
    }

    if (selectedType && selectedType !== "Semua") {
      filtered = filtered.filter((research) => research.type === selectedType);
    }

    // Sorting
    if (sortBy === "newest") {
      filtered.sort((a, b) => b.year - a.year);
    } else if (sortBy === "popular") {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === "downloads") {
      filtered.sort((a, b) => b.downloads - a.downloads);
    }

    setFilteredResearch(filtered);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedField("");
    setSelectedYear("");
    setSelectedType("");
    setSortBy("newest");
    setFilteredResearch(researchList);
  };

  // AI Summarizer Placeholder
  const generateAISummary = () => {
    // AI Integration Placeholder: This will be connected to AI API in future
    setAiSummaryLoading(true);
    setTimeout(() => {
      const updated = { ...selectedResearch, aiSummaryGenerated: true };
      setSelectedResearch(updated);
      setAiSummaryLoading(false);
    }, 2000);
  };

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
              Repository Penelitian
            </h1>
            <p
              className="text-xl text-center text-green-50 mb-8"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Akses hasil penelitian terbaru untuk inovasi dan pengembangan IKM
              Indonesia
            </p>

            {/* Tab Navigation */}
            <div className="flex justify-center space-x-4 mb-8">
              <button
                onClick={() => setActiveTab("feed")}
                className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  activeTab === "feed"
                    ? "bg-white text-green-600 shadow-xl hover:shadow-2xl hover:bg-green-50"
                    : "bg-white/20 text-white hover:bg-white/30 hover:shadow-lg backdrop-blur-sm"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">📚</span>
                  <span>Jelajahi Penelitian</span>
                </div>
                {activeTab === "feed" && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-green-500 rounded-full" />
                )}
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                    activeTab === "feed"
                      ? "opacity-0"
                      : "opacity-0 group-hover:opacity-100 bg-white/5"
                  }`}
                />
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  activeTab === "upload"
                    ? "bg-white text-green-600 shadow-xl hover:shadow-2xl hover:bg-green-50"
                    : "bg-white/20 text-white hover:bg-white/30 hover:shadow-lg backdrop-blur-sm"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">✍️</span>
                  <span>Unggah Penelitian</span>
                </div>
                {activeTab === "upload" && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-green-500 rounded-full" />
                )}
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                    activeTab === "upload"
                      ? "opacity-0"
                      : "opacity-0 group-hover:opacity-100 bg-white/5"
                  }`}
                />
              </button>
              <button
                onClick={() => setActiveTab("collaboration")}
                className={`group relative px-8 py-4 rounded-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 ${
                  activeTab === "collaboration"
                    ? "bg-white text-green-600 shadow-xl hover:shadow-2xl hover:bg-green-50"
                    : "bg-white/20 text-white hover:bg-white/30 hover:shadow-lg backdrop-blur-sm"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🤝</span>
                  <span>Kolaborasi</span>
                </div>
                {activeTab === "collaboration" && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-green-500 rounded-full" />
                )}
                <div
                  className={`absolute inset-0 rounded-xl transition-opacity duration-300 ${
                    activeTab === "collaboration"
                      ? "opacity-0"
                      : "opacity-0 group-hover:opacity-100 bg-white/5"
                  }`}
                />
              </button>
            </div>

            {/* Search Bar (Only for Feed Tab) */}
            {activeTab === "feed" && (
              <>
                <div className="max-w-3xl mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari judul penelitian atau nama akademisi..."
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
              </>
            )}
          </div>
        </div>

        {/* Filters Section */}
        {activeTab === "feed" && showFilters && (
          <div className="bg-white shadow-md py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Bidang Industri
                  </label>
                  <select
                    value={selectedField}
                    onChange={(e) => setSelectedField(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {fields.map((field) => (
                      <option
                        key={field}
                        value={field === "Semua" ? "" : field}
                      >
                        {field}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Tahun
                  </label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {years.map((year) => (
                      <option key={year} value={year === "Semua" ? "" : year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Jenis Penelitian
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {types.map((type) => (
                      <option key={type} value={type === "Semua" ? "" : type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-gray-700 mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Urutkan
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    <option value="newest">Terbaru</option>
                    <option value="popular">Populer</option>
                    <option value="downloads">Paling Banyak Diunduh</option>
                  </select>
                </div>
              </div>
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

        {/* Research Feed Tab */}
        {activeTab === "feed" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <FileText className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3
                  className="text-3xl font-bold text-green-600 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {researchList.length}
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Penelitian Terunggah
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <Users className="w-12 h-12 text-blue-600 mx-auto mb-3" />
                <h3
                  className="text-3xl font-bold text-blue-600 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {
                    dummyCollaborationIKM.filter((c) => c.status === "Aktif")
                      .length
                  }
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Kolaborasi Aktif
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
                <TrendingUp className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
                <h3
                  className="text-3xl font-bold text-yellow-600 mb-2"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Tekstil
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Bidang Paling Populer
                </p>
              </div>
            </div>

            {/* Research Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResearch.map((research) => (
                <div
                  key={research.id}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <span
                        className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {research.field}
                      </span>
                      <span className="text-sm text-gray-500 font-semibold">
                        {research.year}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      className="text-lg font-bold text-gray-800 mb-3 line-clamp-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {research.title}
                    </h3>

                    {/* Author */}
                    <div className="mb-4">
                      <p
                        className="text-sm font-semibold text-gray-700"
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {research.author}
                      </p>
                      <p
                        className="text-xs text-gray-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        {research.institution}
                      </p>
                    </div>

                    {/* Abstract */}
                    <p
                      className="text-sm text-gray-600 mb-4 line-clamp-3"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {research.abstract}
                    </p>

                    {/* TRL Badge */}
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg font-semibold">
                        TRL {research.trl}/9
                      </span>
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold">
                        {research.type}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>👁️ {research.views} views</span>
                      <span>⬇️ {research.downloads} downloads</span>
                      <span>🤝 {research.collaborations}</span>
                    </div>

                    {/* Button */}
                    <button
                      onClick={() => setSelectedResearch(research)}
                      className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Lihat Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Research Tab */}
        {activeTab === "upload" && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2
                className="text-3xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Unggah Hasil Penelitian
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6"></div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p
                  className="text-blue-800 text-sm"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  ℹ️ Hasil penelitian Anda akan melalui proses verifikasi oleh
                  admin sebelum dipublikasikan di platform. Proses verifikasi
                  membutuhkan waktu 3-5 hari kerja.
                </p>
              </div>

              <form className="space-y-6">
                {/* Judul Penelitian */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Judul Penelitian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Masukkan judul penelitian lengkap"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Bidang Industri */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Bidang Industri <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  >
                    <option value="">Pilih bidang industri</option>
                    <option value="furniture">Furniture & Kerajinan</option>
                    <option value="textile">Tekstil & Garmen</option>
                    <option value="metal">Logam & Metalurgi</option>
                    <option value="packaging">Kemasan & Packaging</option>
                    <option value="food">Makanan & Minuman</option>
                    <option value="chemical">Kimia & Farmasi</option>
                    <option value="electronics">Elektronik & Komponen</option>
                  </select>
                </div>

                {/* Jenis Penelitian & Tahun */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Jenis Penelitian <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    >
                      <option value="">Pilih jenis</option>
                      <option value="applied">Terapan</option>
                      <option value="basic">Dasar</option>
                      <option value="experimental">Eksperimental</option>
                      <option value="development">Pengembangan</option>
                    </select>
                  </div>
                  <div>
                    <label
                      className="block text-gray-700 font-semibold mb-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Tahun Penelitian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      min="2000"
                      max="2025"
                      placeholder="2024"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                      required
                    />
                  </div>
                </div>

                {/* TRL Level */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Technology Readiness Level (TRL){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  >
                    <option value="">Pilih TRL Level</option>
                    <option value="1">TRL 1 - Prinsip dasar diamati</option>
                    <option value="2">
                      TRL 2 - Konsep teknologi diformulasikan
                    </option>
                    <option value="3">
                      TRL 3 - Proof of concept eksperimental
                    </option>
                    <option value="4">
                      TRL 4 - Validasi teknologi di laboratorium
                    </option>
                    <option value="5">
                      TRL 5 - Validasi teknologi di lingkungan relevan
                    </option>
                    <option value="6">
                      TRL 6 - Demonstrasi teknologi di lingkungan relevan
                    </option>
                    <option value="7">
                      TRL 7 - Demonstrasi prototipe di lingkungan operasional
                    </option>
                    <option value="8">
                      TRL 8 - Sistem lengkap dan dikualifikasi
                    </option>
                    <option value="9">
                      TRL 9 - Sistem terbukti di lingkungan operasional
                    </option>
                  </select>
                </div>

                {/* Abstrak */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Abstrak / Deskripsi <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={6}
                    placeholder="Jelaskan ringkasan penelitian Anda (maksimal 500 kata)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                    required
                  />
                </div>

                {/* Kata Kunci */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Kata Kunci (Keywords)
                  </label>
                  <input
                    type="text"
                    placeholder="Pisahkan dengan koma (contoh: IoT, Monitoring, Kualitas, Logam)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {/* AI Keyword Integration Placeholder: Future AI will auto-extract keywords */}
                    💡 Fitur ekstraksi kata kunci otomatis dengan AI akan segera
                    tersedia
                  </p>
                </div>

                {/* Upload PDF */}
                <div>
                  <label
                    className="block text-gray-700 font-semibold mb-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Upload Dokumen PDF <span className="text-red-500">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p
                      className="text-gray-600 mb-2"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Klik untuk upload atau drag & drop file
                    </p>
                    <p className="text-xs text-gray-500">PDF (Maksimal 10MB)</p>
                    <input type="file" accept=".pdf" className="hidden" />
                  </div>
                </div>

                {/* Persetujuan */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    className="mt-1 w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    required
                  />
                  <label
                    className="text-sm text-gray-700"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    Saya menyatakan bahwa penelitian ini adalah karya asli dan
                    saya memberikan izin untuk dipublikasikan di platform
                    MitraKita untuk kepentingan pengembangan industri Indonesia.
                  </label>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Kirim untuk Verifikasi
                  </button>
                  <button
                    type="button"
                    className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    Draft
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Collaboration Tab */}
        {activeTab === "collaboration" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
              <h2
                className="text-3xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Kolaborasi Penelitian dengan IKM
              </h2>
              <p
                className="text-gray-600 text-lg"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Jalin kemitraan riset dengan IKM untuk mengimplementasikan hasil
                penelitian Anda
              </p>
            </div>

            {/* Collaboration Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {dummyCollaborationIKM.map((collab) => (
                <div
                  key={collab.id}
                  className="bg-white rounded-2xl shadow-lg p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3
                      className="text-lg font-bold text-gray-800"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {collab.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        collab.status === "Aktif"
                          ? "bg-green-100 text-green-700"
                          : collab.status === "Diajukan"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {collab.status}
                    </span>
                  </div>

                  <p
                    className="text-sm text-gray-600 mb-3"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    <strong>Bidang:</strong> {collab.field}
                  </p>

                  <p
                    className="text-sm text-gray-600 mb-4"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    <strong>Penelitian:</strong> {collab.research}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{collab.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          collab.status === "Selesai"
                            ? "bg-blue-600"
                            : collab.status === "Aktif"
                            ? "bg-green-600"
                            : "bg-yellow-600"
                        }`}
                        style={{ width: `${collab.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <button
                    className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold hover:bg-green-700 transition"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {collab.status === "Selesai"
                      ? "Lihat Laporan"
                      : "Lihat Detail"}
                  </button>
                </div>
              ))}
            </div>

            {/* Propose New Collaboration */}
            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white">
              <h3
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Ajukan Kolaborasi Baru
              </h3>
              <p
                className="text-green-50 mb-6"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Ingin mengajukan penelitian bersama dengan IKM? Kami akan
                membantu mencarikan mitra yang sesuai dengan bidang penelitian
                Anda.
              </p>
              <button
                className="bg-white text-green-600 px-8 py-3 rounded-xl font-bold hover:shadow-xl transition"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Ajukan Kolaborasi Baru
              </button>
            </div>
          </div>
        )}

        {/* Research Detail Modal */}
        {selectedResearch && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedResearch(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h2
                      className="text-2xl font-bold mb-3"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedResearch.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-green-50">
                      <span>👤 {selectedResearch.author}</span>
                      <span>🏛️ {selectedResearch.institution}</span>
                      <span>📅 {selectedResearch.year}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedResearch(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition flex-shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-green-50 rounded-xl p-4 text-center">
                    <p
                      className="text-2xl font-bold text-green-600"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedResearch.views}
                    </p>
                    <p
                      className="text-xs text-gray-600"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Views
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-center">
                    <p
                      className="text-2xl font-bold text-blue-600"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedResearch.downloads}
                    </p>
                    <p
                      className="text-xs text-gray-600"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Downloads
                    </p>
                  </div>
                  <div className="bg-yellow-50 rounded-xl p-4 text-center">
                    <p
                      className="text-2xl font-bold text-yellow-600"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      TRL {selectedResearch.trl}
                    </p>
                    <p
                      className="text-xs text-gray-600"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Readiness
                    </p>
                  </div>
                  <div className="bg-purple-50 rounded-xl p-4 text-center">
                    <p
                      className="text-2xl font-bold text-purple-600"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedResearch.collaborations}
                    </p>
                    <p
                      className="text-xs text-gray-600"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Kolaborasi
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedResearch.field}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedResearch.type}
                  </span>
                  {selectedResearch.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>

                {/* Abstract */}
                <div>
                  <h3
                    className="text-xl font-bold text-gray-800 mb-3"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Abstrak
                  </h3>
                  <p
                    className="text-gray-700 leading-relaxed"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {selectedResearch.fullAbstract}
                  </p>
                </div>

                {/* AI Summary Section */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-xl font-bold text-gray-800 flex items-center"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      <span className="mr-2">🤖</span> Ringkasan AI
                    </h3>
                    {!selectedResearch.aiSummaryGenerated && (
                      <button
                        onClick={generateAISummary}
                        disabled={aiSummaryLoading}
                        className={`px-4 py-2 rounded-xl font-semibold transition ${
                          aiSummaryLoading
                            ? "bg-gray-300 text-gray-500 cursor-wait"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {aiSummaryLoading
                          ? "Menghasilkan..."
                          : "Generate Ringkasan"}
                      </button>
                    )}
                  </div>
                  {/* AI Summarizer Integration Placeholder: Connect to AI API for automatic summarization */}
                  {selectedResearch.aiSummaryGenerated ? (
                    <div className="bg-white rounded-xl p-4">
                      <p
                        className="text-gray-700 leading-relaxed"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        <strong>Ringkasan Mudah Dipahami:</strong>
                        <br />
                        {selectedResearch.summary}
                      </p>
                    </div>
                  ) : (
                    <p
                      className="text-gray-600 italic"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Klik tombol "Generate Ringkasan" untuk mendapatkan
                      ringkasan otomatis dari AI yang mudah dipahami
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    className="bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span>Chat Akademisi</span>
                  </button>
                  <button
                    className="bg-gradient-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    <FileText className="w-5 h-5" />
                    <span>Unduh PDF</span>
                  </button>
                </div>

                <button
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-800 py-4 rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center space-x-2"
                  style={{ fontFamily: "Montserrat, sans-serif" }}
                >
                  <Users className="w-5 h-5" />
                  <span>Ajukan Kolaborasi Penelitian</span>
                </button>

                {/* Comments Section (Placeholder) */}
                <div className="border-t border-gray-200 pt-6">
                  <h3
                    className="text-xl font-bold text-gray-800 mb-4"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Diskusi & Komentar
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-6 text-center">
                    <p
                      className="text-gray-500"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Fitur diskusi akan segera tersedia. Anda dapat bertanya
                      dan berdiskusi langsung dengan peneliti.
                    </p>
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

export default ResearchPage;
