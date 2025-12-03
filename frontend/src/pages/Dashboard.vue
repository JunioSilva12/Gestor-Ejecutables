<template>
  <div class="p-6">
    <div class="bg-white shadow-md rounded-2xl p-6 border border-gray-100">
      <h2 class="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <!-- Icono SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Gestión de Archivos
      </h2>

      <!-- Lista de archivos -->
      <FileList />
    </div>
  </div>
</template>

<script setup>
import FileList from '../components/FileList.vue';
</script>
