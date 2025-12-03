<template>

  <!-- FILTROS COMPACTOS -->
  <div class="px-4 py-2 flex flex-col md:flex-row gap-2 items-center">

    <!-- Buscar -->
    <IconField class="w-full h-9">
      <InputIcon class="pi pi-search" />
      <InputText v-model="search" class="w-full h-9 text-sm" placeholder="Buscar..." @input="onSearch" />
    </IconField>

    <!-- Rol -->
    <Select v-model="role" :options="rolesOptions" optionLabel="label" optionValue="value" placeholder="Rol" showClear
      class="w-full md:w-48 h-9 text-sm" @change="onSearch" :pt="{
        root: { class: 'h-8 flex items-center' },
        label: { class: 'text-xs flex items-center' },
        trigger: { class: 'p-1 flex items-center' },
        dropdownIcon: { class: 'text-xs' }
      }" />


  </div>



  <!-- LISTA DE USUARIOS (Tabla Custom, centrada y stripeada) -->
  <div class="p-2  rounded">

    <!-- CABECERA -->
    <div class="grid grid-cols-3 font-semibold text-gray-700 text-sm py-2 px-3 border-b bg-gray-100">
      <span class="flex items-center">Nombre</span>
      <span class="flex items-center">Email</span>
      <span class="flex items-center justify-end">Rol</span>
    </div>

    <!-- FILAS -->
    <div v-for="(u, index) in usuarios" :key="u.uuid" @click="seleccionar(u)"
      class="grid grid-cols-3 items-center py-2 px-3 text-sm cursor-pointer transition" :class="[
        index % 2 === 0 ? 'bg-white' : 'bg-surface-50',    // stripeado
        u.uuid === selectedUserId ? 'bg-primary-50 border border-primary' : '',
        'hover:bg-gray-100'
      ]">

      <!-- Nombre -->
      <span class="font-medium flex items-center">
        {{ u.name }}
      </span>

      <!-- Email -->
      <span class="text-gray-600 truncate flex items-center">
        {{ u.email }}
      </span>

      <!-- Rol -->
      <div class="text-right flex items-center justify-end">
        {{ u.role }}
      </div>

    </div>

  </div>




  <!-- PAGINADOR -->
  <Paginator v-if="total > perPage" class="p-4" :rows="perPage" :totalRecords="total" :first="(page - 1) * perPage"
    @page="onPaginate" />

</template>


<script setup>
import { ref, onMounted } from "vue";
import { getUsers } from "@/lib/api/usersApi";

// evento hacia el padre
const emit = defineEmits(["select"]);

// STATE
const usuarios = ref([]);
const selectedUserId = ref(null);

const search = ref("");
const role = ref(null);

const page = ref(1);
const perPage = ref(10);
const total = ref(0);

// Opciones de rol
const rolesOptions = [
  { label: "Admin", value: "admin" },
  { label: "Security", value: "security" },
  { label: "User", value: "user" },
  { label: "Visitor", value: "visitor" },
];

// Cargar usuarios
async function cargarUsuarios() {
  const res = await getUsers({
    page: page.value,
    search: search.value,
    role: role.value,
  });

  usuarios.value = res.data;
  perPage.value = res.per_page;
  total.value = res.total;
}

// Buscar
function onSearch() {
  page.value = 1;
  cargarUsuarios();
}

// Paginación
function onPaginate(ev) {
  page.value = ev.page + 1;
  cargarUsuarios();
}

// Selección
function seleccionar(user) {
  selectedUserId.value = user.uuid;
  emit("select", user);
}


// INIT
onMounted(() => cargarUsuarios());
</script>
