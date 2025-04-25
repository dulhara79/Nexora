import { useEffect } from "react";

const GoogleCallback = () => {
  useEffect(() => {
    // Check if the window contains the JSON response
    const fetchUserData = async () => {
      try {
        // Since the page is loaded at /api/auth/google-redirect, the JSON is in the document body
        const jsonText = document.body.textContent;
        const data = JSON.parse(jsonText); // Parse the JSON response
        const { id, token, email, name } = data;

        if (id && token) {
          // Send user data to the parent window
          window.opener.postMessage(
            { userId: id, token, email, name },
            "http://localhost:5173"
          );
        } else {
          throw new Error("Invalid user data");
        }
      } catch (error) {
        console.error("Error processing Google login data:", error);
        window.opener.postMessage(
          { error: "Google login failed" },
          "http://localhost:5173"
        );
      } finally {
        // Close the popup window
        window.close();
      }
    };

    fetchUserData();
  }, []);

  return <div>Authenticating...</div>;
};

export default GoogleCallback;
