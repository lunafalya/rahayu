<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar />

    <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
      <div class="flex flex-row items-start pt-6 w-full">
        <!-- WALLET  -->
      <div class="bg-cyan-950 text-white rounded-2xl p-6 shadow-lg w-full">
      <h2 class="text-xl font-bold mb-4">My Wallet</h2>
      <div class="mb-6">
        <p class="text-sm text-gray-300">Available Balance</p>
        <p class="text-3xl font-bold mt-1">Rp. 5.208.100</p>
      </div>
  
      <div class="flex gap-4 mb-6">
        <div class="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-2 shadow">
          <div class="bg-yellow-500 p-2 rounded-full">
            <svg class="w-4 h-4 text-white rotate-45" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5v10m0 0l5-5m-5 5l-5-5" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-400">Expense</p>
            <p class="text-sm font-semibold">Rp. 240.000</p>
          </div>
        </div>
        <div class="flex items-center gap-2 bg-gray-800 rounded-xl px-4 py-2 shadow">
          <div class="bg-blue-500 p-2 rounded-full">
            <svg class="w-4 h-4 text-white -rotate-45" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5v10m0 0l5-5m-5 5l-5-5" />
            </svg>
          </div>
          <div>
            <p class="text-xs text-gray-400">Income</p>
            <p class="text-sm font-semibold">Rp. 500.000</p>
          </div>
        </div>
      </div>
  
      <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold text-white">Recent Transactions</h3>
          <a href="#" class="text-sm text-blue-400 hover:underline">View All</a>
        </div>
        <ul class="space-y-3 text-sm">
          <li class="flex justify-between items-center">
            <div>
              <p class="font-semibold">PT. SILATURAHMI</p>
              <p class="text-gray-400 text-xs">12.05 WIB • 22/04/2025</p>
            </div>
            <p class="text-orange-400">Rp. 240.000 ↑</p>
          </li>
          <li class="flex justify-between items-center">
            <div>
              <p class="font-semibold">LUNA FALYA ISKANDAR</p>
              <p class="text-gray-400 text-xs">10.30 WIB • 19/04/2025</p>
            </div>
            <p class="text-blue-400">Rp. 500.000 ↓</p>
          </li>
          <li class="flex justify-between items-center">
            <div>
              <p class="font-semibold">FALIANA ALIFIA</p>
              <p class="text-gray-400 text-xs">21.53 WIB • 18/04/2025</p>
            </div>
            <p class="text-orange-400">Rp. 32.030 ↑</p>
          </li>
          <li class="flex justify-between items-center">
            <div>
              <p class="font-semibold">PT. SILATURAHMI</p>
              <p class="text-gray-400 text-xs">08.21 WIB • 14/04/2025</p>
            </div>
            <p class="text-blue-400">Rp. 820.901 ↓</p>
          </li>
          <li class="flex justify-between items-center">
            <div>
              <p class="font-semibold">SD AMALINA</p>
              <p class="text-gray-400 text-xs">16.17 WIB • 10/04/2025</p>
            </div>
            <p class="text-blue-400">Rp. 201.500 ↓</p>
          </li>
        </ul>
      </div>
    </div>
    </div>


    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h3 class="text-xl font-semibold text-center mb-6 text-black">Tambah Deadline Baru</h3>

        <div class="mb-4">
          <label class="font-medium text-black">Target Penyelesaian</label>
          <div class="flex gap-2 mt-1">
            <input v-model="monthInput" type="text" maxlength="2" placeholder="MM" class="border p-2 w-1/3 rounded text-cyan-950" />
            <input v-model="dayInput" type="text" maxlength="2" placeholder="DD" class="border p-2 w-1/3 rounded text-cyan-950" />
            <input v-model="yearInput" type="text" maxlength="2" placeholder="YY" class="border p-2 w-1/3 rounded text-cyan-950" />
          </div>
        </div>

        <div class="mb-6">
          <label class="font-medium text-black">Nama Orderan</label>
          <input v-model="noteText" class="border p-2 w-full rounded mt-1 text-cyan-950" placeholder="Tulis nama pesanan..." />
        </div>

        <div class="flex justify-end gap-3">
          <button @click="closeModal" class="px-4 py-2 rounded text-sm font-semibold bg-gray-400">Batal</button>
          <button @click="saveNoteFromForm" class="text-white px-4 py-2 rounded text-sm font-semibold hover:bg-cyan-700 bg-cyan-950">
            Tambah
          </button>
        </div>
      </div>
    </div>

      <!-- Deadline Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DeadlineCard
          v-for="(deadline, index) in deadlines"
          :key="index"
          :deadline="deadline"
          @edit="editDeadline(index)"
          @delete="deleteDeadline(index)"
        />
      </div>
    </div>

    <!-- Right Side: Notifications -->
    <div class="w-1/5 flex flex-col gap-4 mt-4 mr-4">
      <!-- Notifikasi -->
      <div class="bg-white rounded-2xl shadow-md p-4 h-80">
        <h3 class="font-bold text-cyan-950">NOTIFIKASI</h3>
        <p class="text-sm text-gray-600 mt-2">Belum ada notifikasi baru.</p>
      </div>


      <!-- Kalender Deadline -->
      <div class="bg-white rounded-2xl shadow-md pb-5 h-auto">
        <h3 class="font-bold text-cyan-950 mb-2">DEADLINE</h3>
        <div class="cally bg-base-100 border border-base-300 shadow-lg rounded-box w-full p-4">
          <div class="flex justify-between items-center mb-2">
            <button @click="prevMonth">
              <svg class="fill-current size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
              </svg>
            </button>
            <h3 class="text-cyan-950 text-sm font-semibold">{{ currentMonthName }} {{ currentYear }}</h3>
            <button @click="nextMonth">
              <svg class="fill-current size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
              </svg>
            </button>
          </div>
            <CalendarMonth
              :notes="notes"
              :current-month="currentMonth"
              :current-year="currentYear"
              @date-clicked="handleDateClick"
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'
import CalendarMonth from '@/components/CalendarMonth.vue'

const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const notes = ref({})

const showModal = ref(false)
const noteText = ref('')
const monthInput = ref('')
const dayInput = ref('')
const yearInput = ref('')

function handleDateClick(date) {
  dayInput.value = String(date.day).padStart(2, '0')
  monthInput.value = String(date.month).padStart(2, '0')
  yearInput.value = String(date.year).slice(-2)
  showModal.value = true
}

function openModal() {
  noteText.value = ''
  monthInput.value = ''
  dayInput.value = ''
  yearInput.value = ''
  showModal.value = true
}

function closeModal() {
  showModal.value = false
}

function saveNoteFromForm() {
  const mm = parseInt(monthInput.value)
  const dd = parseInt(dayInput.value)
  const yy = parseInt(yearInput.value)

  if (!mm || !dd || !yy || !noteText.value) {
    alert('Mohon lengkapi semua field.')
    return
  }

  const fullYear = yy < 100 ? 2000 + yy : yy
  const dateKey = `${fullYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
  notes.value[dateKey] = noteText.value
  closeModal()
}

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

const currentMonthName = computed(() =>
  new Date(currentYear.value, currentMonth.value).toLocaleString('default', { month: 'long' })
)
</script>
