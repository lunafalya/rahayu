<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar />

      <!-- Income -->
        <div class="ml-30 w-full p-8 px-6 pt-12 flex gap-6">
          <div class="bg-white rounded-2xl shadow-md p-6 h-full w-full">

          
          <!-- WALLET  -->
          <div class="bg-white rounded-2xl p-6 shadow-lg h-full w-full">
            <h2 class="text-3xl font-bold mb-4 text-cyan-950">REKENING</h2>
            <div class="mb-6">
              <p class="text-sm text-gray-300">Saldo Tersedia</p>
              <p v-if="balance == null" class="skeleton h-9 w-56 mt-1 bg-gray-800"></p>
              <p v-else class="text-3xl font-bold mt-1 text-black">Rp. {{ Intl.NumberFormat('id-ID').format(balance) }}</p>
            </div>
        
            <div class="flex gap-4 mb-6">
              <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow">
                <div class="bg-red-400 p-2 rounded-full">
                    <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l6 6m-6-6l-6 6" />
                    </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-400">Pengeluaran</p>
                  <p class="text-sm font-semibold text-cyan-950"></p>
                </div>
              </div>
              <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow">
                <div class="bg-blue-400 p-2 rounded-full">
                  <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 5v14m0 0l-6-6m6 6l6-6" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-400">Pemasukan</p>
                  <p class="text-sm font-semibold text-cyan-950"></p>
                </div>
              </div>
            </div>
          <div>
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-cyan-950">Riwayat Transaksi</h3>
          </div>
          <div v-if="transactions.length != 0" class="overflow-y-auto max-h-[45vh]">
            <ul v-for="(transaction, index) in transactions.data" :key="index" class="text-sm m-2">
              <li class="flex justify-between items-center">
                <div>
                  <p class="font-semibold text-cyan-950">{{ transaction.channel_category }} - <span v-if="transaction.status === 'SUCCESS'" class="text-green-400">{{ transaction.status }}</span> <span v-else>{{ transaction.status }}</span></p>
                  <p class="text-gray-400 text-xs">{{ Intl.DateTimeFormat('id-ID', {year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'}).format(new Date(transaction.updated)) }}</p>
                </div>
                <p v-if="transaction.cashflow === 'MONEY_OUT'" class="text-orange-400">Rp. {{ Intl.NumberFormat('id-ID').format(transaction.amount) }} ↑</p>
                <p v-else class="text-blue-400">Rp. {{ Intl.NumberFormat('id-ID').format(transaction.amount) }} ↓</p>
              </li>
            </ul>
          </div>
          <div v-else class="flex justify-center items-center h-full">
            <p class="text-gray-400">Tidak ada transaksi</p>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/SideBar.vue'
</script>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      balance: null,
      transactions: []
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
          this.balance = response.data.balance; // Assuming the API returns balance in this format
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
  },
  mounted() {
    this.fetchBalance();
    this.fetchTransactions();
  },
}
</script>