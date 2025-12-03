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

  try {
   const res = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options, // method, body, etc.
      headers,
    });    if (!res.ok) {
        const error = await res.json()


         //toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Error en la operación', life: 3000 });

    console.error(`Error en fetch ${endpoint}:`, error.message || error);
      throw new Error(error.message || `Error HTTP ${res.status}`);
    }

    return await res.json();
  } catch (error) {
       const msg =error.message ? error.message
          : 'Error desconocido';
    // toast.add({ severity: 'error', summary: 'Error', detail: msg || 'Error en la operación:', life: 3000 });

    console.error(`Error en fetch ${endpoint}:`, msg || error);

    throw error;
  }
}

/**
 * Obtener todos los usuarios paginados con filtros opcionales
 * @param {Object} params  { page, search, role, ... }
 */
export async function getUsers(params = {}) {
  // Filtrar params: quitar null, undefined o '' vacíos
  const cleanParams = Object.fromEntries(
    // eslint-disable-next-line no-unused-vars
    Object.entries(params).filter(([_, v]) => v !== null && v !== undefined && v !== '')
  );

  const query = new URLSearchParams(cleanParams).toString();

  return await authFetch(`/users?${query}`, { method: 'GET' });
}

/**
 * Obtener un usuario por ID
 * @param {string} uuid
 */
export async function getUserById(uuid) {
  return authFetch(`/users/${uuid}`, { method: 'GET' });
}

/**
 * Crear un usuario
 * No requiere token
 * @param {object} data - { name, email, password, password_confirmation, rol }
 */
export async function crearUsuario(data) {
    console.log('Creando usuario con datos:', data);

  return authFetch('/users', { method: 'POST', body: JSON.stringify(data) });
}

/**
 * Actualizar un usuario
 * @param {string} uuid
 * @param {object} data - { name?, email?, password?, password_confirmation? }
 */
export async function actualizarUsuario(uuid, data) {
        console.log('Actualizando usuario con datos:', data);

  return authFetch(`/users/${uuid}`, { method: 'PUT', body: JSON.stringify(data) });
}

/**
 * Eliminar un usuario
 * @param {string} uuid
 */
export async function deleteUser(uuid) {
  return authFetch(`/users/${uuid}`, { method: 'DELETE' });
}

/**
 * Obtener roles y permisos de todos los usuarios
 */
export async function getRolesPermissions(page = 1) {
  return authFetch(`/users/roles-permissions?page=${page}`, { method: 'GET' });
}

/**
 * Cambiar rol de un usuario
 * @param {string} uuid
 * @param {string} rol - 'user' | 'visitor'
 */
export async function cambiarRol(uuid, rol) {
  return authFetch(`/users/rol/${uuid}`, {
    method: 'POST',
    body: JSON.stringify({ rol })
  });
}
