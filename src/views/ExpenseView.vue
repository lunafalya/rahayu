<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar />

    <!-- Expense -->
    <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
    <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
    <div class="karyawan-page">      
        <div class="flex mt-8 justify-between pb-6">
            <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-cyan-950 border px-3" />
      </div>
      

        <!-- Tab Buttons -->
        <div class="flex gap-4 mb-4">
            <div class="flex gap-2 mb-4">
            <button @click="tab = 'General'" :class="getTabClass('General')">Pengeluaran General</button>
            <button @click="tab = 'Gaji'" :class="getTabClass('Gaji')">Gaji Karyawan</button>
            <button @click="tab = 'Peminjaman'" :class="getTabClass('Peminjaman')">Peminjaman</button>
            </div>
            <button @click="showModal = true" class="btn hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
            Tambah
          </button>
        </div>



<!-- Table Pengeluaran Berdasarkan Tab -->
<div class="overflow-y-auto mt-4 pr-2" style="max-height: calc(100vh - 250px);">
  <h2 class="text-lg font-bold mb-2 text-cyan-950">Kategori: {{ tab }}</h2>
  <div class="overflow-x-auto rounded-box border border-base-content/5 bg-cyan-950">
    <table class="table">
      <thead>
        <tr>
          <th>No.</th>
          <th>Tanggal</th>
          <th>Keterangan</th>
          <th>Jumlah</th>
          <th>Transaksi</th>
          <th colspan="2">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white text-cyan-950">
        <tr v-for="(pengeluaran, index) in filteredByCategory" :key="index">
          <td>{{ index + 1 }}</td>
          <td>{{ pengeluaran.tanggal }}</td>
          <td>{{ pengeluaran.keterangan }}</td>
          <td>Rp. {{ formatRupiah(pengeluaran.jumlah) }}</td>
          <td>{{ pengeluaran.transaksi }}</td>
          <td>
            <button @click="editPengeluaran(pengeluaran)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button>
          </td>
          <td>
            <button @click="openDetailModal(pengeluaran)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Detail</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

        <!-- Modal Form -->
        <div class="modal-overlay" v-if="showModal">
          <div class="modal-content">
            <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Tambah Pengeluaran</h2>
            <label class="font-medium text-cyan-950">Tanggal Pengeluaran</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.tanggal" type="date" />

            <label class="font-medium text-cyan-950">Kategori Pengeluaran</label>
            <select v-model="form.kategori" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
              <option class="text-cyan-950" disabled value="">Pilih Kategori</option>
              <option class="text-cyan-950">General</option>
              <option class="text-cyan-950">Gaji</option>
              <option class="text-cyan-950">Peminjaman</option>
            </select>

            <label class="font-medium text-cyan-950">Transaksi</label>
            <select v-model="form.transaksi" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
              <option class="text-cyan-950" disabled value="">Pilih Jenis Transaksi</option>
              <option class="text-cyan-950">Transfer</option>
              <option class="text-cyan-950">Cash</option>
              <option class="text-cyan-950">Lainnya</option>
            </select>

            <label class="text-cyan-950">Keterangan</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.keterangan" type="text" />

            <label class="text-cyan-950">Jumlah</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="form.jumlah" type="number" />

            <div class="flex justify-end space-x-2">
              <button @click="resetForm" class="btn bg-gray-500 text-white">Batal</button>
              <button v-if="!isEdit" @click="addPengeluaran" class="btn bg-cyan-950 text-white">Simpan</button>
              <button v-else @click="updatePengeluaran" class="btn bg-cyan-950 text-white">Update</button>
            </div>
          </div>
        </div>
      </div>


      <!-- Modal Detail -->
<div class="modal-overlay" v-if="showDetailModal">
  <div class="modal-content max-w-xl w-full">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-cyan-950">Detail Transaksi</h2>
      <button @click="closeDetail" class="text-gray-500 hover:text-cyan-950">&times;</button>
    </div>
    <div class="text-sm text-gray-800 mb-4">
      <!-- <p><strong>Transaksi dikirim ke:</strong> {{ selectedDetail.nama }}</p> -->
      <p>Tanggal    : {{ selectedDetail.tanggal }}</p>
      <p>Keterangan : {{ selectedDetail.keterangan }}</p>
    </div>
    <div class="flex justify-between items-center border-y py-2 mb-2">
      <span class="text-lg font-bold text-cyan-950">Jumlah      : Rp. {{ formatRupiah(selectedDetail.jumlah) }}</span>
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
const tab = ref('general')
const showModal = ref(false)
const isEdit = ref(false)
const editIndex = ref(null)
const showDetailModal = ref(false)
const selectedDetail = ref({})

const pengeluaranList = ref([])

const form = ref({
  tanggal: '',
  kategori: '',
  keterangan: '',
  jumlah: null,
})


const filteredByCategory = computed(() => {
  return pengeluaranList.value.filter(
    p => p.kategori === tab.value && p.keterangan.toLowerCase().includes(search.value.toLowerCase())
  )
})

function getTabClass(category) {
  return tab.value === category
    ? 'btn bg-cyan-950 text-white'
    : 'btn bg-white text-cyan-950 border border-cyan-950'
}

const uniqueCategories = computed(() => {
  return [...new Set(pengeluaranList.value.map(p => p.kategori))]
})

function addPengeluaran() {
  pengeluaranList.value.push({ ...form.value })
  resetForm()
}

function editPengeluaran(item) {
  form.value = { ...item }
  isEdit.value = true
  showModal.value = true
  editIndex.value = pengeluaranList.value.indexOf(item)
}

function updatePengeluaran() {
  pengeluaranList.value[editIndex.value] = { ...form.value }
  resetForm()
}

function resetForm() {
  form.value = { tanggal: '', kategori: '', keterangan: '', jumlah: null }
  showModal.value = false
  isEdit.value = false
  editIndex.value = null
}

function openDetailModal(pengeluaran) {
  selectedDetail.value = pengeluaran
  showDetailModal.value = true
}

function closeDetail() {
  showDetailModal.value = false
}

// Tambahan: Fungsi format rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID').format(angka)
}
</script>

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