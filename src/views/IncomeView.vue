<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar />

<!-- Income -->
  <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
    <div class="bg-cyan-950 rounded-2xl shadow-md flex-grow p-6">
    <div class="karyawan-page">      
      <div class="flex justify-between items-center mt-8 pb-6">
  <!-- Search Bar di kiri -->
  <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-white border px-3 py-2" />

  <!-- Filter dan Tambah di kanan -->
  <div class="flex space-x-3">
    <button class="btn border-0 shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-700 text-white">Filter</button>
    <button @click="showModal = true" class="btn border-0 shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-700 text-white">Tambah</button>
  </div>
</div>

<!-- Tabel Data Pemasukan -->
<div class="overflow-x-auto rounded-box border border-base-content/5 bg-cyan-700">
    <table class="table">
        <thead>
          <tr>
            <th class="text-white">No.</th>
            <th class="text-white">Tanggal</th>
            <th class="text-white">Keterangan Pemasukan</th>
            <th class="text-white">Nominal</th>
            <th class="text-white">Aksi</th>
          </tr>
        </thead>
          <tbody class="bg-cyan-600 text-white px-4 py-2">
            <tr v-for="(item, index) in filteredList" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ item.tanggal_kirim}}</td>
              <td>{{ item.keterangan}}</td>
              <td>{{totalHargaFormat(item.total_masuk) }}</td>
              <td>
                <button @click="showDetail(item)" class="btn btn-sm border-0 hover:bg-gray-300 hover:text-cyan-950 bg-cyan-700 text-white">Detail</button>
              </td>
            </tr>
          </tbody>
      </table>
</div>

      <!-- Modal Form -->
      <transition name="fade">
        <div class="modal-overlay" v-if="showModal">
        <div class="modal-content">
          <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Tambah Pemasukan</h2>
          <label class="font-medium text-cyan-950">Pengirim</label>
          <input v-model="inForm.pengirim" type="text" placeholder="Nama Pengirim" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />

          <label class="font-medium text-cyan-950">Transaksi</label>
          <select v-model="inForm.transaksi" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
            <option class="text-cyan-950" disabled value="">Pilih Jenis Transaksi</option>
            <option class="text-cyan-950">Transfer</option>
            <option class="text-cyan-950">Qris</option>
            <option class="text-cyan-950">Cash</option>
          </select>

          <label class="font-medium text-cyan-950">Virtual Account</label>
          <input v-model="inForm.vac" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>

          <label class="font-medium text-cyan-950">Nominal</label>
          <input v-model="inForm.total_masuk" type="number" placeholder="Total Masuk" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />

          <label class="font-medium text-cyan-950">Bukti</label>
          <input type="file" @change="handleImageUpload" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />

          <div v-if="inForm.imageUrl" class="flex justify-center mb-4">
          <img :src="inForm.imageUrl" alt="Preview" class="w-24 h-24 rounded-full object-cover border" />
          </div>

          <label class="font-medium text-cyan-950">Keterangan</label>
          <input v-model="inForm.keterangan" type="text" placeholder="Keterangan" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />

          <label class="text-cyan-950 pr-6">Tanggal</label>
          <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="inForm.tanggalMasuk" type="date" />

          <label class="font-medium text-cyan-950">Status</label>
          <select v-model="inForm.status" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
            <option class="text-cyan-950" disabled value="">Pilih Status</option>
            <option>Sukses</option>
            <option>Gagal</option>
          </select>

          <div class="flex justify-end space-x-2">
            <button @click="resetForm" class="btn bg-gray-500 text-white">Batal</button>
            <button v-if="!isEdit" @click="addIncome" class="btn bg-cyan-950 text-white">Simpan</button>
            <button v-else @click="updateIncome" class="btn bg-cyan-950 text-white">Update</button>
          </div>

        </div>
      </div>
  </transition>
      


        <!-- Modal Detail -->
          <div class="modal-overlay" v-if="showDetailModal">
            <div class="modal-content max-w-xl w-full bg-white p-6 rounded-lg shadow-lg relative">
              <button class="absolute top-2 right-2 text-gray-500" @click="showDetailModal = false">✕</button>
              <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Detail Pemasukan</h2>
              <h1 class="text-3xl font-bold mb-4 text-cyan-950">Nominal: {{ totalHargaFormat(detailData.total_masuk) }}</h1>
              <p class="text-cyan-950"><strong>Pengirim :</strong> {{ detailData.nama }}</p>
              <p class="text-cyan-950"><strong>Bank Pengirim :</strong> {{ detailData.bank }}</p>
              <p class="text-cyan-950"><strong>No rek :</strong> {{ detailData.va }}</p>
              <p class="text-cyan-950"><strong>Keterangan:</strong> {{ detailData.keterangan }}</p>
              <p class="text-cyan-950"><strong>Tanggal:</strong> {{ detailData.tanggal_kirim }}</p>
              <p class="text-cyan-950"><strong>Status:</strong> {{ detailData.status }}</p>
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