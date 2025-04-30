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
            <button class="shadow-lg" @click="tab = 'General'" :class="getTabClass('General')">Pengeluaran General</button>
            <button class="shadow-lg" @click="tab = 'Gaji'" :class="getTabClass('Gaji')">Gaji Karyawan</button>
            <button class="shadow-lg" @click="tab = 'Peminjaman'" :class="getTabClass('Peminjaman')">Peminjaman</button>
            </div>
            <button @click="openCategorySelector" class="btn shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
            Tambah
          </button>
        </div>

        <!-- Tabel General -->
        <table v-if="tab === 'General'" class="w-full text-left border">
          <thead>
            <tr>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2 shadow-lg">ID Pengeluaran</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2 shadow-lg">Jumlah</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2 shadow-lg">Keterangan</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2 shadow-lg">Tanggal</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2 shadow-lg">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in generalList" :key="index">
              <td class="bg-white border-cyan-200 text-cyan-950 px-4 py-2">{{ item.id_general }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{totalHargaFormat(item.jumlah) }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.keterangan }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.tanggal }}</td>
              <td>
                <button @click="editGeneral(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button>
                <button @click="showDetail(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Tabel Gaji -->
        <table v-if="tab === 'Gaji'" class="w-full text-left border">
          <thead>
            <tr>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">ID Karyawan</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Total Gaji</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Potongan</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Tanggal</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Status</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in gajiList" :key="index">
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.id_karyawan }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{totalHargaFormat(item.total_gaji) }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.potongan }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.tanggal_pengajuan }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.status }}</td>
              <td>
                <button @click="editGaji(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button>
                <button @click="showDetail(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Tabel Pinjam -->
        <table v-if="tab === 'Peminjaman'" class="w-full text-left border">
          <thead>
            <tr>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">ID Karyawan</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Nama</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Nominal</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Tanggal</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Status</th>
              <th class="overflow-x-auto text-white bg-cyan-950 px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in pinjamList" :key="index">
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.id_karyawan}}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.nama }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ totalHargaFormat(item.jumlah) }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.tanggal }}</td>
              <td class="bg-white text-cyan-950 px-4 py-2">{{ item.status }}</td>
              <td>
                <button @click="editPinjam(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button>
                <button @click="showDetail(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Modal Pilih Kategori -->
        <div class="modal-overlay" v-if="showCategoryModal">
          <div class="modal-content">
            <h2 class="text-xl font-bold text-cyan-950 mb-4">Pilih Kategori Pengeluaran</h2>
            <div class="flex gap-2 mb-4">
              <button class="btn hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white" @click="selectCategory('General')">General</button>
              <button class="btn hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white" @click="selectCategory('Gaji')">Gaji</button>
              <button class="btn hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white" @click="selectCategory('Peminjaman')">Peminjaman</button>
            </div>
            <button @click="showCategoryModal = false" class="mt-4 text-gray-500 hover:text-cyan-950">Batal</button>
          </div>
        </div>

        <!-- Modal Gaji -->
        <div class="modal-overlay" v-if="showGajiModal">
          <div class="modal-content max-w-xl w-full">
            <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Form Gaji Karyawan</h2>
            
            <label class="font-medium text-cyan-950">ID Karyawan</label>
            <select v-model="gajiForm.id_karyawan" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5">
              <option v-for="k in karyawanList" :key="k.id" :value="k.id">{{ k.id }} - {{ k.nama }}</option>
            </select>

            <label class="font-medium text-cyan-950">Transaksi</label>
            <select v-model="gajiForm.transaksi" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
              <option class="text-cyan-950" disabled value="">Pilih Jenis Transaksi</option>
              <option>Cash</option>
              <option>Transfer</option>
            </select>

            <label class="font-medium text-cyan-950">Virtual Account</label>
            <input v-model="gajiForm.vac" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>

            <label class="font-medium text-cyan-950">Total Gaji</label>
            <input v-model="gajiForm.total_gaji" type="number" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>

            <label class="font-medium text-cyan-950">Potongan Pinjaman</label>
            <input v-model="gajiForm.potongan" type="number" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>

            <label class="font-medium text-cyan-950">Tanggal Pengajuan</label>
            <input v-model="gajiForm.tanggal_pengajuan" type="date" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>

            <label class="font-medium text-cyan-950">Status</label>
            <select v-model="gajiForm.status" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5">
              <option>Lunas</option>
              <option>Tunggak</option>
            </select>

            <div class="flex justify-end gap-2">
              <button @click="resetGajiForm" class="btn bg-gray-500 text-white">Batal</button>
              <button v-if="!isEditGaji" @click="addGaji" class="btn bg-cyan-950 text-white">Simpan</button>
              <button v-else @click="updateGaji" class="btn bg-cyan-950 text-white">Update</button>
            </div>
          </div>
        </div>

        
        <!-- Modal General Form -->
        <div class="modal-overlay" v-if="showGeneralModal">
          <div class="modal-content">
            <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Tambah Pengeluaran</h2>

            <label class="text-cyan-950">ID Pengeluaran</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="generalForm.id_general" type="text" />
            
            <label class="text-cyan-950">Nama</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="generalForm.nama" type="text" />

            <label class="text-cyan-950">Bank Tujuan</label>
            <select v-model="generalForm.bank" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5">
              <option class="text-cyan-950" disabled value="">Pilih Bank</option>
              <option>BCA</option>
              <option>BNI</option>
              <option>BRI</option>
            </select>


            <label class="text-cyan-950">Virtual Account</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="generalForm.va" type="text" />

            <label class="font-medium text-cyan-950">Tanggal Pengeluaran</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="generalForm.tanggal" type="date" />

            <label class="text-cyan-950">Keterangan</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="generalForm.keterangan" type="text" />

            <label class="text-cyan-950">Jumlah</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="generalForm.jumlah" type="number" />

            <div class="flex justify-end space-x-2">
              <button @click="resetGeneralForm" class="btn bg-gray-500 text-white">Batal</button>
              <button v-if="!isEditGeneral" @click="addGeneral" class="btn bg-cyan-950 text-white">Simpan</button>
              <button v-else @click="updateGeneral" class="btn bg-cyan-950 text-white">Update</button>
            </div>
          </div>
        </div>

        <!-- Modal Pinjam Form -->
        <div class="modal-overlay" v-if="showPinjamModal">
          <div class="modal-content">
            <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Tambah Pengeluaran</h2>
            <label class="font-medium text-cyan-950">ID Karyawan</label>
            <select v-model="pinjamForm.id" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5">
              <option v-for="k in karyawanList" :key="k.id" :value="k.id">{{ k.id }} - {{ k.nama }}</option>
            </select>

            <label class="font-medium text-cyan-950">Nama Karyawan</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="pinjamForm.nama" type="text" />

            <label class="font-medium text-cyan-950">Transaksi</label>
            <select v-model="pinjamForm.bayar" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
              <option class="text-cyan-950" disabled value="">Pilih Jenis Transaksi</option>
              <option>Cash</option>
              <option>Transfer</option>
            </select>

            <label class="font-medium text-cyan-950">Virtual Account</label>
            <input v-model="pinjamForm.vc" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>

            <label class="text-cyan-950">Nominal</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="pinjamForm.jumlah" type="number" />

            <label class="font-medium text-cyan-950">Tanggal Pinjam</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="pinjamForm.tanggal" type="date" />

            <label class="font-medium text-cyan-950">Status</label>
            <select v-model="pinjamForm.status" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5">
              <option>Lunas</option>
              <option>Tunggak</option>
            </select>

            <div class="flex justify-end space-x-2">
              <button @click="resetPinjamForm" class="btn bg-gray-500 text-white">Batal</button>
              <button v-if="!isEditPinjam" @click="addPinjam" class="btn bg-cyan-950 text-white">Simpan</button>
              <button v-else @click="updatePinjam" class="btn bg-cyan-950 text-white">Update</button>
            </div>
          </div>
        </div>
      </div>


      


      <!-- Modal Detail -->
<div class="modal-overlay" v-if="showDetailModal">
  <div class="modal-content max-w-xl w-full">
    <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Detail {{ tab }}</h2>
    
    <div v-if="tab === 'General'">
      <h1 class="text-3xl font-bold mb-4">Jumlah: {{ totalHargaFormat(detailData.jumlah) }}</h1>
      <p><strong>ID Pengeluaran:</strong> {{ detailData.id_general }}</p>
      <p><strong>Penerima :</strong> {{ detailData.nama }}</p>
      <p><strong>Bank Tujuan :</strong> {{ detailData.bank }}</p>
      <p><strong>No rek :</strong> {{ detailData.va }}</p>
      <p><strong>Keterangan:</strong> {{ detailData.keterangan }}</p>
      <p><strong>Tanggal:</strong> {{ detailData.tanggal }}</p>
      <p><strong>Status:</strong> {{ detailData.status }}</p>
    </div>

    <div v-else-if="tab === 'Gaji'">
      <h1 class="text-3xl font-bold mb-4">Jumlah: {{ totalHargaFormat(detailData.total_gaji) }}</h1>
      <p><strong>ID Karyawan:</strong> {{ detailData.id_karyawan }}</p>
      <p><strong>Potongan:</strong> {{ detailData.potongan }}</p>
      <p><strong>Tanggal Pengajuan:</strong> {{ detailData.tanggal_pengajuan }}</p>
      <p><strong>Pembayaran:</strong> {{ detailData.transaksi }}</p>
      <p><strong>Rekening:</strong> {{ detailData.vac }}</p>
      <p><strong>Status:</strong> {{ detailData.status }}</p>
    </div>

    <div v-else-if="tab === 'Peminjaman'">
      <h1 class="text-3xl font-bold mb-4">Nominal: {{ totalHargaFormat(detailData.jumlah) }}</h1>
      <p><strong>ID Karyawan:</strong> {{ detailData.id_karyawan }}</p>
      <p><strong>Nama:</strong> {{ detailData.nama }}</p>
      <p>{{ detailData.va }}</p>
      <p><strong>Tanggal:</strong> {{ detailData.tanggal }}</p>
      <p><strong>Pembayaran:</strong> {{ detailData.bayar }}</p>
      <p><strong>Rekening:</strong> {{ detailData.vc }}</p>
      <p><strong>Status:</strong> {{ detailData.status }}</p>
    </div>

    <div class="flex justify-end mt-4">
      <button @click="showDetailModal = false" class="btn bg-gray-500 text-white">Tutup</button>
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
const tab = ref('General')
const showDetailModal = ref(false)
const showCategoryModal = ref(false)
const showGajiModal = ref(false)
const showGeneralModal = ref(false)
const showPinjamModal = ref(false)
const selectedDetail = ref({})

const gajiList = ref([]);
const isEditGaji = ref(false);
const editIndexGaji = ref(null);

const generalList = ref([]);
const isEditGeneral = ref(false);
const editIndexGeneral = ref(null);

const pinjamList = ref([]);
const isEditPinjam = ref(false);
const editIndexPinjam = ref(null);

const pengeluaranList = ref([])

const detailData= ref(null);


const form = ref({
  tanggal: '',
  kategori: '',
  keterangan: '',
  jumlah: null,
})

const karyawanList = ref([
  { id: 'K001', nama: 'Ani' },
  { id: 'K002', nama: 'Budi' },
  { id: 'K003', nama: 'Citra' }
])

// GAJI
const gajiForm = ref({
  id_karyawan: '',
  nama:'',
  total_gaji: 0,
  potongan: 0,
  tanggal_pengajuan: '',
  transaksi: '',
  vac: '',
  status: 'Lunas'
});


function addGaji() {
  gajiList.value.push({ ...gajiForm.value });
  resetGajiForm();
}

function editGaji(item) {
  gajiForm.value = { ...item }
  isEditGaji.value = true
  showGajiModal.value = true
  editIndexGaji.value = gajiList.value.indexOf(item)
}

function updateGaji() {
  if (editIndexGaji.value !== null) {
    gajiList.value[editIndexGaji.value] = { ...gajiForm.value };
  }
  resetGajiForm()
}

function resetGajiForm() {
  gajiForm.value = {
    id_karyawan: '',
    nama: '',
    total_gaji: 0,
    potongan: 0,
    tanggal_pengajuan: '',
    transaksi: '',
    vac: '',
    status: 'Lunas'
  };
  showGajiModal.value = false;
  isEditGaji.value = false
  editIndexGaji.value = null
}

function simpanGaji() {
  if (isEditGaji.value) {
    updateGaji();
  } else {
    // Simpan logika
    const newGaji = { ...gajiForm.value };
    gajiList.value.push(newGaji);
  }
  resetGajiForm();
}






// GENERAL

const generalForm = ref({
  id:'',
  kategori: '',
  jumlah: 0,
  tanggal: '',
  nama: '',
  bank: '',
  va: '',
  keterangan: '',
  status: 'sukses'
});

function addGeneral() {
  generalList.value.push({ ...generalForm.value });
  resetGeneralForm();
}

function resetGeneralForm() {
  generalForm.value = {
    id:'',
    kategori: '',
    jumlah: 0,
    tanggal: '',
    nama: '',
    bank: '',
    va: '',
    keterangan: '',
    status: 'sukses'
  };
  showGeneralModal.value = false;
  isEditGeneral.value = false
  editIndexGeneral.value = null
}


function simpanGeneral() {
  if (isEditGeneral.value) {
    updateGeneral();
  } else {
    const newGeneral = { ...generalForm.value };
    generalList.value.push(newGeneral);
  }
  resetGeneralForm();
}

function updateGeneral() {
  if (editIndexGeneral.value !== null) {
    generalList.value[editIndexGeneral.value] = { ...generalForm.value };
  }
  resetGeneralForm()
}

function editGeneral(item) {
  generalForm.value = { ...item }
  isEditGeneral.value = true
  showGeneralModal.value = true
  editIndexGeneral.value = generalList.value.indexOf(item)
}



// PINJAM
const pinjamForm = ref({
  id_karyawan: '',
  nama: '',
  jumlah: 0,
  tanggal: '',
  status: 'Tunggak'
});

function addPinjam() {
  pinjamList.value.push({ ...pinjamForm.value });
  resetPinjamForm();
}

function resetPinjamForm() {
  pinjamForm.value = {
    id_karyawan: '',
    nama: '',
    jumlah: 0,
    tanggal: '',
    status: 'Tunggak'
  };
  showPinjamModal.value = false;
  isEditPinjam.value = false
  editIndexPinjam.value = null
}

function simpanPinjam() {
  if (isEditPinjam.value) {
    updatePinjam();
  } else {
    const newPinjam = { ...pinjamForm.value };
    pinjamList.value.push(newPinjam);
  }
  resetPinjamForm();
}

function updatePinjam() {
  if (editIndexPinjam.value !== null) {
    pinjamList.value[editIndexPinjam.value] = { ...pinjamForm.value };
  }
  resetPinjamForm()
}

function editPinjam(item) {
  pinjamForm.value = { ...item }
  isEditPinjam.value = true
  showPinjamModal.value = true
  editIndexPinjam.value = pinjamList.value.indexOf(item)
}



function openCategorySelector() {
  showCategoryModal.value = true
}

function selectCategory(category) {
  tab.value = category;
  showCategoryModal.value = false;

  // Tampilkan modal berdasarkan kategori yang dipilih
  if (category === 'Gaji') {
    showGajiModal.value = true;
  } else if (category === 'General') {
    showGeneralModal.value = true;
  } else if (category === 'Peminjaman') {
    showPinjamModal.value = true;
  }
}

const filteredByCategory = computed(() => {
  return pengeluaranList.value.filter(
    p => p.kategori === tab.value && p.keterangan.toLowerCase().includes(search.value.toLowerCase())
  );
});


function getTabClass(currentTab) {
  return tab.value === currentTab ? 'btn bg-cyan-950 text-white' : 'btn bg-white text-cyan-950'
}

const uniqueCategories = computed(() => {
  return [...new Set(pengeluaranList.value.map(p => p.kategori))]
})

function showDetail(item) {
  this.detailData = item;
  this.showDetailModal = true;
}

// function openDetailModal(pengeluaran) {
//   selectedDetail.value = pengeluaran
//   showDetailModal.value = true
// }

// function closeDetail() {
//   showDetailModal.value = false
// }

// Tambahan: Fungsi format rupiah
function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID').format(angka)
}

function totalHargaFormat(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(value);
}

const totalHargaFormatted = computed(() => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(totalHarga.value);
  });
  
</script>