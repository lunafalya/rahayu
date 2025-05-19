<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Main Content -->
    <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
      <div class="flex flex-col items-start pt-6 w-full space-y-6">
        
        <!-- Wallet Section -->
        <div class="bg-white text-cyan-950 rounded-2xl p-6 shadow-lg w-full">
          <h2 class="text-2xl font-bold mb-4 text-cyan-950">My Wallet</h2>
          <div class="mb-6">
            <p class="text-sm text-gray-300">Available Balance</p>
            <p v-if="balance == null" class="skeleton h-9 w-56 mt-1 bg-gray-800"></p>
            <p v-else class="text-3xl font-bold mt-1 text-cyan-950">
              Rp. {{ Intl.NumberFormat('id-ID').format(balance) }}
            </p>
          </div>

          <!-- Income & Expense -->
          <div class="flex gap-4 mb-6">
            <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow">
              <div class="bg-yellow-500 p-2 rounded-full">
                <svg class="w-4 h-4 text-cyan-950 rotate-45" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 5v10m0 0l5-5m-5 5l-5-5" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400">Expense</p>
                <p class="text-sm font-semibold text-cyan-950">Rp. 240.000</p>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow">
              <div class="bg-blue-500 p-2 rounded-full">
                <svg class="w-4 h-4 text-cyan-950 -rotate-45" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 5v10m0 0l5-5m-5 5l-5-5" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400">Income</p>
                <p class="text-sm font-semibold text-cyan-950">Rp. 500.000</p>
              </div>
            </div>
          </div>

          <!-- Transactions -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-cyan-950">Recent Transactions</h3>
              <router-link to="/income" class="text-sm text-blue-400 hover:underline">View All</router-link>
            </div>
            <ul class="space-y-3 text-sm">
              <li class="flex justify-between items-center">
                <div>
                  <p class="font-semibold text-cyan-950">PT. SILATURAHMI</p>
                  <p class="text-gray-400 text-xs">12.05 WIB • 22/04/2025</p>
                </div>
                <p class="text-red-500">Rp. 240.000 ↑</p>
              </li>
              <li class="flex justify-between items-center">
                <div>
                  <p class="font-semibold text-cyan-950">LUNA FALYA ISKANDAR</p>
                  <p class="text-gray-400 text-xs">10.30 WIB • 19/04/2025</p>
                </div>
                <p class="text-cyan-400">Rp. 500.000 ↓</p>
              </li>
              <li class="flex justify-between items-center">
                <div>
                  <p class="font-semibold text-cyan-950">FALIANA ALIFIA</p>
                  <p class="text-gray-400 text-xs">21.53 WIB • 18/04/2025</p>
                </div>
                <p class="text-red-500">Rp. 32.030 ↑</p>
              </li>
              <li class="flex justify-between items-center">
                <div>
                  <p class="font-semibold text-cyan-950">PT. SILATURAHMI</p>
                  <p class="text-gray-400 text-xs">08.21 WIB • 14/04/2025</p>
                </div>
                <p class="text-cyan-400">Rp. 820.901 ↓</p>
              </li>
              <li class="flex justify-between items-center">
                <div>
                  <p class="font-semibold text-cyan-950">SD AMALINA</p>
                  <p class="text-gray-400 text-xs">16.17 WIB • 10/04/2025</p>
                </div>
                <p class="text-cyan-400">Rp. 201.500 ↓</p>
              </li>
            </ul>
          </div>
        </div>

      <!-- Map Section -->
        <div class="bg-white text-cyan-950 rounded-2xl p-6 shadow-lg w-full">
          <div class="flex mt-8 justify-between items-center pb-6 relative">
            <h2 class="text-xl font-bold text-cyan-950">Map Overview</h2>

            <!-- Button with Dropdown -->
            <div
              class="relative"
              @mouseenter="showDropdown = true"
              @mouseleave="showDropdown = false"
            >
              <button
                class="bg-white text-cyan-950 px-4 py-2 rounded-lg shadow hover:bg-cyan-950 hover:text-white transition"
              >
                Filter Kota
              </button>

              <!-- Dropdown Menu -->
              <div
                v-show="showDropdown"
                class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow z-10 border">
                <ul>
                  <li
                    v-for="city in cities"
                    :key="city"
                    @click="selectCity(city)"
                    class="px-4 py-2 hover:bg-cyan-100 cursor-pointer text-sm">
                    {{ city }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Map Content -->
          <div
            id="map"
            class="w-full h-64 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500"
          >
            Showing map for: <strong class="ml-1">{{ selectedCity || "All Cities" }}</strong>
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
    </div>

    <!-- Right Side: Notifications -->
    <div class="w-1/5 flex flex-col gap-4 mt-4 mr-4">
      <!-- Notifikasi -->
      <div class="bg-white rounded-2xl shadow-md p-4 h-80">
        <h3 class="font-bold text-cyan-950">NOTIFIKASI</h3>
        <p class="text-sm text-gray-400 mt-2">Belum ada notifikasi baru.</p>
      </div>


      <!-- Kalender Deadline -->
      <div class="bg-white rounded-2xl shadow-md pb-5 h-auto">
        <h3 class="font-bold m-3 text-cyan-950">DEADLINE</h3>
        <div class="cally rounded-box w-full p-4">
          <div class="flex justify-between items-center mb-2">
            <button @click="prevMonth">
              <svg class="fill-current size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
              </svg>
            </button>
            <h3 class="text-sm font-semibold text-cyan-950 hover:text-white">{{ currentMonthName }} {{ currentYear }}</h3>
            <button @click="nextMonth">
              <svg class="fill-current size-4 text-cyan-950 hover:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="m8.25 4.5 7.5 7.5-7.5 7.5"></path>
              </svg>
            </button>
          </div>
            <CalendarMonth
              :notes="notes"
              :current-month="currentMonth"
              :current-year="currentYear"
              @date-clicked="handleDateClick"
              class="w-full h-64"
            />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

import SideBar from '@/components/SideBar.vue'
import CalendarMonth from '@/components/CalendarMonth.vue'
import 'leaflet/dist/leaflet.css';



// Data
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())
const notes = ref({})
const showModal = ref(false)
const noteText = ref('')
const monthInput = ref('')
const dayInput = ref('')
const yearInput = ref('')
const balance = ref(null)

const showDropdown = ref(false)
const selectedCity = ref("")
const cities = ["Bogor", "Bekasi", "Cirebon", "Bandung", "Sukabumi"]

// Methods
function fetchBalance() {
  const token = localStorage.getItem('token')
  if (token) {
    axios.get('https://great-distinctly-seasnail.ngrok-free.app/api/ewallet/balance', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(response => {
      balance.value = response.data.balance
    })
    .catch(error => {
      console.error('Error fetching balance:', error)
      alert('Failed to fetch balance. Please try again later.')
    })
  }
}

function selectCity(city) {
  selectedCity.value = city
  showDropdown.value = false
  // Tambahkan logika untuk peta jika diperlukan
}



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

onMounted(() => {
  fetchBalance()
})
</script>

<script>
import axios from 'axios';


export default {
  data() {
    return {
      showModal: false,
      noteText: '',
      monthInput: '',
      dayInput: '',
      yearInput: '',
      notes: {},
      balance: null,
      showDropdown: false,
      selectedCity: "",
      cities: ["Bogor", "Bekasi", "Cirebon", "Bandung", "Sukabumi"],
    };
  },
  methods: {
    fetchBalance() {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('https://great-distinctly-seasnail.ngrok-free.app/api/ewallet/balance', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.balance = response.data.balance;
        })
        .catch(error => {
          console.error('Error fetching balance:', error);
          alert('Failed to fetch balance. Please try again later.');
        });
      }
    },
    selectCity(city) {
      this.selectedCity = city;
      this.showDropdown = false;
      // Tambahkan logika map jika diperlukan
    },
  },
  mounted() {
    this.fetchBalance();
  },
};
</script>

