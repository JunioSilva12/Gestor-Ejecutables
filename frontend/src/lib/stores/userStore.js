import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import { consultarLogin, eliminarTokenSesion } from '@/lib/api/loginApi'

export const useUserStore = defineStore('user', () => {
  // Estado
  const usuarioHorusEye = ref(null)
  const isAuthenticated = ref(false)
  const loading = ref(false)
  const error = ref(null)

  // Función para sincronizar con localStorage
  const syncToLocalStorage = () => {
    try {
      if (usuarioHorusEye.value) {
        localStorage.setItem('usuarioHorusEye', JSON.stringify(usuarioHorusEye.value))
        localStorage.setItem('isAuthenticated', 'true')
      } else {
        localStorage.removeItem('usuarioHorusEye')
        localStorage.removeItem('isAuthenticated')
      }
    } catch (err) {
      console.error('Error al sincronizar con localStorage:', err)
    }
  }

  // Watchers para sincronización automática
  watch([usuarioHorusEye, isAuthenticated], () => {
    syncToLocalStorage()
  }, { deep: true })

  // Getters (computed)
  const userData = computed(() => usuarioHorusEye.value)
  const userRole = computed(() => usuarioHorusEye.value?.role || null)
  const userName = computed(() => usuarioHorusEye.value?.user?.name || null)
  const userEmail = computed(() => usuarioHorusEye.value?.user?.email || null)

  // Actions (funciones)
  const loginUsuario = async (correo, password) => {
    loading.value = true
    error.value = null

    try {
      console.log('Iniciando sesión para:', correo)
      const response = await consultarLogin(correo, password)

      // Guardar en el store (automáticamente se sincroniza por el watcher)
      usuarioHorusEye.value = response
      isAuthenticated.value = true

      return { success: true, data: response }
    } catch (err) {
      console.error('Error en login:', err)
      error.value = err.message
      return { success: false, mensaje: err.message }
    } finally {
      loading.value = false
    }
  }

  const cerrarSesion = async () => {
    loading.value = true
    try {
      const token = localStorage.getItem('usuarioHorusEye') ? JSON.parse(localStorage.getItem('usuarioHorusEye')).token : null;
      await eliminarTokenSesion(token)

      // Limpiar el store (automáticamente se sincroniza por el watcher)
      usuarioHorusEye.value = null
      isAuthenticated.value = false
      error.value = null
      localStorage.removeItem('usuarioHorusEye')
      localStorage.removeItem('isAuthenticated')
      return { success: true }
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
      error.value = err.message
      return { success: false, mensaje: err.message }
    } finally {
      loading.value = false
    }
  }

  const initializeFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('usuarioHorusEye')
      const storedAuth = localStorage.getItem('isAuthenticated')

      if (storedUser && storedAuth === 'true') {
        usuarioHorusEye.value = JSON.parse(storedUser)
        isAuthenticated.value = true
      }
    } catch (err) {
      console.error('Error al cargar datos del localStorage:', err)
      localStorage.removeItem('usuarioHorusEye')
      localStorage.removeItem('isAuthenticated')
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Inicializar desde localStorage al crear el store
  initializeFromStorage()

  return {
    // Estado
    usuarioHorusEye,
    isAuthenticated,
    loading,
    error,

    // Getters
    userData,
    userRole,
    userName,
    userEmail,

    // Actions
    loginUsuario,
    cerrarSesion,
    initializeFromStorage,
    clearError
  }
})
