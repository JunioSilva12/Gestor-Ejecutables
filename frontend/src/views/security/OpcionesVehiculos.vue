<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: 'carro' },      // v-model (vehículo)
  modelAction: { type: String, default: 'entry' }    // v-model:modelAction (acción)
})

const emit = defineEmits(['update:modelValue', 'update:modelAction'])

const setVehicle = (v) => emit('update:modelValue', v)
const setAction = (a) => emit('update:modelAction', a)
</script>

<template>
  <div class="flex flex-col w-full gap-3">
    <div class="flex justify-center w-full  items-center gap-3">
      <p class="font-bold text-text-estados">Tipo de Vehículo</p>
      <label
        role="radio"
        :aria-checked="props.modelValue === 'carro'"
        @click="setVehicle('carro')"
        :class="[
          'cursor-pointer px-3 py-1 rounded-lg w-[80px] border transition select-none flex items-center gap-2',
          props.modelValue === 'carro'
            ? 'bg-blue-600 text-white border-transparent'
            : 'bg-transparent text-blue-600 border-blue-600'
        ]"
      >
        <input class="sr-only" type="radio" name="vehiculo" value="carro" :checked="props.modelValue === 'carro'" @change="setVehicle('carro')" />
        <span class="font-semibold w-full text-center">Carro</span>
      </label>

      <label
        role="radio"
        :aria-checked="props.modelValue === 'moto'"
        @click="setVehicle('moto')"
        :class="[
          'cursor-pointer px-3 py-1 rounded-lg w-[80px] border transition select-none flex items-center gap-2',
          props.modelValue === 'moto'
            ? 'bg-blue-600 text-white border-transparent'
            : 'bg-transparent text-blue-600 border-blue-600'
        ]"
      >
        <input class="sr-only" type="radio" name="vehiculo" value="moto" :checked="props.modelValue === 'moto'" @change="setVehicle('moto')" />
        <span class="font-semibold w-full text-center">Moto</span>
      </label>
    </div>

    <div class="flex justify-center w-full  items-center gap-3">
      <p class="font-bold w-[30%] text-text-estados">Accion</p>
      <label
        role="radio"
        :aria-checked="props.modelAction === 'entry'"
        @click="setAction('entry')"
        :class="[
          'cursor-pointer px-3 py-1 rounded-lg w-[80px] border transition select-none flex items-center gap-2',
          props.modelAction === 'entry'
            ? 'bg-blue-600 text-white border-transparent'
            : 'bg-transparent text-blue-600 border-blue-600'
        ]"
      >
        <input class="sr-only" type="radio" name="accion" value="entry" :checked="props.modelAction === 'entry'" @change="setAction('entry')" />
        <span class="font-semibold w-full text-center">Entrada</span>
      </label>

      <label
        role="radio"
        :aria-checked="props.modelAction === 'exit'"
        @click="setAction('exit')"
        :class="[
          'cursor-pointer px-3 py-1 rounded-lg w-[80px] border transition select-none flex items-center gap-2',
          props.modelAction === 'exit'
            ? 'bg-blue-600 text-white border-transparent'
            : 'bg-transparent text-blue-600 border-blue-600'
        ]"
      >
        <input class="sr-only" type="radio" name="accion" value="exit" :checked="props.modelAction === 'exit'" @change="setAction('exit')" />
        <span class="font-semibold w-full text-center">Salida</span>
      </label>
    </div>
  </div>
</template>
