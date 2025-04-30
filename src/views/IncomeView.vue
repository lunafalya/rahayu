<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar />

<!-- Income -->
  <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
    <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
    <div class="karyawan-page">      
        <div class="flex mt-8 justify-between pb-6">
            <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-cyan-950 border px-3" />
          <button @click="showModal=true" class="btn shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
          Filter
        </button>
      </div>

<!-- Tabel Data Pemasukan -->
<div class="overflow-x-auto rounded-box border border-base-content/5 bg-cyan-950">
    <table class="table">
        <thead>
          <tr>
            <th class="text-white">No.</th>
            <th class="text-white">Tanggal</th>
            <th class="text-white">Keterangan Pemasukan</th>
            <th class="text-white">Jumlah</th>
            <th class="text-white">Aksi</th>
          </tr>
        </thead>
          <tbody>
            <tr v-for="(item, index) in gajiList" :key="index">
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.tanggal_kirim}}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.keterangan}}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{totalHargaFormat(item.total_gaji) }}</td>
              <td>
                <button @click="showDetail(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Detail</button>
              </td>
            </tr>
          </tbody>
      </table>
</div>

        <!-- Modal Detail -->
          <div class="modal-overlay" v-if="showDetailModal">
            <div class="modal-content max-w-xl w-full bg-white p-6 rounded-lg shadow-lg relative">
              <button class="absolute top-2 right-2 text-gray-500" @click="showDetailModal = false">✕</button>
              <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Detail Pemasukan</h2>
              <h1 class="text-3xl font-bold mb-4">Jumlah: {{ totalHargaFormat(detailData.jumlah) }}</h1>
              <p><strong>Pengirim :</strong> {{ detailData.nama }}</p>
              <p><strong>Bank Pengirim :</strong> {{ detailData.bank }}</p>
              <p><strong>No rek :</strong> {{ detailData.va }}</p>
              <p><strong>Keterangan:</strong> {{ detailData.keterangan }}</p>
              <p><strong>Tanggal:</strong> {{ detailData.tanggal_kirim }}</p>
              <p><strong>Status:</strong> {{ detailData.status }}</p>
            </div>
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

// Dummy data (replace with API later)
const gajiList = ref([
  {
    tanggal_kirim: '2025-04-30',
    keterangan: 'Penjualan produk A',
    jumlah: 150000,
    nama: 'Andi',
    bank: 'BCA',
    va: '1234567890',
    status: 'Sukses'
  },
  {
    tanggal_kirim: '2025-04-29',
    keterangan: 'Penjualan produk B',
    jumlah: 300000,
    nama: 'Budi',
    bank: 'BRI',
    va: '0987654321',
    status: 'Sukses'
  }
])

const filteredList = computed(() => {
  if (!search.value) return gajiList.value
  return gajiList.value.filter(item =>
    item.keterangan.toLowerCase().includes(search.value.toLowerCase()) ||
    item.nama?.toLowerCase().includes(search.value.toLowerCase())
  )
})

function totalHargaFormat(jumlah) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(jumlah)
}

function showDetail(item) {
  detailData.value = item
  showDetailModal.value = true
}
</script>