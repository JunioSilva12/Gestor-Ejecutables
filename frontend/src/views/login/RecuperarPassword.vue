<script setup>

import { ref } from 'vue';
import { recuperarPassword } from '../../lib/api/loginApi.js';
import { validarCorreo } from '../../lib/utils/validaciones.js';
import InformacionSoporte from '@/ui/InformacionSoporte.vue';

const correoRecuperar = ref('');

console.log(correoRecuperar.value);

function manejarRecuperacion() {
  if (!validarCorreo(correoRecuperar.value)) {
    console.log('Por favor, ingrese un correo válido.');
    return;
  }
  const respuesta = recuperarPassword(correoRecuperar.value);
  console.log("Resultado de la recuperación:", respuesta);
}


</script>

<template>
  <div class="w-full h-full flex items-center justify-center bg-background">
    <div class="flex flex-col gap-3 border border-border-contenedor max-w-[300px] sm:max-w-[500px] w-full h-auto items-center rounded-2xl bg-background shadow-lg shadow-primary-shadow">
        <nav class="relative w-full border border-primary rounded-t-2xl h-auto bg-primary justify-center flex">
          <button class="absolute top-4 sm:top-6 left-3" @click="$router.back()">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-titulos left-4 top-4 cursor-pointer hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 class="text-titulos py-3 sm:py-5 text-center font-bold text-lg sm:text-2xl" >Recuperar Contraseña</h1>
        </nav>
        <img src="@/components/icons/LogoHorusEye.png" alt="LogoHorusEye" class=" w-[110px] h-[80px] sm:w-[220px] sm:h-[160px] mt-[15px] md:mt-[20px]">
        <p class="font-light text-lg  text-primary-text text-center max-w-[250px] sm:max-w-[400px] mt-[20px]">Digite su correo electrónico y le enviaremos un enlace para restablecer su contraseña.</p>
        <div class="flex-col md:flex-row text-center px-3 w-full">
          <label for="correo" class="w-auto font-bold text-lg text-primary-text sm:mr-2">Correo
          </label>
          <input
            class="border border-border-input rounded-md p-2 w-[270px] sm:w-[300px] text-[10px] font-semibold sm:text-sm text-center"
            type="email"
            name="correo"
            placeholder="Ingrese su correo electrónico"
            v-model="correoRecuperar"
            />
        </div>
        <button class="border border-border-input rounded-md p-2 text-[10px] font-semibold sm:text-sm bg-primary hover:bg-second text-titulos sm:w-[150px]" @click="manejarRecuperacion">
          Recuperar
        </button>
        <div class="w-auto justify-center items-center flex pb-3">
          <InformacionSoporte />
      </div>
    </div>
  </div>
</template>
