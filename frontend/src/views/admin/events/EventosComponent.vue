<template>
  <div class="p-4 space-y-4">

    <!-- === HEADER === -->
    <div class="flex justify-between items-center md:px-8">
      <h2 class="text-xl font-semibold text-primary">Eventos de placas</h2>
    </div>

    <!-- === FILTROS === -->
    <div class="md:px-8 bg-surface-50 p-4 md:mx-8 rounded-lg border  border-surface-300 flex flex-col gap-4">

      <!-- ======================== -->
      <!-- FILA 1 → 3 filtros       -->
      <!-- ======================== -->
      <div class="grid grid-cols-1 md:grid-cols-3 justify-center items-center gap-4">

        <!-- Placa -->
        <div class="flex  items-center flex-col">
          <label class="font-medium text-sm w-full md:w-8/12  mb-1">Placa</label>
          <IconField class="w-full md:w-8/12">
            <InputIcon class="pi pi-search" />
            <InputText v-model="filters.plate" placeholder="ABC123" class="w-full h-11" />
          </IconField>
        </div>

        <!-- Tipo -->
        <div class="flex items-center  flex-col">
          <label class="font-medium text-sm w-full md:w-8/12   mb-1">Tipo</label>
          <Dropdown v-model="filters.event_type" :options="eventTypeOptions" optionLabel="label" optionValue="value"
            placeholder="Todos" class="w-full md:w-8/12  h-11" showClear />
        </div>

        <!-- Resultado -->
        <div class="flex items-center flex-col">
          <label class="font-medium text-sm w-full md:w-8/12  mb-1">Resultado</label>
          <Dropdown v-model="filters.result" :options="resultOptions" optionLabel="label" optionValue="value"
            placeholder="Todos" class="w-full md:w-8/12 h-11" showClear />
        </div>

      </div>

      <!-- ======================== -->
      <!-- FILA 2 → Fechas + Botón  -->
      <!-- ======================== -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <!-- Desde -->
        <div class="flex items-center flex-col">
          <label class="text-sm font-medium w-full md:w-8/12  mb-1">Desde</label>
          <DatePicker v-model="filters.start_date" placeholder="YYYY-MM-DD" dateFormat="yy-mm-dd" showIcon
            inputClass="w-full h-11" class="w-full md:w-8/12" showClear/>
        </div>

        <!-- Hasta -->
        <div class="flex items-center flex-col">
          <label class="text-sm font-medium w-full md:w-8/12  mb-1">Hasta</label>
          <DatePicker v-model="filters.end_date" placeholder="YYYY-MM-DD" dateFormat="yy-mm-dd" showIcon
            inputClass="w-full h-11" class="w-full md:w-8/12" showClear />
        </div>

        <!-- Botón -->
        <div class="flex flex-col items-center justify-end">
          <Button label="Filtrar" icon="pi pi-filter" class="w-8/12 px-4 py-2 !bg-primary !border-none h-11"
            @click="aplicarFiltros" />
        </div>

      </div>


    </div>


    <!-- === TABLA === -->
    <DataTable class="md:px-8" :value="eventos" :loading="loading" :rows="perPage" size="small" stripedRows>
      <Column field="plate_detected" header="Placa" />

      <Column field="event_datetime" header="Fecha / Hora">
        <template #body="{ data }">
          {{ new Date(data.event_datetime).toLocaleString() }}
        </template>
      </Column>

      <Column field="event_type" header="Tipo">
        <template #body="{ data }">
          <Tag :value="data.event_type" :severity="data.event_type === 'entry' ? 'success' : 'warning'"
            class="w-24 text-center py-1" />
        </template>
      </Column>

      <Column field="result" header="Resultado">
        <template #body="{ data }">
          <Tag :value="data.result" :severity="data.result === 'unauthorized' ? 'danger' : 'success'" />
        </template>
      </Column>
      <!-- ======================== -->
      <!-- imagen (implementacion futura) -->
      <!-- ======================== -->
      <!--<Column header="Imagen">
        <template #body="{ data }">
          <div v-if="data.image_url">
            <img :src="data.image_url" class="w-20 h-12 object-cover rounded" />
          </div>
          <span v-else class="text-gray-400 italic">Sin imagen</span>
        </template>
      </Column>-->
    </DataTable>

    <!-- === PAGINACIÓN === -->
    <Paginator v-if="total > perPage" class="md:px-8" :rows="perPage" :totalRecords="total" @page="onPaginate"
      :first="(page - 1) * perPage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getEvents } from "@/lib/api/eventsApi";

const eventos = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const loading = ref(false);

// === FILTROS ===
const filters = ref({
  plate: "",
  event_type: "",
  result: "",
  start_date: "",
  end_date: ""
});

const eventTypeOptions = [
  { label: "Entrada", value: "entry" },
  { label: "Salida", value: "exit" }
];

const resultOptions = [
  { label: "Autorizado", value: "authorized" },
  { label: "No autorizado", value: "unauthorized" }
];





// === Cargar eventos ===
async function cargarEventos(filtrosFormat) {
  loading.value = true;

  try {
    const res = await getEvents(page.value, filtrosFormat);
    eventos.value = res.data;
    perPage.value = res.per_page;
    total.value = res.total;

  } finally {
    loading.value = false;
  }
}
function formatDate(date) {
  if (!date) return "";
  return date.toISOString().split("T")[0]; // YYYY-MM-DD
}


// === Botón "Filtrar" ===
function aplicarFiltros() {
  page.value = 1;


  const filtrosFormat = {
    ...filters.value,
    start_date: formatDate(filters.value.start_date),
    end_date: formatDate(filters.value.end_date)
  };


  cargarEventos(filtrosFormat);
}

// === Paginación ===
function onPaginate(ev) {
  page.value = ev.page + 1;
    const filtrosFormat = {
    ...filters.value,
    start_date: formatDate(filters.value.start_date),
    end_date: formatDate(filters.value.end_date)
  };
  cargarEventos(filtrosFormat );
}

onMounted(cargarEventos);
</script>
