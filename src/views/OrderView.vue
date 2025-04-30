<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar />

  <!-- Order -->
  <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
  <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
  <div class="order-page">
    <div class="flex mt-8 justify-between pb-6">
        <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-cyan-950 border px-3" />
        <button @click="showModal=true" class="btn shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
        Tambah
      </button>
    </div>

     <!-- Tabel Data Karyawan -->
     <div class="overflow-x-auto rounded-box border border-base-content/5 bg-cyan-950">
      <table class="table">
      <thead>
        <tr>
          <th class="text-white">No.</th>
          <th class="text-white">Nama Pemesan</th>
          <th class="text-white">Deadline</th>
          <th class="text-white">DP</th>
          <th class="text-white">Aksi</th>
        </tr>
      </thead>
      <tbody class="bg-white text-cyan-950">
          <tr v-for="(order, index) in filteredorder" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ order.namaPemesan }}</td>
            <td >{{ order.tanggalPengeluaran }}</td>
            <td>{{ totalHargaFormat(order.totalHarga) }}</td>
            <td><button @click="editKaryawan(index)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button></td>
            
          </tr>
      </tbody>
    </table>
    </div>

    <!-- OrderModal -->
    <div class="modal-overlay " v-if="showModal">
    <div class="modal-content">
    <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Tambah Pesanan</h2>
  
    <label class="text-cyan-950">Nama Pemesan:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.namaPemesan" type="text" placeholder="Nama Pemesan" />

    <label class="text-cyan-950">Nomor Pesanan:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.nomorPesanan" type="text" placeholder="Nomor Pesanan" />

    <label class="text-cyan-950">Jenis Produk:</label>
    <select class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.jenisProduk">
      <option class="text-cyan-950" disabled value="">Pilih Jenis Produk</option>
      <option>Kaos</option>
      <option>Almamater</option>
      <option>Seragam Jas</option>
      <option>Jaket</option>
      <option>Jersey</option>
    </select>

    <label class="text-cyan-950">Jumlah Produk:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="form.jumlahProduk" type="number" placeholder="Jumlah Produk" />

    <label class="text-cyan-950">Extra:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.extra" type="text" placeholder="Extra" />

    <label class="text-cyan-950">Total Harga:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"  v-model.number="form.hargaPerBaju" type="number" placeholder="Harga per Baju" />

    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" :value="totalHargaFormatted" type="text" placeholder="Total Seluruh Harga" disabled />

    <div class="ukuran-group">
      <label class="text-cyan-950">Ukuran:</label>
      <br>
      <label class="text-cyan-950 pr-9">S</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="form.ukuran.S" type="number" placeholder="S" />
      <br>
      <label class="text-cyan-950 pr-7">M</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="form.ukuran.M" type="number" placeholder="M" />
      <br>
      <label class="text-cyan-950 pr-9">L</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="form.ukuran.L" type="number" placeholder="L" />
      <br>
      <label class="text-cyan-950 pr-7">XL</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="form.ukuran.XL" type="number" placeholder="XL" />
      <br>
      <label class="text-cyan-950 pr-5">XXl</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="form.ukuran.XXL" type="number" placeholder="XXL" />
      <br>
      <label class="text-cyan-950 pr-6">Lainnya</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.ukuran.lainnya" type="text" placeholder="Lainnya..." />
    </div>

    <label class="text-cyan-950 pr-6">Metode Pembayaran</label>
    <select class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.jenisProduk">
      <option class="text-cyan-950" disabled value="">Pilih Metode Pembayaran</option>
      <option>Cash</option>
      <option>Dana</option>
      <option>BCA</option>
      <option>Lainnya</option>
    </select>

    <label class="text-cyan-950 pr-6">Tenggat Waktu</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.tanggalPengeluaran" type="date" />

    
    <div class="flex justify-end space-x-2">
      <button @click="closeModal" class="btn bg-gray-200 text-white">Batal</button>
      <button v-if="!isEdit" @click="addKaryawan" class="btn bg-cyan-950 text-white">Simpan</button>
      <button v-else @click="updateKaryawan" class="btn bg-cyan-950 text-white">Update</button>
    </div>
  </div>
</div>

  </div>
  </div>
  </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import SideBar from '@/components/SideBar.vue'
const showModal = ref(false);

const daftarPesanan = ref([]);

const search = ref('');

const form = ref({
  namaPemesan: '',
  nomorPesanan: '',
  jenisProduk: '',
  jumlahProduk: 0,
  extra: '',
  hargaPerBaju: 0,
  ukuran: {
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    lainnya: ''
  },
  metodePembayaran: '',
  tanggalPengeluaran: ''
});

const totalHarga = computed(() => {
  return form.value.jumlahProduk * form.value.hargaPerBaju;
});

const totalHargaFormatted = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(totalHarga.value);
});

const isEdit = ref(false);
const editIndex = ref(null);

function addKaryawan() {
const newOrder = { ...form.value, totalHarga: totalHarga.value };
daftarPesanan.value.push(newOrder);
showModal.value = false;
resetForm();
}

function editKaryawan(index) {
const order = daftarPesanan.value[index];
form.value = JSON.parse(JSON.stringify(order)); // clone object biar reaktif
showModal.value = true;
isEdit.value = true;
editIndex.value = index;
}

function updateKaryawan() {
if (editIndex.value !== null) {
  daftarPesanan.value[editIndex.value] = {
    ...form.value,
    totalHarga: totalHarga.value
  };
  showModal.value = false;
  resetForm();
  isEdit.value = false;
  editIndex.value = null;
}
}

function totalHargaFormat(value) {
return new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
}).format(value);
}


function closeModal() {
showModal.value = false;
resetForm();
  }


function simpanPesanan() {
const newOrder = { ...form.value, totalHarga: totalHarga.value };
daftarPesanan.value.push(newOrder);
showModal.value = false;
resetForm();
}

function resetForm() {
  form.value = {
    namaPemesan: '',
    nomorPesanan: '',
    jenisProduk: '',
    jumlahProduk: 0,
    extra: '',
    hargaPerBaju: 0,
    ukuran: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, lainnya: '' },
    metodePembayaran: '',
    tanggalPengeluaran: ''
  };
}
const filteredorder = computed(() => {
if (!search.value) return daftarPesanan.value;
return daftarPesanan.value.filter(order =>
  order.namaPemesan.toLowerCase().includes(search.value.toLowerCase())
);
});

</script>