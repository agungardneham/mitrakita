import React, { useState, useEffect } from "react";
import {
  Search,
  Users,
  FileText,
  Mail,
  TrendingUp,
  Clock,
  CheckCircle,
  Building2,
  GraduationCap,
  Menu,
  X,
  Home,
  LayoutDashboard,
  Package,
  MessageSquare,
  Star,
  Upload,
  Settings,
  LogOut,
  MessageCircle,
  Download,
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import db from "../firebase-config";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { GoogleGenAI } from "@google/genai";
import { supabase } from "../supabaseClient";

// Research data now loaded from Firestore per-academician (see useEffect below)

const ResearchPage = () => {
  const [activeTab, _setActiveTab] = useState("feed"); // feed, upload
  const [researchList, setResearchList] = useState([]);
  const [filteredResearch, setFilteredResearch] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResearch, setSelectedResearch] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [aiSummaries, setAiSummaries] = useState({});
  const [aiSummaryLoadingId, setAiSummaryLoadingId] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [profileUserResearches, setProfileUserResearches] = useState([]);
  const [_profileLoading, setProfileLoading] = useState(false);
  const [_profileImageError, setProfileImageError] = useState(false);

  const fields = [
    "Semua",
    "Furniture & Kerajinan",
    "Tekstil & Garmen",
    "Logam & Metalurgi",
    "Kemasan & Packaging",
    "Makanan & Minuman",
  ];
  const years = ["Semua", "2024", "2023", "2022", "2021"];
  const statuses = ["Semua", "Sedang Berlangsung", "Selesai"];

  // Filter Research
  const applyFilters = () => {
    let filtered = [...researchList];

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

    if (selectedStatus && selectedStatus !== "Semua") {
      filtered = filtered.filter(
        (research) => research.status === selectedStatus
      );
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

  // Format phone numbers into wa.me-friendly form (Indonesia): convert leading '08' -> '628'
  const formatPhoneForWa = (raw) => {
    if (!raw) return "";
    let s = String(raw).trim();
    // remove leading + and all non-digit chars
    s = s.replace(/^\+/, "").replace(/[^0-9]/g, "");
    if (!s) return "";
    // If starts with '08' -> '628' + rest (common Indonesian mobile)
    if (s.startsWith("08")) {
      return "628" + s.slice(2);
    }
    // If starts with '8' (missing leading zero) -> assume local and add '62'
    if (s.startsWith("8")) {
      return "62" + s;
    }
    // If starts with single 0 (not 08) replace leading 0 with 62
    if (s.startsWith("0")) {
      return "62" + s.slice(1);
    }
    // If already starts with country code (62) keep
    return s;
  };
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedField("");
    setSelectedYear("");
    setSelectedStatus("");
    setSortBy("newest");
    setFilteredResearch(researchList);
  };

  // Fetch researches from Firestore: for each user with role 'academician', read their 'researches' subcollection
  useEffect(() => {
    const fetchResearches = async () => {
      setLoading(true);
      try {
        const usersQ = query(
          collection(db, "users"),
          where("role", "==", "academician")
        );
        const usersSnap = await getDocs(usersQ);
        const aggregated = [];

        for (const userDoc of usersSnap.docs) {
          const userData = userDoc.data() || {};

          // try to read subcollection 'researches' under this user
          const researchesCol = collection(
            db,
            "users",
            userDoc.id,
            "researches"
          );
          let foundInSubcollection = false;
          try {
            const researchesSnap = await getDocs(researchesCol);
            if (!researchesSnap.empty) {
              researchesSnap.forEach((rDoc) => {
                const rData = rDoc.data() || {};
                const researchObj = {
                  id: `${userDoc.id}_${rDoc.id}`,
                  title:
                    rData.title ||
                    rData.name ||
                    rData.topic ||
                    "Untitled Research",
                  abstract:
                    rData.abstract || rData.summary || rData.description || "",
                  fullAbstract:
                    rData.fullAbstract ||
                    rData.full_description ||
                    rData.description ||
                    "",
                  expectedCollab:
                    rData.expectedCollab ||
                    rData.expected_collab ||
                    rData.collaboration ||
                    "",
                  // keep legacy singular/plural keys available for UI
                  collaboration:
                    rData.collaboration ||
                    rData.expectedCollab ||
                    rData.expected_collab ||
                    "",
                  futureplan:
                    rData.futureplan ||
                    rData.future_plan ||
                    rData.futurePlan ||
                    "",
                  field: rData.field || rData.category || "",
                  year: rData.year || rData.publishedYear || null,
                  status: rData.status || "",
                  keywords: Array.isArray(rData.keywords) ? rData.keywords : [],
                  views: rData.views || 0,
                  downloads: rData.downloads || 0,
                  collaborations: rData.collaborations || 0,
                  author:
                    userData.displayName ||
                    userData.name ||
                    userData.fullName ||
                    userData.email ||
                    "",
                  email:
                    rData.email ||
                    rData.emailAddress ||
                    rData.email_address ||
                    userData.email ||
                    "",
                  // prefer researcher-specific fields from the research doc, then fallback to user profile
                  academicianName:
                    rData.academicianName ||
                    rData.academician_name ||
                    userData.academicianName ||
                    userData.displayName ||
                    userData.name ||
                    userData.fullName ||
                    "",
                  frontDegree:
                    rData.frontDegree ||
                    rData.front_degree ||
                    userData.frontDegree ||
                    userData.front_degree ||
                    "",
                  backDegree:
                    rData.backDegree ||
                    rData.back_degree ||
                    userData.backDegree ||
                    userData.back_degree ||
                    "",
                  institution:
                    userData.institution || userData.affiliation || "",
                  phone:
                    rData.phone ||
                    rData.phoneNumber ||
                    rData.phone_number ||
                    userData.phone ||
                    userData.phoneNumber ||
                    userData.mobile ||
                    "",
                  // PDF file references (may be full URL or supabase storage path)
                  pdfUrl:
                    rData.pdfUrl ||
                    rData.pdf_url ||
                    rData.fileUrl ||
                    rData.file_url ||
                    rData.publicUrl ||
                    "",
                  supabasePath:
                    rData.supabasePath ||
                    rData.storagePath ||
                    rData.filePath ||
                    rData.path ||
                    "",
                  photoUrl: rData.photoUrl || userData.photoUrl || "",
                  ownerId: userDoc.id,
                  docId: rDoc.id,
                };
                aggregated.push(researchObj);
              });
              foundInSubcollection = true;
            }
          } catch (err) {
            // if subcollection doesn't exist or read fails, log and continue
            console.warn(
              "ResearchPage: error reading researches subcollection for user",
              userDoc.id,
              err
            );
          }

          // Fallback: some projects store researches as an array field on the user doc
          if (!foundInSubcollection) {
            const userResearches =
              userData.researches || userData.research || null;
            if (Array.isArray(userResearches) && userResearches.length) {
              // found researches in user document
              userResearches.forEach((rItem, idx) => {
                const rData = rItem || {};
                const researchObj = {
                  id: `${userDoc.id}_field_${idx}`,
                  title:
                    rData.title ||
                    rData.name ||
                    rData.topic ||
                    "Untitled Research",
                  abstract:
                    rData.abstract || rData.summary || rData.description || "",
                  fullAbstract:
                    rData.fullAbstract ||
                    rData.full_description ||
                    rData.description ||
                    "",
                  expectedCollab:
                    rData.expectedCollab ||
                    rData.expected_collab ||
                    rData.collaboration ||
                    "",
                  // keep legacy singular/plural keys available for UI
                  collaboration:
                    rData.collaboration ||
                    rData.expectedCollab ||
                    rData.expected_collab ||
                    "",
                  futureplan:
                    rData.futureplan ||
                    rData.future_plan ||
                    rData.futurePlan ||
                    "",
                  field: rData.field || rData.category || "",
                  year: rData.year || rData.publishedYear || null,
                  status: rData.status || "",
                  keywords: Array.isArray(rData.keywords) ? rData.keywords : [],
                  views: rData.views || 0,
                  downloads: rData.downloads || 0,
                  collaborations: rData.collaborations || 0,
                  author:
                    userData.displayName ||
                    userData.name ||
                    userData.fullName ||
                    userData.email ||
                    "",
                  email:
                    rData.email ||
                    rData.emailAddress ||
                    rData.email_address ||
                    userData.email ||
                    "",
                  // for user-stored research entries, allow title/item to include name/degree
                  academicianName:
                    rData.academicianName ||
                    rData.academician_name ||
                    userData.academicianName ||
                    userData.displayName ||
                    userData.name ||
                    userData.fullName ||
                    "",
                  frontDegree:
                    rData.frontDegree ||
                    rData.front_degree ||
                    userData.frontDegree ||
                    userData.front_degree ||
                    "",
                  backDegree:
                    rData.backDegree ||
                    rData.back_degree ||
                    userData.backDegree ||
                    userData.back_degree ||
                    "",
                  institution:
                    userData.institution || userData.affiliation || "",
                  phone:
                    rData.phone ||
                    rData.phoneNumber ||
                    rData.phone_number ||
                    userData.phone ||
                    userData.phoneNumber ||
                    userData.mobile ||
                    "",
                  // PDF file references (may be full URL or supabase storage path)
                  pdfUrl:
                    rData.pdfUrl ||
                    rData.pdf_url ||
                    rData.fileUrl ||
                    rData.file_url ||
                    rData.publicUrl ||
                    "",
                  supabasePath:
                    rData.supabasePath ||
                    rData.storagePath ||
                    rData.filePath ||
                    rData.path ||
                    "",
                  ownerId: userDoc.id,
                  docId: null,
                };
                aggregated.push(researchObj);
              });
            }
          }
        }

        // Sort newest first by year if available
        aggregated.sort((a, b) => (b.year || 0) - (a.year || 0));
        setResearchList(aggregated);
        setFilteredResearch(aggregated);
      } catch (error) {
        console.error("Error fetching researches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResearches();
  }, []);

  // AI Summarizer: send abstract to Gemini/Generative Language API
  // Normalize various shapes of AI SDK / REST responses into a string
  const normalizeAIResponse = (item) => {
    if (item == null) return "";
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      // Common SDK shapes
      if (typeof item.output === "string") return item.output;
      if (typeof item.text === "string") return item.text;
      if (typeof item.content === "string") return item.content;
      if (item.outputText && typeof item.outputText === "string")
        return item.outputText;
      if (item.message && typeof item.message === "string") return item.message;

      // If it's an array-like content field
      if (Array.isArray(item.output))
        return item.output.map(normalizeAIResponse).join("\n\n");
      if (Array.isArray(item.content))
        return item.content.map(normalizeAIResponse).join("\n\n");

      // Candidates pattern
      if (Array.isArray(item.candidates) && item.candidates.length)
        return item.candidates.map(normalizeAIResponse).join("\n\n");

      // Fallback: try to extract text-like properties, else stringify
      const values = [];
      ["text", "content", "output", "message", "outputText"].forEach((k) => {
        if (item[k]) {
          values.push(normalizeAIResponse(item[k]));
        }
      });
      if (values.length) return values.join(" \n ");
      try {
        return JSON.stringify(item);
      } catch {
        return String(item);
      }
    }
    return String(item);
  };

  const generateAISummary = async (research) => {
    if (!research) return;
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) {
      alert("Error terkait API Key. Silakan hubungi admin.");
      return;
    }

    const abstractText = research.fullAbstract || research.abstract || "";
    if (!abstractText) {
      alert("Tidak ada abstrak untuk diringkas.");
      return;
    }

    setAiSummaryLoadingId(research.id);
    try {
      const ai = new GoogleGenAI({ apiKey: key });

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            type: "text",
            text: `Ringkas abstrak penelitian ini dengan bahasa yang mudah dipahami oleh masyarakat umum. Buat dalam 4-5 kalimat saja namun jangan lupa sebutkan fokus utama penelitian.\n\n${abstractText}`,
          },
        ],
      });

      // Normalize SDK response into a text summary using helper
      let summaryText = "";
      if (!response) {
        summaryText = "(Tidak ada respons dari layanan AI)";
      } else {
        summaryText =
          normalizeAIResponse(response) ||
          "(Tidak ada respons teks dari layanan AI)";
      }

      setAiSummaries((prev) => ({ ...prev, [research.id]: summaryText }));
      if (selectedResearch && selectedResearch.id === research.id) {
        setSelectedResearch((prev) => ({
          ...prev,
          aiSummaryGenerated: true,
          summary: summaryText,
        }));
      }
    } catch (err) {
      console.error("Error generating AI summary:", err);
      alert("Gagal menghasilkan ringkasan AI: " + (err.message || err));
    } finally {
      setAiSummaryLoadingId(null);
    }
  };

  // Open profile modal: fetch user profile and their researches
  const openProfile = async (ownerId) => {
    if (!ownerId) return;
    // Reset image error so image will be retried when opening a profile
    setProfileImageError(false);
    setProfileLoading(true);
    try {
      const userRef = doc(db, "users", ownerId);
      const userSnap = await getDoc(userRef);
      // Properly extract data from DocumentSnapshot: use exists() and data()
      const userData = userSnap && userSnap.exists() ? userSnap.data() : {};

      // try to read researches subcollection for this user
      let researches = [];
      try {
        const rCol = collection(db, "users", ownerId, "researches");
        const rSnap = await getDocs(rCol);
        if (!rSnap.empty) {
          rSnap.forEach((rd) => {
            const d = rd.data() || {};
            researches.push({
              id: rd.id,
              title: d.title || d.name || d.topic || "Untitled",
              abstract: d.abstract || d.summary || d.description || "",
            });
          });
        }
      } catch {
        // ignore
      }

      // fallback: if no subcollection, check userData.researches
      if (!researches.length && Array.isArray(userData.researches)) {
        researches = userData.researches.map((r, idx) => ({
          id: `${ownerId}_field_${idx}`,
          title: r.title || r.name || r.topic || "Untitled",
          abstract: r.abstract || r.summary || r.description || "",
        }));
      }

      // Ensure a default profile photo emoji for academicians without uploads
      const normalizedUser = userData || {};
      if (!normalizedUser.photo && !normalizedUser.photoUrl) {
        normalizedUser.photo = "👨‍🔬";
      }
      setProfileUser(normalizedUser);
      setProfileUserResearches(researches || []);
    } catch (err) {
      console.error("Error loading profile:", err);
      alert("Gagal memuat profil akademisi.");
    } finally {
      setProfileLoading(false);
    }
  };

  const closeProfile = () => {
    setProfileUser(null);
    setProfileUserResearches([]);
    setProfileImageError(false);
  };

  // Download PDF (from full URL or Supabase storage path)
  const handleDownloadPDF = async (research) => {
    if (!research) return;
    const titleSafe = (research.title || "research").replace(
      /[^a-z0-9\-_.]/gi,
      "_"
    );

    // Prefer a direct URL if present
    const pdfUrl = research.pdfUrl || "";
    if (pdfUrl && /^https?:\/\//i.test(pdfUrl)) {
      // Try to download by creating an anchor to support Save As
      try {
        const a = document.createElement("a");
        a.href = pdfUrl;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        // Suggest filename when possible
        a.download = `${titleSafe}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        return;
      } catch (err) {
        alert("Gagal memulai unduhan: " + (err.message || err));
        return;
      }
    }

    // If no public URL, try Supabase storage path
    const supaPath = research.supabasePath || "";
    if (supaPath) {
      try {
        // If path contains a leading bucket segment 'bucket/dir/file.pdf', split it
        let bucket = null;
        let path = supaPath;
        const parts = supaPath.split("/");
        if (parts.length > 1) {
          // assume first segment is bucket name
          bucket = parts[0];
          path = parts.slice(1).join("/");
        } else {
          // fallback to default bucket 'public'
          bucket = "public";
          path = supaPath;
        }

        const { data, error } = await supabase.storage
          .from(bucket)
          .download(path);
        if (error || !data) {
          throw error || new Error("No data returned from storage");
        }

        const url = URL.createObjectURL(data);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${titleSafe}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        return;
      } catch (err) {
        console.error("Supabase download error:", err);
        alert("Gagal mengunduh file dari storage: " + (err.message || err));
        return;
      }
    }

    alert("Tidak ada file PDF tersedia untuk penelitian ini.");
  };

  return (
    <div>
      <Navbar />
      <div className="bg-green-50 min-h-screen">
        {/* Hero Header */}
        <div className="bg-linear-to-br from-green-600 via-green-500 to-blue-600 text-white py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1
              className="text-4xl md:text-5xl font-bold mb-4 text-center"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Repositori Penelitian
            </h1>
            <p
              className="text-xl text-center text-green-50 mb-8"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Akses hasil penelitian terbaru untuk inovasi dan pengembangan IKM
              Indonesia
            </p>

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
                    Status Penelitian
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {statuses.map((status) => (
                      <option
                        key={status}
                        value={status === "Semua" ? "" : status}
                      >
                        {status}
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

        {/* Researcher Profile Modal - Enhanced UI */}
        {profileUser && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setProfileUser(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Gradient */}
              <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Profile Photo */}
                    <div className="flex-shrink-0">
                      {profileUser.photoUrl ? (
                        <img
                          src={profileUser.photoUrl}
                          alt="Foto Profil"
                          className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-5xl border-4 border-white shadow-lg">
                          👨‍🔬
                        </div>
                      )}
                    </div>

                    {/* Profile Info */}
                    <div className="flex-1">
                      <h3
                        className="text-2xl font-bold mb-2"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {`${
                          profileUser.frontDegree
                            ? profileUser.frontDegree + " "
                            : ""
                        }${
                          profileUser.academicianName ||
                          profileUser.displayName ||
                          profileUser.name ||
                          profileUser.fullName ||
                          "Nama Peneliti"
                        }${
                          profileUser.backDegree
                            ? ", " + profileUser.backDegree
                            : ""
                        }`}
                      </h3>
                      <div className="space-y-1 text-blue-50">
                        <p
                          className="flex items-center text-sm"
                          style={{ fontFamily: "Open Sans, sans-serif" }}
                        >
                          <Building2 className="w-4 h-4 mr-2" />
                          {profileUser.institution ||
                            profileUser.affiliation ||
                            "Institusi"}
                        </p>
                        {(profileUser.department ||
                          profileUser.departement) && (
                          <p
                            className="flex items-center text-sm"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            <GraduationCap className="w-4 h-4 mr-2" />
                            {profileUser.department || profileUser.departement}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setProfileUser(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition flex-shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Bio Section */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h4
                      className="text-lg font-bold text-gray-800"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Bio
                    </h4>
                  </div>
                  <p
                    className="text-gray-700 leading-relaxed"
                    style={{ fontFamily: "Open Sans, sans-serif" }}
                  >
                    {profileUser.bio ||
                      profileUser.description ||
                      profileUser.about ||
                      "Belum ada bio yang ditambahkan."}
                  </p>
                </div>

                {/* Research Field */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center mr-3">
                      <Search className="w-5 h-5 text-white" />
                    </div>
                    <h4
                      className="text-lg font-bold text-gray-800"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Bidang Riset
                    </h4>
                  </div>
                  <p
                    className="text-gray-700 font-semibold"
                    style={{ fontFamily: "Montserrat, sans-serif" }}
                  >
                    {profileUser.researchField ||
                      profileUser.field ||
                      profileUser.expertise ||
                      "Belum ditentukan"}
                  </p>
                </div>

                {/* Academic Profiles */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Google Scholar */}
                  <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:border-blue-500 hover:shadow-lg transition">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-2xl">🎓</span>
                      </div>
                      <h4
                        className="font-bold text-gray-800"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        Google Scholar
                      </h4>
                    </div>
                    {profileUser.googleScholar ? (
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={profileUser.googleScholar}
                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center hover:underline"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Lihat Profil
                        <span className="ml-1">→</span>
                      </a>
                    ) : (
                      <p
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Belum tersedia
                      </p>
                    )}
                  </div>

                  {/* ResearchGate */}
                  <div className="bg-white rounded-2xl border-2 border-gray-200 p-5 hover:border-green-500 hover:shadow-lg transition">
                    <div className="flex items-center mb-3">
                      <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
                        <span className="text-2xl">🔬</span>
                      </div>
                      <h4
                        className="font-bold text-gray-800"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        ResearchGate
                      </h4>
                    </div>
                    {profileUser.researchGate ? (
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href={profileUser.researchGate}
                        className="text-green-600 hover:text-green-700 text-sm font-semibold flex items-center hover:underline"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Lihat Profil
                        <span className="ml-1">→</span>
                      </a>
                    ) : (
                      <p
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Belum tersedia
                      </p>
                    )}
                  </div>
                </div>

                {/* Research History */}
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-400 rounded-xl flex items-center justify-center mr-3">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <h4
                      className="text-lg font-bold text-gray-800"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Histori Penelitian
                    </h4>
                  </div>

                  {profileUser.researches &&
                  profileUser.researches.length > 0 ? (
                    <div className="space-y-3">
                      {profileUser.researches.map((research, idx) => (
                        <div
                          key={research.id || idx}
                          className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 hover:shadow-md transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h5
                              className="font-bold text-gray-800 flex-1"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              {research.title || "Judul Penelitian"}
                            </h5>
                            {research.year && (
                              <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold ml-2">
                                {research.year}
                              </span>
                            )}
                          </div>
                          <p
                            className="text-sm text-gray-600 leading-relaxed"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {research.abstract
                              ? research.abstract.length > 200
                                ? research.abstract.slice(0, 200) + "..."
                                : research.abstract
                              : "Tidak ada deskripsi tersedia."}
                          </p>
                          {research.field && (
                            <div className="mt-3">
                              <span className="inline-block bg-white border border-yellow-300 text-yellow-700 px-3 py-1 rounded-lg text-xs font-semibold">
                                {research.field}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <FileText className="w-8 h-8 text-gray-400" />
                      </div>
                      <p
                        className="text-gray-500"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        Belum ada histori penelitian yang dipublikasikan.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Research Feed Tab */}
        {activeTab === "feed" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Research Grid */}
            {loading ? (
              <div className="py-12 text-center text-gray-600">
                Memuat penelitian...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResearch.map((research) => (
                  <div
                    key={research.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 overflow-hidden h-full flex flex-col"
                  >
                    <div className="p-6 flex-1 flex flex-col">
                      <div>
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

                        <h3
                          className="text-lg font-bold text-gray-800 line-clamp-2 min-h-14"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {research.title}
                        </h3>

                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <p
                              className="text-sm font-semibold text-gray-700 h-6 overflow-hidden"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >{`${
                              research.frontDegree
                                ? research.frontDegree + " "
                                : ""
                            }${research.academicianName || ""}${
                              research.backDegree
                                ? ", " + research.backDegree
                                : ""
                            }`}</p>
                            <button
                              onClick={() => openProfile(research.ownerId)}
                              className="ml-3 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-lg font-semibold hover:bg-green-200"
                              style={{ fontFamily: "Montserrat, sans-serif" }}
                            >
                              Lihat Profil
                            </button>
                          </div>
                          <p
                            className="text-xs text-gray-500 h-5 overflow-hidden"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {research.institution}
                          </p>
                        </div>
                      </div>

                      <div className="flex-1 mb-4">
                        {research.status === "ongoing" ? (
                          <p
                            className="text-sm text-gray-600 line-clamp-3 h-full"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            <strong>Kolaborasi yang Diharapkan: </strong>
                            {research.collaboration ||
                              "Belum ada kolaborasi yang diharapkan."}
                          </p>
                        ) : (
                          <p
                            className="text-sm text-gray-600 line-clamp-3 h-full"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            <strong>Rencana Ke Depan: </strong>
                            {research.futureplan ||
                              "Belum ada rencana ke depan."}
                          </p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-4">
                          {research.status === "completed" ? (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg font-semibold inline-flex items-center">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Selesai
                            </span>
                          ) : (
                            <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg font-semibold inline-flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              Sedang Berlangsung
                            </span>
                          )}
                        </div>

                        {/* <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                          <span>👁️ {research.views} views</span>
                          <span>⬇️ {research.downloads} downloads</span>
                          <span>🤝 {research.collaborations}</span>
                        </div> */}

                        <div>
                          <button
                            onClick={() => setSelectedResearch(research)}
                            className="w-full bg-linear-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            Lihat Detail
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
              <div className="sticky top-0 bg-linear-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-2xl">
                <div className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <h2
                      className="text-2xl font-bold mb-3"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedResearch.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-green-50">
                      <span>
                        👤{" "}
                        {`${
                          selectedResearch.frontDegree
                            ? selectedResearch.frontDegree + " "
                            : ""
                        }${
                          selectedResearch.academicianName ||
                          selectedResearch.author ||
                          ""
                        }${
                          selectedResearch.backDegree
                            ? ", " + selectedResearch.backDegree
                            : ""
                        }`}
                      </span>
                      <span>🏛️ {selectedResearch.institution}</span>
                      <span>📅 {selectedResearch.year}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedResearch(null)}
                    className="text-white hover:bg-white hover:bg-opacity-20 rounded-xl p-2 transition shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {/* <div className="bg-green-50 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                    <p
                      className="text-xl font-bold text-green-600 leading-tight"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedResearch.views}
                    </p>
                    <p
                      className="text-xs text-gray-600 mt-1"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Views
                    </p>
                  </div> */}
                  {/* <div className="bg-blue-50 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                    <p
                      className="text-xl font-bold text-blue-600 leading-tight"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedResearch.downloads}
                    </p>
                    <p
                      className="text-xs text-gray-600 mt-1"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Downloads
                    </p>
                  </div> */}
                  <div
                    className={`rounded-xl p-4 text-center flex flex-col items-center justify-center ${
                      selectedResearch.status === "completed"
                        ? "bg-green-50"
                        : "bg-yellow-50"
                    }`}
                  >
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-lg font-semibold text-xs mt-1 mb-1 ${
                        selectedResearch.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                      style={{
                        fontFamily: "Montserrat, sans-serif",
                        maxWidth: "100%",
                        whiteSpace: "normal",
                        overflowWrap: "anywhere",
                        textAlign: "center",
                      }}
                    >
                      {selectedResearch.status === "completed" ? (
                        <CheckCircle className="w-4 h-4 mr-1" />
                      ) : (
                        <Clock className="w-4 h-4 mr-1" />
                      )}
                      <span>
                        {" "}
                        {selectedResearch.status === "completed" ? (
                          <p className="text-lg">Selesai</p>
                        ) : (
                          <p className="text-md">Sedang Berlangsung</p>
                        )}
                      </span>
                    </span>
                    <p
                      className="text-xs text-gray-600"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Status
                    </p>
                  </div>
                  {/* <div className="bg-purple-50 rounded-xl p-4 text-center flex flex-col items-center justify-center">
                    <p
                      className="text-xl font-bold text-purple-600 leading-tight"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {selectedResearch.collaborations}
                    </p>
                    <p
                      className="text-xs text-gray-600 mt-1"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Kolaborasi
                    </p>
                  </div> */}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedResearch.field}
                  </span>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {selectedResearch.status === "completed" ? (
                      <p>Selesai</p>
                    ) : (
                      <p>Sedang Berlangsung</p>
                    )}
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
                    {selectedResearch.abstract}
                  </p>
                </div>

                {/* AI Summary Section */}
                <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3
                      className="text-xl font-bold text-gray-800 flex items-center"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      <span className="mr-2">🤖</span> Ringkasan AI
                    </h3>
                    {!aiSummaries[selectedResearch.id] && (
                      <button
                        onClick={() => generateAISummary(selectedResearch)}
                        disabled={aiSummaryLoadingId === selectedResearch.id}
                        className={`px-4 py-2 rounded-xl font-semibold transition ${
                          aiSummaryLoadingId === selectedResearch.id
                            ? "bg-gray-300 text-gray-500 cursor-wait"
                            : "bg-purple-600 text-white hover:bg-purple-700"
                        }`}
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {aiSummaryLoadingId === selectedResearch.id
                          ? "Menghasilkan..."
                          : "Tampilkan Ringkasan AI"}
                      </button>
                    )}
                  </div>
                  {/* AI Summarizer Integration: show per-research summary if available */}
                  {aiSummaries[selectedResearch.id] ? (
                    <div className="bg-white rounded-xl p-4">
                      <p
                        className="text-gray-700 leading-relaxed"
                        style={{ fontFamily: "Open Sans, sans-serif" }}
                      >
                        <strong>Ringkasan:</strong>
                        <br />
                        {aiSummaries[selectedResearch.id]}
                      </p>
                    </div>
                  ) : (
                    <p
                      className="text-gray-600 italic"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      Klik tombol "Tampilkan Ringkasan AI" untuk mendapatkan
                      ringkasan otomatis dari AI yang mudah dipahami
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="mb-4 space-y-3">
                  {/* Row 1: Chat + Email */}
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        const raw = selectedResearch?.phone || "";
                        const formatted = formatPhoneForWa(raw);
                        if (!formatted) {
                          alert(
                            "Nomor telepon tidak tersedia untuk akademisi ini."
                          );
                          return;
                        }
                        window.open(`https://wa.me/${formatted}`, "_blank");
                      }}
                      className="w-full bg-linear-to-r from-green-600 to-green-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
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
                      <span>Chat Akademisi</span>
                    </button>
                    <button
                      onClick={() => {
                        const email = selectedResearch?.email || "";
                        if (!email) {
                          alert("Email tidak tersedia untuk akademisi ini.");
                          return;
                        }
                        const subject = encodeURIComponent(
                          `Pertanyaan tentang penelitian: ${
                            selectedResearch?.title || ""
                          }`
                        );
                        const body = encodeURIComponent(
                          `Yth. ${selectedResearch?.frontDegree} ${
                            selectedResearch?.academicianName
                          }, ${
                            selectedResearch?.backDegree
                          },\n\nSaya tertarik dengan penelitian Anda yang berjudul "${
                            selectedResearch?.title || ""
                          }". Mohon informasi lebih lanjut mengenai ...\n\nTerima kasih.`
                        );
                        window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
                      }}
                      className="w-full bg-linear-to-r from-blue-600 to-blue-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <Mail className="w-5 h-5" />
                      <span>Email Akademisi</span>
                    </button>
                  </div>

                  {/* Row 2: Full-width Download */}
                  <div>
                    <button
                      onClick={() => handleDownloadPDF(selectedResearch)}
                      className="w-full bg-linear-to-r from-indigo-600 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center space-x-2"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      <Download className="w-5 h-5" />
                      <span>Unduh PDF</span>
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

export default ResearchPage;
