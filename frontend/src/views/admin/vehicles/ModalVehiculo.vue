<template>
    <div :class="selectedVehicle
    ? 'grid grid-cols-1   mx-auto'
    : 'grid grid-cols-1 lg:grid-cols-2 gap-8 mx-auto'
    ">

    <!-- =====================================================-->
    <!-- COLUMNA IZQUIERDA – LISTA DE USUARIOS -->
    <!-- =====================================================-->
    <div v-if="!selectedVehicle" class="bg-white rounded-lg ">
            <h3 class="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
          <i class="pi pi-user text-primary"></i>
          {{ 'Seleccion de propietario' }}
        </h3>

      <ListaUsuarios @select="seleccionarUsuario"/>
    </div>

    <!-- =====================================================-->
    <!-- COLUMNA DERECHA – FORMULARIO VEHÍCULO -->
    <!-- =====================================================-->
    <div class="bg-white rounded-lg min-w-[400px] h-full px-6">

      <!-- Verifica si existe un usuario seleccionado -->
      <div v-if="selectedUser || props.vehiculo != null" >

        <h3 class="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
          <i class="pi pi-car text-primary"></i>
          {{ selectedVehicle ? 'Editar vehículo' : 'Crear vehículo' }}
        </h3>

        <!-- Formulario recibe la UUID del usuario -->
        <FormularioVehiculo :user_uuid="selectedUser?.uuid" :vehiculo="selectedVehicle" @ok="onSubmit"
          @cancel="$emit('cancel')" />
      </div>

      <!-- Si no hay usuario seleccionado -->
      <div v-else class="text-gray-500 text-center py-20">
        <i class="pi pi-users text-4xl mb-3"></i>
        <p>Seleccione un usuario para gestionar sus vehículos</p>
      </div>

    </div>

  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

import FormularioVehiculo from './FormularioVehiculo.vue'
import ListaUsuarios from '../users/ListaUsuarios.vue'


 const props = defineProps({
  vehiculo: {
    type: Object,
    default: null
  }
})

onMounted(() => {
  // Si se pasa un vehículo como prop, cargar el usuario asociado
  if (props.vehiculo && props.vehiculo.user) {
    seleccionarUsuario(props.vehiculo.user);
  }
  selectedVehicle.value = props.vehiculo;

});

// Usuario seleccionado en la lista
const selectedUser = ref(null)

// Vehículo seleccionado para edición
const selectedVehicle = ref(null)
const emit = defineEmits(['ok', 'cancel']);

function seleccionarUsuario(user) {
  console.log('Usuario seleccionado:', user.uuid);
  selectedUser.value = user;
  selectedVehicle.value = null; // Resetear vehículo seleccionado al cambiar usuario
}


// Acción cuando el formulario se procesa
function onSubmit(data) {
  console.log("Vehículo guardado:", data)
  emit('ok', data);

  selectedVehicle.value = null
}


</script>
