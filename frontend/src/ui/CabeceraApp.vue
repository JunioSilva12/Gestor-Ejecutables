<script setup>
import { cerrarSesion } from '@/lib/utils/direcciones';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/lib/stores/userStore';

const router = useRouter();
const userStore = useUserStore();

// Obtener datos del usuario desde el store
const role = userStore.userRole;
const name = userStore.userName;
</script>

<template>
  <nav class=" border border-borde-cabecera shadow-md shadow-borde-cabecera w-full max-h-[70px] lg:max-h-[90px] h-full bg-gradient-to-r from-primary from-60% to-secondary to-tertiary flex flex-row justify-between items-center pl-[20px] pr-[10px]">
    <div class="items-center gap-5 py-1 w-full contents sm:flex">
        <img class="w-[60px] sm:w-[80px] h-[40px] sm:h-[50px]" src="../components/icons/LogoHorusEye.png" alt="Logo de HorusEye">
        <!-- <svg viewBox="0 0 24 24" class="w-[80px] h-[50px]" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
        </svg> -->
        <div class="flex flex-col">
          <h1 class=" w-full text-lg sm:text-2xl font-bold text-center sm:text-left text-background"> HorusEye</h1>
          <div>
            <p class="w-full text-sm sm:text-lg sm:mt-2 text-center sm:text-left text-background">{{ name }} - <span>{{ role }}</span></p>
          </div>
        </div>
      </div>

      <button type="button" @click="cerrarSesion(router)" class="flex size-8 sm:size-10 lg:size-12 items-center hover:cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class=""><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 12v.01" /><path d="M3 21h18" /><path d="M5 21v-16a2 2 0 0 1 2 -2h7.5m2.5 10.5v7.5" /><path d="M14 7h7m-3 -3l3 3l-3 3" /></svg>
      </button>
  </nav>
</template>
