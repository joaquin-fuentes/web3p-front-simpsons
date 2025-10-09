import axios from "axios";

const clientAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Cambiá por la URL de tu backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token automáticamente
clientAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Obtener token guardado
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Agregar al header
  }
  return config;
});

export default clientAxios;
