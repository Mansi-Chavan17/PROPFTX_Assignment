import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
});

// Add token to headers for all requests (if token stored in localStorage or elsewhere)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // adjust if stored elsewhere
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
