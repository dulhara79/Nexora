// NotificationsPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import Header from "../../components/common/NewPageHeader"

const BASE_URL = "http://localhost:5000";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds
    
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${BASE_URL }/api/forum/notifications`);
      setNotifications(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`${BASE_URL }/api/forum/notifications/${id}`, { isRead: true });
      setNotifications(notifications.map(n => 
        n.id === id ? { ...n, isRead: true } : n
      ));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <Header />  
      <div className="container px-4 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Your Notifications</h1>
        
        <div className="space-y-4">
          {notifications.map(notification => (
            <div 
              key={notification.id}
              className={`p-4 rounded-lg shadow-sm ${
                notification.isRead ? "bg-white" : "bg-orange-50"
              }`}
            >
              <div className="flex justify-between">
                <p>{notification.message}</p>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(notification.createdAt))} ago
                </span>
              </div>
              
              {!notification.isRead && (
                <button 
                  onClick={() => markAsRead(notification.id)}
                  className="mt-2 text-xs text-orange-500 hover:text-orange-700"
                >
                  Mark as read
                </button>
              )}
            </div>
          ))}
          
          {notifications.length === 0 && (
            <div className="py-8 text-center bg-white rounded-lg shadow-sm">
              <p>No notifications</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}