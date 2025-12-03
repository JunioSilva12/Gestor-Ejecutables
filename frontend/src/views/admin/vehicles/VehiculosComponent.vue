<template>
  <div class="p-4 space-y-4">

    <!-- === HEADER === -->
    <div class="flex justify-between items-center md:px-8">
      <h2 class="text-xl font-semibold text-primary">Gestión de Vehículos</h2>
      <Button label="Crear vehículo" @click="abrirCrear" />
    </div>

    <!-- === TABLA VEHÍCULOS === -->
    <DataTable class="md:px-8" :value="vehiculos" :loading="loading" :rows="perPage" size="small" stripedRows>

      <Column field="license_plate" header="Placa"></Column>
      <Column field="model" header="Modelo"></Column>
      <Column field="color" header="Color"></Column>

      <!-- USUARIO ASOCIADO COMO LINK (manejo seguro de null) -->
      <Column header="Usuario">
        <template #body="{ data }">
          <div v-if="data.user && data.user.uuid">
            <RouterLink :to="`/profile/${data.user.uuid}`" class="text-primary hover:underline">
              {{ data.user.name ?? "Usuario sin nombre" }}
            </RouterLink>
          </div>

          <div v-else class="text-[var(--p-text-muted-color)] italic">
            Sin usuario asociado
          </div>
        </template>
      </Column>

      <!-- === ACCIONES === -->
      <Column header="Acciones">
        <template #body="{ data }">
          <div class="flex gap-2">
            <Button class="p-0" size="small" icon="pi pi-pencil" severity="secondary" text @click="editar(data)" />
            <Button class="p-0" size="small" icon="pi pi-trash" severity="danger" text @click="eliminar(data)" />
          </div>
        </template>
      </Column>

    </DataTable>


    <!-- === PAGINACIÓN === -->
    <Paginator v-if="total > perPage" class="md:px-8" :rows="perPage" :totalRecords="total" @page="onPaginate" :first="(page - 1) * perPage" />

    <!-- === MODAL CREAR/EDITAR VEHÍCULO === -->
    <Dialog v-model:visible="modalForm" modal :header="selectedVehicle ? 'Editar vehículo' : 'Crear vehículo'"
      >
      <ModalVehiculo v-if="modalForm"  :vehiculo="selectedVehicle" @ok="onSubmit" @cancel="modalForm = false" />
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getVehicles, deleteVehicle } from '@/lib/api/vehiclesApi';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ModalVehiculo from './ModalVehiculo.vue';

// === STATE ===
const vehiculos = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const loading = ref(false);

// Modal + vehículo seleccionado
const modalForm = ref(false);
const selectedVehicle = ref(null);

// PrimeVue
const confirm = useConfirm();
const toast = useToast();

// === CARGAR VEHÍCULOS ===
async function cargarVehiculos() {
  loading.value = true;
  try {
    const res = await getVehicles(page.value);
    vehiculos.value = res.data;
    perPage.value = res.per_page;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}

// === PAGINACIÓN ===
function onPaginate(ev) {
  page.value = ev.page + 1;
  cargarVehiculos();
}

// === CREAR ===
function abrirCrear() {
  selectedVehicle.value = null;
  modalForm.value = true;
}



// === EDITAR ===
function editar(v) {
  selectedVehicle.value = { ...v };
  modalForm.value = true;
}

// === SE LLAMA DESDE FormularioVehiculo ===
async function onSubmit() {
  modalForm.value = false;
  await cargarVehiculos();
}

// === ELIMINAR ===
function eliminar(v) {
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

// === INIT ===
onMounted(cargarVehiculos);
</script>
