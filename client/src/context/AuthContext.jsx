import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/check-session", {
          withCredentials: true,
        });
        // Ensure response.data matches UserResponse format from backend
        if (response.data && response.data.id) {
          setUser({
            id: (response.data.id)? response.data.id : 0,
            email: (response.data.email)? response.data.email : "",
            name: (response.data.name)? response.data.name : "",
            profileImage: (response.data.profileImage)? response.data.profileImage : "",
            role: response.data.role || "USER",
          });
          setIsAuthenticated(true);
        } else {
          throw new Error("Invalid session data");
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        console.error("Session check failed:", err.response?.data || err.message);
      } finally {
        setLoading(false); // Set loading to false after check
      }
    };
    checkSession();

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, 30 * 60 * 1000); // 30 minutes
    };

    // Use a single event listener function for better performance
    const activityListener = () => resetTimer();
    window.addEventListener("mousemove", activityListener);
    window.addEventListener("keypress", activityListener);
    resetTimer();

    // Cleanup
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("mousemove", activityListener);
      window.removeEventListener("keypress", activityListener);
    };
  }, []); // Empty dependency array since this runs once on mount

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setLoading(false); // Ensure loading is false after manual login
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, { withCredentials: true });
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
      window.location.href = "/login"; // Redirect to login page
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;