import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";

const Notifications = ({ onNewNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notifications", {
        withCredentials: true,
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Polling every 5 seconds for live updates
    const interval = setInterval(fetchNotifications, 5000);

    // Listen for new notifications triggered by likes/comments
    if (onNewNotification) {
      onNewNotification(fetchNotifications);
    }

    return () => clearInterval(interval); // Cleanup on unmount
  }, [onNewNotification]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl p-4 mx-auto"
    >
      <h2 className="mb-6 text-2xl font-bold text-gray-800">Notifications</h2>
      <div className="p-6 bg-white rounded-lg shadow-md">
        {loading ? (
          <p className="text-center text-gray-600">Loading notifications...</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-600">No notifications yet.</p>
        ) : (
          <ul className="space-y-2">
            {notifications.map((notification) => (
              <motion.li
                key={notification.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="p-2 bg-gray-100 rounded-lg"
              >
                {notification.message} -{" "}
                {new Date(notification.createdAt).toLocaleString()}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default Notifications;