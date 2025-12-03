<template>
  <div class="p-5 space-y-8 bg-[var(--p-surface-ground)]">

    <!-- === HEADER GLOBAL === -->
    <div>
      <h2 class="text-2xl font-bold text-[var(--p-primary-color)]">
        Perfil del Usuario
      </h2>
      <p class="text-sm text-[var(--p-text-secondary-color)] mt-1">
        Información general del usuario y sus registros del sistema.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- ===============================
                 CARD PERFIL
            ================================= -->
      <Card class="col-span-1 shadow-sm bg-[var(--p-surface-card)] rounded-xl">
        <template #header>
          <div class="flex items-center gap-4 p-4 border-b border-[var(--p-content-border-color)]">
            <div
              class="w-12 h-12 rounded-full bg-[var(--p-primary-100)] flex items-center justify-center text-[var(--p-primary-color)] text-xl font-bold">
              {{ user?.name?.charAt(0)?.toUpperCase() }}
            </div>

            <div>
              <h3 class="text-lg font-semibold text-[var(--p-text-color)]">
                {{ user?.name }}
              </h3>
              <p class="text-[var(--p-text-secondary-color)] text-sm">
                {{ user?.email }}
              </p>
            </div>
          </div>
        </template>

        <template #content>
          <div v-if="loadingUser" class="py-5">
            <ProgressBar mode="indeterminate" style="height: 4px" />
          </div>

          <div v-else class="space-y-3 p-4 text-[var(--p-text-color)]">
            <p><strong>UUID:</strong> {{ user?.uuid }}</p>

            <p class="flex items-center gap-2">
              <strong>2FA:</strong>
              <Tag :severity="user?.two_factor_auth ? 'success' : 'danger'">
                {{ user?.two_factor_auth ? "Activo" : "Inactivo" }}
              </Tag>
            </p>
          </div>
        </template>
      </Card>

      <!-- ===============================
        VEHÍCULOS
      ================================= -->
      <Card class="col-span-1 lg:col-span-2 shadow-sm bg-[var(--p-surface-card)] rounded-xl">
        <template #title>
          <div class="flex items-center gap-2 text-[var(--p-primary-color)]">
            <i class="pi pi-car text-lg"></i>
            <span class="text-lg font-semibold">Vehículos registrados</span>
          </div>
        </template>

        <template #content>

          <!-- === LOADING === -->
          <div v-if="loadingVehicles" class="py-4">
            <ProgressBar mode="indeterminate" style="height: 4px" />
          </div>

          <!-- === NO HAY VEHÍCULOS === -->
          <div v-else-if="vehicles.length === 0" class="py-6 text-center text-[var(--p-text-secondary-color)]">
            <i class="pi pi-info-circle text-2xl mb-2"></i>
            <p>No hay vehículos registrados para este usuario.</p>
          </div>

          <!-- === TABLA DE VEHÍCULOS === -->
          <div v-else>
            <DataTable class="compact-table text-[var(--p-text-color)]" :value="vehicles" stripedRows size="small"
              scrollable scrollHeight="200px">
              <Column field="license_plate" header="Placa" />
              <Column field="model" header="Modelo" />
              <Column field="color" header="Color" />
            </DataTable>

            <Paginator v-if="vehiclesTotal > vehiclesPerPage" :rows="vehiclesPerPage" :totalRecords="vehiclesTotal" @page="onPaginateVehicles"
              :first="(vehiclesPage - 1) * vehiclesPerPage" />
          </div>

        </template>
      </Card>


    </div>

    <!-- ===============================
     EVENTOS
    ================================= -->
    <Card class="shadow-sm bg-[var(--p-surface-card)] rounded-xl">
      <template #title>
        <div class="flex items-center gap-2 text-[var(--p-primary-color)]">
          <i class="pi pi-history text-lg"></i>
          <span class="text-lg font-semibold">Eventos recientes</span>
        </div>
      </template>

      <template #content>

        <!-- === LOADING === -->
        <div v-if="loadingEvents" class="py-4">
          <ProgressBar mode="indeterminate" style="height: 4px" />
        </div>

        <!-- === NO HAY EVENTOS === -->
        <div v-else-if="events.length === 0" class="py-6 text-center text-[var(--p-text-secondary-color)]">
          <i class="pi pi-info-circle text-2xl mb-2"></i>
          <p>No hay eventos registrados para este usuario.</p>
        </div>

        <!-- === TABLA DE EVENTOS === -->
        <div v-else>
          <DataTable class="compact-table text-[var(--p-text-color)]" :value="events" stripedRows size="small"
            scrollable >
            <Column field="plate_detected" header="Placa" />

            <Column field="event_datetime" header="Fecha">
              <template #body="{ data }">
                {{ formatDate(data.event_datetime) }}
              </template>
            </Column>

            <Column field="event_type" header="Tipo" />

            <Column field="result" header="Resultado">
              <template #body="{ data }">
                <Tag :severity="data.result === 'authorized' ? 'success' : 'danger'">
                  {{ data.result }}
                </Tag>
              </template>
            </Column>
          </DataTable>

          <Paginator v-if="eventsTotal > eventsPerPage" :rows="eventsPerPage" :totalRecords="eventsTotal" @page="onPaginateEvents"
            :first="(eventsPage - 1) * eventsPerPage" />
        </div>

      </template>
    </Card>


  </div>
</template>



<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

import { getUserById } from "@/lib/api/usersApi";
import { getVehiclesByUser } from "@/lib/api/vehiclesApi";
import { getEventsByUser } from "@/lib/api/eventsApi";

import { useToast } from "primevue/usetoast";
const toast = useToast();

// ROUTE PARAM
const route = useRoute();
const userUUID = route.params.uuid;

// === USER ===
const user = ref(null);
const loadingUser = ref(false);

// === VEHICLES ===
const vehicles = ref([]);
const vehiclesPage = ref(1);
const vehiclesPerPage = ref(2);
const vehiclesTotal = ref(0);
const loadingVehicles = ref(false);

// === EVENTS ===
const events = ref([]);
const eventsPage = ref(1);
const eventsPerPage = ref(2);
const eventsTotal = ref(0);
const loadingEvents = ref(false);

onMounted(() => {
  cargarUsuario();
  cargarVehiculos();
  cargarEventos();
});

// LOAD USER
async function cargarUsuario() {
  loadingUser.value = true;
  try {
    user.value = await getUserById(userUUID);
  } catch (e) {
    console.error(e);
    toast.add({ severity: "error", summary: "Error", detail: "No se pudo cargar el usuario" });
  } finally {
    loadingUser.value = false;
  }
}

// LOAD VEHICLES
async function cargarVehiculos() {
  loadingVehicles.value = true;
  try {
    const res = await getVehiclesByUser(userUUID, vehiclesPage.value);

    vehicles.value = res.data;
    vehiclesPerPage.value = res.per_page;
    vehiclesTotal.value = res.total;
  } finally {
    loadingVehicles.value = false;
  }
}

function onPaginateVehicles(ev) {
  vehiclesPage.value = ev.page + 1;
  cargarVehiculos();
}

// LOAD EVENTS
async function cargarEventos() {
  loadingEvents.value = true;
  try {
    const res = await getEventsByUser(userUUID, eventsPage.value);

    events.value = res.data;
    eventsPerPage.value = res.per_page;
    eventsTotal.value = res.total;
  } finally {
    loadingEvents.value = false;
  }
}

function onPaginateEvents(ev) {
  eventsPage.value = ev.page + 1;
  cargarEventos();
}

// FORMAT DATE
function formatDate(dateStr) {
  return new Date(dateStr).toLocaleString();
}
</script>


<style scoped>
.compact-table .p-datatable-thead>tr>th {
  padding: 0.4rem !important;
}

.compact-table .p-datatable-tbody>tr>td {
  padding: 0.35rem !important;
}
</style>
