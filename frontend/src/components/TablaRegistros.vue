<script setup>
import { ref,computed, onMounted, toRaw} from 'vue'
import FiltrosTabla from '../views/security/FiltrosTabla.vue'
import { consultarEventosAPI } from '../lib/api/inicioApi.js'

const eventos = ref([])
const currentPage = ref(1)
const lastPage = ref(1)
const loadingEventos = ref(false)

function formatFechaUTC(utcString) {
  if (!utcString) return ''
  const d = new Date(utcString)
  // Convertir UTC a hora de Colombia (UTC-5)
  const offsetMs = 5 * 60 * 60 * 1000
  const dCol = new Date(d.getTime() - offsetMs)
  const day = pad(dCol.getUTCDate())
  const month = pad(dCol.getUTCMonth() + 1)
  const year = dCol.getUTCFullYear()
  const hours = pad(dCol.getUTCHours())
  const minutes = pad(dCol.getUTCMinutes())
  return `${day}-${month}-${year} ${hours}:${minutes}`
}

const pad = (n) => String(n).padStart(2, '0')

// obtener eventos (acepta page opcional)
async function obtenerEventos() {
  try {
    loadingEventos.value = true
    const token = localStorage.getItem('usuarioHorusEye')
      ? JSON.parse(localStorage.getItem('usuarioHorusEye')).token
      : null

    const resp = await consultarEventosAPI(token)

    if (!resp) {
      eventos.value = []
      lastPage.value = 1
      currentPage.value = 1
      return
    }

    if (Array.isArray(resp)) {
      eventos.value = resp
      lastPage.value = 1
      currentPage.value = 1
    } else {
      // buscar array principal
      if (Array.isArray(resp.data)) {
        eventos.value = resp.data
      } else if (Array.isArray(resp.results)) {
        eventos.value = resp.results
      } else if (Array.isArray(resp.events)) {
        eventos.value = resp.events
      } else {

        const firstArray = Object.values(resp).find(v => Array.isArray(v))
        eventos.value = firstArray || []
      }

    }

    console.log('Eventos en la tabla:', toRaw(eventos.value))
  } catch (err) {
    console.error('Error al obtener eventos:', err)
    eventos.value = []
    lastPage.value = 1
    currentPage.value = 1
  } finally {
    loadingEventos.value = false
  }
}

// helpers para paginación (muestra ventana de páginas con up to 5 botones)
const pagesToShow = computed(() => {
  const total = Math.max(1, lastPage.value)
  const curr = Math.min(Math.max(1, currentPage.value), total)
  const delta = 2 // números antes y después del actual
  const left = Math.max(1, curr - delta)
  const right = Math.min(total, curr + delta)
  const pages = []

  if (left > 1) pages.push(1)
  if (left > 2) pages.push('...')

  for (let i = left; i <= right; i++) pages.push(i)

  if (right < total - 1) pages.push('...')
  if (right < total) pages.push(total)

  return pages
})

const changePage = async (page) => {
  if (typeof page === 'string') return
  if (page < 1 || page > lastPage.value || page === currentPage.value) return
  currentPage.value = page
  await obtenerEventos(page)
}

onMounted(() => {
  obtenerEventos()
})
</script>

<template>
  <div class="w-full h-auto flex flex-col items-center justify-start py-2 gap-4">
    <h1 class="text-xl font-bold text-primary"> Historial de accesos</h1>
    <div class="flex-wrap sm:flex md:flex-col w-full h-auto items-center justify-center">
      <FiltrosTabla />
    </div>
    <div v-if="eventos.length === 0" class="w-full h-full flex items-center justify-center py-10">
      <p class="text-primary-text font-medium">No hay registros de accesos disponibles.</p>
    </div>
    <div v-else class="overflow-x-auto w-full px-5">
      <table class="w-full border-gray-300">
        <thead class="bg-primary text-titulos">
          <tr class="text-center h-[40px]">
            <th class="w-[150px] rounded-l-xl">Placa</th>
            <th class="w-[150px]">Resultado</th>
            <th class="w-[150px]">Tipo</th>
            <th class="w-[150px] rounded-r-xl">Fecha</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(campo, index) in eventos" :key="index" class="text-center border-y-hover-botones-secundarios h-[40px] border-b">
            <td class="font-bold">{{ campo.plate_detected }}</td>
            <td v-if="campo.result === 'authorized'" class="text-text-estados"><div class="w-full flex justify-center"><p class="bg-background-estado-activo rounded-2xl px-3">Autorizado</p></div></td>
            <td v-if="campo.result === 'unauthorized'" class="text-text-inactivo"><div class="w-full flex justify-center"><p class="bg-background-estado-inactivo rounded-2xl px-3">No Autorizado</p></div></td>
            <td v-if="campo.event_type === 'entry'" class="text-text-acceso-entrada">Entrada</td>
            <td v-if="campo.event_type === 'exit'" class="text-text-acceso-salida">Salida</td>
            <td>{{ formatFechaUTC(campo.event_datetime) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  <div v-if="eventos.length !== 0" class="flex items-center gap-2">
      <button
        class="px-3 py-1 rounded border border-secondary text-sm disabled:opacity-50"
        :disabled="currentPage === 1 || loadingEventos"
        @click="changePage(currentPage - 1)"
      >
      ←
      </button>

      <div class="flex gap-1">
        <button
          v-for="page in pagesToShow"
          :key="String(page)"
          class="px-3 py-1 rounded border border-secondary text-sm"
          :class="page === currentPage ? 'bg-secondary font-bold text-titulos' : 'bg-white hover:bg-gray-100'"
          @click="changePage(page)"
          :disabled="page === '...' || loadingEventos"
        >
          {{ page }}
        </button>
      </div>

      <button
        class="px-3 py-1 rounded border border-secondary text-sm disabled:opacity-50"
        :disabled="currentPage === lastPage || loadingEventos"
        @click="changePage(currentPage + 1)"
      >
        →
      </button>
    </div>
  </div>
</template>
