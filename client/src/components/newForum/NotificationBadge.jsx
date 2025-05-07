// src/components/newForum/NotificationBell.jsx
import React, { useEffect, useState } from "react";
import { IoMdNotifications } from "react-icons/io";
import { useNotifications } from "../../store/useNotifications";

export default function NotificationBell() {
  const { notifications, addNotification } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:5000/ws`);

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      addNotification(notification);
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) ws.close();
    };
  }, [addNotification]);

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-600">
        <IoMdNotifications size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 w-64 p-4 mt-2 bg-white rounded shadow-lg">
          <h3 className="mb-2 font-bold">Notifications</h3>
          <ul>
            {notifications.slice(0, 5).map((n, i) => (
              <li key={i} className="py-1 text-sm border-b">
                {n.message}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}