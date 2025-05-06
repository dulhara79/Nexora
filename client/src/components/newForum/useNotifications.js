// src/store/useNotifications.js
import { create } from "zustand";

export const useNotifications = create((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({ notifications: [notification, ...state.notifications] })),
}));