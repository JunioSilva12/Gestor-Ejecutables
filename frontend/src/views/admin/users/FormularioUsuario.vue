<template>
  <div :class="esEdicion
    ? 'grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto'
    : '  mx-auto'
    ">


    <!-- =====================================================-->
    <!--COLUMNA IZQUIERDA – VEHÍCULOS ASIGNADOS-->
    <!-- =====================================================-->

    <div class="flex flex-col bg-white  h-full self-stretch rounded-lg " v-if="esEdicion">
      <!-- === MODAL FORMULARIO VEHÍCULO === -->
      <div v-if="modalForm" >

        <!-- Caja del modal -->
        <div class="bg-white rounded-lg  w-full max-w-4xl px-6">


                  <!-- Título -->
        <h3 class="text-lg font-semibold text-primary flex items-center gap-2 mb-3">
          <i class="pi pi-car text-primary"></i>
          {{ selectedVehicle ? 'Editar vehículo' : 'Crear vehículo' }}
        </h3>

          <!-- Formulario -->
            <!-- Formulario recibe la UUID del usuario -->
          <FormularioVehiculo v-if="modalForm" :user_uuid="props.user_uuid" :vehiculo="selectedVehicle" @ok="onSubmit" @cancel="modalForm = false" />
        </div>
      </div>

              <!-- === VEHÍCULOS ASIGNADOS === -->

      <div v-if="!modalForm">

        <!-- Título -->
        <h3 class="text-lg font-semibold text-primary flex items-center gap-2 mb-3">
          <i class="pi pi-car text-primary"></i>
          Vehículos asignados
        </h3>

        <!-- Lista de Vehículos -->
        <ul class="space-y-2 overflow-auto" v-if="vehiculos.length > 0">
          <li v-for="v in vehiculos" :key="v.uuid"
            class="p-3 rounded-lg border flex justify-between items-center hover:bg-gray-50">
            <div>
              <p class="font-semibold">{{ v.license_plate }}</p>
              <p class="text-xs text-gray-500">{{ v.model }}</p>
            </div>

            <div class="flex gap-2">
              <Button class="p-0" size="small" icon="pi pi-pencil" severity="secondary" text
                @click="editarVehicle(v)" />
              <Button class="p-0" size="small" icon="pi pi-trash" severity="danger" text @click="eliminarVehicle(v)" />
            </div>
          </li>
        </ul>

        <p v-else class="text-gray-400 text-sm italic">
          No hay vehículos asignados.
        </p>

        <!-- Botones de acción lado a lado -->
        <div class="flex gap-3 mt-2">

          <!-- Botón: Vehículo nuevo -->
          <Button class="flex-1 !py-4 flex items-center justify-center gap-2 !rounded-none"
           @click="abrirCrearVehicle">
            <i class="pi pi-plus text-lg"></i>
            Vehículo nuevo
          </Button>

          <!-- Botón: Vehículo registrado -->
          <!-- <Button class="flex-1  !py-4 flex items-center justify-center gap-2 !rounded-none"
          @click="abrirBuscadorVehiculo">
          <i class="pi pi-search text-lg"></i>
          Vehículo registrado
        </Button>-->

        </div>
      </div>
    </div>

    <!-- =====================================================
         COLUMNA DERECHA – FORMULARIO DEL USUARIO
    ====================================================== -->
    <div class="flex flex-col  bg-white h-full w-100 rounded-lg">

      <form @submit.prevent="guardar" class="space-y-4 flex-1">

        <!-- Nombre -->
        <div>
          <label class="text-sm font-semibold block">Nombre</label>
          <InputText class="w-full" v-model="form.name" placeholder="Nombre completo" required />
        </div>

        <!-- Email -->
        <div>
          <label class="text-sm font-semibold block">Email</label>
          <InputText class="w-full" v-model="form.email" placeholder="correo@ejemplo.com" type="email" required />
        </div>

        <!-- Password -->
        <div>
          <label class="text-sm font-semibold block">Contraseña</label>
          <Password v-model="form.password" :feedback="false" :toggle-mask="true" class="w-full"
            :input-style="{ width: '100%' }" />
        </div>

        <!-- Confirmar Password -->
        <div>
          <label class="text-sm font-semibold block">Confirmar Contraseña</label>
          <Password v-model="form.password_confirmation" :feedback="false" :toggle-mask="true" class="w-full"
            :input-style="{ width: '100%' }" />
        </div>

        <!-- Rol -->
        <div v-if="!esEdicion">
          <label class="text-sm font-semibold block">Rol</label>
          <Select v-model="form.rol" :options="roles" option-label="label" option-value="value"
            placeholder="Seleccionar rol" class="w-full" />
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-2 pt-2">
          <Button label="Cancelar" severity="secondary" text @click="$emit('cancel')" />
          <Button :label="esEdicion ? 'Actualizar' : 'Crear'" icon="pi pi-check" type="submit" />
        </div>

      </form>

    </div>

  </div>
</template>



<script setup>
import { ref, watch, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';


import { crearUsuario, actualizarUsuario } from '@/lib/api/usersApi';
import { onMounted } from 'vue';
import { getVehiclesByUser, deleteVehicle } from '@/lib/api/vehiclesApi';
import FormularioVehiculo from '../vehicles/FormularioVehiculo.vue';


const props = defineProps({
  usuario: {
    type: Object,
    default: null
  },

});


function onSubmit() {
  modalForm.value = false;
  selectedVehicle.value = null;
  cargarVehiculos();  // Recargar lista
}


const emit = defineEmits(['ok', 'cancel']);

const toast = useToast();

// Roles disponibles
const roles = [
  { label: 'Usuario', value: 'user' },
  { label: 'Visitor', value: 'visitor' }
];

const form = ref({
  uuid: null,
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  rol: 'user',
   two_factor_auth: false
});

const esEdicion = computed(() => !!props.usuario);

// Modal + vehículo seleccionado
const modalForm = ref(false);
const selectedVehicle = ref(null);

const vehiculos = ref([]);

// Cargar vehículos del usuario cuando entra al formulario
onMounted(async () => {
  await cargarVehiculos();
});

async function cargarVehiculos() {
  if (!props.usuario?.uuid) return;

  try {
    const res = await getVehiclesByUser(props.usuario.uuid);
    vehiculos.value = res?.data ?? [];
  } catch (error) {
    console.error("Error en cargarVehiculos:", error);
    vehiculos.value = [];
  }
}

// === EDITAR ===
function editarVehicle(v) {
  selectedVehicle.value = { ...v };
  modalForm.value = true;
}

// === CREAR ===
function abrirCrearVehicle() {
  selectedVehicle.value = null;
  modalForm.value = true;
}





// Abrir buscador de vehículos ya registrados
/*
function abrirBuscadorVehiculo() {
  emit('abrir-vehiculo-registrado', props.usuario);
}
*/
watch(
  () => props.usuario,
  (val) => {
    if (val) {
      form.value = {
        uuid: val.uuid ?? null,
        name: val.name,
        email: val.email,
        password: '',
        password_confirmation: '',
        rol: val.rol || 'user',
        /* two_factor_auth: val.two_factor_auth */
      };
    } else {
      form.value = {
        uuid: null,
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol: 'user',
        /* two_factor_auth: false*/
      };
    }
  },
  { immediate: true }
);


// === ELIMINAR ===
function eliminarVehicle(v) {
  confirm.require({
    message: `¿Eliminar el vehículo ${v.license_plate}?`,
    header: "Confirmar",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await deleteVehicle(v.uuid);
        toast.add({
          severity: "success",
          summary: "Eliminado",
          detail: `${v.license_plate} eliminado`,
          life: 2000
        });
        cargarVehiculos();
      } catch (error) {
        console.error("Error al eliminar vehículo:", error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar",
          life: 2000
        });
      }
    }
  });
}

const confirm = useConfirm();
async function guardar() {
  confirm.require({
    message: esEdicion.value ? '¿Actualizar usuario?' : '¿Crear usuario?',
    header: esEdicion.value ? 'Actualizar Usuario' : 'Crear Usuario',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: async () => {

      // Validación mínima de password
      if (!esEdicion.value && (!form.value.password || form.value.password !== form.value.password_confirmation)) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Las contraseñas no coinciden', life: 3000 });
        return;
      }

      try {
        let resultado;

        if (esEdicion.value) {
          // Editar usuario
          const payload = { ...form.value };
          // No enviar password si está vacío
          delete payload.uuid;// UUID no se necesita
          delete payload.rol; // Rol no se edita aquí

          // Evitar enviar email si no cambió
          console.log('Email actual:', props.usuario.email);
          console.log('Email del formulario:', payload.email);
          if (payload.email === props.usuario.email) {
            delete payload.email;
          }

          if (!payload.password) {
            delete payload.password;
            delete payload.password_confirmation;
          }
          resultado = await actualizarUsuario(form.value.uuid, payload);
          console.log('Usuario actualizado:', resultado);
          toast.add({ severity: 'success', summary: 'Actualizado', detail: resultado.message, life: 2000 });
        } else {
          // Crear usuario
          const payload = JSON.parse(JSON.stringify(form.value));

          delete payload.uuid;

          resultado = await crearUsuario(payload);
          console.log('Usuario creado:', resultado);
          toast.add({ severity: 'success', summary: 'Creado', detail: resultado.message, life: 2000 });
        }

        emit('ok', resultado.usuario);

      } catch (error) {
        toast.add({ severity: 'error', summary: 'Error', detail: error.message || 'Error al guardar usuario', life: 3000 });
      }
    }
  });
}
</script>
