<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <div>
        <ul class="menu menu-lg bg-base-200 rounded-box w-28 h-full m-8 hover:bg-base-300 transition-all duration-300 ease-in-out shadow-lg hover:w-56">
            <li class="menu-title w-full">
                <div class="flex flex-row items-center gap-2">
                    <img src="../assets/rahayuwhite.svg" alt="rahayu logo">
                </div>
            </li>
            <li class="menu w-full">
                <div class="flex flex-row items-center gap-2" @click="$router.push('/dashboard')">
                    <a><font-awesome-icon icon="house" class="w-10 h-10 p-2 transition-all duration-300 bg-cyan-300 rounded-sm" /></a>
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Dashboard</span>
                </div>
            </li>
            <li class="menu w-full">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/income')">
                    <font-awesome-icon icon="sack-dollar" class="w-12 h-auto" />
                    <span class="menu-text opacity-1 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Income</span>
                </a>
            </li>
            <li class="menu w-full">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/order')">
                    <font-awesome-icon icon="fa-brands fa-shopify" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Order</span>
                </a>
            </li>
            <li class="menu w-full">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/product')">
                    <font-awesome-icon icon="shirt" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Product</span>
                </a>
            </li>
            <li class="menu w-full">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/expense')">
                    <font-awesome-icon icon="receipt" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Expense</span>
                </a>
            </li>
            <li class="menu w-full mb-32">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/employee')">
                    <font-awesome-icon icon="user-group" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Employee</span>
                </a>
            </li>
            <li class="menu">
                <a class="flex flex-row items-center gap-2">
                    <font-awesome-icon icon="right-from-bracket" class="w-12 h-auto" />
                </a>
            </li>
        </ul>
    </div>
      
  
      <div class="flex-grow px-6 pt-12 flex gap-6 main-content">
    <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-2xl font-bold text-cyan-950">Deadline</h2>
        <div class="flex items-center gap-2 font-semibold">
          <button class="text-cyan-950" @click="prevMonth">&lt;</button>
          <span class="text-cyan-950">{{ currentMonthName }} {{ currentYear }}</span>
          <button class="text-cyan-950" @click="nextMonth">&gt;</button>
        </div>
      </div>

      <!-- Days of week -->
      <div class="grid grid-cols-7 text-center font-semibold bg-cyan-950 text-white py-2 rounded-t-xl">
        <div v-for="day in days" :key="day">{{ day }}</div>
      </div>

      <!-- Days grid -->
      <div class="grid grid-cols-7 gap-y-4 text-center border border-cyan-950 rounded-b-xl py-4">
        <div v-for="n in startOffset" :key="'empty' + n"></div>
        <div
          v-for="day in daysInMonth"
          :key="day"
          class="relative cursor-pointer text-cyan-950 hover:bg-cyan-100 rounded-lg"
          @click="openModal(day)"
        >
          <div>{{ day }}</div>
          <div v-if="hasNote(day)" class="text-xs text-red-500 mt-1">📌 {{ notes[noteKey(day)] }}</div>
        </div>
      </div>

      <!-- Add Note Button -->
      <div class="mt-6 text-right">
        <button @click="openModal(null)" class="btn bg-cyan-500 text-white hover:bg-cyan-950">
          Tambahkan Deadline Baru
        </button>
      </div>
    </div>

<!-- Modal -->
<div v-if="showModal" class="modal-overlay">
  <div class="modal-content">
    <h3 class="text-xl font-semibold text-center mb-6 text-black">Tambah Deadline Baru</h3>
    <br>
    <div class="mb-4">
      <label class="font-medium text-black">Target Penyelesaian</label>
      <div class="flex gap-2 mt-1">
        <input v-model="monthInput" type="text" maxlength="2" placeholder="MM" class="border p-2 w-1/3 rounded text-cyan-950" />
        <input v-model="dayInput" type="text" maxlength="2" placeholder="DD" class="border p-2 w-1/3 rounded text-cyan-950" />
        <input v-model="yearInput" type="text" maxlength="2" placeholder="YY" class="border p-2 w-1/3 rounded text-cyan-950" />
      </div>
    </div>
    <br>
    <div class="mb-6">
      <label class="font-medium text-black">Nama Orderan</label>
      <input v-model="noteText" class="border p-2 w-full rounded mt-1 text-cyan-950" placeholder="Tulis nama pesanan..." />
    </div>
    <br>
    <div class="flex justify-end gap-3">
      <button @click="closeModal" class="close-button px-4 py-2 rounded text-sm font-semibold bg-gray-400">Batal</button>
      <button @click="saveNoteFromForm" class="open-button text-white px-4 py-2 rounded text-sm font-semibold hover:bg-cyan-700 bg-cyan-950">
        Tambah
      </button>
      </div>
    </div>
  </div>
  </div>
</div>
  </template>
  
  <style scoped>
  .modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); /* hitam transparan */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999; /* supaya di atas elemen lain */
}

.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
  </style>

<script setup>
import { ref, computed } from 'vue'

const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const now = new Date()
const currentMonth = ref(now.getMonth())
const currentYear = ref(now.getFullYear())
const notes = ref({}) // store notes like { '2025-01-17': 'Project deadline' }

const selectedDay = ref(null)
const noteText = ref('')
const showModal = ref(false)
const monthInput = ref('')
const dayInput = ref('')
const yearInput = ref('')

function saveNoteFromForm() {
  const mm = parseInt(monthInput.value)
  const dd = parseInt(dayInput.value)
  const yy = parseInt(yearInput.value)

  if (!mm || !dd || !yy || !noteText.value) {
    alert('Mohon lengkapi semua field.')
    return
  }

  const fullYear = yy < 100 ? 2000 + yy : yy // agar '25' jadi '2025'
  const dateKey = `${fullYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`

  notes.value[dateKey] = noteText.value
  closeModal()
}



const currentMonthName = computed(() =>
  new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long' })
)

const daysInMonth = computed(() =>
  new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
)

const startOffset = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  return (firstDay.getDay() + 6) % 7 // shift so Monday is first
})

const noteKey = (day) => `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
const hasNote = (day) => notes.value[noteKey(day)]

function prevMonth() {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value -= 1
  } else {
    currentMonth.value -= 1
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value += 1
  } else {
    currentMonth.value += 1
  }
}

function closeModal() {
  showModal.value = false
  selectedDay.value = null
}

function saveNote() {
  if (selectedDay.value) {
    notes.value[noteKey(selectedDay.value)] = noteText.value
  }
  closeModal()
}

function openModal(day) {
  selectedDay.value = day
  showModal.value = true
  noteText.value = ''
  monthInput.value = ''
  dayInput.value = ''
  yearInput.value = ''
}
</script>