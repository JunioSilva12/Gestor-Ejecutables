<template>
  <div class="p-mb-3">
    <input type="file" @change="handleFile" />
    <button @click="upload" class="p-button p-button-success p-ml-2">Subir</button>
  </div>
</template>

<script>
import { uploadFile } from '../services/file.service';

export default {
  data() {
    return {
      selectedFile: null,
    };
  },
  methods: {
    handleFile(event) {
      this.selectedFile = event.target.files[0];
    },
    async upload() {
      if (!this.selectedFile) return;
      try {
        await uploadFile(this.selectedFile);
        alert('Archivo subido');
        this.$emit('uploaded');
      } catch (err) {
        console.error(err);
        alert('Error al subir');
      }
    },
  },
};
</script>
