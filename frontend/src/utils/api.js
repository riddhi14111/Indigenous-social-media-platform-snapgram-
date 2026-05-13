import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

if (!BASE_URL) {
  console.error("VITE_API_URL missing!");
}

const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;