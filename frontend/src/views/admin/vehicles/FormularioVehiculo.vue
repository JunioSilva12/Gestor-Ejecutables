<template>
  <form @submit.prevent="guardar" class="space-y-4">

    <!-- Placa -->
    <div>
      <label class="text-sm font-semibold block">Placa</label>
      <InputText class="w-full" v-model="form.license_plate" placeholder="Ej: ABC123" required />
    </div>

    <!-- Modelo -->
    <div>
      <label class="text-sm font-semibold block">Modelo</label>
      <InputText class="w-full" v-model="form.model" placeholder="Modelo del vehículo" required />
    </div>

    <!-- Color -->
    <div>
      <label class="text-sm font-semibold block">Color</label>
      <InputText class="w-full" v-model="form.color" placeholder="Color del vehículo" required />
    </div>



    <!-- Botones -->
    <div class="flex justify-end gap-2 pt-2">
      <Button label="Cancelar" severity="secondary" text @click="$emit('cancel')" />
      <Button :label="esEdicion ? 'Actualizar' : 'Crear'" icon="pi pi-check" type="submit" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

import { createVehicle, updateVehicle } from '@/lib/api/vehiclesApi';

const props = defineProps({
  user_uuid: {
    type: String,
    default: null
  },
  vehiculo: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['ok', 'cancel']);

const toast = useToast();
const confirm = useConfirm();

const original = ref(null);


const form = ref({
  uuid: null,
  license_plate: '',
  model: '',
  color: '',
});

const esEdicion = computed(() => !!props.vehiculo);

// Cargar vehiculo en formulario si es edición
watch(
  () => props.vehiculo,
  (val) => {
    console.log('FormularioVehiculo - user_uuid prop:', props.user_uuid);

    if (val) {
      form.value = {

        uuid: val.uuid ?? null,
        user_uuid: val.user_uuid ?? props.user_uuid,
        license_plate: val.license_plate,
        model: val.model,
        color: val.color,
      };
      // Guardamos los valores originales para comparar
      original.value = { ...form.value };
    } else {
      form.value = {
        uuid: null,
        user_uuid: props.user_uuid,
        license_plate: '',
        model: '',
        color: '',
      };
      // Guardamos los valores originales para comparar
      original.value = { ...form.value };
    }
  },
  { immediate: true }
);



// Guardar vehículo
async function guardar() {
  confirm.require({
    message: esEdicion.value ? '¿Actualizar vehículo?' : '¿Crear vehículo?',
    header: esEdicion.value ? 'Actualizar Vehículo' : 'Crear Vehículo',
    icon: 'pi pi-exclamation-triangle',
    acceptLabel: 'Sí',
    rejectLabel: 'No',
    accept: async () => {
      try {

        let payload = {};

        // Comparar campos y agregar solo los modificados
        Object.keys(form.value).forEach(key => {
          if (key !== 'uuid' && form.value[key] !== original.value[key]) {
            payload[key] = form.value[key];
          }
        });

        if (props.user_uuid != null) {
          // mandar user_uuid

          payload.user_uuid = props.user_uuid;
          console.log('user_uuid desde props:', props.user_uuid);
        }

        console.log('Payload FINAL:', payload);

        let resultado;
        if (esEdicion.value) {
          resultado = await updateVehicle(form.value.uuid, payload);
        } else {
          resultado = await createVehicle(payload);
        }

        toast.add({
          severity: 'success',
          summary: esEdicion.value ? 'Actualizado' : 'Creado',
          detail: esEdicion.value ? 'Vehículo actualizado.' : 'Vehículo creado.',
          life: 2000
        });

        emit('ok', resultado.vehicle);

      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Error al guardar vehículo',
          life: 3000
        });
      }
    }
  });
}

</script>
