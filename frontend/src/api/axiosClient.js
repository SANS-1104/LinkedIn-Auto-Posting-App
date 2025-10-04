// src/api/axiosClient.js
import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Request interceptor: attach access token conditionally
axiosClient.interceptors.request.use(
  (config) => {
    const publicRoutes = ["/login", "/signup", "/auth/refresh-token", "/auth"];
    const token = localStorage.getItem("accessToken"); // ✅ fixed key

    // console.log("📦 AxiosClient request to:", config.url);
    // console.log("🔑 Token from localStorage:", token);

    if (publicRoutes.some(route => config.url.includes(route))) {
      return config; // Skip token for public routes
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response interceptor: refresh token logic
axiosClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (
      err.response?.status === 401 &&
      err.response.data?.msg === "Token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        try {
          const res = await axios.post("http://localhost:5000/api/auth/refresh-token", {
            token: refreshToken,
          });

          const newAccessToken = res.data.accessToken;
          localStorage.setItem("accessToken", newAccessToken); // ✅ fixed key

          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosClient(originalRequest);
        } catch (refreshErr) {
          localStorage.clear();
          window.location.href = "/auth";
        }
      } else {
        localStorage.clear();
        window.location.href = "/auth";
      }
    }

    return Promise.reject(err);
  }
);

export default axiosClient;
