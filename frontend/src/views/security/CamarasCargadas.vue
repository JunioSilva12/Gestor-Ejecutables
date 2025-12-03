<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

// Props para recibir la cámara seleccionada desde el componente padre
const props = defineProps({
  camaraId: {
    type: String,
    default: ''
  }
})

const videoRef = ref(null)   // referencia al <video>
let stream = null            // guardamos el stream para poder detenerlo luego

// Función para tomar una foto de la cámara actual (retorna blob)
const tomarFoto = () => {
  if (!videoRef.value || !stream) {
    console.warn('No hay cámara activa para tomar foto')
    return null
  }

  try {
    // Crear un canvas para capturar la imagen
    const canvas = document.createElement('canvas')
    const video = videoRef.value

    // Establecer las dimensiones del canvas igual al video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Dibujar el frame actual del video en el canvas
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convertir canvas a blob (Promise)
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve({
            imagen: blob,                          // Blob de la imagen
            imagenUrl: URL.createObjectURL(blob),  // URL temporal para vista previa
            timestamp: new Date().toISOString(),
            camaraId: props.camaraId,
            fileName: `camara_${props.camaraId}_${Date.now()}.jpg` // Nombre sugerido
          })
        } else {
          console.error('Error al generar blob')
          resolve(null)
        }
      }, 'image/jpeg', 0.8) // Formato JPEG con 80% de calidad
    })
  } catch (err) {
    console.error('Error al tomar foto:', err)
    return Promise.resolve(null)
  }
}

// Función para detener la cámara
const detenerCamara = () => {
  try {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      stream = null
    }

    if (videoRef.value) {
      videoRef.value.srcObject = null
    }
  } catch (err) {
    console.error('Error al detener la cámara:', err)
  }
}

// Función para iniciar la cámara seleccionada
const iniciarCamara = async (deviceId = null) => {
  try {
    // Detener stream anterior si existe
    detenerCamara()

    // Configurar restricciones de video
    const constraints = {
      video: deviceId ? { deviceId: { exact: deviceId } } : true,
      audio: false
    }

    // Obtener nuevo stream
    stream = await navigator.mediaDevices.getUserMedia(constraints)

    if (videoRef.value) {
      videoRef.value.srcObject = stream
    }
  } catch (err) {
    console.error('Error al acceder a la cámara:', err)
  }
}

// Observar cambios en la prop camaraId
watch(() => props.camaraId, (nuevaCamera) => {
  if (nuevaCamera) {
    iniciarCamara(nuevaCamera)
  } else {
    // Si camaraId está vacío (None seleccionado), detener la cámara
    detenerCamara()
  }
}, { immediate: true })

onMounted(async () => {
  // Si no se proporciona camaraId, usar la cámara por defecto
  if (!props.camaraId) {
    await iniciarCamara()
  }
})

// Limpiar el stream cuando el componente se destruya
onBeforeUnmount(() => {
  detenerCamara()
})

// Exponer la función para que el componente padre pueda llamarla
defineExpose({
  tomarFoto
})
</script>

<template>
  <div class="w-full h-full flex items-center justify-center overflow-hidden">
    <video
      ref="videoRef"
      autoplay
      playsinline
      class="w-full h-full object-cover rounded-lg"
    ></video>
  </div>
</template>
