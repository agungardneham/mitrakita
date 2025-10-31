import React from "react";
import { Link } from "react-router-dom";
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

const AboutUsPage = () => {
  const coreValues = [
    {
      icon: <CheckCircle className="w-8 h-8 text-green-600" />,
      title: "Integritas",
      description:
        "Mengedepankan transparansi dan kejujuran dalam setiap kemitraan yang terjalin",
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Kolaborasi",
      description:
        "Membangun sinergi antara IKM, industri besar, dan akademisi untuk pertumbuhan bersama",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-yellow-600" />,
      title: "Inovasi",
      description:
        "Mendorong penggunaan teknologi dan penelitian untuk meningkatkan daya saing IKM",
    },
    {
      icon: <Star className="w-8 h-8 text-green-600" />,
      title: "Kualitas",
      description:
        "Menjamin standar produk dan layanan melalui sistem verifikasi yang ketat",
    },
    {
      icon: <Building2 className="w-8 h-8 text-blue-600" />,
      title: "Keberlanjutan",
      description:
        "Membangun ekosistem industri yang berkelanjutan dan berdampak jangka panjang",
    },
    {
      icon: <GraduationCap className="w-8 h-8 text-yellow-600" />,
      title: "Pemberdayaan",
      description:
        "Memberikan akses dan kesempatan yang setara bagi seluruh pelaku industri kecil",
    },
  ];

  const mainFeatures = [
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Database IKM Terverifikasi",
      description:
        "Akses lengkap ke profil IKM yang telah melalui proses verifikasi admin dengan informasi produk, layanan, dan kapasitas produksi yang tervalidasi",
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Sistem Chat Terintegrasi",
      description:
        "Platform komunikasi real-time yang memungkinkan diskusi langsung antara IKM dengan mitra potensial atau akademisi untuk kolaborasi riset",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Repository Penelitian",
      description:
        "Kumpulan hasil penelitian akademis dengan fitur AI summarization yang memudahkan IKM menemukan inovasi dan teknologi terbaru",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Partnership Tracking",
      description:
        "Sistem monitoring progress kemitraan dari tahap order hingga pengiriman dengan update status real-time dan transparansi penuh",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Rating & Feedback System",
      description:
        "Mekanisme penilaian dan ulasan yang membangun kepercayaan serta mendorong peningkatan kualitas layanan berkelanjutan",
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Admin Verification",
      description:
        "Semua konten melalui proses kurasi dan verifikasi ketat untuk menjamin kredibilitas dan keamanan seluruh pengguna platform",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="bg-green-50 min-h-screen">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-green-600 via-green-500 to-blue-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1
              className="text-5xl md:text-6xl font-bold mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Tentang MitraKita
            </h1>
            <p
              className="text-xl md:text-2xl text-green-50 max-w-3xl mx-auto"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Platform digital Kementerian Perindustrian yang menghubungkan IKM
              dengan industri besar dan akademisi untuk membangun ekosistem
              industri Indonesia yang kuat dan berkelanjutan
            </p>
          </div>
        </div>

        {/* Visi dan Misi */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visi */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-green-500 rounded-2xl flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2
                className="text-3xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Visi
              </h2>
              <p
                className="text-gray-700 text-lg leading-relaxed"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Menjadi platform digital terdepan yang mengakselerasi
                pertumbuhan Industri Kecil dan Menengah Indonesia melalui
                kolaborasi strategis dengan industri besar dan lembaga akademis,
                menciptakan ekosistem industri yang inklusif, inovatif, dan
                berdaya saing global.
              </p>
            </div>

            {/* Misi */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2
                className="text-3xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Misi
              </h2>
              <ul
                className="space-y-3 text-gray-700"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    Memfasilitasi link-and-match antara IKM dengan industri
                    besar dan akademisi
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    Meningkatkan akses IKM terhadap teknologi dan hasil
                    penelitian
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    Membangun sistem kemitraan yang transparan dan saling
                    menguntungkan
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    Mendorong digitalisasi dan modernisasi operasional IKM
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Latar Belakang */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-4xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Latar Belakang
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto rounded-full"></div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 rounded-2xl p-8 mb-8">
                <p
                  className="text-gray-700 text-lg leading-relaxed mb-6"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Industri Kecil dan Menengah (IKM) merupakan tulang punggung
                  perekonomian Indonesia, menyumbang lebih dari 60% PDB dan
                  menyerap jutaan tenaga kerja. Namun, IKM masih menghadapi
                  berbagai tantangan dalam mengakses pasar yang lebih luas,
                  teknologi modern, dan hasil penelitian yang dapat meningkatkan
                  daya saing mereka.
                </p>
                <p
                  className="text-gray-700 text-lg leading-relaxed mb-6"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  Di sisi lain, industri besar membutuhkan mitra lokal yang
                  dapat diandalkan untuk mendukung rantai pasok mereka,
                  sementara lembaga akademis memiliki banyak hasil penelitian
                  yang belum dimanfaatkan secara optimal oleh industri.
                  Kesenjangan ini menciptakan peluang yang belum tergali
                  maksimal.
                </p>
                <p
                  className="text-gray-700 text-lg leading-relaxed"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  MitraKita hadir sebagai jembatan digital yang menghubungkan
                  ketiga pihak ini dalam ekosistem yang terintegrasi. Dengan
                  memanfaatkan teknologi digital dan sistem verifikasi yang
                  kredibel, MitraKita memfasilitasi pembentukan kemitraan yang
                  transparan, efisien, dan saling menguntungkan, mendorong
                  pertumbuhan industri nasional yang berkelanjutan.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-gradient-to-br from-green-600 to-green-500 rounded-2xl p-6 text-white text-center">
                  <h3
                    className="text-4xl font-bold mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    60%+
                  </h3>
                  <p style={{ fontFamily: "Open Sans, sans-serif" }}>
                    Kontribusi IKM terhadap PDB Indonesia
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-6 text-white text-center">
                  <h3
                    className="text-4xl font-bold mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    97%
                  </h3>
                  <p style={{ fontFamily: "Open Sans, sans-serif" }}>
                    Proporsi IKM dari total unit usaha
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-2xl p-6 text-white text-center">
                  <h3
                    className="text-4xl font-bold mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Jutaan
                  </h3>
                  <p style={{ fontFamily: "Open Sans, sans-serif" }}>
                    Tenaga kerja terserap di sektor IKM
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Core Values
            </h2>
            <p
              className="text-gray-600 text-lg max-w-2xl mx-auto"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Nilai-nilai fundamental yang menjadi landasan kami dalam membangun
              ekosistem kemitraan industri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1"
              >
                <div className="mb-4">{value.icon}</div>
                <h3
                  className="text-xl font-semibold text-gray-800 mb-3"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-gray-600"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Fitur Utama */}
        <div className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2
                className="text-4xl font-bold text-gray-800 mb-4"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Fitur Utama MitraKita
              </h2>
              <p
                className="text-gray-600 text-lg max-w-2xl mx-auto"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Platform komprehensif yang dirancang untuk memaksimalkan potensi
                kolaborasi dan pertumbuhan
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mainFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-green-50 rounded-2xl p-8 hover:shadow-lg transition-all"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                      idx % 3 === 0
                        ? "bg-gradient-to-br from-green-600 to-green-500 text-white"
                        : idx % 3 === 1
                        ? "bg-gradient-to-br from-blue-600 to-blue-500 text-white"
                        : "bg-gradient-to-br from-yellow-500 to-yellow-400 text-white"
                    }`}
                  >
                    {feature.icon}
                  </div>
                  <h3
                    className="text-xl font-semibold text-gray-800 mb-3"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-gray-700 leading-relaxed"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filosofi Nama dan Logo */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-12">
            <h2
              className="text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Filosofi Nama dan Logo
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-blue-600 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Logo Visualization */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 bg-gradient-to-br from-green-600 via-green-500 to-blue-600 rounded-3xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all">
                  <Users className="w-32 h-32 text-white" />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg">
                  <p
                    className="font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    MitraKita
                  </p>
                </div>
              </div>
            </div>

            {/* Philosophy Content */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3
                  className="text-2xl font-bold text-green-600 mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Makna Nama "MitraKita"
                </h3>
                <p
                  className="text-gray-700 leading-relaxed mb-4"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  <strong className="text-green-600">Mitra</strong> melambangkan
                  kemitraan yang setara dan saling menguntungkan antara semua
                  pihak tanpa memandang skala usaha.
                </p>
                <p
                  className="text-gray-700 leading-relaxed"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  <strong className="text-blue-600">Kita</strong> menekankan
                  rasa kepemilikan bersama dan kolaborasi, bahwa platform ini
                  milik seluruh ekosistem industri Indonesia.
                </p>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3
                  className="text-2xl font-bold text-blue-600 mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Simbolisme Logo
                </h3>
                <div
                  className="space-y-3 text-gray-700"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  <p className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Handshake Abstract:</strong> Simbol kepercayaan,
                      kesepakatan, dan kemitraan yang kuat
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-blue-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Warna Hijau:</strong> Pertumbuhan, kesejahteraan,
                      dan keberlanjutan industri
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-yellow-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Warna Biru:</strong> Profesionalisme, kepercayaan,
                      dan stabilitas pemerintah
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Aksen Kuning:</strong> Inovasi, optimisme, dan
                      energi positif dalam berkolaborasi
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Mari Bergabung dengan MitraKita
            </h2>
            <p
              className="text-xl text-green-50 mb-8"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Jadilah bagian dari ekosistem industri Indonesia yang terhubung,
              bermitra, dan bertumbuh bersama
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-block bg-white text-green-600 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Daftar Sekarang
              </Link>
              <button
                className="bg-yellow-400 text-gray-800 px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AboutUsPage;
