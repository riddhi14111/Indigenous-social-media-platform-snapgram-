import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const res = await api.post("/auth/login", { email, password });

          set({
            user: res.data.user || null,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });

          return {
            success: false,
            message: error?.response?.data?.message || "Login failed",
          };
        }
      },

      register: async (data) => {
        set({ isLoading: true });

        try {
          const res = await api.post("/auth/register", data);

          set({
            user: res.data.user || null,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });

          return {
            success: false,
            message: error?.response?.data?.message || "Register failed",
          };
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "snapgram-auth",
    }
  )
);