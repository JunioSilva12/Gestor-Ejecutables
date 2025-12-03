<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  fotos: {
    type: Array,
    default: () => []
  },
  cargando: {
    type: Boolean,
    default: false
  },
  resultado: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

console.log('Props del modal:', props)

// Función para descargar las fotos
const descargarFoto = (foto) => {
  const link = document.createElement('a')
  link.href = foto.imagenUrl
  link.download = foto.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const descargarTodasLasFotos = () => {
  props.fotos.forEach(foto => {
    setTimeout(() => descargarFoto(foto), 100)
  })
}
</script>

<template>
  <div class="fixed inset-0 bg-transparent flex items-center justify-center z-50" @click="emit('close')">
    <div class="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto border" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">
          {{ cargando ? 'Escaneando Placa...' : 'Resultados del Escaneo' }}
        </h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
      </div>
      
      <!-- Estado de carga -->
      <div v-if="cargando" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mb-4"></div>
        <p class="text-lg text-gray-600">Procesando imágenes...</p>
        <p class="text-sm text-gray-500 mt-2">Esto puede tardar unos segundos</p>
      </div>
      
      <!-- Resultados -->
      <div v-else-if="resultado">
        <!-- Error en la petición -->
        <div v-if="resultado.error" class="text-center py-2">
          <!-- <div class="text-red-500 text-3xl mb-4">⚠️</div> -->
          <h3 class="text-lg font-semibold text-red-600 mb-2">Error en el Escaneo</h3>
          <p class="text-gray-600">{{ resultado.error }}</p>
        </div>
        
        <!-- Resultados exitosos -->
        <div v-else>
          <div class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 class="text-lg font-semibold text-green-800 mb-2">🎯 Placa Detectada</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="resultado.placa" class="text-sm">
                <strong>Placa:</strong> {{ resultado.placa }}
              </div>
              <div v-if="resultado.confianza" class="text-sm">
                <strong>Confianza:</strong> {{ resultado.confianza }}%
              </div>
              <div v-if="resultado.vehiculo" class="text-sm">
                <strong>Vehículo:</strong> {{ resultado.vehiculo }}
              </div>
              <div class="text-sm">
                <strong>Timestamp:</strong> {{ new Date().toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Fotos capturadas -->
      <div v-if="fotos.length > 0 && !cargando" class="mt-6">
        <h3 class="text-lg font-semibold mb-4">📸 Fotos Capturadas</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div v-for="(foto, index) in fotos" :key="index" class="border rounded-lg p-4">
            <img :src="foto.imagenUrl" :alt="`Foto ${index + 1}`" class="w-full h-48 object-cover rounded mb-2" />
            <div class="text-sm text-gray-600">
              <p><strong>Cámara:</strong> {{ foto.nombre }}</p>
              <p><strong>Timestamp:</strong> {{ new Date(foto.timestamp).toLocaleString() }}</p>
            </div>
            <button 
              @click="descargarFoto(foto)"
              class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
            >
              Descargar
            </button>
          </div>
        </div>
        
        <div class="flex justify-center">
          <button 
            @click="descargarTodasLasFotos"
            class="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600"
          >
            Descargar Todas las Fotos
          </button>
        </div>
      </div>
    </div>
  </div>
</template>