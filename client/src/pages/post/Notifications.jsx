import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../../context/AuthContext";
import { formatDistanceToNow, parseISO } from "date-fns";
import Navbar from "../../components/post/Navbar";

const Notifications = ({ onNewNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useContext(AuthContext);

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/notifications", {
        withCredentials: true,
      });
      console.log("Fetched notifications:", response.data); // Debug log
      const notificationData = response.data.map(item => item.notification);
      setNotifications(notificationData);
      
      const unread = notificationData.filter(notification => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`http://localhost:5000/api/notifications/${notificationId}/read`, {}, {
        withCredentials: true,
      });
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("http://localhost:5000/api/notifications/read-all", {}, {
        withCredentials: true,
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  const getFilteredNotifications = () => {
    switch (filter) {
      case "unread":
        return notifications.filter(notification => !notification.read);
      case "likes":
        return notifications.filter(notification => notification.type === "like");
      case "comments":
        return notifications.filter(notification => notification.type === "comment");
      case "all":
      default:
        return notifications;
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "like":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case "comment":
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 13V5a2 2 0 00-2-2H4a2 2 0 00-2 2v8a2 2 0 002 2h3l3 3 3-3h3a2 2 0 002-2zM5 7a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h3a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
          </div>
        );
    }
  };

  const formatNotificationTime = (createdAt) => {
    if (!createdAt) {
      console.warn("createdAt is undefined or null:", createdAt);
      return "Just now";
    }
    try {
      const date = typeof createdAt === 'number' ? new Date(createdAt) : parseISO(createdAt);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date parsed:", createdAt);
        return "Just now";
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error("Error parsing date:", createdAt, error);
      return "Just now";
    }
  };

  useEffect(() => {
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 3000); // Reduced to 3 seconds

    if (onNewNotification) {
      onNewNotification(() => {
        console.log("onNewNotification triggered, fetching notifications");
        fetchNotifications();
      });
    }

    return () => clearInterval(interval);
  }, [onNewNotification]);

  return (
    <div className="min-h-screen text-gray-900 bg-amber-50">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl p-4 mx-auto mt-6"
      >
        <div className="overflow-hidden bg-white shadow-lg rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-amber-500 to-amber-400">
            <div className="flex items-center">
              <h2 className="text-2xl font-bold text-white">Notifications</h2>
              {unreadCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="px-2 py-1 ml-3 text-xs font-bold text-white bg-red-500 rounded-full"
                >
                  {unreadCount} new
                </motion.span>
              )}
            </div>
            {notifications.length > 0 && (
              <button 
                onClick={markAllAsRead}
                className="px-3 py-1 text-sm font-medium text-white transition-all rounded-md bg-amber-600 hover:bg-amber-700"
              >
                Mark all as read
              </button>
            )}
          </div>
          
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {["all", "unread", "likes", "comments"].map((filterType) => (
                <button
                  key={filterType}
                  onClick={() => setFilter(filterType)}
                  className={`px-4 py-2 text-sm font-medium rounded-full transition-all ${
                    filter === filterType
                      ? "bg-amber-500 text-white" 
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                  {filterType === "unread" && unreadCount > 0 && (
                    <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${
                      filter === filterType
                        ? "bg-white text-amber-600"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-8 h-8 border-t-2 border-b-2 rounded-full animate-spin border-amber-500"></div>
                <p className="ml-3 text-gray-600">
                  Loading notifications...
                </p>
              </div>
            ) : getFilteredNotifications().length === 0 ? (
              <div className="py-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <p className="mb-2 text-lg font-medium text-gray-700">
                  No notifications yet
                </p>
                <p className="text-gray-500">
                  {filter === "all" 
                    ? "When someone interacts with your post, you'll see it here."
                    : `No ${filter} notifications available.`}
                </p>
              </div>
            ) : (
              <AnimatePresence>
                <ul className="space-y-3">
                  {getFilteredNotifications().map((notification) => (
                    <motion.li
                      key={notification.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className={`p-4 rounded-lg flex items-start hover:shadow-md transition-all ${
                        notification.read 
                          ? "bg-white border border-gray-100" 
                          : "bg-amber-50"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 ml-4">
                        <div className="flex justify-between">
                          <p className="font-medium text-gray-800">
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatNotificationTime(notification.createdAt)}
                          </span>
                        </div>
                        {notification.recipeName && (
                          <p className="mt-1 text-sm text-gray-500">
                            on post: <span className="font-medium text-amber-600">{notification.recipeName}</span>
                          </p>
                        )}
                        {!notification.read && (
                          <div className="flex justify-end mt-3">
                            <button 
                              onClick={() => markAsRead(notification.id)}
                              className="px-3 py-1 text-xs font-medium transition-all rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200"
                            >
                              Mark as read
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Notifications;