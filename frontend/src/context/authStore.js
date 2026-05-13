import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../utils/api"; // ✅ FIXED IMPORT

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // 🔥 LOGIN
      login: async (email, password) => {
        set({ isLoading: true });

        try {
          const res = await api.post("/auth/login", { email, password });

          set({
            user: res.data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });

          return {
            success: false,
            message:
              error.response?.data?.message || "Login failed",
          };
        }
      },

      // 🔥 REGISTER
      register: async (userData) => {
        set({ isLoading: true });

        try {
          const res = await api.post("/auth/register", userData);

          set({
            user: res.data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true };
        } catch (error) {
          set({ isLoading: false });

          return {
            success: false,
            message:
              error.response?.data?.message || "Registration failed",
          };
        }
      },

      // 🔥 LOGOUT
      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.log(error);
        }

        set({
          user: null,
          isAuthenticated: false,
        });
      },

      // 🔥 UPDATE USER
      updateUser: (userData) => {
        set({
          user: { ...get().user, ...userData },
        });
      },

      // 🔥 GET CURRENT USER
      getMe: async () => {
        try {
          const res = await api.get("/auth/me");

          set({
            user: res.data.user,
            isAuthenticated: true,
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      // 🔥 FORGOT PASSWORD
      forgotPassword: async (email) => {
        set({ isLoading: true });

        try {
          const res = await api.post("/auth/forgot-password", {
            email,
          });

          set({ isLoading: false });

          return {
            success: true,
            message: res.data.message,
          };
        } catch (error) {
          set({ isLoading: false });

          return {
            success: false,
            message:
              error.response?.data?.message ||
              "Something went wrong",
          };
        }
      },

      // 🔥 RESET PASSWORD
      resetPassword: async (token, newPassword) => {
        set({ isLoading: true });

        try {
          const res = await api.post(
            `/auth/reset-password/${token}`,
            { newPassword }
          );

          set({ isLoading: false });

          return {
            success: true,
            message: res.data.message,
          };
        } catch (error) {
          set({ isLoading: false });

          return {
            success: false,
            message:
              error.response?.data?.message || "Reset failed",
          };
        }
      },
    }),
    {
      name: "snapgram-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);