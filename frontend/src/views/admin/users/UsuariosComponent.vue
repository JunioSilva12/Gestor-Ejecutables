<template>
  <!-- MODAL CREAR / EDITAR -->
  <Dialog v-model:visible="modalForm" modal :header="selectedUser ? 'Editar usuario' : 'Crear usuario'">
    <FormularioUsuario v-if="modalForm" :usuario="selectedUser"  @cancel="modalForm = false" />
  </Dialog>

  <div class="p-4  space-y-5">

    <!-- =========================== -->
    <!-- HEADER ----------------------->
    <!-- =========================== -->
    <div class="md:px-8 flex items-center justify-between">
      <h2 class="text-xl font-semibold text-primary">
        Gestión de Usuarios
      </h2>

      <Button severity="primary" @click="abrirCrear" class="!flex !items-center !gap-2">
        Crear usuario
      </Button>
    </div>

    <!-- =========================== -->
    <!-- tabla Usuarios    ------------>
    <!-- =========================== -->
      <TablaUsuarios ref="formUsuarioRef"  @edit="editar" @delete="eliminar" />

    </div>
</template>


<script setup>
import { ref } from "vue";
import FormularioUsuario from "./FormularioUsuario.vue";

import TablaUsuarios from "./TablaUsuarios.vue";
import {  deleteUser } from "@/lib/api/usersApi";
import { useConfirm } from "primevue/useconfirm";
import { useToast } from "primevue/usetoast";




// MODAL
const modalForm = ref(false);
const selectedUser = ref(null);

const confirm = useConfirm();
const toast = useToast();


// === Crear ===
function abrirCrear() {
  selectedUser.value = null;
  modalForm.value = true;
}

// === Editar ===
async function  editar(u) {
  console.log('Editar usuario:', u);
  selectedUser.value = u;
  modalForm.value = true;
}


const formUsuarioRef = ref(null)

function cargarUsuarios() {
  // 👇 llamar al método del hijo
  formUsuarioRef.value?.cargarUsuarios()
}


// === Eliminar ===
function eliminar(u) {
  confirm.require({
    message: `¿Eliminar a ${u.name}?`,
    header: "Confirmar",
    icon: "pi pi-exclamation-triangle",
    acceptClass: "p-button-danger",
    accept: async () => {
      try {
        await deleteUser(u.uuid);
        toast.add({
          severity: "success",
          summary: "Eliminado",
          detail: `${u.name} eliminado`,
          life: 2000,
        });
        cargarUsuarios();
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "No se pudo eliminar",
          life: 2000,
        });
      }
    },
  });
}







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
