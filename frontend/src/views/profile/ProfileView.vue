<template>
  <div class="flex h-screen">

    <!-- === MAIN AREA === -->
    <div class="flex-1 flex flex-col">

      <!-- TOP BAR -->
      <div class="sticky top-0 z-50 w-full flex bg-gradient-to-r from-primary from-60% to-secondary to-tertiary max-h-[70px] lg:max-h-[90px] h-full">

        <CabeceraApp />
      </div>




      <!-- MAIN CONTENT -->
      <div class="p-4 overflow-auto w-full h-full">
        <ProfileComponent/>
      </div>
    </div>

    <div v-if="loader.loading" class="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <ProgressSpinner />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import ProgressSpinner from "primevue/progressspinner";
import CabeceraApp from '@/ui/CabeceraApp.vue';
import ProfileComponent from '@/views/profile/ProfileComponent.vue';
// router composables




/* Loader example variable */
const loader = ref({ loading: false });
</script>


