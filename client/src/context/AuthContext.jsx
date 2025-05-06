import React, { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(
    () => localStorage.getItem("token") || null
  );

  const publicPaths = [
    "/login",
    "/signup",
    "/verify-email",
    "/otp-verify",
    "/",
  ];

  /** Reset ALL authentication-related states properly */
  const resetAuthState = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setToken(null);
    localStorage.removeItem("token");
    sessionStorage.clear();
    axios.defaults.headers.common["Authorization"] = null; // 🔥 clear axios headers
  }, []);

  /** Handle Login */
  // const login = useCallback(
  //   async (userData, newToken) => {
  //     localStorage.setItem("token", newToken);
  //     setUser({
  //       id: userData.id || 0,
  //       email: userData.email || "",
  //       name: userData.name || "",
  //       role: userData.role || "USER",
  //       profilePhotoUrl: userData.profilePhotoUrl || "",
  //     });
  //     setToken(newToken);
  //     setIsAuthenticated(true);

  //     axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`; // 🔥 Set axios auth header

  //     if (
  //       ["/login", "/signup", "/verify-email", "/otp-verify", "/"].includes(
  //         location.pathname
  //       )
  //     ) {
  //       navigate("/feed", { replace: true });
  //     }
  //   },
  //   [navigate, location.pathname]
  // );
const login = useCallback(async (userData, newToken) => {
  localStorage.setItem("token", newToken);
  setToken(newToken);
  
  try {
    const response = await axios.get(
      "http://localhost:5000/api/auth/check-session",
      {
        headers: { Authorization: `Bearer ${newToken}` },
        withCredentials: true,
      }
    );
    const freshUserData = response.data;
    
    setUser({
      id: freshUserData.id || 0,
      email: freshUserData.email || "",
      name: freshUserData.name || "",
      role: freshUserData.role || "USER",
      profilePhotoUrl: freshUserData.profilePhotoUrl || "",
    });
    setIsAuthenticated(true);

    if (["/login", "/signup", "/verify-email", "/otp-verify"].includes(location.pathname)) {
      navigate("/feed", { replace: true });
    }
  } catch (error) {
    console.error("Failed to fetch session data after login:", error.response?.data || error.message);
    resetAuthState();
  }
}, [navigate, location.pathname, resetAuthState]);


  /** Handle Logout */
  const logout = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        await axios.post(
          "http://localhost:5000/api/auth/logout",
          {},
          {
            headers: { Authorization: `Bearer ${storedToken}` },
            withCredentials: true,
          }
        );
      }
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      resetAuthState();
      navigate("/login", { replace: true });
      window.location.reload();
    }
  }, [navigate, resetAuthState]);

  /** Centralized session check */
  const checkSession = useCallback(async () => {
    setLoading(true);
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      resetAuthState();
      if (!publicPaths.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
      setLoading(false);
      return;
    }

    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`; // 🔥 Set token before API
      const response = await axios.get(
        "http://localhost:5000/api/auth/check-session",
        { withCredentials: true }
      );

      if (response.data && response.data.id) {
        setUser({
          id: response.data.id || 0,
          email: response.data.email || "",
          name: response.data.name || "",
          role: response.data.role || "USER",
          profilePhotoUrl: response.data.profilePhotoUrl || "",
        });
        setToken(storedToken);
        setIsAuthenticated(true);

        if (
          ["/login", "/signup", "/verify-email", "/otp-verify", "/"].includes(
            location.pathname
          )
        ) {
          navigate("/feed", { replace: true });
        }
      } else {
        throw new Error("Invalid session data");
      }
    } catch (err) {
      console.error("Session check failed:", err.response?.data || err.message);
      resetAuthState();
      if (!publicPaths.includes(location.pathname)) {
        navigate("/login", { replace: true });
      }
    } finally {
      setLoading(false);
    }
  }, [location.pathname, navigate, resetAuthState]);

  /** On mount: Check session + Setup inactivity logout */
  useEffect(() => {
    checkSession();

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000); // 30 mins
    };

    const activityListener = () => resetTimer();
    window.addEventListener("mousemove", activityListener);
    window.addEventListener("keypress", activityListener);
    resetTimer();

    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", activityListener);
      window.removeEventListener("keypress", activityListener);
    };
  }, [checkSession, logout]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        loading,
        token,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
