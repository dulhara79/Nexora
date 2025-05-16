// src/components/common/BellIcon.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import webSocket from "../../utils/websocket";
import { FaBell } from "react-icons/fa";

const BellIcon = () => {
  const { token, user } = useContext(AuthContext);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!token || !user) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          "http://localhost:5000/api/forum/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          }
        );
        const count = res.data.notifications.filter(
          (notif) => !notif.isRead
        ).length;
        setUnreadCount(count);
      } catch (err) {
        console.error("Failed to fetch notification count:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnreadCount();
  }, [token, user]);

  // Optional: Add WebSocket listener for real-time updates (if needed)
  useEffect(() => {
    if (user?.id && token) {
      const client = webSocket(user.id, (newNotification) => {
        if (!newNotification.isRead) {
          setUnreadCount((prev) => prev + 1);
        }
      });
      return () => client.deactivate();
    }
  }, [user?.id, token]);

  if (!token || loading) return null;

  return (
    <Link
      to="/forum/notifications"
      className="fixed z-50 top-40 right-6 focus:outline-none"
      aria-label="Notifications"
    >
      <div className="relative">
        <div className="p-2 transition-shadow bg-white rounded-full shadow-lg hover:shadow-xl">
          <FaBell className="text-xl text-gray-700" />
        </div>
        {unreadCount > 0 && (
          <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full -top-1 -right-1 animate-pulse">
            {unreadCount}
          </span>
        )}
      </div>
    </Link>
  );
};

export default BellIcon;
