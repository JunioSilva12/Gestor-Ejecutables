<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-sm bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-700">Iniciar Sesión</h2>

      <!-- Usuario -->
      <div class="mb-4">
        <label class="block text-gray-600 mb-1">Usuario</label>
        <InputText v-model="username" placeholder="Usuario" class="w-full" />
      </div>

      <!-- Contraseña -->
      <div class="mb-6">
        <label class="block text-gray-600 mb-1">Contraseña</label>
        <Password v-model="password" placeholder="Contraseña" toggleMask class="w-full" />
      </div>

      <!-- Botón -->
      <Button label="Ingresar" icon="pi pi-sign-in" class="w-full p-button-primary" @click="handleLogin" />

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-600 mt-3 text-center">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../services/auth.service';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';

const router = useRouter();
const username = ref('');
const password = ref('');
const errorMessage = ref('');

const handleLogin = async () => {
  try {
    await login(username.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Usuario o contraseña incorrecta';
  }
};
</script>

<style scoped>
/* Opcional: efecto hover en la card */
div > .p-card:hover {
  transform: translateY(-2px);
  transition: transform 0.2s;
}
</style>

