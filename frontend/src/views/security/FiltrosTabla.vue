<script setup>

</script>

<template>
  <div class="flex flex-col justify-center items-center gap-1 w-full ">
    <div class="flex flex-wrap sm:grid-row h-full w-auto sm:max-w-[700px] md:max-w-full gap-2 items-center justify-center py-2 ">

        <div class="mb-2 flex flex-col sm:flex-wrap md:flex-row mr-2 justify-center items-center ">
          <label for="filtro_placa" class="mr-1 font-semibold">Placa:</label>
        <input type="text" id="filtro_placa" placeholder="Buscar placa...." name="filtro_placa" class="border border-border rounded w-[200px] sm:w-[300px] px-2 py-1">
      </div>

      <div class="mb-2 flex flex-col sm:flex-wrap md:flex-row mr-2 justify-center items-center">
        <label for="filtro_estado" class="mr-1 font-semibold">Respuesta:</label>
        <select id="filtro_estado" name="filtro_estado" class="border border-border rounded flex w-[200px] px-2 py-1">
          <option value="">Todos</option>
          <option value="Activo">Permitido</option>
          <option value="Inactivo">Denegado</option>
        </select>
      </div>
      <div class="mb-2 flex flex-col sm:flex-wrap md:flex-row mr-2 justify-center items-center">
        <label for="filtro_tipo" class="mr-1 font-semibold">Tipo:</label>
        <select id="filtro_tipo" name="filtro_tipo" class="border border-border rounded w-[200px] px-2 py-1">
          <option value="">Todos</option>
          <option value="Entrada">Entrada</option>
          <option value="Salida">Salida</option>
        </select>
      </div>
      <div class="mb-2 flex flex-col sm:flex-row gap-2 mr-2 items-center justify-center">
        <label for="filtro_fecha_inicio" class="mr-1 font-semibold">Fecha:</label>
        <input type="date" id="filtro_fecha_inicio" name="filtro_fecha_inicio" class="border border-border w-[200px] rounded px-2 py-1 mr-1">
        <span class="mx-1">al</span>
        <input type="date" id="filtro_fecha_fin" name="filtro_fecha_fin" class="border border-border w-[200px] rounded px-2 py-1" >
      </div>
    </div>
    <div class="flex flex-row gap-4 mb-2 w-full items-center justify-center">
      <button class="border border-hover-botones-secundarios bg-hover-botones-secundarios hover:bg-shadow rounded-lg p-1 text-primary-text hover:scale-105 hover:bg-gray-400 transition-transform duration-200 hover:cursor-pointer w-auto px-4">Limpiar Filtros</button>
      <button class="border border-secondary bg-secondary hover:bg-shadow rounded-lg p-1 text-white hover:scale-105 transition-transform duration-200 hover:cursor-pointer hover:bg-primary hover:border-primary w-auto px-4">Aplicar Filtros</button>
    </div>

  </div>

</template>
