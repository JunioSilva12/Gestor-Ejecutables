// Ejemplo de cómo usar el userStore en cualquier componente

import { useUserStore } from '@/lib/stores/userStore'

export default {
  setup() {
    const userStore = useUserStore()

    // ✅ Acceder a datos del usuario
    console.log('Usuario:', userStore.userData)
    console.log('Nombre:', userStore.userName)
    console.log('Email:', userStore.userEmail)
    console.log('Rol:', userStore.userRole)
    console.log('¿Autenticado?:', userStore.isAuthenticated)

    // ✅ Hacer login
    const handleLogin = async (email, password) => {
      const result = await userStore.loginUsuario(email, password)
      if (result.success) {
        console.log('Login exitoso!')
      } else {
        console.error('Error:', result.mensaje)
      }
    }

    // ✅ Cerrar sesión
    const handleLogout = async () => {
      const result = await userStore.cerrarSesion()
      if (result.success) {
        console.log('Sesión cerrada')
      }
    }

    // ✅ Limpiar errores
    const clearErrors = () => {
      userStore.clearError()
    }

    return {
      userStore,
      handleLogin,
      handleLogout,
      clearErrors
    }
  }
}

// 📝 En Composition API (script setup):
// <script setup>
// import { useUserStore } from '@/lib/stores/userStore'
//
// const userStore = useUserStore()
//
// // Usar los computed values reactivos
// const userName = computed(() => userStore.userName)
// const isLoading = computed(() => userStore.loading)
// </script>
