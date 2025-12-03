// usersApi.js
import { useUserStore } from '@/lib/stores/userStore';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

/**
 * Obtiene el token desde el store
 * @returns {string|null}
 */
function getToken() {
  const userStore = useUserStore();
  return userStore.userData?.token || null;
}

/**
 * Manejo genérico de fetch con token opcional
 */
async function authFetch(endpoint, options = {}, requireToken = true) {

  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',

  };

  const token = getToken();
  if (requireToken && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Manejo de errores HTTP
  if (!res.ok) {
    let errorMsg = `Error HTTP ${res.status}`;

    try {
      const errData = await res.json();
      if (errData?.message) errorMsg = errData.message;
    } catch {
      /* no importa */
    }

    throw new Error(errorMsg);
  }

  return await res.json();
}

/**
 * Get /events/user/:user_uuid
 * Obtiene eventos por usuario con paginación
 * @param {string} user_uuid
 * @param {number} page
 */
export async function getEventsByUser(user_uuid, page = 1) {
  return authFetch(`/events/user/${user_uuid}?page=${page}`, { method: 'GET' });
}



/**
 * GET /events
 * Obtiene eventos con filtros opcionales
 * @param {number} page
 * @param {object} filters
 *   plate: string
 *   event_type: "entry" | "exit"
 *   result: "authorized" | "unauthorized"
 *   start_date: "YYYY-MM-DD"
 *   end_date: "YYYY-MM-DD"
 */
export async function getEvents(page = 1, filters = {}) {
  const params = new URLSearchParams();

  params.append("page", page);

  // Filtros opcionales
  if (filters.plate) params.append("plate", filters.plate);
  if (filters.event_type) params.append("event_type", filters.event_type);
  if (filters.result) params.append("result", filters.result);
  if (filters.start_date) params.append("start_date", filters.start_date);
  if (filters.end_date) params.append("end_date", filters.end_date);

  return authFetch(`/events?${params.toString()}`, {
    method: "GET",
  });
}
