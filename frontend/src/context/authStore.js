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
          const res = await api.post("/auth/login", {
            email,
            password,
          });

          const user = res?.data?.user || null;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });

          return {
            success: false,
            message:
              error?.response?.data?.message || "Login failed",
          };
        }
      },

      register: async (data) => {
        set({ isLoading: true });

        try {
          const res = await api.post("/auth/register", data);

          const user = res?.data?.user || null;

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });

          return {
            success: false,
            message:
              error?.response?.data?.message || "Register failed",
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

      // ✅ IMPORTANT FIX
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);