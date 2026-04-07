import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase-config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import SHA256 from "crypto-js/sha256";

// Create Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  // Regular user auth state
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Admin auth state
  const [adminUser, setAdminUser] = useState(null);
  const [adminIsLoggedIn, setAdminIsLoggedIn] = useState(false);
  const [adminLoading, setAdminLoading] = useState(true);

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // User is logged in
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
        });

        // Get role from Firestore
        try {
          const db = getFirestore();
          const userDocRef = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);
          if (userSnap.exists()) {
            const userData = userSnap.data();
            setRole(userData.role);
            setIsLoggedIn(true);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        // User is logged out
        setUser(null);
        setRole(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Check admin login status on mount
  useEffect(() => {
    const storedAdminSession = localStorage.getItem("adminSession");
    if (storedAdminSession) {
      try {
        const adminData = JSON.parse(storedAdminSession);
        setAdminUser(adminData);
        setAdminIsLoggedIn(true);
      } catch (error) {
        console.error("Error parsing admin session:", error);
        localStorage.removeItem("adminSession");
      }
    }
    setAdminLoading(false);
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Admin login function
  const adminLogin = (username, password) => {
    try {
      const adminUsername =
        import.meta.env.VITE_ADMIN_USERNAME || "admin_losin";
      const adminPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;

      if (!adminPasswordHash) {
        console.error("Admin password hash not configured in .env");
        return false;
      }

      // Hash the input password
      const inputPasswordHash = SHA256(password).toString();

      // Compare username and password hash
      if (
        username === adminUsername &&
        inputPasswordHash === adminPasswordHash
      ) {
        const adminData = {
          username: username,
          role: "admin",
          loginTime: new Date().toISOString(),
        };
        setAdminUser(adminData);
        setAdminIsLoggedIn(true);
        localStorage.setItem("adminSession", JSON.stringify(adminData));
        return true;
      }

      return false;
    } catch (error) {
      console.error("Admin login error:", error);
      return false;
    }
  };

  // Admin logout function
  const adminLogout = () => {
    setAdminUser(null);
    setAdminIsLoggedIn(false);
    localStorage.removeItem("adminSession");
  };

  const value = {
    // Regular user auth
    user,
    role,
    isLoggedIn,
    loading,
    logout,
    // Admin auth
    adminUser,
    adminIsLoggedIn,
    adminLoading,
    adminLogin,
    adminLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
