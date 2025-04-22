<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <div>
        <ul class="menu menu-lg bg-base-200 rounded-box w-28 h-full m-8 hover:bg-base-300 transition-all duration-300 ease-in-out shadow-lg hover:w-56">
            <li class="menu-title w-full">
                <div class="flex flex-row items-center gap-2">
                    <img src="../assets/rahayuwhite.svg" alt="rahayu logo">
                </div>
            </li>
            <li class="menu w-full">
                <div class="flex flex-row items-center gap-2" @click="$router.push('/dashboard')">
                    <a><font-awesome-icon icon="house" class="w-12 h-auto" /></a>
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Dashboard</span>
                </div>
            </li>
            <li class="menu w-full">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/income')">
                    <font-awesome-icon icon="sack-dollar" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Income</span>
                </a>
            </li>
            <li class="menu w-full">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/order')">
                    <font-awesome-icon icon="fa-brands fa-shopify" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Order</span>
                </a>
            </li>
            <li class="menu w-full">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/product')">
                    <font-awesome-icon icon="shirt" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Product</span>
                </a>
            </li>
            <li class="menu w-full">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/expense')">
                    <font-awesome-icon icon="receipt" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Expense</span>
                </a>
            </li>
            <li class="menu w-full mb-32">
                <a class="flex flex-row items-center gap-2" @click="$router.push('/employee')">
                    <font-awesome-icon icon="user-group" class="w-12 h-auto" />
                    <span class="menu-text opacity-0 transition-opacity duration-300 delay-75 whitespace-nowrap font-bold">Employee</span>
                </a>
            </li>
            <li class="menu">
                <a class="flex flex-row items-center gap-2">
                    <font-awesome-icon icon="right-from-bracket" class="w-12 h-auto" />
                </a>
            </li>
        </ul>
    </div>

    <!-- Order -->
    <div class="flex-grow p-6 flex gap-6 main-content">
    <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
    <div class="order-page">
      <div class="flex mt-8 justify-between pb-6">
          <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-cyan-950 border px-3" />
          <button @click="showModal=true" class="btn hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
          Tambah
        </button>
      </div>

       <!-- Tabel Data Karyawan -->
       <div class="overflow-x-auto rounded-box border border-base-content/5 bg-cyan-950">
        <table class="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama Pemesan</th>
            <th>Deadline</th>
            <th>DP</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody class="bg-white text-cyan-950>">
            <tr v-for="(order, index) in filteredorder" :key="index">
              <td>{{ index + 1 }}</td>
              <td>{{ order.namaPemesan }}</td>
              <td>{{ order.tanggalPengeluaran }}</td>
              <td>{{ totalHargaFormat(order.totalHarga) }}</td>
              <td><button @click="editKaryawan(index)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button></td>
            </tr>
        </tbody>
      </table>
      </div>

      <!-- OrderModal -->
      <div class="modal-overlay " v-if="showModal">
    <div class="modal">
      <h2>Tambah Pesanan</h2>
    
      <label>Nama Pemesan:</label>
      <input v-model="form.namaPemesan" type="text" placeholder="Nama Pemesan" />

      <label>Nomor Pesanan:</label>
      <input v-model="form.nomorPesanan" type="text" placeholder="Nomor Pesanan" />

      <label>Jenis Produk:</label>
      <select v-model="form.jenisProduk">
        <option disabled value="">Pilih Jenis Produk</option>
        <option>Kaos</option>
        <option>Almamater</option>
        <option>Seragam Jas</option>
        <option>Jaket</option>
        <option>Jersey</option>
      </select>

      <label>Jumlah Produk:</label>
      <input v-model.number="form.jumlahProduk" type="number" placeholder="Jumlah Produk" />

      <label>Extra:</label>
      <input v-model="form.extra" type="text" placeholder="Extra" />

      <label>Total Harga:</label>
      <input v-model.number="form.hargaPerBaju" type="number" placeholder="Harga per Baju" />

      <input :value="totalHargaFormatted" type="text" placeholder="Total Seluruh Harga" disabled />

      <div class="ukuran-group">
        <label>Ukuran:</label>
        <br>
        <label>S</label>
        <input v-model.number="form.ukuran.S" type="number" placeholder="S" />
        <br>
        <label>M</label>
        <input v-model.number="form.ukuran.M" type="number" placeholder="M" />
        <br>
        <label>L</label>
        <input v-model.number="form.ukuran.L" type="number" placeholder="L" />
        <br>
        <label>XL</label>
        <input v-model.number="form.ukuran.XL" type="number" placeholder="XL" />
        <br>
        <label>XXl</label>
        <input v-model.number="form.ukuran.XXL" type="number" placeholder="XXL" />
        <br>
        <label>Lainnya</label>
        <input v-model="form.ukuran.lainnya" type="text" placeholder="Lainnya..." />
      </div>

      <select v-model="form.metodePembayaran">
        <option disabled value="">Pilih Metode Pembayaran</option>
        <option>Cash</option>
        <option>Dana</option>
        <option>BCA</option>
        <option>Lainnya</option>
      </select>

      <input v-model="form.tanggalPengeluaran" type="date" />

      <div class="modal-buttons">
        <button @click="closeModal" class="close-button">Batal</button>
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

  // filter kalau ingin pencarian
const filteredorder = computed(() => {
  return daftarPesanan.value.filter(order =>
    order.namaPemesan.toLowerCase().includes(search.value.toLowerCase())
  );
});

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

  
  .modal {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    width: 400px;
    max-height: 90vh;
    overflow-y: auto;
  }
  
  .modal input,
  .modal select {
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
  }
  
  .ukuran-group input {
    width: 70px;
    margin-right: 0.5rem;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
  </style>
  