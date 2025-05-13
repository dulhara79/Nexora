// src/services/websocket.js
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

const webSocket = (userId, onMessageReceived) => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found for WebSocket connection");
    return { deactivate: () => {} }; // Return dummy client
  }

  const client = new Client({
    webSocketFactory: () => new SockJS("http://localhost:5000/ws-notifications"),
    connectHeaders: {
      Authorization: `Bearer ${token}`,
    },
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
    debug: (str) => {
      console.log("STOMP Debug:", str); // Add debug logging
    },
  });

  client.onConnect = () => {
    console.log("WebSocket connected for user:", userId);
    client.subscribe(`/user/${userId}/queue/notifications`, (message) => {
      console.log("Received WebSocket message:", message.body);
      try {
        const notification = JSON.parse(message.body);
        onMessageReceived(notification);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    });
  };

  client.onStompError = (frame) => {
    console.error("WebSocket STOMP error:", frame);
  };

  client.onWebSocketError = (error) => {
    console.error("WebSocket error:", error);
  };

  client.onWebSocketClose = () => {
    console.log("WebSocket closed, attempting to reconnect...");
  };

  client.activate();

  return client;
};

export default webSocket;