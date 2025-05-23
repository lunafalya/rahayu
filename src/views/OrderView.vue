<template>
    <div class="flex h-screen">
    <!-- Sidebar -->
    <SideBar />
  <div class="ml-30 p-8 flex-grow px-6 pt-12 flex flex-col gap-6 main-content">
  <div class="bg-white rounded-2xl shadow-md p-6">
    <!-- Order Page Content -->
    <div class="order-page">
      <div class="flex mt-8 justify-between pb-6">
        <input v-model="search" type="text" placeholder="Cari disini..." class="search-bar text-cyan-950 border px-3 py-2" />
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
              <th class="text-white">Tanggal</th>
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

  <!-- Peta Persebaran Konsumen -->
    <div class="bg-white text-cyan-950 rounded-2xl p-6 shadow-md"> 
      <div class="flex justify-between items-center pb-6 relative"> 
        <h2 class="text-2xl font-bold text-cyan-950">Peta Persebaran Konsumen</h2> 
      </div>
      <p>Warna merah menandakan jumlah konsumen tinggi, merah muda menandakan jumlah rendah.</p>

      <!-- Leaflet Map -->
      <LMap
          :zoom="10"
          :center="[center.lat, center.lng]"
          class="relative z-10"
          style="height: 300px; width: 100%; margin-top: 1rem"
        >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        
        <!-- Layer GeoJSON -->
        <LGeoJson
          v-if="geojsonData && showBoundary"
          :geojson="geojsonData"
          :optionsStyle="adminStyle"
        />

        <!-- Kontrol di dalam peta -->
        <LControl position="topright">
          <div class="leaflet-control-layers leaflet-bar p-2 bg-white rounded shadow space-y-2">
            <label class="flex items-center space-x-2 text-sm">
              <select v-model="showBoundary"> 
                <option :value="true">Tampilkan batas</option> 
                <option :value="false">Sembunyikan batas</option> 
              </select>
              <span>Batas Administrasi</span>
            </label>
          </div>
        </LControl>


        <LCircleMarker
          v-for="(item, i) in orders"
          :key="i"
          :lat-lng="[parseFloat(item.latitude), parseFloat(item.longitude)]"
          :radius="8"
          :color="getColor(item.kota)"
          fill-opacity="0.6"
          stroke
        >
          <LPopup>
            <strong>{{ item['Nama Pemesan'] }}</strong><br />
            {{ item.alamat }}<br />
            {{ item['Jenis Produk'] }} - {{ item['Jumlah Produk'] }} pcs<br />
            Kota: {{ item.kota || 'Tidak diketahui' }}
          </LPopup>
        </LCircleMarker>
      </LMap>
    </div>
</div>

    <!-- OrderModal -->
    <div class="modal-overlay " v-if="showModal">
    <div class="modal-content">
    <h2 class="text-2xl font-bold text-cyan-950 mb-6 text-center">TAMBAH PESANAN</h2>
  
    <label class="text-cyan-950">Nama Pemesan:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.namaPemesan" type="text" placeholder="Nama Pemesan" />

    <label class="text-cyan-950">Nomor Telepon :</label>
    <div class="flex items-center border rounded p-2 mb-5 bg-white">
      <span class="text-cyan-950 mr-2">+62</span>
      <input
        class="flex-1 text-cyan-950 outline-none"
        v-model="form.nomorTelepon"
        type="number"
        placeholder="Nomor Telepon"
      />
    </div>

    <label class="text-cyan-950">Kota:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.kota" type="text" placeholder="Masukkan Kota" />

    <label class="text-cyan-950">Alamat:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.alamat" type="text" placeholder="Masukkan Alamat" />

    <div class="flex gap-6">
    <div class="flex flex-col w-full">
      <label class="text-cyan-950 mb-1">Longitude</label>
      <input class="text-cyan-950 border p-2 w-full rounded mb-5" v-model="form.longitude" type="text" placeholder="Masukkan Longitude"/>
    </div>

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
      <option>Extra</option>
    </select>

    <label class="text-cyan-950">Jumlah Produk:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model.number="form.jumlahProduk" type="number" placeholder="Jumlah Produk" />

    <label class="text-cyan-950">Harga Produk (tanpa extra):</label>
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
  </div>
  </div>



<!-- Detail Order Modal -->
<div class="modal-overlay"  v-if="isDetailVisible">
  <div class="modal-content max-w-3xl w-full bg-white rounded-xl shadow p-6">
    <h1 class="text-2xl font-bold mb-6 border-b pb-4 text-cyan-950 text-center">Detail Pesanan</h1>

    <div class="flex justify-between text-sm text-gray-600 mb-1">
      <p>Pesanan atas nama <strong>{{ detailData.namaPemesan }}</strong></p>
      <p>No. Telp: {{ detailData.nomorTelepon }}</p>
    </div>

    <div class="flex justify-between text-sm text-gray-600 mb-4">
      <p>Alamat: {{ detailData.alamat }}</p>
      <p class="text-xl font-semibold text-right text-black">
        Jumlah Produk<br><span class="text-2xl">{{ detailData.jumlahProduk }}</span>
      </p>
    </div>

    <p class="text-sm mb-2">Status Pembayaran: 
      <span
        class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
        :class="{
          'bg-green-100 text-green-800': detailData.status === 'Lunas',
          'bg-yellow-100 text-yellow-800': detailData.status === 'DP',
          'bg-red-100 text-red-800': detailData.status === 'Belum Bayar'
        }"
      >
        {{ detailData.status }}
      </span>
    </p>

    <table class="w-full text-sm text-left border-t mt-4">
      <thead>
        <tr class="text-gray-500">
          <th class="py-2">Jenis Produk</th>
          <th class="py-2">Ukuran (S/M/L/XL/XXL/Lainnya)</th>
          <th class="py-2 text-right">Harga Satuan</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t text-black">
          <td class="py-2">{{ detailData.jenisProduk }}</td>
          <td class="py-2">
            S: {{ detailData.ukuran?.S }},
            M: {{ detailData.ukuran?.M }},
            L: {{ detailData.ukuran?.L }},
            XL: {{ detailData.ukuran?.XL }},
            XXL: {{ detailData.ukuran?.XXL }},
            lainnya: {{ detailData.ukuran?.lainnya }}
          </td>
          <td class="py-2 text-right">{{ totalHargaFormat(detailData.hargaPerBaju) }}</td>
        </tr>
      </tbody>
    </table>

    <table class="w-full text-sm text-left border-t mt-4" v-if="detailData.extras && detailData.extras.length">
      <thead>
        <tr class="text-gray-500">
          <th class="py-2">Jenis Extra</th>
          <th class="py-2">Harga</th>
          <th class="py-2">Jumlah</th>
          <th class="py-2 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(extra, index) in detailData.extras" :key="index" class="border-t text-black">
          <td class="py-2">{{ extra.jenis }}</td>
          <td class="py-2">Rp{{ extra.harga }}</td>
          <td class="py-2">{{ extra.jumlah }}</td>
          <td class="py-2 text-right">Rp{{ extra.harga * extra.jumlah }}</td>
        </tr>
      </tbody>
    </table>

    <table class="w-full text-sm text-left border-t mt-4">
      <thead>
        <tr class="text-gray-500">
          <th class="py-2">Total Harga</th>
          <th class="py-2">Tenggat Waktu</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t text-black">
          <td class="py-2">{{ totalHargaFormat(detailData.totalHargapesanan) }}</td>
          <td class="py-2">{{ detailData.tanggalPengeluaran }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end mt-6">
      <button @click="isDetailVisible = false" class="btn bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm">Tutup</button>
    </div>
  </div>
</div>

    <!-- Bayar Modal -->
      <div class="modal-overlay" v-if="showModalBayar">
        <div class="modal-content">
          <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Bayar Pesanan</h2>

          <label class="text-cyan-950 block mb-1">Link Bayar</label>
          <div class="flex items-center justify-between border p-2 rounded mb-5 bg-white">
            <a 
              :href="linkBayar" 
              target="_blank" 
              class="text-cyan-950 underline break-all"
            >
              {{ linkBayar }}
            </a>
            <button @click="copyLinkBayar" class="ml-2 text-cyan-950" title="Salin Link">
              <!-- Icon copy SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" 
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
              </svg>
            </button>
          </div>

          <div class="flex justify-end space-x-2">
            <button @click="closeModalBayar" class="btn bg-gray-200 text-white">Batal</button>
            <button @click="addBayar" class="btn bg-cyan-950 text-white">Selesai</button>
          </div>
        </div>
      </div>

    </div>

</template>


<script setup> 
import { ref, onMounted, computed } from 'vue';
import SideBar from '@/components/SideBar.vue'
import { LMap, LTileLayer, LCircleMarker, LPopup, LGeoJson, LControl } from '@vue-leaflet/vue-leaflet'; 
import 'leaflet/dist/leaflet.css'
</script>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      showModal: false,
      daftarPesanan: [],
      showDetailModal: false,
      detailData: {},
      search: '',
      isEdit: false,
      editIndex: null,
      isDetailVisible: false,
      showModalBayar: false,
      currentPage: 1,
      itemsPerPage: 6,
      form: {
        namaPemesan: '',
        nomorTelepon: '',
        kota: '',
        alamat: '',
        longitude: '',
        latitude: '',
        jenisProduk: '',
        jumlahProduk: 0,
        jenisextra: '',
        extra: 0,
        jumlahextra: 0,
        totalextra: '',
        hargaPerBaju: 0,
        totalhargapesanan: '',
        dp: '',
        sisabayar: '',
        totalHarga: 0,
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
        extras: []
      },
      extraInput: {
        jenis: '',
        harga: 0,
        jumlah: 0
      }
    }
  },
  computed: {
    paginatedOrders() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredorder.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.filteredorder.length / this.itemsPerPage);
    },
    totalHarga() {
      return this.form.jumlahProduk * this.form.hargaPerBaju;
    },
    totalextra() {
      return this.form.jumlahextra * this.form.extra;
    },
    totalHargaFormatted() {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(this.totalHarga);
    },
    totalHargaPesananFormatted() {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(this.totalHargaPesanan);
    },
    totalHargaExtraFormatted() {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(this.totalHargaExtra);
    },
    totalHargaExtra() {
      return this.form.extras.reduce((acc, item) => {
        return acc + (item.harga * item.jumlah);
      }, 0);
    },
    totalHargaPesanan() {
      return this.totalHarga + this.totalHargaExtra;
    },
    sisabayar() {
      const currentItem = this.detailData;
      const previousDP = currentItem?.dp ?? 0;
      const totalHarga = currentItem?.totalhargapesanan ?? 0;
      const dpBaru = this.form.dp ?? 0;
      return totalHarga - (previousDP + dpBaru);
    },
    filteredorder() {
      if (!this.search) return this.daftarPesanan;
      return this.daftarPesanan.filter(order =>
        order.namaPemesan?.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    tambahExtra() {
      if (
        this.extraInput.jenis &&
        this.extraInput.harga > 0 &&
        this.extraInput.jumlah > 0
      ) {
        this.form.extras.push({
          jenis: this.extraInput.jenis,
          harga: this.extraInput.harga,
          jumlah: this.extraInput.jumlah
        });
        this.extraInput = { jenis: '', harga: 0, jumlah: 0 };
      } else {
        alert('Mohon lengkapi data Extra dengan benar.');
      }
    },
    copyLinkBayar() {
    navigator.clipboard.writeText(this.linkBayar)
      .then(() => {
        alert("Link berhasil disalin!");
      })
      .catch(err => {
        console.error("Gagal menyalin link:", err);
      });
  },
    hapusExtra(index) {
      this.form.extras.splice(index, 1);
    },
    totalHargaPesananFormat(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(value);
    },
    totalHargaFormat(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(value);
    },
    totalHargaExtraFormat(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(value);
    },
    addOrder() {
      const newOrder = { ...this.form, totalHarga: this.totalHarga, totalHargapesanan: this.totalHargaPesanan };
      this.daftarPesanan.push(newOrder);
      this.showModal = false;
      this.resetForm();
    },
    showDetail(order) {
      this.detailData = order;
      this.isDetailVisible = true;
    },
    closeDetail() {
      this.isDetailVisible = false;
      this.resetForm();
    },
    editOrder(index) {
      const order = this.daftarPesanan[index];
      this.form = JSON.parse(JSON.stringify(order));
      this.showModal = true;
      this.isEdit = true;
      this.editIndex = index;
    },
    updateOrder() {
      const totalProduk = this.form.jumlahProduk * this.form.hargaPerBaju;
      const totalExtra = this.form.extras.reduce((acc, extra) => acc + (extra.harga * extra.jumlah), 0);
      const totalPesanan = totalProduk + totalExtra;
      this.form.totalHargapesanan = totalPesanan;
      if (this.editIndex !== null) {
        this.daftarPesanan[this.editIndex] = { ...this.form };
      }
      this.closeModal();
    },
    closeModal() {
      this.showModal = false;
      this.resetForm();
    },
    simpanPesanan() {
      const newOrder = { ...this.form, totalHarga: this.totalHarga };
      this.daftarPesanan.push(newOrder);
      this.showModal = false;
      this.resetForm();
    },
    showModalBayarFunc(index) {
      const item = this.daftarPesanan[index];
      this.detailData = item;
      this.form.totalHarga = item.totalhargapesanan ?? 0;
      this.form.dp = 0;
      this.form.metodepembayaran = item.metodepembayaran ?? '';
      this.showModalBayar = true;
    },
    closeModalBayar() {
      this.showModalBayar = false;
    },
    updateBayar() {
      if (this.form.metodepembayaran === 'Transfer' || this.form.metodepembayaran === 'Qris') {
        alert("Metode pembayaran ini tidak bisa disimpan langsung.");
        return;
      }
      const index = this.daftarPesanan.findIndex(item => item === this.detailData);
      if (index !== -1) {
        const current = this.daftarPesanan[index];
        const previousDP = current.dp ?? 0;
        const newTotalDP = previousDP + this.form.dp;
        if (newTotalDP > current.totalhargapesanan) {
          alert("Total DP tidak boleh melebihi total harga!");
          return;
        }
        current.dp = newTotalDP;
        current.sisabayar = current.totalhargapesanan - newTotalDP;
        current.metodepembayaran = this.form.metodepembayaran;
      }
      this.closeModalBayar();
    },
    addBayar() {
      if (this.form.metodepembayaran !== 'Cash') {
        const kode = 'PAY-' + Math.floor(Math.random() * 1000000);
        alert('Kode Pembayaran: ' + kode);
        this.closeModalBayar();
      }
    },
    resetForm() {
      this.form = {
        namaPemesan: '',
        nomorTelepon: '',
        kota: '',
        alamat: '',
        longitude: '',
        latitude: '',
        jenisProduk: '',
        jumlahProduk: 0,
        jenisextra: '',
        extra: '',
        jumlahextra: '',
        totalextra: '',
        hargaPerBaju: 0,
        dp: '',
        sisabayar: '',
        totalhargapesanan: '',
        ukuran: { S: 0, M: 0, L: 0, XL: 0, XXL: 0, lainnya: '' },
        totalHarga: 0,
        metodepembayaran: '',
        tanggalPengeluaran: '',
        extras: []
      };
      this.extraInput = { jenis: '', harga: 0, jumlah: 0 };
      this.isEdit = false;
      this.editIndex = null;
    }
  }
}

import L from 'leaflet' 
delete L.Icon.Default.prototype._getIconUrl 
L.Icon.Default.mergeOptions({ 
iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href, 
iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href, 
shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href 
});
  // Data 
  const orders = ref([]) 
  const kotaCount = ref({})
    const center = { lat: -6.5, lng: 106.8 } // Dramaga 
    
    // onMounted(async () => { const res = await fetch('https://api.rahayukonveksi.com/orders') 
    // const data = await res.json() 
    const dummyOrders = [
      {
      "Nama Pemesan": "Dwi",
      "alamat": "Kelurahan A, Kota Bogor",
      "kota": "Bogor",
      "latitude": "-6.595038",
      "longitude": "106.816635",
      "Jenis Produk": "Kaos",
      "Jumlah Produk": 20
      },
      {
      "Nama Pemesan": "Lina",
      "alamat": "Kelurahan B, Kota Bogor",
      "kota": "Bogor",
      "latitude": "-6.589379",
      "longitude": "106.805155",
      "Jenis Produk": "Jaket",
      "Jumlah Produk": 15
      },
      {
      "Nama Pemesan": "Rudi",
      "alamat": "Kelurahan C, Kota Depok",
      "kota": "Depok",
      "latitude": "-6.391978",
      "longitude": "106.821823",
      "Jenis Produk": "Kaos",
      "Jumlah Produk": 10
      },
      {
      "Nama Pemesan": "Sari",
      "alamat": "Kelurahan D, Kota Depok",
      "kota": "Depok",
      "latitude": "-6.387002",
      "longitude": "106.832789",
      "Jenis Produk": "Kemeja",
      "Jumlah Produk": 5
      },
      {
      "Nama Pemesan": "Aminah",
      "alamat": "Kelurahan E, Kota Tangerang",
      "kota": "Tangerang",
      "latitude": "-6.199602",
      "longitude": "106.660999",
      "Jenis Produk": "Kaos",
      "Jumlah Produk": 3
      }
      ]
    onMounted(() => {
      const count = {}
      dummyOrders.forEach(item => {
      const kota = item.kota || 'Tidak diketahui'
      count[kota] = (count[kota] || 0) + 1
      })
      orders.value = dummyOrders
      kotaCount.value = count
      })

      const geojsonData = ref(null) 
      const showBoundary = ref(true) 
      const adminStyle = () => ({ 
        color: '#2c3e50', 
        weight: 1.5, 
        fillOpacity: 0 
      }) 
      
      onMounted(async () => { 
        const res = await fetch('/jabar.geojson') 
        const json = await res.json() 
        geojsonData.value = json 
      })
   // Buat struktur kota: jumlah pesanan 
    // const count = {} 
    // data.forEach(item => { 
    //   const kota = item.kota || 'Tidak diketahui' 
    //   count[kota] = (count[kota] || 0) + 1 
    // }) 
    // orders.value = data 
    // kotaCount.value = count 
    // })
      // Fungsi pewarnaan berdasarkan jumlah pesanan 
      const getColor = (kota) => {
        const count = kotaCount.value[kota || 'Tidak diketahui'] || 0;

        if (count >= 10) return 'red';
        if (count >= 5) return 'blue';
        if (count >= 2) return 'salmon';
        return 'pink';
      };
</script>