// vehiclesApi.js
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
 * Manejo genérico de fetch con token obligatorio
 */
async function  authFetch(endpoint, options = {}, requireToken = true) {

  const token = getToken();
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (requireToken && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${BACKEND_URL}${endpoint}`, { ...options, headers });
    if (!res.ok) {
        const error = await res.json()



    console.error(`Error en fetch ${endpoint}:`, error.message || error);
      throw new Error(error.message || `Error HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {


    console.error(`Error en fetch ${endpoint}:`, error.message || error);   
     throw error;
  }
}

/** ===================== VEHÍCULOS ===================== */

/**
 * GET /vehicles?page=1
 * Obtener todos los vehículos (requiere rol admin)
 * @param {number} page
 */
        export async function getVehicles(page = 1) {
  return authFetch(`/vehicles?page=${page}`, { method: 'GET' });
}

/**
 * GET /vehicles/:id
 * Obtener vehículo por ID (requiere permiso)
 * @param {string} id
 */
export async function getVehicleById(id) {
  return authFetch(`/vehicles/${id}`, { method: 'GET' });
}

/**
 * GET /vehicles/user/:user_uuid?page=1
 * Obtener vehículos asociados a un usuario (requiere permiso)
 * @param {string} user_uuid
 * @param {number} page
 */
export async function getVehiclesByUser(user_uuid, page = 1) {
  return authFetch(`/vehicles/user/${user_uuid}?page=${page}`, { method: 'GET' });
}

/**
 * GET /vehicles/license-plate/:plate
 * Obtener vehículo por placa (requiere permiso)
 * @param {string} plate
 */
export async function getVehicleByPlate(plate) {
  return authFetch(`/vehicles/license-plate/${plate}`, { method: 'GET' });
}

/**
 * POST /vehicles
 * Crear un vehículo (requiere permiso)
 * @param {object} data - { license_plate, model, color, user_uuid }
 */
export async function createVehicle(data) {
  return authFetch('/vehicles', {
    method: 'POST',
    body: JSON.stringify(data)
  });
}

/**
 * PUT /vehicles/:id
 * Actualizar vehículo (requiere permiso)
 * @param {string} id
 * @param {object} data - Campos a actualizar
 */
export async function updateVehicle(id, data) {
  return authFetch(`/vehicles/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  });
}

/**
 * DELETE /vehicles/:id
 * Borrar vehículo (requiere rol admin)
 * @param {string} id
 */
export async function deleteVehicle(id) {
  return authFetch(`/vehicles/${id}`, { method: 'DELETE' });
}
