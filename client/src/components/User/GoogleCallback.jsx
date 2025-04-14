import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch user data from the success endpoint
        const response = await axios.get('http://localhost:5000/api/users/google-success', {
          withCredentials: true
        });
        const { userId } = response.data;

        if (userId) {
          // Post message to parent window
          window.opener.postMessage({ userId }, 'http://localhost:5173');
          navigate(`/edit/${userId}`);
        }
      } catch (error) {
        console.error('Error fetching Google login data:', error);
        window.opener.postMessage({ error: 'Google login failed' }, 'http://localhost:5173');
      } finally {
        window.close();
      }
    };

    fetchUserData();
  }, [navigate]);

  return <div>Authenticating...</div>;
};

export default GoogleCallback;