<template>
  <div class="grid grid-cols-7 gap-2">
    <!-- Header Hari -->
    <div v-for="day in days" :key="day" class="text-center font-semibold text-sm text-cyan-950">
      {{ day }}
    </div>

    <!-- Offset kosong -->
    <div v-for="n in startOffset" :key="'offset-' + n"></div>

    <!-- Tanggal -->
    <div
      v-for="day in daysInMonth"
      :key="'day-' + day"
      class="relative border rounded p-4 cursor-pointer hover:bg-cyan-700"
      :class="{ 'bg-red-800 text-white': hasNote(day) }"
      @click="handleDateClick(day)"
    >
      <!-- Tanggal di pojok kiri atas -->
      <div class="absolute top-1 left-1 text-xs font-bold">{{ day }}</div>

      <!-- Jika ada note -->

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  notes: Object,
  currentMonth: Number,
  currentYear: Number
})

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const daysInMonth = computed(() =>
  new Date(props.currentYear, props.currentMonth + 1, 0).getDate()
)

const startOffset = computed(() => {
  const firstDay = new Date(props.currentYear, props.currentMonth, 1)
  return (firstDay.getDay() + 6) % 7 // Adjust agar Senin = 0
})

const emit = defineEmits(['date-clicked'])

function handleDateClick(day) {
  const clickedDate = {
    day,
    month: props.currentMonth + 1,
    year: props.currentYear
  }
  emit('date-clicked', clickedDate)
}

function getNote(day) {
  const dateKey = `${props.currentYear}-${String(props.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return props.notes[dateKey] || ''
}

function hasNote(day) {
  return !!getNote(day)
}
</script>
