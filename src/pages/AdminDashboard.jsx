import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  BarChart3,
  Settings,
  Users,
  Database,
  Download,
  Eye,
  Edit2,
  Plus,
} from "lucide-react";
import * as XLSX from "xlsx";
import db from "../firebase-config";
import { collection, query, getDocs, orderBy, limit } from "firebase/firestore";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

const AdminDashboard = () => {
  const { adminUser, adminLogout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("management");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editType, setEditType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityPeriod, setActivityPeriod] = useState("1m"); // 1m, 3m, 6m, 1y
  const [regionalFilter, setRegionalFilter] = useState("province"); // province or city

  // State untuk data real
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalIKM: 0,
    totalAcademician: 0,
    totalResearch: 0,
    totalPartnerships: 0,
  });
  const [ikmData, setIkmData] = useState([]);
  const [userData, setUserData] = useState([]);
  const [editLogs, setEditLogs] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    ikmByKomoditi: {},
    regionalDistribution: {},
    regionalDistributionByCity: {},
    userActivityTrend: [],
  });

  // State untuk Survey IKM
  const [ikmSurveyList, setIkmSurveyList] = useState([]);
  const [surveySearch, setSurveySearch] = useState("");

  const handleLogout = () => {
    adminLogout();
    navigate("/admin");
  };

  // Function to calculate date range based on period
  const getDateRange = (period) => {
    const now = new Date();
    const startDate = new Date();

    switch (period) {
      case "1m":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3m":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6m":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setMonth(now.getMonth() - 1);
    }
    return { startDate, endDate: now };
  };

  // Function to convert Firestore timestamp to Date
  const toDate = (timestamp) => {
    if (!timestamp) return null;
    if (
      typeof timestamp === "object" &&
      timestamp.toDate &&
      typeof timestamp.toDate === "function"
    ) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    if (typeof timestamp === "string") {
      return new Date(timestamp);
    }
    return null;
  };

  // Compute activity trend data based on selected period
  const activityTrendData = useMemo(() => {
    const { startDate, endDate } = getDateRange(activityPeriod);

    // Create map for weekly data (more readable than daily)
    const weeklyData = {};

    // Initialize weeks
    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      const weekStart = new Date(currentDate);
      const dayOfWeek = weekStart.getDay();
      weekStart.setDate(weekStart.getDate() - dayOfWeek); // Start from Sunday

      const weekKey = weekStart.toISOString().split("T")[0];
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          week: `${weekStart.getDate()} ${weekStart.toLocaleString("id-ID", { month: "short" })}`,
          logins: 0,
          registrations: 0,
        };
      }

      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Process login logs - use loginAt Date object directly
    loginLogs.forEach((log) => {
      const logDate = log.loginAt; // Already a Date object
      if (logDate && logDate >= startDate && logDate <= endDate) {
        const weekStart = new Date(logDate);
        const dayOfWeek = weekStart.getDay();
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        const weekKey = weekStart.toISOString().split("T")[0];

        if (weeklyData[weekKey]) {
          weeklyData[weekKey].logins += 1;
        }
      }
    });

    // Process user createdAt for registrations
    allUsers.forEach((user) => {
      const createdDate = toDate(user.createdAt);
      if (createdDate && createdDate >= startDate && createdDate <= endDate) {
        const weekStart = new Date(createdDate);
        const dayOfWeek = weekStart.getDay();
        weekStart.setDate(weekStart.getDate() - dayOfWeek);
        const weekKey = weekStart.toISOString().split("T")[0];

        if (weeklyData[weekKey]) {
          weeklyData[weekKey].registrations += 1;
        }
      }
    });

    // Convert to array and sort
    return Object.values(weeklyData).sort((a, b) => {
      const aDate = new Date(a.week);
      const bDate = new Date(b.week);
      return aDate - bDate;
    });
  }, [activityPeriod, loginLogs, allUsers]);

  // Helper function to safely render Firestore timestamp objects
  const renderSafeValue = (value) => {
    if (!value) return "N/A";
    // Check if it's a Firestore Timestamp object
    if (
      typeof value === "object" &&
      value.toDate &&
      typeof value.toDate === "function"
    ) {
      return value.toDate().toLocaleString("id-ID");
    }
    // Check if it's a Date object
    if (value instanceof Date) {
      return value.toLocaleString("id-ID");
    }
    // Otherwise return as string
    return String(value);
  };

  // Fetch semua data dari Firestore
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersQuery = query(collection(db, "users"));
        const usersSnapshot = await getDocs(usersQuery);
        const allUsers = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Count by role
        const totalUsers = allUsers.filter((u) => u.role === "user").length;
        const totalIKM = allUsers.filter((u) => u.role === "ikm").length;
        const totalAcademician = allUsers.filter(
          (u) => u.role === "academician",
        ).length;

        // Store data
        setUserData(allUsers.filter((u) => u.role === "user"));
        setIkmData(allUsers.filter((u) => u.role === "ikm"));
        setAllUsers(allUsers);

        // Calculate partnerships (dari field kemitraanAkademik, kemitraan, activePartnerships)
        let partnershipCount = 0;
        allUsers.forEach((user) => {
          const partnerships = [
            ...(user.kemitraanAkademik || []),
            ...(user.kemitraan || []),
            ...(user.activePartnerships || []),
            ...(user.academicPartnerships || []),
            ...(user.companyPartnerships || []),
          ];
          partnershipCount += partnerships.length;
        });

        // Get research count from academician data
        let researchCount = 0;
        allUsers
          .filter((u) => u.role === "academician")
          .forEach((user) => {
            researchCount += (user.research || []).length;
          });

        // Fetch edit logs if collection exists
        try {
          // Fetch all logs ordered by timestamp (avoids needing composite index)
          const editLogsQuery = query(
            collection(db, "adminLogs"),
            orderBy("timestamp", "desc"),
            limit(50),
          );
          const editLogsSnapshot = await getDocs(editLogsQuery);
          const fetchedEditLogs = editLogsSnapshot.docs
            .map((doc) => {
              const data = doc.data();
              // Convert Firestore timestamp to readable format
              let timestampDisplay = data.timestamp;
              if (
                data.timestamp &&
                typeof data.timestamp === "object" &&
                data.timestamp.toDate
              ) {
                timestampDisplay = data.timestamp
                  .toDate()
                  .toLocaleString("id-ID");
              } else if (data.timestamp instanceof Date) {
                timestampDisplay = data.timestamp.toLocaleString("id-ID");
              } else if (typeof data.timestamp === "string") {
                timestampDisplay = data.timestamp;
              }
              return {
                id: doc.id,
                type: data.type || "N/A",
                entity: data.entity || "N/A",
                action: data.action || "N/A",
                editor: data.editor || "N/A",
                timestamp: timestampDisplay,
                details: data.details || "N/A",
              };
            })
            // Filter for type="edit" on client-side
            .filter((log) => log.type === "edit")
            .slice(0, 10);
          setEditLogs(fetchedEditLogs);
        } catch (error) {
          console.log("Edit logs collection not found or error:", error);
          setEditLogs([]);
        }

        // Fetch login logs if collection exists
        try {
          // Fetch ALL login logs without limit (or with large limit) for trend calculation
          const loginLogsQuery = query(
            collection(db, "login_logs"),
            orderBy("loginAt", "desc"),
          );
          const loginLogsSnapshot = await getDocs(loginLogsQuery);
          const fetchedLoginLogs = loginLogsSnapshot.docs.map((doc) => {
            const data = doc.data();
            // Keep loginAt as Date object for trend calculation in useMemo
            let loginAtDate = null;
            if (
              data.loginAt &&
              typeof data.loginAt === "object" &&
              data.loginAt.toDate &&
              typeof data.loginAt.toDate === "function"
            ) {
              loginAtDate = data.loginAt.toDate();
            } else if (data.loginAt instanceof Date) {
              loginAtDate = data.loginAt;
            } else if (typeof data.loginAt === "string") {
              loginAtDate = new Date(data.loginAt);
            }

            // Create display string for UI
            let loginAtDisplay = "N/A";
            if (loginAtDate) {
              loginAtDisplay = loginAtDate.toLocaleString("id-ID");
            }

            return {
              id: doc.id,
              email: data.email || "N/A",
              role: data.role || "N/A",
              loginAt: loginAtDate, // Keep as Date object
              loginAtDisplay: loginAtDisplay, // For UI display
            };
          });
          setLoginLogs(fetchedLoginLogs);
        } catch (error) {
          console.log("Login logs collection not found or error:", error);
          // Use mock data jika collection tidak ada
          setLoginLogs([]);
        }

        // Update stats
        setStats({
          totalUsers,
          totalIKM,
          totalAcademician,
          totalResearch: researchCount,
          totalPartnerships: partnershipCount,
        });

        // Fetch IKM Survey Data
        const ikmUsers = allUsers.filter((u) => u.role === "ikm");
        const surveyCompletedIkm = ikmUsers
          .filter((ikm) => ikm.survey)
          .map((ikm) => ({
            id: ikm.id,
            uid: ikm.id,
            businessName: ikm.businessName || "N/A",
            fullName: ikm.fullName || "N/A",
            email: ikm.email || "N/A",
            phone: ikm.phone || "N/A",
            survey: ikm.survey || {},
            surveySubmittedAt: ikm.surveySubmittedAt || "N/A",
          }));
        setIkmSurveyList(surveyCompletedIkm);

        // Calculate analytics
        calculateAnalytics(ikmUsers);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Function untuk calculate analytics
  const calculateAnalytics = (ikmUsers) => {
    // IKM by KBLI (5 digit code)
    const kbliMap = {};
    ikmUsers.forEach((ikm) => {
      const kbliCode = ikm.kbli || "0000"; // Default jika tidak ada
      kbliMap[kbliCode] = (kbliMap[kbliCode] || 0) + 1;
    });

    // Sort by count (descending) and get top 10
    const sortedKbli = Object.entries(kbliMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Create top 10 KBLI object
    const komoditi = {};
    let komoditiOtherCount = 0;

    sortedKbli.forEach(([kbli, count]) => {
      komoditi[kbli] = count;
    });

    // Count the rest as "Lainnya" (only if more than 10 unique KBLI)
    const totalUniqueKbli = Object.keys(kbliMap).length;
    Object.entries(kbliMap).forEach(([kbli, count]) => {
      if (!Object.prototype.hasOwnProperty.call(komoditi, kbli)) {
        komoditiOtherCount += count;
      }
    });

    if (komoditiOtherCount > 0 && totalUniqueKbli > 10) {
      komoditi["Lainnya"] = komoditiOtherCount;
    }

    // Regional distribution by PROVINCE
    const provinceMap = {};
    let provinceUnknownCount = 0;

    ikmUsers.forEach((ikm) => {
      const province = ikm.factoryProvince || ikm.officeProvince;
      if (province && province.trim()) {
        provinceMap[province] = (provinceMap[province] || 0) + 1;
      } else {
        provinceUnknownCount += 1;
      }
    });

    // Sort by count (descending) and get top 10
    const sortedProvince = Object.entries(provinceMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Create top 10 province object
    const provinces = {};
    sortedProvince.forEach(([province, count]) => {
      provinces[province] = count;
    });

    // Count the rest as "Lainnya" (only if more than 10 unique provinces)
    let provinceOtherCount = provinceUnknownCount;
    const totalUniqueProvinces = Object.keys(provinceMap).length;
    Object.entries(provinceMap).forEach(([province, count]) => {
      if (!Object.prototype.hasOwnProperty.call(provinces, province)) {
        provinceOtherCount += count;
      }
    });

    if (provinceOtherCount > 0 && totalUniqueProvinces > 10) {
      provinces["Lainnya"] = provinceOtherCount;
    }

    // Regional distribution by CITY
    const cityMap = {};
    let cityUnknownCount = 0;

    ikmUsers.forEach((ikm) => {
      const city = ikm.factoryCity || ikm.officeCity;
      if (city && city.trim()) {
        cityMap[city] = (cityMap[city] || 0) + 1;
      } else {
        cityUnknownCount += 1;
      }
    });

    // Sort by count (descending) and get top 10
    const sortedCity = Object.entries(cityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    // Create top 10 city object
    const cities = {};
    sortedCity.forEach(([city, count]) => {
      cities[city] = count;
    });

    // Count the rest as "Lainnya" (only if more than 10 unique cities)
    let cityOtherCount = cityUnknownCount;
    const totalUniqueCities = Object.keys(cityMap).length;
    Object.entries(cityMap).forEach(([city, count]) => {
      if (!Object.prototype.hasOwnProperty.call(cities, city)) {
        cityOtherCount += count;
      }
    });

    if (cityOtherCount > 0 && totalUniqueCities > 10) {
      cities["Lainnya"] = cityOtherCount;
    }

    setAnalyticsData({
      ikmByKomoditi: komoditi,
      regionalDistribution: provinces,
      regionalDistributionByCity: cities,
      userActivityTrend: [],
    });
  };

  // Filter IKM surveys by search term
  const filteredSurveyList = ikmSurveyList.filter(
    (survey) =>
      survey.businessName.toLowerCase().includes(surveySearch.toLowerCase()) ||
      survey.fullName.toLowerCase().includes(surveySearch.toLowerCase()),
  );

  // Handle opening survey detail view
  const handleOpenSurvey = (survey) => {
    navigate(`/admin/survey/${survey.uid}`);
  };

  // Handle edit
  const handleEdit = (type) => {
    setEditType(type);
    setShowEditModal(true);
  };

  // Create dashboard cards from stats
  const dashboardCards = [
    {
      id: 1,
      title: "Total Users",
      value: stats.totalUsers.toString(),
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-600 to-blue-500",
    },
    {
      id: 2,
      title: "Active IKM",
      value: stats.totalIKM.toString(),
      icon: <Database className="w-6 h-6" />,
      color: "from-green-600 to-green-500",
    },
    {
      id: 3,
      title: "Total Research",
      value: stats.totalResearch.toString(),
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-yellow-600 to-yellow-500",
    },
    {
      id: 4,
      title: "Partnerships",
      value: stats.totalPartnerships.toString(),
      icon: <BarChart3 className="w-6 h-6" />,
      color: "from-purple-600 to-purple-500",
    },
  ];

  // Export IKM data to Excel
  const exportToExcel = () => {
    // Transform real IKM data for export
    const exportData = ikmData.map((ikm, index) => ({
      "No.": index + 1,
      "Nama Perusahaan": ikm.businessName || "N/A",
      "KBLI 5 Digit": ikm.kbli || "N/A",
      "KBLI 2 Digit": ikm.kbli ? String(ikm.kbli).substring(0, 2) : "N/A",
      Komoditi: ikm.commodity || "N/A",
      "Kabupaten/Kota": ikm.officeCity || ikm.factoryCity || "N/A",
      Provinsi: ikm.officeProvince || ikm.factoryProvince || "N/A",
      "Contact Person": ikm.fullName || "N/A",
      "No. Telp": ikm.phone || "N/A",
    }));

    if (exportData.length === 0) {
      alert("Tidak ada data IKM untuk diekspor");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data IKM");

    // Auto-adjust column widths
    const maxWidth = 20;
    const colWidths = Object.keys(exportData[0]).map(() => maxWidth);
    worksheet["!cols"] = colWidths.map((w) => ({ wch: w }));

    XLSX.writeFile(workbook, `Data_IKM_MitraKita_${new Date().getTime()}.xlsx`);
  };

  // Export User data to Excel
  const exportUserData = () => {
    const exportData = userData.map((user, index) => ({
      "No.": index + 1,
      Nama: user.fullName || "N/A",
      Email: user.email || "N/A",
      Perusahaan: user.companyName || "N/A",
      Posisi: user.position || "N/A",
      Telepon: user.phoneNumber || "N/A",
      Kota: user.city || "N/A",
      "Tanggal Daftar": user.registrationDate || "N/A",
    }));

    if (exportData.length === 0) {
      alert("Tidak ada data User untuk diekspor");
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data User");

    const colWidths = Object.keys(exportData[0]).map(() => 20);
    worksheet["!cols"] = colWidths.map((w) => ({ wch: w }));

    XLSX.writeFile(
      workbook,
      `Data_User_MitraKita_${new Date().getTime()}.xlsx`,
    );
  };

  // Export Analytics Summary to Excel
  const exportAnalytics = () => {
    const analyticsExport = [
      {
        Metrik: "Total IKM Terdaftar",
        Jumlah: stats.totalIKM,
      },
      {
        Metrik: "Total User",
        Jumlah: stats.totalUsers,
      },
      {
        Metrik: "Total Academician",
        Jumlah: stats.totalAcademician,
      },
      {
        Metrik: "Total Penelitian",
        Jumlah: stats.totalResearch,
      },
      {
        Metrik: "Total Kemitraan",
        Jumlah: stats.totalPartnerships,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(analyticsExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Analytics Summary");

    const colWidths = [30, 15];
    worksheet["!cols"] = colWidths.map((w) => ({ wch: w }));

    XLSX.writeFile(
      workbook,
      `Analytics_MitraKita_${new Date().getTime()}.xlsx`,
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        {/* <Navbar /> */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p
              className="text-gray-600"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              Memuat data...
            </p>
          </div>
        </div>
        {/* <Footer /> */}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="flex-1 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1
                className="text-4xl font-bold text-gray-800"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Admin Dashboard
              </h1>
              <p
                className="text-gray-600 mt-2"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Selamat datang,{" "}
                <span className="font-semibold">{adminUser?.username}</span>
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold"
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex flex-wrap gap-2 mb-8 bg-white rounded-xl p-2 shadow-md">
            {[
              // {
              //   id: "overview",
              //   label: "Overview",
              //   icon: <BarChart3 className="w-4 h-4" />,
              // },
              {
                id: "management",
                label: "Edit Data",
                icon: <Database className="w-4 h-4" />,
              },
              { id: "logs", label: "Logs", icon: <Eye className="w-4 h-4" /> },
              {
                id: "analytics",
                label: "Data",
                icon: <BarChart3 className="w-4 h-4" />,
              },
              {
                id: "survey",
                label: "Survey IKM",
                icon: <Edit2 className="w-4 h-4" />,
              },
              {
                id: "export",
                label: "Ekspor Data",
                icon: <Download className="w-4 h-4" />,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${
                  activeTab === tab.id
                    ? "bg-linear-to-r from-green-600 to-green-500 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content Area */}
          {activeTab === "overview" && (
            <div>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {dashboardCards.map((card) => (
                  <div
                    key={card.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <div
                      className={`w-12 h-12 bg-linear-to-br ${card.color} rounded-xl flex items-center justify-center text-white mb-4`}
                    >
                      {card.icon}
                    </div>
                    <h3
                      className="text-gray-600 text-sm font-semibold mb-1"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {card.title}
                    </h3>
                    <p
                      className="text-2xl font-bold text-gray-800"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {card.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Recent Activity
                  </h2>
                  <div className="space-y-4">
                    {editLogs.slice(0, 3).map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            log.type === "IKM"
                              ? "bg-green-500"
                              : log.type === "User"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                          }`}
                        ></div>
                        <div className="flex-1">
                          <p
                            className="text-sm font-semibold text-gray-800"
                            style={{ fontFamily: "Montserrat, sans-serif" }}
                          >
                            {log.action} - {log.entity}
                          </p>
                          <p
                            className="text-xs text-gray-500"
                            style={{ fontFamily: "Open Sans, sans-serif" }}
                          >
                            {log.timestamp}
                          </p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            log.type === "IKM"
                              ? "bg-green-100 text-green-700"
                              : log.type === "User"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {log.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h2
                    className="text-xl font-bold text-gray-800 mb-6"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <button
                      onClick={() => setActiveTab("management")}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-500 rounded-xl hover:shadow-lg transition-all"
                    >
                      Manage Users
                    </button>
                    <button
                      onClick={() => setActiveTab("management")}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-white bg-linear-to-r from-green-600 to-green-500 rounded-xl hover:shadow-lg transition-all"
                    >
                      Manage IKM
                    </button>
                    <button
                      onClick={() => setActiveTab("logs")}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-white bg-linear-to-r from-yellow-500 to-yellow-400 rounded-xl hover:shadow-lg transition-all"
                    >
                      View Logs
                    </button>
                    <button
                      onClick={() => setActiveTab("export")}
                      className="w-full px-4 py-3 text-left text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-purple-500 rounded-xl hover:shadow-lg transition-all"
                    >
                      Ekspor Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === "management" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Edit Data
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Edit Data IKM",
                    description:
                      "Edit profil, KBLI, dan informasi kemitraan IKM",
                    icon: <Edit2 className="w-8 h-8" />,
                    color: "from-green-600 to-green-500",
                    type: "ikm",
                  },
                  {
                    title: "Edit Data User",
                    description: "Edit profil dan informasi pengguna industri",
                    icon: <Users className="w-8 h-8" />,
                    color: "from-blue-600 to-blue-500",
                    type: "user",
                  },
                  {
                    title: "Edit Data Akademisi",
                    description: "Edit profil dan penelitian akademisi",
                    icon: <BarChart3 className="w-8 h-8" />,
                    color: "from-yellow-600 to-yellow-500",
                    type: "academician",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div
                      className={`w-12 h-12 bg-linear-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-4`}
                    >
                      {item.icon}
                    </div>
                    <h3
                      className="text-lg font-bold text-gray-800 mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm text-gray-600 mb-4"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {item.description}
                    </p>
                    <button
                      onClick={() => handleEdit(item.type)}
                      className={`w-full px-4 py-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all bg-linear-to-r ${item.color}`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>

              {/* Mock Edit Form */}
              {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full p-6">
                    <h3
                      className="text-xl font-bold text-gray-800 mb-4"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      Edit Data {editType?.toUpperCase() || ""}
                    </h3>
                    <div className="space-y-4 mb-6">
                      <input
                        type="text"
                        placeholder="Cari nama atau ID"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        <option>Pilih data yang akan diedit...</option>
                        <option>Item 1</option>
                        <option>Item 2</option>
                      </select>
                      <textarea
                        placeholder="Catatan perubahan..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => setShowEditModal(false)}
                        className="flex-1 px-4 py-2 bg-linear-to-r from-green-600 to-green-500 text-white rounded-lg hover:shadow-lg"
                      >
                        Simpan
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="space-y-6">
              {/* Edit Logs */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Edit Logs
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Waktu
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Tipe
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Entity
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Aksi
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Admin
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {editLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {renderSafeValue(log.timestamp)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                log.type === "IKM"
                                  ? "bg-green-100 text-green-700"
                                  : log.type === "User"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {renderSafeValue(log.type)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                            {renderSafeValue(log.entity)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {renderSafeValue(log.action)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {renderSafeValue(log.editor)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Login Logs */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2
                  className="text-2xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Login Logs
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Waktu Login
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loginLogs.map((log) => (
                        <tr
                          key={log.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {log.loginAtDisplay}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                            {renderSafeValue(log.email)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                log.role === "ikm"
                                  ? "bg-green-100 text-green-700"
                                  : log.role === "user"
                                    ? "bg-blue-100 text-blue-700"
                                    : log.role === "academician"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {renderSafeValue(log.role)
                                ?.charAt(0)
                                .toUpperCase() +
                                renderSafeValue(log.role)?.slice(1) || "N/A"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {loginLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>Belum ada data login logs</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Analisis Data
              </h2>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    title: "Jumlah IKM",
                    value: stats.totalIKM,
                    color: "from-green-600 to-green-500",
                  },
                  {
                    title: "Jumlah User",
                    value: stats.totalUsers,
                    color: "from-blue-600 to-blue-500",
                  },
                  {
                    title: "Jumlah Akademisi",
                    value: stats.totalAcademician,
                    color: "from-yellow-600 to-yellow-500",
                  },
                  {
                    title: "Jumlah Kemitraan",
                    value: stats.totalPartnerships,
                    color: "from-purple-600 to-purple-500",
                  },
                ].map((metric, idx) => (
                  <div
                    key={idx}
                    className={`bg-linear-to-br ${metric.color} text-white rounded-2xl p-6 shadow-lg`}
                  >
                    <h3
                      className="text-sm font-semibold mb-2 opacity-90"
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      {metric.title}
                    </h3>
                    <p
                      className="text-4xl font-bold"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* IKM by KBLI */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3
                  className="text-xl font-bold text-gray-800 mb-6"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  IKM per KBLI
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(analyticsData.ikmByKomoditi).map(
                    ([kbli, count]) => (
                      <div key={kbli} className="flex items-center gap-4">
                        <div className="flex-1">
                          <div className="flex justify-between mb-2">
                            <span className="font-semibold text-gray-800">
                              {kbli === "Lainnya" ? "Lainnya" : `KBLI ${kbli}`}
                            </span>
                            <span className="font-bold text-gray-900">
                              {count}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-linear-to-r from-green-600 to-green-500 h-3 rounded-full"
                              style={{ width: `${(count / 250) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Regional Distribution */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                  <h3
                    className="text-xl font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Sebaran Wilayah IKM
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setRegionalFilter("province")}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        regionalFilter === "province"
                          ? "bg-linear-to-r from-blue-600 to-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Provinsi
                    </button>
                    <button
                      onClick={() => setRegionalFilter("city")}
                      className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                        regionalFilter === "city"
                          ? "bg-linear-to-r from-blue-600 to-blue-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Kota/Kabupaten
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(
                    regionalFilter === "province"
                      ? analyticsData.regionalDistribution
                      : analyticsData.regionalDistributionByCity,
                  ).map(([region, count]) => (
                    <div key={region} className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <span className="font-semibold text-gray-800">
                            {region}
                          </span>
                          <span className="font-bold text-gray-900">
                            {count}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-linear-to-r from-blue-600 to-blue-500 h-3 rounded-full"
                            style={{ width: `${(count / 300) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Trend */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                  <h3
                    className="text-xl font-bold text-gray-800"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Tren Aktivitas Pengguna
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    {[
                      { label: "1 Bulan", value: "1m" },
                      { label: "3 Bulan", value: "3m" },
                      { label: "6 Bulan", value: "6m" },
                      { label: "1 Tahun", value: "1y" },
                    ].map((period) => (
                      <button
                        key={period.value}
                        onClick={() => setActivityPeriod(period.value)}
                        className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                          activityPeriod === period.value
                            ? "bg-linear-to-r from-green-600 to-green-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                        style={{ fontFamily: "Montserrat, sans-serif" }}
                      >
                        {period.label}
                      </button>
                    ))}
                  </div>
                </div>

                {activityTrendData && activityTrendData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={activityTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="week"
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                        }}
                      />
                      <Legend />
                      <Bar
                        dataKey="logins"
                        fill="#10b981"
                        name="Login"
                        radius={[8, 8, 0, 0]}
                      />
                      <Bar
                        dataKey="registrations"
                        fill="#3b82f6"
                        name="Registrasi Baru"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-96 text-gray-500">
                    <p>Tidak ada data aktivitas untuk periode ini</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeTab === "export" && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2
                className="text-2xl font-bold text-gray-800 mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Ekspor Data
              </h2>
              <p
                className="text-gray-600 mb-8"
                style={{ fontFamily: "Open Sans, sans-serif" }}
              >
                Download kompilasi data dalam format Excel untuk analisis lebih
                lanjut
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: "Ekspor Data IKM",
                    description: "Download semua data IKM terdaftar",
                    icon: <Download className="w-8 h-8" />,
                    color: "from-green-600 to-green-500",
                    action: exportToExcel,
                  },
                  {
                    title: "Ekspor Data User",
                    description: "Download semua data pengguna industri",
                    icon: <Download className="w-8 h-8" />,
                    color: "from-blue-600 to-blue-500",
                    action: exportUserData,
                  },
                  {
                    title: "Ekspor Data Akademisi",
                    description: "Download semua data akademisi",
                    icon: <Download className="w-8 h-8" />,
                    color: "from-yellow-600 to-yellow-500",
                    action: exportAnalytics,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:border-gray-300 transition-all"
                  >
                    <div
                      className={`w-12 h-12 bg-linear-to-br ${item.color} rounded-xl flex items-center justify-center text-white mb-4`}
                    >
                      {item.icon}
                    </div>
                    <h3
                      className="text-lg font-bold text-gray-800 mb-2"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm text-gray-600 mb-4"
                      style={{ fontFamily: "Open Sans, sans-serif" }}
                    >
                      {item.description}
                    </p>
                    <button
                      onClick={item.action}
                      className={`w-full px-4 py-2 text-white rounded-lg font-semibold hover:shadow-lg transition-all bg-linear-to-r ${item.color}`}
                      style={{ fontFamily: "Montserrat, sans-serif" }}
                    >
                      Ekspor
                    </button>
                  </div>
                ))}
              </div>

              {/* Info Box */}
              <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
                <p
                  className="text-blue-900 text-sm"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                >
                  <span className="font-semibold">ℹ️ Catatan:</span> File export
                  akan berisi data komprehensif yang dapat digunakan untuk
                  analisis, pelaporan, dan keperluan administrasi. Semua file
                  export akan diunduh dalam format .xlsx (Excel).
                </p>
              </div>
            </div>
          )}

          {/* Survey IKM Tab */}
          {activeTab === "survey" && (
            <div className="space-y-6">
              <h2
                className="text-2xl font-bold text-gray-800"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Data Survey IKM
              </h2>

              {/* Search Box */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <input
                  type="text"
                  placeholder="Cari nama IKM atau nama kontak..."
                  value={surveySearch}
                  onChange={(e) => setSurveySearch(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ fontFamily: "Open Sans, sans-serif" }}
                />
              </div>

              {/* Survey List */}
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                {filteredSurveyList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b-2 border-gray-200 bg-gray-50">
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Nama IKM
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Nama Kontak
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                            Status
                          </th>
                          <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSurveyList.map((survey) => (
                          <tr
                            key={survey.uid}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                              {survey.businessName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {survey.fullName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {survey.email}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                Sudah Diisi
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleOpenSurvey(survey)}
                                className="px-4 py-2 text-sm font-semibold text-white bg-linear-to-r from-blue-600 to-blue-500 rounded-lg hover:shadow-lg transition-all"
                                style={{ fontFamily: "Montserrat, sans-serif" }}
                              >
                                Lihat Detail
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">
                    {ikmSurveyList.length === 0 ? (
                      <p>Belum ada IKM yang mengisi survey</p>
                    ) : (
                      <p>Tidak ada hasil pencarian</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Info Box */}
          {/* <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-2xl">
            <p
              className="text-blue-900 text-sm"
              style={{ fontFamily: "Open Sans, sans-serif" }}
            >
              <span className="font-semibold">ℹ️ Informasi:</span> Panel admin
              ini menyediakan tools lengkap untuk mengelola data sistem, melihat
              logs, menganalisis tren, dan export data. Semua aktivitas admin
              dicatat untuk keamanan dan audit trail.
            </p>
          </div> */}
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default AdminDashboard;
