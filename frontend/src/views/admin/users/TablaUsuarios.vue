<template>

    <!-- ===========================-->
    <!-- FILTROS                    -->
    <!--=========================== -->
    <div class="md:px-8 mt-3 flex flex-col md:flex-row gap-3 md:items-center w-full">

      <!-- Buscar -->
      <div class="w-full md:flex-1">
        <IconField class="w-full">
          <InputIcon class="pi pi-search" />
          <InputText v-model="search" placeholder="Buscar por nombre o email" class="w-full" @input="onSearch" />
        </IconField>
      </div>

      <!-- Rol -->
      <div class="w-full md:w-64">
        <Select v-model="role" :options="rolesOptions" optionLabel="label" optionValue="value"
          placeholder="Filtrar por rol" class="w-full" showClear @change="onSearch" />
      </div>

    </div>



    <!-- TABLA -->
    <div class="md:px-8 mt-4">
      <DataTable :value="usuarios" :loading="loading" :rows="perPage" stripedRows size="small" class="compact-table">

        <Column field="name" header="Nombre">
          <template #body="{ data }">
            <RouterLink :to="`/profile/${data.uuid}`" class="text-primary hover:underline">
              {{ data.name }}
            </RouterLink>
          </template>
        </Column>

        <Column field="email" header="Email" />

        <Column field="role" header="Rol">
          <template #body="{ data }">
            <Tag :severity="roleColor(data.role)">
              {{ data.role }}
            </Tag>
          </template>
        </Column>

        <Column header="Acciones">
          <template #body="{ data }">
            <div class="flex gap-2">
              <Button icon="pi pi-pencil" size="small" severity="secondary" text @click="editar(data)" />
              <Button icon="pi pi-trash" size="small" severity="danger" text @click="eliminar(data)" />
            </div>
          </template>
        </Column>

      </DataTable>
    </div>

    <!-- PAGINADOR -->
    <Paginator v-if="total > perPage" class="md:px-8 mt-4" :rows="perPage" :totalRecords="total"
      :first="(page - 1) * perPage" @page="onPaginate" />

</template>


<script setup>
import { ref, onMounted } from "vue";
import { getUsers } from "@/lib/api/usersApi";

// STATE
const usuarios = ref([]);
const page = ref(1);
const perPage = ref(10);
const total = ref(0);
const loading = ref(false);

// filtros
const search = ref("");
const role = ref(null);

const rolesOptions = [
  { label: "Admin", value: "admin" },
  { label: "Security", value: "security" },
  { label: "User", value: "user" },
  { label: "Visitor", value: "visitor" }
];

// MODAL
const modalForm = ref(false);
const selectedUser = ref(null);



// === FUNCIÓN PARA CARGAR USUARIOS =====
async function cargarUsuarios() {
  loading.value = true;

  try {
    const res = await getUsers({
      page: page.value,
      search: search.value,
      role: role.value,
    });

    usuarios.value = res.data;
    perPage.value = res.per_page;
    total.value = res.total;
  } finally {
    loading.value = false;
  }
}

// === Búsqueda por texto y rol ===
function onSearch() {
  page.value = 1;
  cargarUsuarios();
}

// === Paginación ===
function onPaginate(ev) {
  page.value = ev.page + 1;
  cargarUsuarios();
}



// === Editar ===
function editar(u) {
  selectedUser.value = { ...u };
  modalForm.value = true;
  emit("edit", u);
}

// === Eliminar ===
const emit = defineEmits(['delete', 'edit']);

function eliminar(u) {
  // Emitir evento al padre
  emit("delete", u);
}




// === Color para el rol ===
function roleColor(r) {
  switch (r) {
    case "admin": return "danger";
    case "security": return "info";
    case "user": return "success";
    case "visitor": return "warning";
    default: return "";
  }
}

// INIT
onMounted(cargarUsuarios);


// 👇 Exponer funciones o variables hacia el padre
defineExpose({
  cargarUsuarios
})

</script>

<style scoped>
.compact-table .p-datatable-tbody>tr>td {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}

.compact-table .p-datatable-thead>tr>th {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}
</style>
