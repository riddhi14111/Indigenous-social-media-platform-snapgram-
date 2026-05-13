import { create } from "zustand";
import api from "../api"; // ✅ FIXED IMPORT (IMPORTANT)

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  isLoading: false,
  isAuthenticated: !!localStorage.getItem("token"),

  // 🔥 LOGIN
  login: async (email, password) => {
    set({ isLoading: true });

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // ✅ SAVE TOKEN + USER
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      set({ isLoading: false });

      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  },

  // 🔥 REGISTER
  register: async (data) => {
    set({ isLoading: true });

    try {
      const res = await api.post("/auth/register", data);

      const { token, user } = res.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });

      return { success: true };
    } catch (err) {
      set({ isLoading: false });

      return {
        success: false,
        message: err.response?.data?.message || "Register failed",
      };
    }
  },

  // 🔥 LOGOUT
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      user: null,
      isAuthenticated: false,
    });
  },

  // 🔥 LOAD USER ON REFRESH
  loadUser: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      set({
        user: JSON.parse(user),
        isAuthenticated: true,
      });
    }
  },
}));