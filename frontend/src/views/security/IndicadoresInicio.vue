<script setup>

</script>
<template>
  <div class="border rounded-2xl p-2 flex flex-col md:flex-row gap-2 bg-[#ffffff] border-[#d1d1d12e] shadow-md shadow-shadow hover:scale-105 transition-transform duration-200">
    <div class=" items-center flex justify-center">
        <svg viewBox="0 0 24 24 " class="w-10 h-10 border rounded-xl bg-background-icono-accesos-hoy text-background-icono-accesos-hoy p-1">
            <path class="fill-icono-accesos-hoy" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
        </svg>
    </div>
    <div class=" flex flex-col items-center">
        <h3 class="font-bold text-2xl text-primary">2,847</h3>
        <p class="text-sm text-center font-light text-second-text">Total Accesos Hoy</p>
    </div>
  </div>

  <div class="border rounded-2xl sm:mt-0 mt-4 p-2 flex flex-col md:flex-row items-center justify-center gap-2 bg-[#ffffff] border-[#d1d1d12e] shadow-md shadow-shadow hover:scale-105 transition-transform duration-200">
    <div class=" items-center flex justify-center ">
        <svg viewBox="0 0 24 24" class="w-10 h-10 border rounded-xl bg-background-icono-accesos text-background-icono-accesos p-1">
            <path class="fill-icono-accesos" d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
        </svg>
    </div>
    <div class="flex flex-col items-center">
        <h3 class="font-bold text-2xl text-primary">2,654</h3>
        <p class="text-sm text-center font-light text-second-text">Accesos Autorizados</p>
    </div>
  </div>

  <div class="border rounded-2xl p-2 flex flex-col md:flex-row items-center justify-center gap-2 bg-[#ffffff] border-[#d1d1d12e] shadow-md shadow-shadow hover:scale-105 transition-transform duration-200">
    <div class=" items-center flex justify-center">
        <svg viewBox="0 0 24 24" class="w-10 h-10 border rounded-xl bg-background-icono-visitantes text-background-icono-visitantes p-1">
            <path class="fill-icono-visitantes" d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
        </svg>
    </div>
    <div class="flex flex-col items-center">
        <h3 class="font-bold text-2xl text-primary">193</h3>
        <p class="text-sm text-center font-light text-second-text">Visitantes Activos</p>
    </div>
  </div>

  <div class="border rounded-2xl sm:mt-0 mt-4 p-2 flex flex-col md:flex-row items-center justify-center gap-2 bg-[#ffffff] border-[#d1d1d12e] shadow-md shadow-shadow hover:scale-105 transition-transform duration-200">
    <div class=" items-center flex justify-center">
        <svg viewBox="0 0 24 24" class="w-10 h-10 border rounded-xl bg-background-icono-alertas text-background-icono-alertas p-1">
            <path class="fill-icono-alertas" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
        </svg>
    </div>
    <div class="flex flex-col items-center">
        <h3 class="font-bold text-2xl text-primary">8</h3>
        <p class="text-sm text-center font-light text-second-text">Alertas de Seguridad</p>
    </div>
  </div>
</template>
