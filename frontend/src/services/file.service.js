import api from './api';

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return await api.post('/files/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const getFiles = async () => {
  return await api.get('/files');
};

export const downloadFile = async (id) => {
  return await api.get(`/files/${id}/download`, { responseType: 'blob' });
};

export const deleteFile = async (id) => {
  return await api.delete(`/files/${id}`);
};

export async function downloadFileById(id) {
  const response = await api.get(`/files/${id}/download`, {
    responseType: "arraybuffer",
  });

  const mime = response.headers["content-type"] || "";
  const size = response.data.byteLength;

  // ❌ Saltar archivos .bin o superiores a 10MB
  if (mime === "application/x-msdownload" || size > 10_000_000) {
    console.warn("Archivo inesperado del backend. Se ignora.");
    return;
  }

  // ---- Obtener nombre ----
  const header = response.headers["content-disposition"];
  let filename = "archivo";

  if (header) {
    const match = header.match(/filename="?([^"]+)"?/);
    if (match) filename = decodeURIComponent(match[1]);
  }

  const blob = new Blob([response.data], { type: mime });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
}

