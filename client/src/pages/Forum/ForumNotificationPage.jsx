// src/pages/NotificationPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import setupWebSocket from "../../utils/websocket";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../context/AuthContext";
import EnhancedHeader from "../../components/common/NewPageHeader";
import { FaRegCheckCircle, FaRegBell } from "react-icons/fa";

const NotificationPage = () => {
  const { token, user } = useContext(AuthContext);
  const userId = user?.id;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // const fetchNotifications = async () => {
  //   if (!token || !userId) {
  //     console.error("No token or userId found");
  //     toast.error("Please log in to view notifications");
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const res = await axios.get(
  //       "http://localhost:5000/api/forum/notifications",
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //           "Cache-Control": "no-cache",
  //         },
  //       }
  //     );
  //     setNotifications(res.data.notifications || []);
  //   } catch (err) {
  //     handleApiError(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchNotifications = async () => {
    if (!token || !userId) {
      console.error("No token or userId found");
      toast.error("Please log in to view notifications");
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

      // Sort notifications by createdAt (descending)
      const sortedNotifications = [...res.data.notifications].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setNotifications(sortedNotifications);
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err) => {
    console.error("Failed to fetch notifications:", err.response?.data);
    if (err.response?.status === 401) {
      toast.error("Session expired. Please log in again.");
    } else {
      toast.error(err.response?.data?.error || "Failed to load notifications");
    }
  };

  useEffect(() => {
    if (userId && token) {
      fetchNotifications();
      const client = setupWebSocket(userId, (newNotification) => {
        setNotifications((prev) => [newNotification, ...prev]);
        toast.info(newNotification.message, {
          position: "top-right",
          autoClose: 5000,
          icon: <FaRegBell className="text-blue-500" />,
        });
      });
      return () => client.deactivate();
    } else {
      toast.error("Please log in to receive notifications");
      setLoading(false);
    }
  }, [userId, token]);

  const markAsRead = async (id) => {
    try {
      await axios.post(
        `http://localhost:5000/api/forum/notifications/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(
        notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark as read:", err);
      toast.error("Failed to mark notification as read");
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/forum/notifications/mark-all-read",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
      toast.success("All notifications marked as read");
    } catch (err) {
      console.error("Failed to mark all as read:", err);
      toast.error("Failed to mark all notifications as read");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.RelativeTimeFormat("en", { style: "short" }).format(
      Math.floor((date - new Date()) / (1000 * 60 * 60 * 24)),
      "day"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <EnhancedHeader />
        <div className="max-w-3xl px-4 py-12 mx-auto space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex p-4 space-x-4 bg-white rounded-lg shadow animate-pulse"
            >
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-4">
                <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <EnhancedHeader />
      <div className="max-w-3xl px-4 py-12 mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Notifications</h1>
            <p className="mt-2 text-gray-600">
              {notifications.length}{" "}
              {notifications.length === 1 ? "notification" : "notifications"}
            </p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-500 rounded-full hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <FaRegCheckCircle className="mr-2" />
              Mark all as read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center bg-white shadow-sm rounded-xl">
            <div className="p-6 text-orange-400 bg-orange-100 rounded-full">
              <FaRegBell size={40} />
            </div>
            <h3 className="mt-4 text-xl font-medium text-gray-900">
              No notifications yet
            </h3>
            <p className="max-w-md mt-2 text-gray-500">
              Stay tuned for updates from the cooking community!
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 bg-white rounded-xl shadow-sm transition-all duration-200 hover:shadow-md ${
                  !notif.isRead
                    ? "border-l-4 border-orange-500"
                    : "border-l-4 border-transparent"
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 text-white rounded-full bg-gradient-to-r from-orange-400 to-pink-500">
                      <span className="text-lg font-bold">
                        {notif.userName?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-gray-800 ${
                        !notif.isRead ? "font-semibold" : ""
                      }`}
                    >
                      {notif.type === "COMMENT" ||
                      notif.type === "QUESTION_VOTE" ? (
                        <Link
                          to={`/forum/question/${notif.relatedQuestionId}`}
                          className="transition-colors hover:text-orange-500"
                        >
                          {notif.message}
                        </Link>
                      ) : notif.type === "COMMENT_VOTE" ? (
                        <Link
                          to={`/forum/question/${notif.relatedQuestionId}#comment-${notif.relatedCommentId}`}
                          className="transition-colors hover:text-orange-500"
                        >
                          {notif.message}
                        </Link>
                      ) : (
                        notif.message
                      )}
                    </p>

                    <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                      <time>{formatDate(notif.createdAt)}</time>
                      {!notif.isRead && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="flex items-center text-orange-500 hover:text-orange-700"
                          aria-label="Mark as read"
                        >
                          <FaRegCheckCircle className="w-4 h-4 mr-1" />
                          <span>Mark as read</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;
