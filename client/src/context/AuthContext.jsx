import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkSession = async () => {
      if (!token) {
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);
        navigate("/login"); // Redirect to login if no token
        return;
      }
      try {
        const response = await axios.get(
          "http://localhost:5000/api/auth/check-session",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (response.data && response.data.id) {
          setUser({
            id: response.data.id || 0,
            email: response.data.email || "",
            name: response.data.name || "",
            role: response.data.role || "USER",
          });
          setIsAuthenticated(true);
          navigate("/feed"); // Redirect to feed after successful session check
        } else {
          throw new Error("Invalid session data");
        }
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
        console.error(
          "Session check failed:",
          err.response?.data || err.message
        );
        navigate("/login"); // Redirect to login on failure
      } finally {
        setLoading(false);
      }
    };
    checkSession();

    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(logout, 30 * 60 * 1000); // 30 minutes
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
  }, [token, navigate]);

  const login = (userData, newToken) => {
    setUser(userData);
    setToken(newToken);
    localStorage.setItem("token", newToken);
    setIsAuthenticated(true);
    setLoading(false);
    navigate("/feed"); // Redirect to feed after login
  };

  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/logout", {});
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setLoading(false);
      navigate("/login"); // Redirect to login after logout
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setLoading(false);
      navigate("/login");
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, loading, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
