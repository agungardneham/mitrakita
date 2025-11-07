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
import logo from "../assets/MitraKita-Logo-fc.png";

const AboutUsPage = () => {
  const coreValues = [
    {
      icon: (
        <svg
          className="w-10 h-10"
          viewBox="0 0 48 48"
          xmlns="http://www.w3.org/2000/svg"
          fill="#43A047 "
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <title>service-setting</title>{" "}
            <g id="Layer_2" data-name="Layer 2">
              {" "}
              <g id="invisible_box" data-name="invisible box">
                {" "}
                <rect width="48" height="48" fill="none"></rect>{" "}
                <rect width="48" height="48" fill="none"></rect>{" "}
                <rect width="48" height="48" fill="none"></rect>{" "}
              </g>{" "}
              <g id="icons_Q2" data-name="icons Q2">
                {" "}
                <g>
                  {" "}
                  <path d="M28.7,18.8l-1.8,2.9,1.4,1.4,2.9-1.8,1,.4L33,25h2l.8-3.3,1-.4,2.9,1.8,1.4-1.4-1.8-2.9a4.2,4.2,0,0,0,.4-1L43,17V15l-3.3-.8a4.2,4.2,0,0,0-.4-1l1.8-2.9L39.7,8.9l-2.9,1.8-1-.4L35,7H33l-.8,3.3-1,.4L28.3,8.9l-1.4,1.4,1.8,2.9a4.2,4.2,0,0,0-.4,1L25,15v2l3.3.8A4.2,4.2,0,0,0,28.7,18.8ZM34,14a2,2,0,1,1-2,2A2,2,0,0,1,34,14Z"></path>{" "}
                  <path d="M42.2,28.7a5.2,5.2,0,0,0-4-1.1l-9.9,1.8a4.5,4.5,0,0,0-1.4-3.3L19.8,19H5a2,2,0,0,0,0,4H18.2l5.9,5.9a.8.8,0,0,1-1.2,1.2l-3.5-3.5a2,2,0,0,0-2.8,2.8l3.5,3.5a4.5,4.5,0,0,0,3.4,1.4,5.7,5.7,0,0,0,1.8-.3h0l13.6-2.4a1,1,0,0,1,.8.2.9.9,0,0,1,.3.7,1,1,0,0,1-.8,1L20.6,36.9,9.7,28H5a2,2,0,0,0,0,4H8.3l11.1,9.1,20.5-3.7a5,5,0,0,0,2.3-8.7Z"></path>{" "}
                </g>{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>
      ),
      title: "Berorientasi Pelayanan",
      description: "Memberikan kemudahan dan solusi digital terbaik bagi IKM",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 13.9021 3.5901 15.6665 4.59721 17.1199C4.70168 17.2707 4.7226 17.4653 4.64529 17.6317L3.42747 20.2519C3.23699 20.5853 3.47768 21 3.86159 21H12Z"
              stroke="#0288D1 "
              stroke-width="2"
            ></path>{" "}
            <path
              d="M15 10L11.25 14L9 12.1818"
              stroke="#0288D1 "
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            ></path>{" "}
          </g>
        </svg>
      ),
      title: "Akuntabel",
      description:
        "Mengedepankan transparansi dan kejujuran dalam setiap kemitraan yang terjalin",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="#FDD835"
          height="200px"
          width="200px"
          version="1.1"
          id="Icons"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 32 32"
          xml:space="preserve"
          stroke="#FDD835"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path d="M30,3h-2H4H2C1.4,3,1,3.4,1,4s0.4,1,1,1h1v16c0,0.6,0.4,1,1,1h9.8l-5.5,6.3c-0.4,0.4-0.3,1,0.1,1.4C8.5,29.9,8.8,30,9,30 c0.3,0,0.6-0.1,0.8-0.3l5.2-6V28c0,0.6,0.4,1,1,1s1-0.4,1-1v-4.3l5.2,6c0.2,0.2,0.5,0.3,0.8,0.3c0.2,0,0.5-0.1,0.7-0.2 c0.4-0.4,0.5-1,0.1-1.4L18.2,22H28c0.6,0,1-0.4,1-1V5h1c0.6,0,1-0.4,1-1S30.6,3,30,3z M24.8,8.6l-4,6c-0.3,0.4-0.8,0.6-1.3,0.3 L15.8,13h-3.4l-3.7,3.7C8.5,16.9,8.3,17,8,17s-0.5-0.1-0.7-0.3c-0.4-0.4-0.4-1,0-1.4l4-4c0.2-0.2,0.4-0.3,0.7-0.3h4 c0.2,0,0.3,0,0.4,0.1l3.2,1.6l3.5-5.3c0.3-0.5,0.9-0.6,1.4-0.3C25,7.5,25.1,8.1,24.8,8.6z"></path>{" "}
          </g>
        </svg>
      ),
      title: "Kompeten",
      description:
        "Mengembangkan inovasi dan pengetahuan untuk kemajuan industri nasional",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <path
              d="M17.5291 7.77C17.4591 7.76 17.3891 7.76 17.3191 7.77C15.7691 7.72 14.5391 6.45 14.5391 4.89C14.5391 3.3 15.8291 2 17.4291 2C19.0191 2 20.3191 3.29 20.3191 4.89C20.3091 6.45 19.0791 7.72 17.5291 7.77Z"
              fill="#43A047 "
            ></path>{" "}
            <path
              d="M20.7916 14.7004C19.6716 15.4504 18.1016 15.7304 16.6516 15.5404C17.0316 14.7204 17.2316 13.8104 17.2416 12.8504C17.2416 11.8504 17.0216 10.9004 16.6016 10.0704C18.0816 9.8704 19.6516 10.1504 20.7816 10.9004C22.3616 11.9404 22.3616 13.6504 20.7916 14.7004Z"
              fill="#43A047 "
            ></path>{" "}
            <path
              d="M6.44016 7.77C6.51016 7.76 6.58016 7.76 6.65016 7.77C8.20016 7.72 9.43016 6.45 9.43016 4.89C9.43016 3.29 8.14016 2 6.54016 2C4.95016 2 3.66016 3.29 3.66016 4.89C3.66016 6.45 4.89016 7.72 6.44016 7.77Z"
              fill="#43A047 "
            ></path>{" "}
            <path
              d="M6.55109 12.8506C6.55109 13.8206 6.76109 14.7406 7.14109 15.5706C5.73109 15.7206 4.26109 15.4206 3.18109 14.7106C1.60109 13.6606 1.60109 11.9506 3.18109 10.9006C4.25109 10.1806 5.76109 9.89059 7.18109 10.0506C6.77109 10.8906 6.55109 11.8406 6.55109 12.8506Z"
              fill="#43A047 "
            ></path>{" "}
            <path
              d="M12.1208 15.87C12.0408 15.86 11.9508 15.86 11.8608 15.87C10.0208 15.81 8.55078 14.3 8.55078 12.44C8.56078 10.54 10.0908 9 12.0008 9C13.9008 9 15.4408 10.54 15.4408 12.44C15.4308 14.3 13.9708 15.81 12.1208 15.87Z"
              fill="#43A047 "
            ></path>{" "}
            <path
              d="M8.87078 17.9406C7.36078 18.9506 7.36078 20.6106 8.87078 21.6106C10.5908 22.7606 13.4108 22.7606 15.1308 21.6106C16.6408 20.6006 16.6408 18.9406 15.1308 17.9406C13.4208 16.7906 10.6008 16.7906 8.87078 17.9406Z"
              fill="#43A047 "
            ></path>{" "}
          </g>
        </svg>
      ),
      title: "Harmonis",
      description: "Membangun sinergi antar IKM, akademisi, dan pemerintah",
    },
    {
      icon: (
        <svg
          className="w-10 h-10"
          fill="#0288D1"
          viewBox="-3 0 19 19"
          xmlns="http://www.w3.org/2000/svg"
          class="cf-icon-svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path d="M10.506 3.883a.563.563 0 0 1 .306.092.574.574 0 0 1 .206.251l1.776 4.138a.552.552 0 0 1 .045.23v.005a2.333 2.333 0 1 1-4.666 0v-.005a.552.552 0 0 1 .045-.23l1.447-3.372H7.078v7.538l3.918 1.624a.554.554 0 0 1-.212 1.066H2.302a.554.554 0 0 1-.212-1.066l3.88-1.608V4.992H3.335l1.447 3.372a.552.552 0 0 1 .045.23v.005a2.333 2.333 0 1 1-4.666 0v-.005a.552.552 0 0 1 .045-.23l1.776-4.138a.56.56 0 0 1 .206-.25.554.554 0 0 1 .306-.093H5.97v-.68a.554.554 0 1 1 1.108 0v.68h3.428zM3.677 8.6 2.494 5.843 1.312 8.599zm8.012 0-1.183-2.756L9.323 8.6z"></path>
          </g>
        </svg>
      ),
      title: "Loyal",
      description:
        "Berkomitmen mendukung pemberdayaan dan pertumbuhan industri dalam negeri",
    },
    {
      icon: (
        <svg
          className="w-8 h-8"
          fill="#FDD835 "
          viewBox="0 0 14 14"
          role="img"
          focusable="false"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path d="m 11.8,10.6 0,-7.2035638 C 11.8,2.7367083 11.264337,2.2 10.603564,2.2 l -7.2071278,0 C 2.7367083,2.2 2.2,2.7356627 2.2,3.3964362 L 2.2,10.6 1,10.6 1,11.2 c 0,0.333681 0.2664272,0.6 0.5950819,0.6 l 10.8098361,0 C 12.726816,11.8 13,11.531371 13,11.2 l 0,-0.6 -1.2,0 z m -8.4,-7.2 7.2,0 0,5.4 -7.2,0 0,-5.4 z m 2.4,6.6 2.4,0 0,0.6 -2.4,0 0,-0.6 z"></path>
          </g>
        </svg>
      ),
      title: "Adaptif",
      description:
        "Terus berinovasi mengikuti perkembangan teknologi dan kebutuhan industri",
    },
    {
      icon: (
        <svg
          fill="#43A047"
          className="w-8 h-8"
          version="1.1"
          id="Layer_1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 512 512"
          xml:space="preserve"
          stroke="#43A047"
        >
          <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            {" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M208.057,362.515c-15.603-10.082-36.424-5.606-46.506,9.996c10.082-15.603,5.606-36.424-9.996-46.506 c-15.603-10.082-36.424-5.606-46.506,9.996c10.082-15.603,5.606-36.424-9.996-46.506c-15.603-10.082-36.424-5.606-46.506,9.996 l-34.484,53.367c-10.082,15.603-5.606,36.424,9.996,46.506c15.603,10.082,36.424,5.606,46.506-9.996 c-10.082,15.603-5.606,36.424,9.996,46.506c15.603,10.082,36.424,5.606,46.506-9.996c-10.082,15.603-5.606,36.424,9.996,46.506 s36.424,5.606,46.506-9.996l34.484-53.367C228.135,393.418,223.659,372.596,208.057,362.515z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M436.601,270.49l-0.902-0.587L264.31,158.311l-27.309,41.448c-12.201,18.777-32.847,29.983-55.264,29.983 c-12.686,0-25.037-3.647-35.716-10.548c-30.505-19.712-39.287-60.566-19.603-91.029l16.405-25.475L85.266,88.843L0,264.877 l20.909,17.996l0.565-0.875c12.19-18.865,32.885-30.127,55.358-30.125c12.686,0.001,25.036,3.649,35.713,10.548 c10.11,6.532,18.066,15.492,23.267,26.008c11.812,0.444,23.255,4.053,33.235,10.502c10.11,6.532,18.066,15.492,23.267,26.007 c11.812,0.444,23.254,4.051,33.235,10.503c30.505,19.711,39.287,60.566,19.575,91.071l-18.284,28.296l28.307,18.767 c15.603,10.082,36.424,5.606,46.506-9.996c10.082-15.603,5.606-36.424-9.996-46.506l11.442,7.394 c15.603,10.082,36.424,5.606,46.506-9.996c10.082-15.603,5.606-36.423-9.995-46.505l11.441,7.393 c15.603,10.082,36.424,5.606,46.506-9.996c10.081-15.602,5.608-36.42-9.992-46.503l11.438,7.391 c15.603,10.082,36.424,5.606,46.506-9.996C455.354,301.022,451.316,280.821,436.601,270.49z"></path>{" "}
              </g>{" "}
            </g>{" "}
            <g>
              {" "}
              <g>
                {" "}
                <path d="M467.068,33.035l-246.101,7.839l-67.449,104.74c-10.082,15.603-5.606,36.424,9.996,46.506 c15.603,10.082,36.424,5.606,46.506-9.996l45.013-68.316l9.854,6.416l177.625,115.652L512,184.419L467.068,33.035z"></path>{" "}
              </g>{" "}
            </g>{" "}
          </g>
        </svg>
      ),
      title: "Kolaboratif",
      description:
        "Mendorong kerja sama lintas sektor untuk pertumbuhan berkelanjutan",
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
              MitraKita adalah platform digital yang dikembangkan untuk
              memperkuat kemitraan antara Industri Kecil dan Menengah (IKM),
              industri besar, akademisi, dan masyarakat. Melalui sistem yang
              transparan dan terintegrasi, MitraKita berkomitmen menjadi
              jembatan kolaborasi yang mendorong pertumbuhan industri nasional
              yang berdaya saing dan berkelanjutan.
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
                Mewujudkan Industri Kecil dan Menengah (IKM) Yang Berdaya Global
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
                    Meningkatkan Pengetahuan dan Keterampilan SDM Berbasis
                    Kompetensi
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Mendorong Tumbuhnya Wirausaha Baru IKM</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>
                    Mendorong Peningkatan Penguasaan dan Penerapan Teknologi
                    Modern
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Mendorong Peningkatan Perluasan Pasar</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Mendorong Peningkatan Nilai Tambah</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Mendorong Perluasan Akses Sumber Pembiayaan</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">•</span>
                  <span>Mendorong Penyebaran Pembangunan IKM di Luar Jawa</span>
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
                  perekonomian Indonesia. Hingga tahun 2024, IKM yang tersebar
                  di seluruh Indonesia telah tercatat sebanyak lebih dari 4,5
                  juta, membuka lebih dari 10 juta lapangan pekerjaan, dan
                  berkontribusi nilai output terhadap industri non migas sebesar
                  21,13%. Namun, IKM masih menghadapi berbagai tantangan dalam
                  mengakses pasar yang lebih luas, teknologi modern, dan hasil
                  penelitian yang dapat meningkatkan daya saing mereka.
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
                    21,13%
                  </h3>
                  <p style={{ fontFamily: "Open Sans, sans-serif" }}>
                    Kontribusi IKM terhadap Nilai Output Industri Non Migas
                  </p>
                </div>
                <div className="bg-gradient-to-br from-blue-600 to-blue-500 rounded-2xl p-6 text-white text-center">
                  <h3
                    className="text-4xl font-bold mb-2"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    99,77%
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
                    10 Juta+
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

          {/* Grid utama untuk 6 core values pertama */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.slice(0, -1).map((value, idx) => (
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
                  className="text-gray-600 text-left"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          {/* Core value terakhir (Kolaboratif) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6">
            <div className="lg:col-start-2 bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="mb-4">{coreValues.slice(-1)[0].icon}</div>
              <h3
                className="text-xl font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {coreValues.slice(-1)[0].title}
              </h3>
              <p
                className="text-gray-600 text-left"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                {coreValues.slice(-1)[0].description}
              </p>
            </div>
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
                <div className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white rounded-[2.5rem] shadow-2xl flex items-center justify-center transform hover:scale-105 transition-all duration-300 p-8 sm:p-12">
                  <img
                    src={logo}
                    alt="MitraKita logo"
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white px-8 py-3 rounded-full shadow-xl">
                  <p
                    className="font-bold text-xl sm:text-2xl text-gray-800"
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
                  kemitraan yang saling menguntungkan antara semua pihak tanpa
                  memandang skala usaha.
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
                      <strong>Dua Tangan Berjabat Tangan</strong> sebagai simbol
                      kepercayaan, dukungan, dan kesepakatan bersama yang saling
                      menguntungkan
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Bentuk Lingkaran di Sekitar Tangan</strong>{" "}
                      melambangkan kesatuan, kesinambungan, dan ekosistem
                      industri yang saling terhubung dan berkelanjutan
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Lingkaran Kuning</strong> sebagai simbol manusia
                      dan semangat pembangunan
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Warna Hijau Kolaborasi</strong> melambangkan
                      pertumbuhan, kerja sama, dan inovasi berkelanjutan
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Warna Biru Harmoni</strong> memberi kesan percaya
                      diri dan keterhubungan digital
                    </span>
                  </p>
                  <p className="flex items-start">
                    <span className="text-green-600 font-bold mr-2">•</span>
                    <span>
                      <strong>Warna Kuning Emas</strong> menonjolkan optimisme
                      dan hasil nyata
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
