<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar />

    <!-- Main Content -->
    <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
      <div class="flex flex-col items-start w-full space-y-6">
        
        <!-- Wallet Section -->
        <div class="bg-white text-cyan-950 rounded-2xl p-6 shadow-lg w-full">
          <h2 class="font-poppins text-3xl font-bold mb-4 text-cyan-950" style="font-family: 'Poppins', sans-serif;">REKENING</h2>
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
              <h3 class="font-semibold text-cyan-950" style="font-family: 'Poppins', sans-serif;">Riwayat Transaksi</h3>
              <router-link to="/income" class="text-sm text-blue-400 hover:underline" style="font-family: 'Poppins', sans-serif;">Lihat Semua</router-link>
            </div>
            <div v-if="transactions.length != 0">
              <ul class="space-y-3 text-sm">
                <li v-for="(transaction,index) in transactions.data.slice(0,7)" :key="index" class="flex justify-between items-center">
                  <div>
                    <p class="font-semibold text-cyan-950">{{ transaction.channel_category }} - <span v-if="transaction.status === 'SUCCESS'" class="text-green-400">{{ transaction.status }}</span> <span v-else>{{ transaction.status }}</span></p>
                    <p class="text-gray-400 text-xs">{{ Intl.DateTimeFormat('id-ID', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(transaction.updated)) }}</p>
                  </div>
                  <p v-if="transaction.cashflow === 'MONEY_OUT'" class="text-orange-400">Rp. {{ Intl.NumberFormat('id-ID').format(transaction.amount) }} ↑</p>
                  <p v-else class="text-blue-400" style="font-family: 'Poppins', sans-serif;">Rp. {{ Intl.NumberFormat('id-ID').format(transaction.amount) }} ↓</p>
                </li>
              </ul>
            </div>
            <div v-else>
              <li v-for="n in 6" :key="n" class="flex justify-between items-center">
                  <div>
                    <p class="skeleton h-6 w-32 bg-gray-800 my-2"></p>
                    <p class="skeleton h-4 w-24 bg-gray-800"></p>
                  </div>
                  <p class="skeleton h-6 w-24 bg-gray-800"></p>
                </li>
            </div>
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
      <div v-if="modalNote" class="text-cyan-950 space-y-2" style="font-family: 'Poppins', sans-serif;">
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
              <label class="text-cyan-950 pr-6" style="font-family: 'Poppins', sans-serif;">Tenggat Waktu</label>
              <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="form.tanggal" type="date" />
        </div>

        <div class="mb-6">
          <label class="font-medium text-black" style="font-family: 'Poppins', sans-serif;">Catatan</label>
          <input v-model="noteText" class="border p-2 w-full rounded mt-1 text-cyan-950" style="font-family: 'Poppins', sans-serif;" placeholder="Tulis nama pesanan..." />
        </div>

        <div class="flex justify-end gap-3">
          <button @click="closeModal" style="font-family: 'Poppins', sans-serif;" class="px-4 py-2 rounded text-sm text-white font-semibold bg-gray-400">Batal</button>
          <button @click="saveNoteFromForm" style="font-family: 'Poppins', sans-serif;" class="text-white px-4 py-2 rounded text-sm font-semibold hover:bg-cyan-700 bg-cyan-950">
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
        <h3 class="font-bold text-cyan-950" style="font-family: 'Poppins', sans-serif;">NOTIFIKASI</h3>
        <p class="text-sm text-gray-400 mt-2" style="font-family: 'Poppins', sans-serif;">Belum ada notifikasi baru.</p>
      </div>


      <!-- Kalender Deadline -->
      <div class="bg-white rounded-2xl shadow-md pb-5 h-auto">
        <h3 class="font-bold m-3 text-cyan-950" style="font-family: 'Poppins', sans-serif;">KALENDER</h3>
        <div class="cally rounded-box w-full p-4">
          <div class="flex justify-between items-center mb-2">
            <button @click="prevMonth">
              <svg class="fill-current size-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path fill="currentColor" d="M15.75 19.5 8.25 12l7.5-7.5"></path>
              </svg>
            </button>
            <h3 class="text-sm font-semibold text-cyan-950 hover:text-white" style="font-family: 'Poppins', sans-serif;">{{ currentMonthName }} {{ currentYear }}</h3>
            <button @click="nextMonth">
              <svg class="fill-current size-4 text-cyan-950 hover:text-white" style="font-family: 'Poppins', sans-serif;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
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
      form: {
      tanggal: ''
    },
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      showModal: false,
      noteText: '',
      tanggal:'',
      monthInput: '',
      dayInput: '',
      yearInput: '',
      notes: {},
      balance: null,
      showDropdown: false,
      selectedCity: "",
      cities: ["Bogor", "Bekasi", "Cirebon", "Bandung", "Sukabumi"],
      selectedDate: '',
      modalNote: '',
      transactions: []
    };
  },
  methods: {
    fetchBalance() {
      const token = localStorage.getItem('token');
      if (token) {
        axios.get('https://api.rahayu-konveksi.ydns.eu/api/ewallet/balance', {
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
        axios.get('https://api.rahayu-konveksi.ydns.eu/api/ewallet/transactions', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        .then(response => {
          this.transactions = response.data; // Assuming the API returns transactions in this format
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
      const dateKey = `${date.year}-${String(date.month).padStart(2, '0')}-${String(date.day).padStart(2, '0')}`;
      const note = this.notes[dateKey];

      this.form.tanggal = dateKey;
      this.noteText = note || '';
      this.modalNote = note || '';
      this.selectedDate = dateKey;

      const [year, month, day] = dateKey.split('-');
      this.yearInput = year;
      this.monthInput = month;
      this.dayInput = day;

      this.showModal = true;
    },
    closeModal() {
      this.showModal = false
      this.modalNote = ''
      this.selectedDate = ''
    },
    openModal() {
      this.noteText = ''
      this.tanggal= ''
      this.monthInput = ''
      this.dayInput = ''
      this.yearInput = ''
      this.showModal = true
    },
    saveNoteFromForm() {
      if (!this.form.tanggal || !this.noteText) {
        alert('Mohon lengkapi semua field.');
        return;
      }

      const [year, month, day] = this.form.tanggal.split('-');
      const dateKey = `${year}-${month}-${day}`;

      this.notes[dateKey] = this.noteText;
      this.closeModal();
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
    this.fetchTransactions();
  },
  computed: {
    currentMonthName() {
      return new Date(this.currentYear, this.currentMonth).toLocaleString('default', { month: 'long' })
    }
  },
  watch: {
  'form.tanggal'(newVal) {
    if (newVal) {
      const [year, month, day] = newVal.split('-');
      this.yearInput = year;
      this.monthInput = month;
      this.dayInput = day;
    }
  }
},
};
</script>

