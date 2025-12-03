<script setup>
import TablaRegistros from '@/components/TablaRegistros.vue';
import CabeceraApp from '@/ui/CabeceraApp.vue';
import EspacioCamaras from '../security/EspacioCamaras.vue';
// import OpcionesVehiculos from '../security/OpcionesVehiculos.vue';
import InformacionSoporte from '@/ui/InformacionSoporte.vue';
// import ModalConsulta from '../security/ModalConsulta.vue';
import IndicadoresInicio from '../security/IndicadoresInicio.vue';
// import { escanearPlacaCarro, escanearPlacaMoto } from '@/lib/api/inicioApi.js';
import { useWindowSize } from '@vueuse/core'
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'



// const aprobado = ref(false);
// const fotosCapturadas = ref([]);
// const espacioCamarasRef = ref(null);

const { width } = useWindowSize()

const isMobile = computed(() => width.value > 768)

// async function escanear() {
//   // Tomar fotos de las cámaras activas
//   if (espacioCamarasRef.value) {
//     const fotos = await espacioCamarasRef.value.tomarFotosCamarasActivas();
//     fotosCapturadas.value = fotos;


 // aprobado.value = true;
//}

import { useToast } from 'primevue/usetoast';
const toast = useToast();
const router = useRouter() // ✅ Aquí obtienes la ruta actual

onMounted(() => {
  const msg = router.currentRoute?.value?.query?.msg;
  console.log("Mensaje de la ruta:", msg);
  if (msg == 'no-permission') {
    toast.add({ severity: 'info', summary: 'Acceso denegado', detail: 'Solo los administradores pueden acceder a esta sección', life: 2000 });
       // ✅ Limpiar query sin recargar
    router.replace({ query: {} });

  }
});

</script>

<template>
  <div class="relative w-full min-h-screen flex flex-col bg-background gap-1">
    <div class="sticky top-0 z-50 w-full flex">
      <CabeceraApp />
    </div>


      <div class="w-full flex flex-col gap-1 items-center justify-center py-2">
        <div class="flex flex-row gap-2 w-full h-full px-2 ">
          <div v-if="isMobile" class="flex flex-col max-w-[35%] lg:max-w-[30%] w-full items-center py-2">
            <EspacioCamaras />
          </div>
          <div class="flex flex-col w-full h-auto justify-center items-center py-2 gap-5">
            <div class="w-full gap-5 sm:gap-10 lg:gap-20 py-2 max-w-[90%] columns-2 sm:flex items-center justify-center">
                <IndicadoresInicio />
              </div>
            <div class="w-full h-auto sm:h-full flex flex-col items-center justify-center border border-border rounded-4xl bg-primary-components shadow-md shadow-shadow">
              <TablaRegistros />
            </div>

          </div>

      </div>
    </div>

        <div class="w-auto justify-center items-center flex pb-3">
          <InformacionSoporte />
        </div>
  </div>
</template>
