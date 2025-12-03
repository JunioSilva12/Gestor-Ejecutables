<script setup>
import { ref, onMounted, toRaw } from 'vue'
import CamarasCargadas from '../security/CamarasCargadas.vue';
import IndicadoresCamaras from '../security/IndicadoresCamaras.vue';
import { escanearPlacaCarro, escanearPlacaMoto, crearEventoAPI} from '@/lib/api/inicioApi.js';
import OpcionesVehiculos from '../security/OpcionesVehiculos.vue';
import ModalConsulta from '../security/ModalConsulta.vue';

const camaras = ref([])      // lista de cámaras disponibles
const camara1Seleccionada = ref('') // ID de la cámara seleccionada para cámara 1
const camara2Seleccionada = ref('') // ID de la cámara seleccionada para cámara 2

// Referencias a los componentes de cámara
const camara1Ref = ref(null)
const camara2Ref = ref(null)

// Estado del modal y carga
const aprobado = ref(false);
const cargando = ref(false);
const fotosCapturadas = ref([]);
const resultadoEscaneo = ref(null);
const vehiculoSeleccionado = ref('carro');
const accionSeleccionada = ref('entry');


// Función para tomar fotos de las cámaras activas
const tomarFotosCamarasActivas = async () => {
  const fotos = []

  try {
    // Tomar foto de cámara 1 si está activa
    if (camara1Seleccionada.value && camara1Seleccionada.value !== '' && camara1Ref.value) {
      const foto1 = await camara1Ref.value.tomarFoto()
      if (foto1) {
        fotos.push({ ...foto1, nombre: 'Cámara 1' })
      }
    }

    // Tomar foto de cámara 2 si está activa
    if (camara2Seleccionada.value && camara2Seleccionada.value !== '' && camara2Ref.value) {
      const foto2 = await camara2Ref.value.tomarFoto()
      if (foto2) {
        fotos.push({ ...foto2, nombre: 'Cámara 2' })
      }
    }

    console.log(`Se capturaron ${fotos.length} fotos como blobs`)
    return fotos
  } catch (error) {
    console.error('Error al tomar fotos:', error)
    return []
  }
}

// Función de escaneo actualizada
async function escanear() {
  try {
    console.log('Iniciando escaneo...');

    // Abrir modal inmediatamente con estado de carga
    cargando.value = true;
    aprobado.value = true;
    resultadoEscaneo.value = null;

    // Tomar fotos
    const fotos = await tomarFotosCamarasActivas();

    console.log('Fotos obtenidas:', fotos);

    if (!fotos || fotos.length === 0) {
      cargando.value = false;
      aprobado.value = false;
      alert('No se capturaron fotos. Asegúrate de que al menos una cámara esté activa.');
      return;
    }

    fotosCapturadas.value = fotos;

    console.log('Fotos capturadas para escaneo:', fotosCapturadas.value);

    // Llamar a la API según el tipo de vehículo seleccionado
    const resultado = ref([]);
    if (vehiculoSeleccionado.value === 'carro') {
      console.log('Escaneando con API de carros...');
      resultado.value = await escanearPlacaCarro(fotos, vehiculoSeleccionado.value);
    } else {
      console.log('Escaneando con API de motos...');
      resultado.value = await escanearPlacaMoto(fotos, vehiculoSeleccionado.value);
    }

    console.log('Resultado del escaneo:', toRaw(resultado.value));
    // const placaDetectada = resultado.value.results[0].plate;
      const token = localStorage.getItem('usuarioHorusEye') ? JSON.parse(localStorage.getItem('usuarioHorusEye')).token : null;
      console.log(accionSeleccionada.value)
      console.log(resultado.value.plate)
      // console.log('Resultado para crear evento:', resultado.value);
      const response = await crearEventoAPI(token, resultado.value.plate, accionSeleccionada.value)
      console.log('Evento creado:', response);

    // Guardar resultado y quitar estado de carga
    // resultadoEscaneo.value = resultado;
    cargando.value = false;

  } catch (error) {
    console.error('Error durante el escaneo:', error);
    cargando.value = false;
    resultadoEscaneo.value = { error: error.message };
  }
}

// Función para cerrar modal
const cerrarModal = () => {
  aprobado.value = false;
  cargando.value = false;
  fotosCapturadas.value = [];
  resultadoEscaneo.value = null;
}

// Función para detectar todas las cámaras
const detectarCamaras = async () => {
  try {
    // Solicitar permisos primero
    await navigator.mediaDevices.getUserMedia({ video: true })

    // Obtener lista de dispositivos
    const dispositivos = await navigator.mediaDevices.enumerateDevices()

    // Filtrar solo las cámaras (videoinput)
    const camarasDisponibles = dispositivos
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        id: device.deviceId,
        nombre: device.label || `Cámara ${device.deviceId.substring(0, 8)}...`
      }))

    camaras.value = camarasDisponibles

    // Asignar cámaras por defecto si hay disponibles
    if (camarasDisponibles.length > 0) {
      camara1Seleccionada.value = camarasDisponibles[0].id
    }
    if (camarasDisponibles.length > 1) {
      camara2Seleccionada.value = camarasDisponibles[1].id
    }
  } catch (err) {
    console.error('Error al detectar cámaras:', err)
  }
}

// Exponer la función para que otros componentes puedan llamarla si es necesario
defineExpose({
  tomarFotosCamarasActivas
})

onMounted(async () => {
  await detectarCamaras()
})
</script>

<template>
  <div class="w-full h-auto flex flex-col gap-2 px-4 py-2 justify-center border border-border rounded-4xl bg-primary-components shadow-md shadow-shadow">
    <div class="flex w-full items-center gap-2 px-2">
        <svg width="40" height="40" viewBox="0 0 24 24">
                <path class="fill-primary" d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
            </svg>
      <h1 class="text-lg font-semibold text-primary">Cámaras en Video</h1>
    </div>

    <div class="w-full h-full flex items-center justify-center px-2 lg:px-10 bg-indicadores-camras rounded-xl">
      <IndicadoresCamaras :camarasConectadas="camaras.length" />
    </div>

    <!-- Controles de vehículo y escaneo -->
    <div class="w-full max-w-[600px] h-full flex items-center justify-center max-h-[90px]">
      <OpcionesVehiculos v-model="vehiculoSeleccionado" v-model:modelAction="accionSeleccionada"/>
    </div>

    <button
      :disabled="cargando"
      :class="[
        'border font-semibold shadow-shadow rounded-lg px-4 py-2 text-white transition-all duration-200',
        cargando
          ? 'border-gray-400 bg-gray-400 cursor-not-allowed'
          : 'border-secondary bg-secondary hover:cursor-pointer hover:scale-103 hover:bg-primary hover:border-primary'
      ]"
      @click="escanear"
    >
      {{ cargando ? 'Escaneando...' : 'Escanear Placa' }}
    </button>

    <!-- Cámara 1 -->
    <p class="w-full text-start">Cámara 1</p>
    <div class="w-full h-full flex items-center justify-center border border-[#8989894d] rounded-lg bg-[#d8d8d84d] max-h-[250px] shadow-md shadow-[#d8d8d84d]">
      <CamarasCargadas ref="camara1Ref" :camaraId="camara1Seleccionada" />
    </div>
    <div>
      <select v-model="camara1Seleccionada" class="w-full px-2 py-1 border border-border rounded">
        <option value="">None</option>
        <option
          v-for="camara in camaras"
          :key="camara.id"
          :value="camara.id"
        >
          {{ camara.nombre }}
        </option>
      </select>
    </div>

    <!-- Cámara 2 -->
    <p class="w-full text-start">Cámara 2</p>
    <div class="w-full h-full flex items-center justify-center border border-[#8989894d] rounded-lg bg-[#d8d8d84d] max-h-[250px] shadow-md shadow-[#d8d8d84d]">
      <CamarasCargadas ref="camara2Ref" :camaraId="camara2Seleccionada" />
    </div>
    <div>
      <select v-model="camara2Seleccionada" class="w-full px-2 py-1 border border-border rounded">
        <option value="">None</option>
        <option
          v-for="camara in camaras"
          :key="camara.id"
          :value="camara.id"
        >
          {{ camara.nombre }}
        </option>
      </select>
    </div>
  </div>

  <!-- Modal -->
  <ModalConsulta
    v-if="aprobado"
    @close="cerrarModal"
    :fotos="fotosCapturadas"
    :cargando="cargando"
    :resultado="resultadoEscaneo"
  />
</template>
