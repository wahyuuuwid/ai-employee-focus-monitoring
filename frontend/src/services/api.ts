import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000",
});

// Add Authorization header to all requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 responses - redirect to login
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_id");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default API;
