<script setup>
defineProps({
  nombre: {
    type: String,
    required: true
  },
  clases: {
    type: String,
    default: 'w-5 h-5 text-primary-text'
  }
})
</script>

<template>
  <!-- Icono de correo -->
  <svg v-if="nombre === 'correo'" xmlns="http://www.w3.org/2000/svg" :class="clases" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4h16c1.1 0 2 .9 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2z" />
    <polyline stroke-linecap="round" stroke-linejoin="round" points="22,6 12,13 2,6" />
  </svg>

  <!-- Candado abierto -->
  <svg v-else-if="nombre === 'candado-abierto'" xmlns="http://www.w3.org/2000/svg" :class="clases" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" role="img">
    <path stroke-linecap="round" stroke-linejoin="round" d="M16 11V8a4 4 0 1 0-8 0" />
    <rect x="4" y="11" width="16" height="10" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>

  <!-- Candado cerrado -->
  <svg v-else-if="nombre === 'candado-cerrado'" xmlns="http://www.w3.org/2000/svg" :class="clases" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" role="img">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
    <path stroke-linecap="round" stroke-linejoin="round" d="M6 11V8a6 6 0 0 1 12 0v3" />
    <rect x="4" y="11" width="16" height="10" rx="2" ry="2" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
