<script setup>
import { computed } from 'vue'

const props = defineProps({
  camarasConectadas: {
    type: Number,
    default: 0
  }
})

const indicadores = computed(() => [
  { label: 'Cámaras Conectadas', valor: props.camarasConectadas },
  { label: 'Disponibilidad', valor: '24/7' },
])
</script>

<template>
  <div v-for="(item, index) in indicadores" :key="index" class=" flex flex-wrap w-full justify-between gap-3 hover:scale-105 transition-transform duration-200">
    <div class="flex flex-col w-full items-center justify-center py-1 px-2">
      <h1 class="text-primary font-bold text-sm sm:text-md md:text-lg lg:text-2xl">{{ item.valor }}</h1>
      <p class="text-[8px] sm:text-[12px] md:text-sm w-full text-center">{{ item.label }}</p>
    </div>
  </div>
</template>
