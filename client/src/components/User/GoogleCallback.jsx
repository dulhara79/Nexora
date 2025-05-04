// src/components/User/GoogleCallback.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const handleMessage = (event) => {
      // Ensure the message is from the expected origin
      if (event.origin !== "http://localhost:5173") return;

      const { userId, token, email, name, error } = event.data;

      if (error) {
        console.error("Google login error:", error);
        navigate("/login", { replace: true });
        return;
      }

      // Call the login function from AuthContext
      login(
        {
          id: userId,
          email,
          name,
          profilePhotoUrl: "", // Will be updated by backend
        },
        token
      );

      // Navigate to the desired page (e.g., /feed)
      navigate("/feed", { replace: true });
    };
    window.addEventListener("message", handleMessage);

    window.addEventListener("message", handleMessage);
    // Open the Google OAuth popup
    const popup = window.open(
      "http://localhost:5000/api/auth/google-redirect",
      "GoogleLogin",
      "width=600,height=600"
    );

    // Check if popup was blocked
    if (!popup) {
      console.error("Popup blocked");
      navigate("/login", { replace: true });
    }

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [navigate, login]);

  return null; // No UI, just handles the callback
};

export default GoogleCallback;
