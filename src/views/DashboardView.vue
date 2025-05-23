<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Main Content -->
    <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
      <div class="flex flex-col items-start pt-6 w-full space-y-6">
        
        <!-- Wallet Section -->
        <div class="bg-white text-cyan-950 rounded-2xl p-6 shadow-lg w-full">
          <h2 class="font-poppins text-3xl font-bold mb-4 text-cyan-950">REKENING</h2>
          <div class="mb-6">
            <p class="text-sm text-gray-300">Saldo Tersedia</p>
            <p v-if="balance == null" class="skeleton h-9 w-56 mt-1 bg-gray-800"></p>
            <p v-else class="text-3xl font-bold mt-1 text-cyan-950">
              Rp. {{ Intl.NumberFormat('id-ID').format(balance) }}
            </p>
          </div>

          <!-- Income & Expense -->
          <div class="flex gap-4 mb-6">
            <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow">
              <div class="bg-red-400 p-2 rounded-full">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400">Pengeluaran</p>
              </div>
            </div>
            <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow">
              <div class="bg-blue-400 p-2 rounded-full">
                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400">Pemasukan</p>
              </div>
            </div>
          </div>

          <!-- Transactions -->
          <div>
            <div class="flex justify-between items-center mb-3">
              <h3 class="font-semibold text-cyan-950">Riwayat Transaksi</h3>
              <router-link to="/income" class="text-sm text-blue-400 hover:underline">Lihat Semua</router-link>
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
            <h2 class="text-xl font-bold text-cyan-950">MAP</h2>

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
    <div v-if="showModal" class="fixed inset-0 bg-[rgba(0,0,0,0.43)] flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h3 class="text-xl font-semibold text-center mb-6 text-black">
        {{ modalNote ? 'Detail Deadline' : 'Tambah Deadline Baru' }}
      </h3>

      <!-- Tampilkan detail jika ada note -->
      <div v-if="modalNote" class="text-cyan-950 space-y-2">
        <p><strong>Nama Pesanan:</strong> {{ modalNote }}</p>
        <p><strong>Tenggat Waktu:</strong> {{ selectedDate }}</p>
        <div class="flex justify-end mt-4">
          <button @click="closeModal" class="px-4 py-2 bg-cyan-950 text-white rounded hover:bg-cyan-700">Tutup</button>
        </div>
      </div>

      <!-- Jika tidak ada data, tampilkan form -->
      <div v-else>
        <!-- Form input tanggal dan note -->
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
          <button @click="closeModal" class="px-4 py-2 rounded text-sm text-white font-semibold bg-gray-400">Batal</button>
          <button @click="saveNoteFromForm" class="text-white px-4 py-2 rounded text-sm font-semibold hover:bg-cyan-700 bg-cyan-950">
            Tambah
          </button>
        </div>
      </div>
    </div>
    </div>
      </div>

        

    <!-- Right Side: Notifications -->
    <div class="w-1.5/5 flex flex-col gap-4 mt-4 mr-5">
      <!-- Notifikasi -->
      <div class="bg-white rounded-2xl shadow-md p-4 h-80">
        <h3 class="font-bold text-cyan-950">NOTIFIKASI</h3>
        <p class="text-sm text-gray-400 mt-2">Belum ada notifikasi baru.</p>
      </div>


      <!-- Kalender Deadline -->
      <div class="bg-white rounded-2xl shadow-md pb-5 h-auto">
        <h3 class="font-bold m-3 text-cyan-950">KALENDAR</h3>
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
import 'leaflet/dist/leaflet.css';
import SideBar from '@/components/SideBar.vue'
import CalendarMonth from '@/components/CalendarMonth.vue'
</script>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
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
      selectedDate: '',
      modalNote: ''
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
    fetchTransactions() {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('https://great-distinctly-seasnail.ngrok-free.app/api/ewallet/transactions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.transactions = response.data; // Assuming the API returns transactions in this format
          console.log(this.transactions);
        })
        .catch(error => {
          console.error('Error fetching transactions:', error);
          alert('Failed to fetch transactions. Please try again later.');
        });
      }
    },
    selectCity(city) {
      this.selectedCity = city;
      this.showDropdown = false;
      // Tambahkan logika map jika diperlukan
    },
    handleDateClick(date) {
      const dateKey = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`
      const note = this.notes[dateKey]

      if (note) {
        this.modalNote = note
        this.selectedDate = dateKey
      } else {
        this.noteText = ''
        this.monthInput = String(date.month).padStart(2, '0')
        this.dayInput = String(date.day).padStart(2, '0')
        this.yearInput = String(date.year).slice(-2)
        this.modalNote = ''
      }

      this.showModal = true
    },
    closeModal() {
      this.showModal = false
      this.modalNote = ''
      this.selectedDate = ''
    },
    openModal() {
      this.noteText = ''
      this.monthInput = ''
      this.dayInput = ''
      this.yearInput = ''
      this.showModal = true
    },
    saveNoteFromForm() {
      const mm = parseInt(this.monthInput)
      const dd = parseInt(this.dayInput)
      const yy = parseInt(this.yearInput)

      if (!mm || !dd || !yy || !this.noteText) {
        alert('Mohon lengkapi semua field.')
        return
      }

      const fullYear = yy < 100 ? 2000 + yy : yy
      const dateKey = `${fullYear}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`
      this.notes[dateKey] = this.noteText
      this.closeModal()
    },
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear -= 1
      } else {
        this.currentMonth -= 1
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear += 1
      } else {
        this.currentMonth += 1
      }
    }
  },
  mounted() {
    this.fetchBalance();
  },
  computed: {
    currentMonthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' })
    }
  },
};
</script>

