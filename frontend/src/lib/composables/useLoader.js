/**
 * Composable `useLoader` para manejar un estado global de carga (loader/spinner) en Vue 3.
 *
 * Funcionalidad:
 * 1. Controla un estado reactivo `loading` que indica si se está mostrando un loader.
 * 2. Proporciona métodos `mostrar` y `ocultar` para activar o desactivar el loader.
 * 3. Ideal para usar con indicadores de carga en botones, tablas o formularios.
 *
 */

import { ref } from 'vue'

// Estado reactivo que indica si el loader está activo
const loading = ref(false)

export function useLoader() {
  /**
   * Activa el loader estableciendo `loading` en true
   */
  const mostrar = () => {
    loading.value = true
  }

  /**
   * Desactiva el loader estableciendo `loading` en false
   */
  const ocultar = () => {
    loading.value = false
  }

  // Retorna las funciones y el estado reactivo
  return {
    mostrar,
    ocultar,
    loading
  }
}
