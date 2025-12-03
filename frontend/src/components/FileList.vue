<template>
  <div class="space-y-6">

    <!-- Upload Card -->
    <Card class="p-6 rounded-2xl shadow-md border border-gray-100">
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-upload text-blue-600"></i>
          <span class="text-xl font-semibold text-gray-700">Subir nuevo archivo</span>
        </div>
      </template>

      <!-- Contenido del Card -->
      <template #content>
      <FileUpload mode="basic" choose-label="Seleccionar archivo" upload-label="Subir" customUpload
        @uploaded="loadFiles" />
      </template>
    </Card>

    <!-- Files List -->
    <Card class="p-6 rounded-2xl shadow-md border border-gray-100">
      <!-- Título -->
      <template #title>
        <div class="flex items-center gap-2">
          <i class="pi pi-folder text-yellow-500"></i>
          <span class="text-xl font-semibold text-gray-700">Archivos disponibles</span>
        </div>
      </template>

      <!-- Contenido del Card -->
      <template #content>
        <ul class="divide-y divide-gray-200">
          <li v-for="file in files" :key="file.id"
            class="flex justify-between items-center py-3 px-2 hover:bg-gray-50 transition rounded-lg">
            <div class="flex items-center gap-2">
              <i class="pi pi-file text-blue-500"></i>
              <span>{{ file.original_name }}</span>
            </div>
            <div class="flex gap-2">
              <Button icon="pi pi-download" label="Descargar" class="p-button-sm p-button-info"
                @click="download(file.id)" />
              <Button icon="pi pi-trash" label="Eliminar" class="p-button-sm p-button-danger"
                @click="confirmDelete(file.id)" />
            </div>
          </li>
        </ul>

        <div v-if="files.length === 0" class="text-gray-500 text-sm text-center py-4">
          No hay archivos subidos.
        </div>
      </template>
    </Card>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import FileUpload from './FileUpload.vue';
import Card from 'primevue/card';
import Button from 'primevue/button';
import { getFiles, downloadFileById, deleteFile } from '../services/file.service';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const files = ref([]);
const confirm = useConfirm();
const toast = useToast();

const loadFiles = async () => {
  const res = await getFiles();
  files.value = res.data;
};

const download = async (id) => {
  await downloadFileById(id);
};

const confirmDelete = (id) => {
  confirm.require({
    message: '¿Deseas eliminar este archivo?',
    header: 'Confirmar eliminación',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      await deleteFile(id);
      toast.add({
        severity: 'success',
        summary: 'Eliminado',
        detail: 'Archivo eliminado correctamente',
        life: 3000
      });
      loadFiles();
    }
  });
};

onMounted(() => {
  loadFiles();
});
</script>
