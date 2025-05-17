<template>
    <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar />
  <div class="ml-30 p-8 flex-grow px-6 pt-12 flex flex-col gap-6 main-content">
  <div class="bg-white rounded-2xl shadow-md p-6">
    <!-- Order Page Content -->
    <div class="order-page">
      <div class="flex mt-8 justify-between pb-6">
        <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-cyan-950 border px-3 py-2" />
        <button @click="showModal=true" class="btn shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
          Tambah
        </button>
      </div>

      <!-- Tabel Data Order -->
      <div class="overflow-x-auto rounded-box border border-base-content/5">
        <table class="table bg-gray-400">
          <thead>
            <tr>
              <th class="text-white">No.</th>
              <th class="text-white">Nama Pemesan</th>
              <th class="text-white">Total Harga</th>
              <th class="text-white">Sisa Pembayaran</th>
              <th class="text-white">Deadline</th>
              <th class="text-white">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-cyan-950 bg-white">
            <tr v-for="(order, index) in paginatedOrders" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ order.namaPemesan }}</td>
              <td>{{ totalHargaFormat(order.totalHargapesanan) }}</td>
              <td>{{ totalHargaFormat(order.sisabayar) }}</td>
              <td>{{ order.tanggalPengeluaran }}</td>
              <td>
                <button @click="editOrder(index)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button>
                <button @click="showDetail(order)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Detail</button>
                <button @click="showModalBayarFunc(index)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Bayar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex bg-white justify-center items-center mt-4 gap-4">
          <button @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 text-white rounded hover:bg-gray-300 hover:text-cyan-950 disabled:opacity-50">◀</button>
          <span class="text-cyan-950 font-semibold">{{ currentPage }} dari {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" class="px-3 py-1 text-white rounded hover:bg-gray-300 hover:text-cyan-950 disabled:opacity-50">▶</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Map Section -->
  <div class="bg-white text-cyan-950 rounded-2xl p-6 shadow-md">
    <div class="flex justify-between items-center pb-6 relative">
      <h2 class="text-2xl font-bold text-cyan-950">Map Overview</h2>
      

      <!-- Dropdown Button -->
      <div class="relative" @mouseenter="showDropdown = true" @mouseleave="showDropdown = false">
        <button class="bg-white text-cyan-950 px-4 py-2 rounded-lg shadow hover:bg-cyan-950 hover:text-white transition">
          Filter Kota
        </button>


        <!-- Dropdown Menu -->
        <div v-show="showDropdown" class="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow z-10 border">
          <ul>
            <li v-for="city in cities" :key="city" @click="selectCity(city)" class="px-4 py-2 hover:bg-cyan-100 cursor-pointer text-sm">
              {{ city }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <p>Pesanan dari kota berjumlah </p>

    <!-- Map Box -->
    <div id="map" class="w-full h-64 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
      Showing map for: <strong class="ml-1">{{ selectedCity || "All Cities" }}</strong>
    </div>
  </div>
</div>



    <!-- OrderModal -->
    <div class="modal-overlay " v-if="showModal">
    <div class="modal-content">
    <h2 class="text-2xl font-bold text-cyan-950 mb-6 text-center">Tambah Pesanan</h2>
  
    <label class="text-cyan-950">Nama Pemesan:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.namaPemesan" type="text" placeholder="Nama Pemesan" />

    <label class="text-cyan-950">Nomor Telepon :</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.nomorTelepon" type="number" placeholder="Nomor Telepon" />


    <label class="text-cyan-950">Alamat:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.alamat" type="text" placeholder="Masukkan Alamat" />

    <div class="flex gap-6">
  <!-- Longitude -->
  <div class="flex flex-col w-full">
    <label class="text-cyan-950 mb-1">Longitude</label>
    <input class="text-cyan-950 border p-2 w-full rounded mb-5" v-model="form.longitude" type="text" placeholder="Masukkan Longitude"/>
  </div>

  <!-- Latitude -->
  <div class="flex flex-col w-full">
    <label class="text-cyan-950 mb-1">Latitude</label>
    <input class="text-cyan-950 border p-2 w-full rounded mb-5" v-model="form.latitude" type="text" placeholder="Masukkan Latitude"/>
  </div>
</div>
    


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

    <label class="text-cyan-950">Total harga Produk (tanpa extra):</label>
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
    </div>

                      <!-- Tabel Input Extra -->
                        <h3 class="text-lg font-semibold text-cyan-950 mb-2">Tambah Extra</h3>

                        <!-- Tabel Daftar Extra Ditambahkan -->
                    <table class="w-full text-sm border border-gray-300 mb-4">
                      <thead class="bg-white">
                        <tr>
                          <th class="p-2 border">Jenis Extra</th>
                          <th class="p-2 border">Harga</th>
                          <th class="p-2 border">Jumlah</th>
                          <th class="p-2 border">Total</th>
                          <th class="p-2 border">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(extra, index) in form.extras" :key="index">
                          <td class="border p-2">
                            <input v-model="extra.jenis" class="w-full border rounded p-1" />
                          </td>
                          <td class="border p-2">
                            <input v-model.number="extra.harga" type="number" class="w-full border rounded p-1" />
                          </td>
                          <td class="border p-2">
                            <input v-model.number="extra.jumlah" type="number" class="w-full border rounded p-1" />
                          </td>
                          <td class="border p-2">
                            Rp{{ extra.harga * extra.jumlah }}
                          </td>
                          <td class="border p-2">
                            <button @click="hapusExtra(index)" class="text-red-600 hover:underline">Hapus</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Form Tambah Extra -->
                    <div class="grid grid-cols-4 gap-2 mb-2">
                      <input class="border p-2 rounded" v-model="extraInput.jenis" type="text" placeholder="Nama Extra (contoh: Lengan Panjang)" />
                      <input class="border p-2 rounded" v-model.number="extraInput.harga" type="number" placeholder="Harga Extra" />
                      <input class="border p-2 rounded" v-model.number="extraInput.jumlah" type="number" placeholder="Jumlah Extra" />
                      <input class="border p-2 rounded bg-gray-100" :value="extraInput.harga * extraInput.jumlah" type="text" placeholder="Total" disabled />
                    </div>

                    <button @click="tambahExtra" class="bg-cyan-950 text-white px-3 py-1 rounded mb-4">+ Tambah Extra</button>
                    <br>

                    <label class="text-cyan-950">Total Harga Extra:</label>
                    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" :value="totalHargaExtraFormatted" type="text" placeholder="Harga extra" disabled />

    <label class="text-cyan-950">Total Harga Pesanan (Produk + Extra):</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" :value="totalHargaPesananFormatted" type="text" placeholder="Total Seluruh Harga" disabled />

    <label class="text-cyan-950 pr-6">Tenggat Waktu</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.tanggalPengeluaran" type="date" />
    
    <div class="flex justify-end space-x-2">
      <button @click="closeModal" class="btn bg-gray-200 text-white">Batal</button>
      <button v-if="!isEdit" @click="addOrder" class="btn bg-cyan-950 text-white">Simpan</button>
      <button v-else @click="updateOrder" class="btn bg-cyan-950 text-white">Update</button>
    </div>




<!-- Detail Order Modal -->
<div class="modal-overlay" v-if="isDetailVisible">
  <div class="modal-content max-w-xl w-full">
    <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Detail Pesanan</h2>
    
    <p class="flex justify-between"><strong>Nama Pemesan</strong> <span>{{ detailData.namaPemesan }}</span></p>
    <p class="flex justify-between"><strong>Nomor Telepon</strong> <span>{{ detailData.nomorTelepon }}</span></p>
    <p class="flex justify-between"><strong>Alamat</strong> <span>{{ detailData.alamat }}</span></p>
    <p class="flex justify-between"><strong>Jenis Produk</strong> <span>{{ detailData.jenisProduk }}</span></p>
    <p class="flex justify-between"><strong>Jumlah Produk</strong> <span>{{ detailData.jumlahProduk }}</span></p>
    <p class="flex justify-between"><strong>Ukuran</strong></p>
    <ul class="ml-4">
      <li class="flex justify-between">S: <span>{{ detailData.ukuran?.S }}</span></li>
      <li class="flex justify-between">M: <span>{{ detailData.ukuran?.M }}</span></li>
      <li class="flex justify-between">L: <span>{{ detailData.ukuran?.L }}</span></li>
      <li class="flex justify-between">XL: <span>{{ detailData.ukuran?.XL }}</span></li>
      <li class="flex justify-between">XXL: <span>{{ detailData.ukuran?.XXL }}</span></li>
      <li class="flex justify-between">Lainnya: <span>{{ detailData.ukuran?.lainnya }}</span></li>
    </ul>
    <p class="flex justify-between"><strong>Jenis Extra</strong> <span>{{ detailData.jenisextra }}</span></p>
    <p class="flex justify-between"><strong>Extra</strong> <span>{{ detailData.extra }}</span></p>
    <p class="flex justify-between"><strong>Extra</strong> <span>{{ detailData.jumlahextra }}</span></p>
    <p class="flex justify-between"><strong>Extra</strong> <span>{{ detailData.totalextra }}</span></p>
    <p class="flex justify-between"><strong>Harga per Baju</strong> <span>{{ totalHargaFormat(detailData.hargaPerBaju) }}</span></p>
    <p class="flex justify-between"><strong>Total Harga</strong> <span>{{ totalHargaFormat(detailData.totalHargapesanan) }}</span> </p>
    <p class="flex justify-between"><strong>DP</strong> <span>{{ totalHargaFormat(detailData.dp) }}</span></p>
    <p class="flex justify-between"><strong>Tanggal Pengeluaran</strong> <span>{{ detailData.tanggalPengeluaran }}</span></p>

    <div class="flex justify-end mt-4">
      <button @click="closeDetail(order)" class="btn bg-gray-200 text-cyan-950">Tutup</button>
    </div>
  </div>
</div>


    <!-- Bayar Modal -->
    <div class="modal-overlay" v-if="showModalBayar">
      <div class="modal-content">
        <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Bayar Pesanan</h2>
        
        <p><strong>Total Harga:</strong> Rp {{ totalHargaFormat(detailData.totalHargapesanan) }}</p>

        <label class="text-cyan-950">Jumlah yang dibayarkan</label>
        <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"
          v-model.number="form.dp"
          type="number"
          placeholder="DP Sekarang" />

        <label class="text-cyan-950">Sisa Pembayaran</label>
        <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"
          :value="sisabayar"
          type="number"
          readonly />

        <label class="text-cyan-950">Metode Pembayaran</label>
        <select class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"
          v-model="form.metodepembayaran">
          <option disabled value="">Pilih Metode</option>
          <option>Cash</option>
          <option>Transfer</option>
          <option>Qris</option>
        </select>

        <div class="flex justify-end space-x-2">
          <button @click="closeModalBayar" class="btn bg-gray-200 text-white">Batal</button>

          <button @click="updateBayar" class="btn bg-cyan-950 text-white"
            :disabled="form.metodepembayaran === 'Transfer' || form.metodepembayaran === 'Qris'">Simpan</button>

          <button @click="addBayar" class="btn bg-cyan-950 text-white"
            :disabled="form.metodepembayaran === 'Cash'">Generated Code</button>
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
const showDetailModal = ref(false);
const detailData = ref({});
const search = ref('');
const isEdit = ref(false);
const editIndex = ref(null);
const isDetailVisible = ref(false);
const showModalBayar = ref(false);
const currentPage = ref(1);
const itemsPerPage = 6;

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredorder.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(filteredorder.value.length / itemsPerPage);
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};




const form = ref({
  namaPemesan: '',
  nomorTelepon: '',
  alamat: '',
  longitude:'',
  latitude: '',
  jenisProduk: '',
  jumlahProduk: 0,
  jenisextra: '',
  extra: 0,
  jumlahextra:0,
  totalextra:'',
  hargaPerBaju: 0,
  totalhargapesanan:'',
  dp: '',
  sisabayar: '',
  totalHarga: 0,
  dp: 0,
  metodepembayaran: '',
  ukuran: {
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
    lainnya: ''
  },
  tanggalPengeluaran: '',
  extras:[]
});


function tambahExtra() {
  if (
    extraInput.value.jenis &&
    extraInput.value.harga > 0 &&
    extraInput.value.jumlah > 0
  ) {
    form.value.extras.push({
      jenis: extraInput.value.jenis,
      harga: extraInput.value.harga,
      jumlah: extraInput.value.jumlah
    });

    // Reset input extra
    extraInput.value = { jenis: '', harga: 0, jumlah: 0 };
  } else {
    alert('Mohon lengkapi data Extra dengan benar.');
  }
}

function hapusExtra(index) {
  form.value.extras.splice(index, 1);
}

const extraInput = ref({
  jenis: '',
  harga: 0,
  jumlah: 0
});



const totalHarga = computed(() => {
  return form.value.jumlahProduk * form.value.hargaPerBaju;
});

const totalextra = computed(() => {
  return form.value.jumlahextra * form.value.extra;
});

const totalHargaFormatted = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(totalHarga.value);
});

const totalHargaPesananFormatted = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(totalHargaPesanan.value);
});

const totalHargaExtraFormatted = computed(() => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR'
  }).format(totalHargaExtra.value);
});

const totalHargaExtra = computed(() => {
  return form.value.extras.reduce((acc, item) => {
    return acc + (item.harga * item.jumlah);
  }, 0);
});

const totalHargaPesanan = computed(() => {
  return totalHarga.value + totalHargaExtra.value;
});

function totalHargaPesananFormat(value) {
return new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
}).format(value);
}

function totalHargaFormat(value) {
return new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
}).format(value);
}

function totalHargaExtraFormat(value) {
return new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR'
}).format(value);
}

function addOrder() {
const newOrder = { ...form.value, totalHarga: totalHarga.value, totalHargapesanan: totalHargaPesanan.value, };
daftarPesanan.value.push(newOrder);
showModal.value = false;
resetForm();
}

function showDetail(order) {
  detailData.value = order;
  isDetailVisible.value = true;
}

function closeDetail() {
  isDetailVisible.value = false;
  resetForm();
}

function editOrder(index) {
const order = daftarPesanan.value[index];
form.value = JSON.parse(JSON.stringify(order)); // clone object biar reaktif
showModal.value = true;
isEdit.value = true;
editIndex.value = index;
this.isEdit = true;
this.editIndex = index;
  this.form = JSON.parse(JSON.stringify(this.orders[index])); // deep copy untuk menghindari reaktivitas langsung
  this.showModal = true;
}

function updateOrder() {
  const totalProduk = form.value.jumlahProduk * form.value.hargaPerBaju;
  const totalExtra = form.value.extras.reduce((acc, extra) => acc + (extra.harga * extra.jumlah), 0);
  const totalPesanan = totalProduk + totalExtra;

  form.value.totalHargapesanan = totalPesanan; // <- ini yang penting

  if (editIndex.value !== null) {
    daftarPesanan.value[editIndex.value] = { ...form.value };
  }

  closeModal();
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


// ✅ Function: Menampilkan modal dan mengisi form
function showModalBayarFunc(index) {
  const item = daftarPesanan.value[index];
  detailData.value = item;

  form.value.totalHarga = item.totalhargapesanan ?? 0;
  form.value.dp = 0; // DP baru yang ingin ditambahkan
  form.value.metodepembayaran = item.metodepembayaran ?? '';

  showModalBayar.value = true;
}


function closeModalBayar() {
  showModalBayar.value = false;
}

function updateBayar() {
  if (form.value.metodepembayaran === 'Transfer' || form.value.metodepembayaran === 'Qris') {
    alert("Metode pembayaran ini tidak bisa disimpan langsung.");
    return;
  }

  const index = daftarPesanan.value.findIndex(item => item === detailData.value);
  if (index !== -1) {
    const current = daftarPesanan.value[index];
    const previousDP = current.dp ?? 0;
    const newTotalDP = previousDP + form.value.dp;

    if (newTotalDP > current.totalhargapesanan) {
      alert("Total DP tidak boleh melebihi total harga!");
      return;
    }

    current.dp = newTotalDP;
    current.sisabayar = current.totalhargapesanan - newTotalDP;
    current.metodepembayaran = form.value.metodepembayaran;
  }

  closeModalBayar();
}

function addBayar() {
  if (form.value.metodepembayaran !== 'Cash') {
    const kode = 'PAY-' + Math.floor(Math.random() * 1000000);
    alert('Kode Pembayaran: ' + kode);
    closeModalBayar();
  }
}

const sisabayar = computed(() => {
  const currentItem = detailData.value;
  const previousDP = currentItem?.dp ?? 0;
  const totalHarga = currentItem?.totalhargapesanan ?? 0;
  const dpBaru = form.value.dp ?? 0;

  return totalHarga - (previousDP + dpBaru);
});




function resetForm() {
  form.value = {
    namaPemesan: '',
    nomorTelepon: '',
    alamat: '',
    longitude:'',
    latitude: '',
    jenisProduk: '',
    jumlahProduk: 0,
    jenisextra: '',
    extra: '',
    jumlahextra:'',
    totalextra:'',
    hargaPerBaju: 0,
    dp: '',
    sisabayar:'',
    totalhargapesanan:'',
    ukuran: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, lainnya: '' },
    totalHarga: 0,
    dp: 0,
    metodepembayaran: '',
    tanggalPengeluaran: '',
    extras:[]
  };
}



const filteredorder = computed(() => {
if (!search.value) return daftarPesanan.value;
return daftarPesanan.value.filter(order =>
  order.namaPemesan.toLowerCase().includes(search.value.toLowerCase())
);
});

</script>