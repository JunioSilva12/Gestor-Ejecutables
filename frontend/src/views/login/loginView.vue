<script setup>
import { useRouter } from 'vue-router';
import { loginUsuario } from '@/lib/utils/direcciones';
import { validarCorreo } from '@/lib/utils/validaciones.js';
import { ref, watch, onMounted } from 'vue';
import InformacionSoporte from '@/ui/InformacionSoporte.vue';
import IconosApp from '@/components/icons/iconosApp.vue';

const router = useRouter();
const correo = ref('');
const password = ref('');
const mensaje = ref('');
const mostrarPassword = ref(false);

const manejarInicio = async () => {
  if (!validarCorreo(correo.value)) {
    mensaje.value = 'Por favor, ingrese un correo válido.';
    return;
  }
  const resultado = await loginUsuario(router, correo.value, password.value);
   if (resultado && resultado.success) {
    // ✅ Login exitoso
    correo.value = '';
    password.value = '';
    mensaje.value = ''; // opcional
  } else {
    mensaje.value = resultado?.mensaje || 'Error al iniciar sesión.';
  }
};

watch([correo, password], ([nuevoCorreo, nuevoPassword]) => {
  if (nuevoCorreo && nuevoPassword) {
    mensaje.value = ''
  }
})

import { useToast } from 'primevue/usetoast';
const toast = useToast();

onMounted(() => {
    const msg = router.currentRoute?.value?.query?.msg;
    //console.log("Mensaje de la ruta:", msg);
   
  if (msg == 'no-auth') {
      toast.add({ severity: 'info', summary: 'Acceso denegado', detail: 'Usuario no autenticado', life: 2000 });
      router.replace({ query: { ...router.currentRoute.value.query, msg: undefined } });
    }


});

</script>

<template>
  <div class="w-full h-full flex items-center justify-center bg-background">
    <div class="flex flex-col gap-2 md:gap-4 border max-w-[300px] sm:max-w-[500px] w-full h-auto items-center rounded-2xl bg-primary-components shadow-lg shadow-primary">
        <nav class="w-full border border-primary rounded-t-2xl max-h-[30px] sm:max-h-[50px] h-full bg-primary">
          <h1 class="text-titulos py-1 sm:py-2 font-bold text-lg sm:text-2xl text-center" >Inicio de sesión</h1>
        </nav>
        <img src="@/components/icons/LogoHorusEye.png" alt="LogoHorusEye" class=" w-[110px] h-[80px] sm:w-[220px] sm:h-[160px] mt-2 ">
        <p class="font-light text-lg  text-primary-text text-center max-w-[250px] sm:max-w-[400px] mt-[20px]">La <span class="font-semibold text-primary-text">seguridad</span> no es <span class="font-semibold text-primary-text">opción</span> es una <span class="font-semibold text-primary-text">prioridad</span></p>

        <label for="correo" class="font-bold text-lg text-primary-text">Correo</label>

        <div class="relative max-w-[250px] w-full">
          <input
            class="border border-border-input rounded-md p-2 w-full text-center"
            type="email"
            v-model="correo"
            name="correo"
            placeholder="Ingrese su usuario"
          />
          <!-- Ícono de correo -->
          <div class="absolute inset-y-0 right-0 p-2 flex items-center text-gray-500">
            <IconosApp nombre="correo" clases="w-5 h-5 text-primary-text" />
          </div>
        </div>

        <label for="password" class="font-bold text-lg text-primary-text">Contraseña</label>
        <div class="relative max-w-[250px] w-full text-center items-center">
          <input
            class="border border-border-input rounded-md p-2 w-full text-center"
            :type="mostrarPassword ? 'text' : 'password'"
            v-model="password"
            name="password"
            placeholder="Ingrese su contraseña"
            autocomplete="current-password"
          />
            <button
              type="button"
              class="absolute inset-y-0 right-0 p-2 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
              @click="mostrarPassword = !mostrarPassword"
              :aria-pressed="mostrarPassword"
              :title="mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
            >
              <IconosApp
                :nombre="mostrarPassword ? 'candado-abierto' : 'candado-cerrado'"
                clases="w-5 h-5 text-primary-text"
              />
              <span class="sr-only">
                {{ mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña' }}
              </span>
            </button>
        </div>

        <p v-if="mensaje" class=" text-text-informativos font-semibold text-center text-[12px] sm:text-sm md:text-lg">
          {{ mensaje }}
        </p>
        <button class="border border-primary bg-primary rounded-md max-w-[250px] w-full py-2 justify-center text-titulos font-bold hover:bg-primary hover:shadow-primary hover:shadow-md"  @click="manejarInicio">
          INGRESAR
        </button>
        <button class="border border-primary bg-primary rounded-md max-w-[250px] w-full py-2 justify-center text-titulos font-bold hover:bg-primary hover:shadow-primary hover:shadow-md">
          REGISTRARSE
        </button>
        <hr class="w-[200px] sm:w-[400px] border-barra"/>

        <a href="/recuperar-password" class="text-text underline hover:text-text-hover ">¿Olvidaste tu contraseña?</a>

      <div class="w-auto justify-center items-center flex pb-3">
          <InformacionSoporte />
      </div>
    </div>
  </div>
</template>




