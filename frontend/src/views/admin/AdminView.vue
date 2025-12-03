<template>
  <div class="flex h-screen">

    <!-- === DRAWER/SIDERBAR === -->

    <Drawer v-model:visible="sidebarOpen" :modal="true" position="left"
      :style="{ width: '15rem', position: 'relative' }">
      <!-- Header -->
      <div class="flex items-center gap-3 px-0 py-3 border-b">
        <i class="pi pi-cog"></i>
        <span class="font-semibold">Administración</span>
      </div>

      <!-- Menú -->
      <ul class="mt-4">
        <li v-for="item in menu" :key="item.name"
          class="px-2 py-2 flex items-center gap-3 hover:bg-gray-200 cursor-pointer" @click="go(item.path)">
          <i :class="item.icon"></i>
          <span>{{ item.label }}</span>
        </li>
      </ul>
    </Drawer>


    <!-- === MAIN AREA === -->
    <div class="flex-1 flex flex-col">

      <!-- TOP BAR -->
      <div class="sticky top-0 z-50 w-full flex bg-gradient-to-r from-primary from-60% to-secondary to-tertiary max-h-[70px] lg:max-h-[90px] h-full">
        <div
          class="border border-borde-cabecera shadow-md shadow-borde-cabecera flex p-0 flex-row justify-between items-center">
          <button @click="sidebarOpen = true" size="4xl" class="text-background p-7  lg:p-9 hover:bg-white/10 transition-all">
            <i class="pi pi-bars scale-150"></i>
          </button>
        </div>


        <CabeceraApp />
      </div>




      <!-- MAIN CONTENT -->
      <div class="p-4 overflow-auto w-full h-full">
        <router-view />
      </div>
    </div>

    <div v-if="loader.loading" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {  useRouter } from "vue-router";

import ProgressSpinner from "primevue/progressspinner";
import CabeceraApp from '@/ui/CabeceraApp.vue';

// router composables
const router = useRouter();

/* MENU ITEMS */
const menu = [
  {
    name: "vehiculos",
    label: "Vehículos",
    icon: "pi pi-car",
    path: "/admin/vehicles",
  },
  {
    name: "usuarios",
    label: "Usuarios",
    icon: "pi pi-users",
    path: "/admin/users",
  },
    {
    name: "eventos",
    label: "Eventos",
    icon: "pi pi-calendar",
    path: "/admin/events",
  },
];

const sidebarOpen = ref(false);

/* Change route */
function go(path) {
  router.push(path);
  sidebarOpen.value = false;
}

/*
/* Determine title based on route */
/*
const currentViewLabel = computed(() => {
  const found = menu.find((m) => route.path.includes(m.name));
  return found?.label ?? "";
});*/


/* Loader example variable */
const loader = ref({ loading: false });
</script>

<style scoped>
/* Customize PrimeVue Drawer */
.custom-drawer .p-drawer {
  width: 10rem !important;
  /* ejemplo, 160px */
  position: relative !important;
  /* si quieres que deje de ser absoluta */
}
</style>
