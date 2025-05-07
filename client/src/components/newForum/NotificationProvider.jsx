// NotificationProvider.jsx
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const NotificationContext = createContext();

const BASE_URL = "http://localhost:5000";

export function useNotifications() {
  return useContext(NotificationContext);
}

export default function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL }/api/forum/notifications`);
      setNotifications(res.data);
      setUnreadCount(res.data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  // Poll for updates
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      fetchNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}