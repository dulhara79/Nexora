// src/utils/notificationSocket.js
import { useEffect } from "react";
import { useNotifications } from "../context/NotificationProvider";

export function useNotificationSocket(userId) {
  useEffect(() => {
    if (!userId) return;
    
    const ws = new WebSocket(`wss://your-api-url/ws/notifications/${userId}`);
    
    // Handle incoming notifications
    ws.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        // Update global notification state
        useNotifications.getState().addNotification(notification);
      } catch (error) {
        console.error("Error parsing notification:", error);
      }
    };
    
    // Handle connection errors
    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };
    
    // Clean up
    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
    };
  }, [userId]);
  
  return null;
}