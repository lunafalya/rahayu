<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar />

      <!-- Income -->
        <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
          <div class="bg-white rounded-2xl shadow-md flex-grow p-6 max-h-[90vh] overflow-y-auto">

          
              <!-- WALLET  -->
              <div class="bg-white rounded-2xl p-6 shadow-lg w-full">
            <h2 class="text-3xl font-bold mb-4 text-cyan-950">MY WALLET</h2>
            <div class="mb-6">
              <p class="text-sm text-gray-300">Available Balance</p>
              <p v-if="balance == null" class="skeleton h-9 w-56 mt-1 bg-gray-800"></p>
              <p v-else class="text-3xl font-bold mt-1 text-black">Rp. {{ Intl.NumberFormat('id-ID').format(balance) }}</p>
            </div>
        
            <div class="flex gap-4 mb-6">
              <div class="flex items-center gap-2 bg-white rounded-xl px-4 py-2 shadow">
                <div class="bg-yellow-500 p-2 rounded-full">
                  <svg class="w-4 h-4 text-cyan-950 rotate-45" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 5v10m0 0l5-5m-5 5l-5-5" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs text-gray-400">Expense</p>
                  <p class="text-sm font-semibold text-cyan-950"></p>
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
                  <p class="text-sm font-semibold text-cyan-950"></p>
                </div>
              </div>
            </div>
        
            <div>
        <div class="flex justify-between items-center mb-3">
          <h3 class="font-semibold text-cyan-950">Recent Transactions</h3>
        </div>
        <ul class="space-y-3 text-sm">
          <li class="flex justify-between items-center">
            <div>
              <p class="font-semibold text-cyan-950">PT SINGASANA</p>
              <p class="text-gray-400 text-xs">22.23 20/04/2025</p>
            </div>
            <p class="text-orange-400">Rp. 240.000 ↑</p>
          </li>

        </ul>
      </div>
    </div>


      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import SideBar from '@/components/SideBar.vue'


const search = ref('')
const showModal = ref(false)
const showDetailModal = ref(false)
const detailData = ref({})
const isEdit = ref(false)
const inList = ref([])

const inForm = ref({
  pengirim: '',
  transaksi: '',
  vac: '',
  keterangan: '',
  tanggalMasuk: '',
  status: '',
  imageUrl: ''
})


function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      inForm.value.imageUrl = reader.result
    }
    reader.readAsDataURL(file)
  }
}


function addIncome() {
  inList.value.push({
    ...inForm.value,
    total_masuk: '',
    tanggal_kirim: inForm.value.tanggalMasuk,
    nama: inForm.value.pengirim,
    bank: inForm.value.transaksi,
    va: inForm.value.vac
  })
  resetForm()
}

function updateIncome() {
  // logika update data bisa disesuaikan
  resetForm()
}

function resetForm() {
  inForm.value = {
    pengirim: '',
    transaksi: '',
    vac: '',
    keterangan: '',
    tanggalMasuk: '',
    status: ''
  }
  inForm.imageUrl = ''
  showModal.value = false
  isEdit.value = false
}

const filteredList = computed(() => {
  if (!search.value) return inList.value
  return inList.value.filter(item =>
    item.keterangan.toLowerCase().includes(search.value.toLowerCase()) ||
    item.nama?.toLowerCase().includes(search.value.toLowerCase())
  )
})

function totalHargaFormat(total_masuk) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(total_masuk)
}

function showDetail(item) {
  detailData.value = item
  showDetailModal.value = true
}
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
      balance: null
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
  },
  mounted() {
    this.fetchBalance();
  },
}
</script>