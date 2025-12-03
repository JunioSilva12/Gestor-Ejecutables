import axios from 'axios';


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Accept': 'application/json',
  }
});

// 👉 Agregar token automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 👉 Evitar descargas .bin inesperadas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.data instanceof Blob &&
      error.response.data.type === "application/octet-stream"
    ) {
      return Promise.reject({
        message: "⚠️ El servidor devolvió un archivo .bin inesperado",
        error
      });
    }

    return Promise.reject(error);
  }
);

export default api;
