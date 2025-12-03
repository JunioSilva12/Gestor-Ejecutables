<template>
  <div class="grid md:grid-cols-2 m-3" :class="darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'">
    <!-- Panel Izquierdo: Fuente (Cámara / Video / Imagen) -->
    <div class="col-12 md:col-8">
      <Card class="h-full" :class="darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'">
        <template #title>
          <div class="flex justify-content-between align-items-center"
            :class="darkMode ? 'text-gray-200' : 'text-gray-900'">
            <span class="font-medium">Vista de Fuente {{ darkMode ? 'Oscura' : 'Clara' }}</span>
            <Tag :value="currentSourceLabel" severity="info" />
          </div>
        </template>

        <template #content>
          <div :class="darkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-200 text-gray-900'"
            class="relative w-full aspect-video border-round overflow-hidden flex align-items-center justify-content-center">
            <!-- Cámara -->
            <video v-show="source === 'camera'" ref="cameraVideo" autoplay playsinline muted
              class="w-full h-full object-contain" />

            <!-- Video -->
            <video v-show="source === 'video' && videoUrl" ref="fileVideo" :src="videoUrl" controls playsinline
              class="w-full h-full object-contain" />

            <!-- Imagen -->
            <img v-show="source === 'image' && imageUrl" ref="imageEl" :src="imageUrl" alt="Imagen seleccionada"
              class="h-full object-contain" />

            <!-- Mensajes de ayuda -->
            <div v-if="source === 'video' && !videoUrl" :class="darkMode ? 'text-gray-400' : 'text-gray-600'"
              class="text-center p-3">
              Selecciona un archivo de video para previsualizarlo aquí.
            </div>
            <div v-if="source === 'image' && !imageUrl" :class="darkMode ? 'text-gray-400' : 'text-gray-600'"
              class="text-center p-3">
              Selecciona una imagen para previsualizarla aquí.
            </div>
          </div>
          <!-- Canvas oculto para capturas -->
          <canvas ref="captureCanvas" class="hidden"></canvas>
        </template>
      </Card>
    </div>

    <!-- Panel Derecho -->
    <div class="col-12 md:col-4 flex flex-column gap-3">
      <!-- Controles -->
      <Card :class="darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'">
        <template #title>
          <span :class="darkMode ? 'text-gray-200' : 'text-gray-900'" class="font-medium">Controles</span>
        </template>
        <template #content>
          <div class="flex flex-column gap-3">
            <!-- Fuente -->
            <div class="flex flex-column gap-2">
              <label :class="darkMode ? 'text-gray-300' : 'text-gray-900'" class="font-medium">Fuente</label>
              <Dropdown v-model="source" :options="sourceOptions" optionLabel="label" optionValue="value" class="w-full"
                :class="darkMode ? 'bg-gray-700 text-gray-100' : 'bg-white text-gray-900'" />
            </div>

            <!-- Botones según fuente -->
            <div v-if="source === 'camera'" class="flex gap-2 flex-wrap">
              <Button class="" icon="pi pi-video" label="Iniciar" @click="startCamera"
                :class="darkMode ? 'bg-blue-600 text-white' : ''" />
              <Button icon="pi pi-stop" label="Detener" severity="secondary" @click="stopCamera"
                :class="darkMode ? 'bg-gray-600 text-white' : ''" />
            </div>

            <div v-else-if="source === 'video'" class="flex flex-wrap gap-2">
              <Button icon="pi pi-upload" label="Seleccionar Video" @click="pickVideo"
                :class="darkMode ? 'bg-blue-600 text-white' : ''" />
              <span :class="darkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm truncate max-w-20rem"
                v-if="videoName">{{ videoName }}</span>
              <input ref="videoInput" type="file" accept="video/*" class="hidden" @change="onVideoSelected" />
            </div>

            <div v-else-if="source === 'image'" class="flex flex-wrap gap-2">
              <Button icon="pi pi-upload" label="Seleccionar Imagen" @click="pickImage"
                :class="darkMode ? 'bg-blue-600 text-white' : ''" />
              <span :class="darkMode ? 'text-gray-400' : 'text-gray-600'" class="text-sm truncate max-w-20rem"
                v-if="imageName">{{ imageName }}</span>
              <input ref="imageInput" type="file" accept="image/*" class="hidden" @change="onImageSelected" />
            </div>

            <!-- Switch Carro/Moto -->
            <div class="flex align-items-center gap-3">
              <span :class="darkMode ? 'text-gray-200' : 'text-gray-900'" class="font-medium">Tipo de vehículo</span>
              <ToggleButton :class="darkMode ? 'bg-blue-600 text-white' : ''" v-model="isCar" onLabel="Carro"
                offLabel="Moto" onIcon="pi pi-car" offIcon="pi pi-motorcycle"
                :pt="{ root: { class: 'w-12rem' }, box: { class: 'w-full justify-content-between' } }" />
            </div>

            <!-- Botón Escanear -->
            <Button :loading="loading" class="w-full py-3" size="large" icon="pi pi-search" label="Escanear placa"
              @click="onScanClick" :class="darkMode ? 'bg-green-600 text-white' : 'bg-green-500 text-white'" />
          </div>
        </template>
      </Card>

      <!-- Historial -->
      <Card :class="darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'">
        <template #title>
          <div class="flex align-items-center gap-2" :class="darkMode ? 'text-gray-200' : 'text-gray-900'">
            <i class="pi pi-history"></i>
            <span class="font-medium">Historial de ingreso</span>
          </div>
        </template>
        <template #content>
          <DataTable :value="history" :paginator="history.length > 10" :rows="10" responsiveLayout="scroll" dataKey="id"
            :class="darkMode ? 'bg-blue-600 text-white' : ''" size="small" class="text-sm">
            <Column field="plate" header="Placa" />                  
            <Column field="date" header="Fecha" />
          </DataTable>
        </template>
      </Card>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, onBeforeUnmount, watch } from "vue"
import Button from "primevue/button"
import Card from "primevue/card"
import Dropdown from "primevue/dropdown"
import ToggleButton from "primevue/togglebutton"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import Tag from "primevue/tag"

import { useDarkMode } from "../stores/useDarkMode";

const darkMode = useDarkMode();
const key = ref(0); // 🔑 clave reactiva

// Cuando cambie darkMode, fuerza un re-render
watch(darkMode, () => {
  key.value++;
  console.log("Dark mode cambiado:", darkMode.value);
});

// Estado
const source = ref("camera")
const isCar = ref(true)
const loading = ref(false)

const sourceOptions = [
  { label: "Cámara", value: "camera" },
  { label: "Video", value: "video" },
  { label: "Imagen", value: "image" }
]
const currentSourceLabel = computed(
  () => sourceOptions.find(o => o.value === source.value)?.label || ""
)

// Cámara
const cameraVideo = ref(null)
let cameraStream = null
const fileVideo = ref(null)
const imageEl = ref(null)
const captureCanvas = ref(null)

const videoInput = ref(null)
const imageInput = ref(null)
const videoUrl = ref("")
const videoName = ref("")
const imageUrl = ref("")
const imageName = ref("")

// Historial
const history = ref([])

let idSeq = 1

const startCamera = async () => {
  stopCamera()
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
      audio: false
    })
    if (cameraVideo.value) {
      cameraVideo.value.srcObject = cameraStream
      await cameraVideo.value.play()
    }
  } catch (err) {
    console.error("No se pudo iniciar la cámara", err)
  }
}
const stopCamera = () => {
  if (cameraStream) {
    cameraStream.getTracks().forEach(t => t.stop())
    cameraStream = null
  }
}
onBeforeUnmount(() => {
  stopCamera()
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
})

// Archivos
const pickVideo = () => videoInput.value?.click()
const pickImage = () => imageInput.value?.click()
const onVideoSelected = e => {
  const file = e.target.files?.[0]
  if (!file) return
  if (videoUrl.value) URL.revokeObjectURL(videoUrl.value)
  videoUrl.value = URL.createObjectURL(file)
  videoName.value = file.name
}
const onImageSelected = e => {
  const file = e.target.files?.[0]
  if (!file) return
  if (imageUrl.value) URL.revokeObjectURL(imageUrl.value)
  imageUrl.value = URL.createObjectURL(file)
  imageName.value = file.name
}




// 🔹 Recorta un canvas para que quede cuadrado
function cropToSquare(canvas) {
  const ctx = canvas.getContext("2d")
  const size = Math.min(canvas.width, canvas.height)
  const offsetX = (canvas.width - size) / 2
  const offsetY = (canvas.height - size) / 2

  const squareCanvas = document.createElement("canvas")
  squareCanvas.width = size
  squareCanvas.height = size
  const squareCtx = squareCanvas.getContext("2d")

  squareCtx.drawImage(
    canvas,
    offsetX, offsetY, size, size, // fuente
    0, 0, size, size              // destino
  )

  return squareCanvas
}

// 📸 Captura
const captureBlob = async () => {
  const originCanvas = captureCanvas.value
  const ctx = originCanvas.getContext("2d")
  let w = 0, h = 0

  if (source.value === "camera" && cameraVideo.value) {
    w = cameraVideo.value.videoWidth
    h = cameraVideo.value.videoHeight
    originCanvas.width = w
    originCanvas.height = h
    ctx.drawImage(cameraVideo.value, 0, 0, w, h)
  } else if (source.value === "video" && fileVideo.value) {
    w = fileVideo.value.videoWidth
    h = fileVideo.value.videoHeight
    originCanvas.width = w
    originCanvas.height = h
    ctx.drawImage(fileVideo.value, 0, 0, w, h)
  } else if (source.value === "image" && imageEl.value) {
    w = imageEl.value.naturalWidth
    h = imageEl.value.naturalHeight
    originCanvas.width = w
    originCanvas.height = h
    ctx.drawImage(imageEl.value, 0, 0, w, h)
  } else {
    throw new Error("No hay fuente activa")
  }

  // 🔹 Ahora sí recortamos al cuadrado
  const squareCanvas = cropToSquare(originCanvas)

  // 🔹 Si quieres que se vea en tu <canvas ref="captureCanvas">
  captureCanvas.value.width = squareCanvas.width
  captureCanvas.value.height = squareCanvas.height
  captureCanvas.value
    .getContext("2d")
    .drawImage(squareCanvas, 0, 0)

  return new Promise(resolve =>
    squareCanvas.toBlob(resolve, "image/jpeg", 0.92)
  )
}


// Escanear
const onScanClick = async () => {
  try {
    loading.value = true
    const blob = await captureBlob()
    if (!blob) throw new Error("No se pudo capturar")

    const fd = new FormData()
    fd.append("image", blob, "frame.jpg")
    fd.append("vehicleType", isCar.value ? "car" : "moto")

    // Esperamos respuesta del backend
    const res = await fetch("http://127.0.0.1:8000/api/plate-recognition/", {
      method: "POST",
      body: fd
    })

    if (!res.ok) throw new Error("Error en la API")

    const data = await res.json()
    console.log("Resultados de la API:", data)

    const now = new Date()

    // Adaptamos los campos a tu tabla
    history.value.unshift({
      id: idSeq++,
      plate: data.plate ?? "---",
      role: data.count ?? "N/D",        // 👈 podrías mapearlo como "veces detectada"
      status: data.confidence ?? "---", // 👈 aquí confianza
      date: now.toLocaleString()
    })
    
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

</script>

<style scoped>
.aspect-video {
  aspect-ratio: 16 / 9;
}
</style>
