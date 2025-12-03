// Composable para funciones de formato general

export function usarFormato() {

  /**
   * Formatea la fecha a DD/MM/AAAA HH:mm
   * @param {string} fechaIso
   * @returns {string}
   */
  const formatearFecha = (fechaIso) => {
    const fecha = new Date(fechaIso)
    return fecha.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  /**
   * Formatea un string Base64 y lo convierte en JSON
   * @param {string | undefined} perfilBase64
   * @returns {any}
   */
  const formatearBase64aJSON = (perfilBase64) => {
    if (perfilBase64) {
      // Decodificar la cookie base64
      const perfilJson = atob(perfilBase64)

      // Parsear el JSON
      const perfil = JSON.parse(perfilJson)

      // Ahora puedes usar el perfil decodificado
      return perfil
    } else {
      return { mensaje: 'No se encontró el perfil del usuario.' }
    }
  }

  return {
    formatearFecha,
    formatearBase64aJSON
  }
}
