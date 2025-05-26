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
              <th style="font-family: 'Poppins', sans-serif;" class="text-white">No.</th>
              <th style="font-family: 'Poppins', sans-serif;" class="text-white">Nama Pemesan</th>
              <th style="font-family: 'Poppins', sans-serif;" class="text-white">Total Harga</th>
              <th style="font-family: 'Poppins', sans-serif;" class="text-white">Tanggal</th>
              <th style="font-family: 'Poppins', sans-serif;" class="text-white">Status</th>
              <th style="font-family: 'Poppins', sans-serif;" class="text-white">Aksi</th>
            </tr>
          </thead>
          <tbody class="text-cyan-950 bg-white" style="font-family: 'Poppins', sans-serif;">
            <tr v-for="(order, index) in paginatedOrders" :key="index">
              <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td>{{ order.customerName }}</td>
              <td>{{ totalHargaFormat(order.totalPrice) }}</td>
              <td>{{ Intl.DateTimeFormat('id-ID').format(new Date(order.deadline)) }}</td>
              <td>{{ order.status}}</td>
              <td>
                <!-- <button @click="editOrder(order.id)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button> -->
                <button @click="showDetail(order)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Detail</button>
                <button v-if="order.status == 'PENDING'" @click="showModalBayarFunc(index)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Bayar</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div class="flex bg-white justify-center items-center mt-4 gap-4">
          <button style="font-family: 'Poppins', sans-serif;" @click="prevPage" :disabled="currentPage === 1" class="px-3 py-1 text-white rounded hover:bg-gray-300 hover:text-cyan-950 disabled:opacity-50">◀</button>
          <span style="font-family: 'Poppins', sans-serif;" class="text-cyan-950 font-semibold">{{ currentPage }} dari {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages" style="font-family: 'Poppins', sans-serif;" class="px-3 py-1 text-white rounded hover:bg-gray-300 hover:text-cyan-950 disabled:opacity-50">▶</button>
        </div>
      </div>
    </div>
  </div>

 <!-- Peta Persebaran Konsumen -->
    <div class="bg-white text-cyan-950 rounded-2xl p-6 shadow-md"> 
      <div class="flex justify-between items-center pb-6 relative"> 
        <h2 class="text-2xl font-bold text-cyan-950">Peta Persebaran Konsumen</h2> 
      </div>
      <p>Persebaran pasar konsumen dibagi menjadi 2Q dari warna Merah tertinggi hingga warna Kuning.</p>

      <!-- Leaflet Map -->
      <LMap
        ref="mapRef"
        :zoom="10"
        :center="[center.lat, center.lng]"
        class="z-0"
        style="height: 300px; width: 100%; margin-top: 1rem"
      >
        <LTileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <!-- Kontrol Layer & Filter -->
        <LControl position="topright">
          <div class="leaflet-control-layers leaflet-bar p-2 bg-white rounded shadow space-y-2 text-sm w-64">
            <!-- Pilihan Layer -->
            <label class="flex items-center space-x-2 mb-2">
              <span class="font-semibold">Layer Peta</span>
              <select v-model="selectedLayer" class="text-sm border rounded px-1 py-0.5">
                <option value="polygon">Wilayah Persebaran</option>
                <option value="marker">Titik Konsumen</option>
              </select>
            </label>

            <!-- Filter Wilayah -->
            <div v-if="selectedLayer === 'polygon'">
              <label class="block text-sm font-medium mb-1">Filter Wilayah:</label>
              <input
                v-model="selectedCity"
                type="text"
                list="city-options"
                class="border rounded px-2 py-1 w-full"
                placeholder="Ketik nama kota..."
              />
              <datalist id="city-options">
                <option
                  v-for="(jumlah, kota) in kotaPurchaseCount"
                  :key="kota"
                  :value="kota"
                />
              </datalist>
            </div>
          </div>
        </LControl>

        <!-- GeoJSON Layer -->
        <LGeoJson
          v-if="selectedLayer === 'polygon' && showBoundary && filteredGeoJson"
          :geojson="filteredGeoJson"
          :options-style="styleFeature"
        />

        <!-- Titik Konsumen: Layer marker (semua konsumen) -->
        <LCircleMarker
          v-for="(order, i) in selectedLayer === 'marker' ? orders : []"
          :key="'all-' + i"
          :lat-lng="[order.latitude, order.longitude]"
          :radius="8"
          :color="getColorByCustomerPurchase(order['Jumlah Produk'])"
        >
          <LPopup>
            <strong>{{ order['Nama Pemesan'] }}</strong><br />
            {{ order.Alamat }}<br />
            {{ order.Kota || 'Tidak diketahui' }}<br />
            {{ order['Jenis Produk'] }} - {{ order['Jumlah Produk'] }} pcs
          </LPopup>
        </LCircleMarker>

        <!-- Titik Konsumen: Hanya yang cocok dengan filter kota -->
        <LCircleMarker
          v-for="(order, i) in selectedLayer === 'polygon' && selectedCity ? filteredOrders : []"
          :key="'filtered-' + i"
          :lat-lng="[order.latitude, order.longitude]"
          :radius="8"
          :color="getColorByCustomerPurchase(order['Jumlah Produk'])"
        >
          <LPopup>
            <strong>{{ order['Nama Pemesan'] }}</strong><br />
            {{ order.Alamat }}<br />
            {{ order.Kota || 'Tidak diketahui' }}<br />
            {{ order['Jenis Produk'] }} - {{ order['Jumlah Produk'] }} pcs
          </LPopup>
        </LCircleMarker>

        <!-- Sidebar Khusus Filter -->
        <SideBar v-if="selectedCity && selectedLayer === 'polygon'">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold">Pesanan di {{ selectedCity }}</h3>
            <button @click="closeSidebar" class="text-sm text-red-500 hover:underline">Tutup</button>
          </div>
          <ul class="text-sm">
            <li v-for="(order, i) in filteredOrders" :key="i">
              {{ order.Nama }} - {{ order['Jumlah Produk'] }} produk
            </li>
          </ul>
        </SideBar>

        <!-- Sidebar Global (jika ada kebutuhan lain) -->
        <SideBar v-if="showSidebar">
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-lg font-semibold">Pesanan di {{ selectedCity }}</h3>
            <button @click="closeSidebar" class="text-sm text-red-500 hover:underline">Tutup</button>
          </div>
          <ul class="text-sm">
            <li v-for="(order, i) in filteredOrders" :key="i">
              {{ order.Nama }} - {{ order['Jumlah Produk'] }} produk
            </li>
          </ul>
        </SideBar>
      </LMap>
    </div>

    <!-- OrderModal -->
    <div class="modal-overlay " v-if="showModal">
    <div class="modal-content">
    <h2 class="text-2xl font-bold text-cyan-950 mb-6 text-center" style="font-family: 'Poppins', sans-serif;">TAMBAH PESANAN</h2>
  
    <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Nama Pemesan:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="form.namaPemesan" type="text" placeholder="Nama Pemesan" />

    <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Nomor Telepon :</label>
    <div class="flex items-center border rounded p-2 mb-5 bg-white">
      <span class="text-cyan-950 mr-2" style="font-family: 'Poppins', sans-serif;">+62</span>
      <input
        class="flex-1 text-cyan-950 outline-none"
        v-model="form.nomorTelepon"
        type="number"
        placeholder="Nomor Telepon"
        style="font-family: 'Poppins', sans-serif;"
      />
    </div>

    <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Kota:</label>
    <select class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="form.kota">
      <option class="text-cyan-950" disabled value="" style="font-family: 'Poppins', sans-serif;">Pilih Kota</option>
      <option>Bogor</option>
      <option>Kota Bogor</option>
      <option>Bekasi</option>
      <option>Kota Bekasi</option>
      <option>Jakarta Selatan</option>
      <option>Depok</option>
      <option>Tanggerang</option>
      <option>Cirebon</option>
    </select>

    <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Alamat:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" v-model="form.alamat" type="text" placeholder="Masukkan Alamat" />

    <div class="flex gap-6">
    <div class="flex flex-col w-full">
      <label class="text-cyan-950 mb-1" style="font-family: 'Poppins', sans-serif;">Longitude</label>
      <input class="text-cyan-950 border p-2 w-full rounded mb-5" v-model="form.longitude" type="text" placeholder="Masukkan Longitude"/>
    </div>

  <div class="flex flex-col w-full">
    <label class="text-cyan-950 mb-1" style="font-family: 'Poppins', sans-serif;">Latitude</label>
    <input class="text-cyan-950 border p-2 w-full rounded mb-5" style="font-family: 'Poppins', sans-serif;" v-model="form.latitude" type="text" placeholder="Masukkan Latitude"/>
  </div>
</div>
    
    <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Jenis Produk:</label>
    <select class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="form.jenisProduk">
      <option class="text-cyan-950" style="font-family: 'Poppins', sans-serif;" disabled value="">Pilih Jenis Produk</option>
      <option>Kaos</option>
      <option>Almamater</option>
      <option>Seragam Jas</option>
      <option>Jaket</option>
      <option>Jersey</option>
      <option>Extra</option>
    </select>

    <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Jumlah Produk:</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model.number="form.jumlahProduk" type="number" placeholder="Jumlah Produk" />

    <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Harga Produk (tanpa extra):</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;"  v-model.number="form.hargaPerBaju" type="number" placeholder="Harga per Baju" />

    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" :value="totalHargaFormatted" type="text" placeholder="Total Seluruh Harga" disabled />

    <div class="ukuran-group">
      <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Ukuran:</label>
      <br>
      <label class="text-cyan-950 pr-9" style="font-family: 'Poppins', sans-serif;">S</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model.number="form.ukuran.S" type="number" placeholder="S" />
      <br>
      <label class="text-cyan-950 pr-7" style="font-family: 'Poppins', sans-serif;">M</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model.number="form.ukuran.M" type="number" placeholder="M" />
      <br>
      <label class="text-cyan-950 pr-9" style="font-family: 'Poppins', sans-serif;">L</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model.number="form.ukuran.L" type="number" placeholder="L" />
      <br>
      <label class="text-cyan-950 pr-7" style="font-family: 'Poppins', sans-serif;">XL</label>
      <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model.number="form.ukuran.XL" type="number" placeholder="XL" />
    </div>

                      <!-- Tabel Input Extra -->
                        <h3 class="text-lg font-semibold text-cyan-950 mb-2" style="font-family: 'Poppins', sans-serif;">Tambah Extra</h3>

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
                            <input v-model="extra.name" class="w-full border rounded p-1" />
                          </td>
                          <td class="border p-2">
                            <input v-model.number="extra.price" type="number" class="w-full border rounded p-1" />
                          </td>
                          <td class="border p-2">
                            <input v-model.number="extra.quantity" type="number" class="w-full border rounded p-1" />
                          </td>
                          <td class="border p-2">
                            Rp{{ extra.price * extra.quantity }}
                          </td>
                          <td class="border p-2">
                            <button @click="hapusExtra(index)" class="text-red-600 hover:underline">Hapus</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <!-- Form Tambah Extra -->
                    <div class="grid grid-cols-4 gap-2 mb-2">
                      <input class="border p-2 rounded" v-model="extraInput.name" type="text" placeholder="Nama Extra (contoh: Lengan Panjang)" />
                      <input class="border p-2 rounded" v-model.number="extraInput.price" type="number" placeholder="Harga Extra" />
                      <input class="border p-2 rounded" v-model.number="extraInput.quantity" type="number" placeholder="Jumlah Extra" />
                      <input class="border p-2 rounded bg-gray-100" :value="extraInput.price * extraInput.quantity" type="text" placeholder="Total" disabled />
                    </div>

                    <button @click="tambahExtra" class="bg-cyan-950 text-white px-3 py-1 rounded mb-4">+ Tambah Extra</button>
                    <br>

                    <label class="text-cyan-950">Total Harga Extra:</label>
                    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" :value="totalHargaExtraFormatted" type="text" placeholder="Harga extra" disabled />

    <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Total Harga Pesanan (Produk + Extra):</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" :value="totalHargaPesananFormatted" type="text" placeholder="Total Seluruh Harga" disabled />

    <label class="text-cyan-950 pr-6" style="font-family: 'Poppins', sans-serif;">Tenggat Waktu</label>
    <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="form.tanggalPengeluaran" type="date" />
    
    <div class="flex justify-end space-x-2">
      <button @click="closeModal" class="btn bg-gray-200 text-white" style="font-family: 'Poppins', sans-serif;">Batal</button>
      <button v-if="!isEdit" @click="addOrder" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Simpan</button>
      <button v-else @click="updateOrder" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Update</button>
    </div>
  </div>
  </div>



<!-- Detail Order Modal -->
<div class="modal-overlay"  v-if="isDetailVisible">
  <div class="modal-content max-w-3xl w-full bg-white rounded-xl shadow p-6">
    <h1 class="text-2xl font-bold mb-6 border-b pb-4 text-cyan-950 text-center" style="font-family: 'Poppins', sans-serif;">Detail Pesanan</h1>

    <div class="flex justify-between text-sm text-gray-600 mb-1" style="font-family: 'Poppins', sans-serif;">
      <p>Pesanan atas nama <strong>{{ detailData.customerName }}</strong></p>
      <p>No. Telp: +62 {{ detailData.phoneNumber }}</p>
    </div>

    <div class="flex justify-between text-sm text-gray-600 mb-4" style="font-family: 'Poppins', sans-serif;">
      <p>Alamat: {{ detailData.address }}</p>
      <p class="text-xl font-semibold text-right text-black" style="font-family: 'Poppins', sans-serif;">
        Jumlah Produk<br><span class="text-2xl">{{ detailData.productQuantity }}</span>
      </p>
    </div>

    <p class="text-sm mb-2">Status Pembayaran: 
      <span
        class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
        :class="{
          'bg-green-100 text-green-800': detailData.status === 'PAID',
          'bg-yellow-100 text-yellow-800': detailData.status === 'PENDING',
          'bg-red-100 text-red-800': detailData.status === 'FAILED'
        }"
      >
        {{ detailData.status }}
      </span>
    </p>

    <table class="w-full text-sm border-t mt-4">
      <thead>
        <tr class="text-gray-500" style="font-family: 'Poppins', sans-serif;">
          <th class="py-2 text-left">Jenis Produk</th>
          <th class="py-2 text-right">Ukuran (S/M/L/XL/XXL/Lainnya)</th>
          <!-- <th class="py-2 text-right">Harga Satuan</th> -->
        </tr>
      </thead>
      <tbody>
        <tr class="border-t text-black text-left" style="font-family: 'Poppins', sans-serif;">
          <td class="py-2">{{ detailData.productType }}</td>
          <td class="py-2 text-right">
            S: {{ detailData.sizeS }},
            M: {{ detailData.sizeM }},
            L: {{ detailData.sizeL }},
            XL: {{ detailData.sizeXL }},
            XXL: {{ detailData.sizeXXL }},
            lainnya: {{ detailData.otherSize }}
          </td>
          <!-- <td class="py-2 text-right">{{ totalHargaFormat(detailData.hargaPerBaju) }}</td> -->
        </tr>
      </tbody>
    </table>

    <table class="w-full text-sm text-left border-t mt-4" v-if="detailData.extras && detailData.extras.length">
      <thead>
        <tr class="text-gray-500" style="font-family: 'Poppins', sans-serif;">
          <th class="py-2">Jenis Extra</th>
          <th class="py-2">Harga</th>
          <th class="py-2">Jumlah</th>
          <th class="py-2 text-right">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(extra, index) in detailData.extras" :key="index" class="border-t text-black" style="font-family: 'Poppins', sans-serif;">
          <td class="py-2">{{ extra.name }}</td>
          <td class="py-2">{{ totalHargaExtraFormat(extra.price) }}</td>
          <td class="py-2">{{ extra.quantity }}</td>
          <td class="py-2 text-right">{{ totalHargaExtraFormat(extra.price * extra.quantity) }}</td>
        </tr>
      </tbody>
    </table>

    <table class="w-full text-sm text-right border-t mt-4">
      <thead>
        <tr class="text-gray-500" style="font-family: 'Poppins', sans-serif;">
          <th class="py-2">Total Harga</th>
        </tr>
      </thead>
      <tbody>
        <tr class="border-t text-black" style="font-family: 'Poppins', sans-serif;">
          <td class="py-2">{{ totalHargaFormat(detailData.totalPrice) }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-end mt-6">
      <button @click="isDetailVisible = false" class="btn bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 text-sm" style="font-family: 'Poppins', sans-serif;">Tutup</button>
    </div>
  </div>
</div>

    <!-- Bayar Modal -->
      <div class="modal-overlay" v-if="showModalBayar">
        <div class="modal-content">
          <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center" style="font-family: 'Poppins', sans-serif;">Bayar Pesanan</h2>

          <label class="text-cyan-950 block mb-1" style="font-family: 'Poppins', sans-serif;">Link Bayar</label>
          <div class="flex items-center justify-between border p-2 rounded mb-5 bg-white">
            <a 
              :href="linkBayar" 
              target="_blank" 
              class="text-cyan-950 underline break-all"
              style="font-family: 'Poppins', sans-serif;"
            >
              {{ linkBayar }}
            </a>
            <button @click="copyLinkBayar" class="ml-2 text-cyan-950" title="Salin Link" style="font-family: 'Poppins', sans-serif;">
              <!-- Icon copy SVG -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" 
                  viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" 
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-4 4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
              </svg>
            </button>
          </div>

          <div class="flex justify-end space-x-2">
            <button @click="closeModalBayar" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Selesai</button>
          </div>
        </div>
      </div>
    </div>
</div>

</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import SideBar from '@/components/SideBar.vue';
import {
  LMap,
  LTileLayer,
  LCircleMarker,
  LPopup,
  LGeoJson,
  LControl
} from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import L from 'leaflet';

// Konfigurasi marker default Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href
});

// State
const orders = ref([]);
const mapRef = ref(null);
const selectedLayer = ref('marker');
const center = { lat: -6.5, lng: 106.8 };
const geojsonData = ref(null);
const showBoundary = ref(true);

const showSidebar = ref(false);
const selectedCity = ref(null);
const highlightFeature = ref(null);

// Filter order berdasarkan kota jika selectedCity diisi
const filteredOrders = computed(() => {
  if (!selectedCity.value) return orders.value;
  return orders.value.filter(o => o.Kota?.trim() === selectedCity.value);
});

// Hitung jumlah pembelian per kota
const kotaPurchaseCount = computed(() => {
  const count = {};
  orders.value.forEach(item => {
    const namaKota = item.Kota?.trim();
    const jumlah = Number(item['Jumlah Produk']) || 0;
    if (namaKota) {
      count[namaKota] = (count[namaKota] || 0) + jumlah;
    }
  });
  return count;
});

const terciles = computed(() => {
  const values = Object.values(kotaPurchaseCount.value)
    .filter(v => v > 0)
    .sort((a, b) => a - b);

  const q = (p) => {
    const pos = (values.length - 1) * p;
    const base = Math.floor(pos);
    const rest = pos - base;
    return values[base] + rest * ((values[base + 1] ?? 0) - values[base]);
  };

  return {
    Q1: q(1 / 3),
    Q2: q(2 / 3)
  };
});

const getColorByTotalPurchase = (kota) => {
  const total = kotaPurchaseCount.value[kota] || 0;
  const { Q1, Q2 } = terciles.value;

  if (total >= Q2) return 'red';     // level tinggi
  if (total >= Q1) return 'orange';  // level menengah
  if (total > 0) return 'yellow';    // level rendah
  return null;                       // tidak ada warna
};

// Warna marker per pelanggan
const getColorByCustomerPurchase = (jumlahProduk) => {
  if (jumlahProduk >= 100) return 'red';
  if (jumlahProduk >= 50) return 'orange';
  return 'yellow';
};

// Style GeoJSON
const styleFeature = (feature) => {
  const namaKota = feature.properties.NAME_2?.trim();
  const total = kotaPurchaseCount.value[namaKota] || 0;
  const isSelected = selectedCity.value === namaKota;
  const fillColor = getColorByTotalPurchase(namaKota);

  if (isSelected) {
    return {
      color: '#333',        // border lebih tebal
      weight: 2,
      fillColor: 'transparent',
      fillOpacity: 0
    };
  }

  if (total <= 0 || !fillColor) {
    return {
      fillColor: 'transparent',
      color: 'transparent',
      weight: 0,
      fillOpacity: 0,
      opacity: 0
    };
  }

  return {
    color: '#666',
    weight: 1,
    fillColor,
    fillOpacity: 0.6
  };
};

// Filter GeoJSON berdasarkan kota terpilih
const filteredGeoJson = computed(() => {
  if (!geojsonData.value) return null;
  if (!selectedCity.value) return geojsonData.value;

  return {
    ...geojsonData.value,
    features: geojsonData.value.features.filter(
      f => f.properties.NAME_2?.trim() === selectedCity.value
    )
  };
});

watch([selectedCity, filteredGeoJson], ([city, geojson]) => {
  if (city && geojson && mapRef.value && geojson.features.length > 0) {
    const layer = L.geoJSON(geojson);
    const bounds = layer.getBounds();
    mapRef.value.leafletObject.fitBounds(bounds);
  }
});

// Klik polygon wilayah
const onFeatureClick = (e) => {
  const kota = e.target.feature.properties.NAME_2?.trim();
  selectedCity.value = kota;
  highlightFeature.value = e.target.feature;
  showSidebar.value = true;
};

// Callback per feature
const onEachFeature = (feature, layer) => {
  layer.on({
    click: onFeatureClick
  });
};

// Tutup sidebar
const closeSidebar = () => {
  showSidebar.value = false;
  selectedCity.value = null;
  highlightFeature.value = null;
};

// Ambil data pesanan
onMounted(async () => {
  try {
    const res = await axios.get('/api/maps-order', {
      headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      }
    });

    const data = res.data;
    orders.value = data
      .map(item => {
        const latitude = Number(item.Latitude || item.latitude);
        const longitude = Number(item.Longitude || item.longitude);
        if (!isFinite(latitude) || !isFinite(longitude)) return null;

        const kota = item.Kota?.trim();
        const tipeWilayah = kota?.toLowerCase().startsWith('kota') ? 'kota' : 'kabupaten';

        return {
          ...item,
          latitude,
          longitude,
          Kota: kota,
          tipeWilayah
        };
      })
      .filter(Boolean);
  } catch (err) {
    console.error('Gagal mengambil data pesanan:', err);
  }
});

// Ambil GeoJSON wilayah
onMounted(async () => {
  const res = await fetch('/jawa.geojson');
  geojsonData.value = await res.json();
});
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
      linkBayar: '',
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
        totalhargapesanan: 0,
        dp: '',
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
        name: '',
        price: 0,
        quantity: 0
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
        return acc + (item.price * item.quantity);
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
        this.extraInput.name &&
        this.extraInput.price > 0 &&
        this.extraInput.quantity > 0
      ) {
        this.form.extras.push({
          name: this.extraInput.name,
          price: this.extraInput.price,
          quantity: this.extraInput.quantity
        });
        this.extraInput = { name: '', price: 0, quantity: 0 };
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
      axios.post('https://api.rahayu-konveksi.ydns.eu/api/ewallet/payment/orders', {
        CustomerName: this.form.namaPemesan,
        PhoneNumber: this.form.nomorTelepon.toString(),
        City: this.form.kota,
        Address: this.form.alamat,
        Longitude: parseFloat(this.form.longitude),
        Latitude: parseFloat(this.form.latitude),
        ProductType: this.form.jenisProduk,
        ProductQuantity: this.form.jumlahProduk,
        Deadline: this.form.tanggalPengeluaran,
        Status: this.form.status || "Belum Bayar",
        Extras: this.form.extras.map(extra => ({
          name: extra.name,
          price: extra.price.toString(), // match your C# model (string)
          quantity: extra.quantity
        })),
        ExtraPrice: this.totalHargaExtra, // or this.form.extra if that's correct
        SizeS: this.form.ukuran.S,
        SizeM: this.form.ukuran.M,
        SizeL: this.form.ukuran.L,
        SizeXL: this.form.ukuran.XL,
        SizeXXL: this.form.ukuran.XXL,
        OtherSize: this.form.ukuran.lainnya,
        TotalPrice: this.totalHargaPesanan,
      }, 
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        }
      )
        .then(response => {
          this.daftarPesanan.push(response.data);
          this.showModal = false;
          this.resetForm();
        })
        .catch(error => {
          console.error('Error adding order:', error);
        });
    },
    showDetail(order) {
      this.detailData = order;
      this.isDetailVisible = true;
    },
    closeDetail() {
      this.isDetailVisible = false;
      this.resetForm();
    },
    editOrder(id) {
      axios.put(`https://api.rahayu-konveksi.ydns.eu/api/orders/${id}`, {
        ...this.form,
        Extras: this.form.extras.map(extra => ({
          name: extra.name,
          price: extra.price.toString(),
          quantity: extra.quantity
        })),
        ExtraPrice: this.totalHargaExtra,
        TotalPrice: this.totalHargaPesanan
      }, 
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(response => {
          const index = this.daftarPesanan.findIndex(order => order.id === id);
          if (index !== -1) {
            this.daftarPesanan[index] = response.data;
            this.resetForm();
            this.showModal = false;
          }
        })
        .catch(error => {
          console.error('Error updating order:', error);
        });
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
      const order = this.daftarPesanan[index];
      this.linkBayar = order.paymentUrl || ''; // Ganti dengan URL yang sesuai
      this.showModalBayar = true;
    },
    closeModalBayar() {
      this.showModalBayar = false;
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
      this.extraInput = { name: '', price: 0, quantity: 0 };
      this.isEdit = false;
      this.editIndex = null;
    },
    fetchOrders() {
      axios.get('https://api.rahayu-konveksi.ydns.eu/api/orders', {
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
      })
        .then(response => {
          this.daftarPesanan = response.data;
          console.log('Orders fetched:', this.daftarPesanan);
        })
        .catch(error => {
          console.error('Error fetching orders:', error);
        });
    }
  },
  mounted() {
    this.fetchOrders();
  }
}
</script>