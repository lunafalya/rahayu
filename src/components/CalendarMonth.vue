<template>
  <div class="grid grid-cols-7 gap-2">
    <!-- Header Hari -->
    <div v-for="day in days" :key="day" class="text-center font-semibold text-sm text-cyan-200">
      {{ day }}
    </div>

    <!-- Offset kosong untuk awal bulan -->
    <div v-for="n in startOffset" :key="'offset-' + n"></div>

<!-- Tanggal -->
    <div
      v-for="day in daysInMonth"
      :key="'day-' + day"
      class="relative p-2 text-center border rounded hover:bg-cyan-200 cursor-pointer"
      @click="handleDateClick(day)"
    >
      <div class="font-semibold text-cyan-500">{{ day }}</div>
      <div v-if="getNote(day)" class="mt-1 text-xs text-cyan-700 truncate">
        {{ getNote(day) }}
      </div>
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
  return (firstDay.getDay() + 6) % 7 // agar Senin = 0
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


// Ambil isi catatan untuk tanggal tertentu
function getNote(day) {
  const dateKey = `${props.currentYear}-${String(props.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  return props.notes[dateKey] || ''
}
</script>
