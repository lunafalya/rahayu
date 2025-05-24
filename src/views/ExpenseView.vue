<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar />

    <!-- Expense -->
    <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
    <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
    <div class="karyawan-page">      
        <div class="flex mt-8 justify-between pb-6">
            <input v-model="search" type="text" placeholder="Cari disini..." style="font-family: 'Poppins', sans-serif;" class="search-bar text-cyan-950 border px-3 py-2" />
      </div>
      

        <!-- Tab Buttons -->
        <div class="flex gap-4 mb-4">
            <div class="flex gap-2 mb-4">
            <button class="shadow-lg" @click="tab = 'General'" :class="getTabClass('General')">Pengeluaran General</button>
            <button class="shadow-lg" @click="tab = 'Gaji'" :class="getTabClass('Gaji')">Gaji Karyawan</button>
            <button class="shadow-lg" @click="tab = 'Peminjaman'" :class="getTabClass('Peminjaman')">Peminjaman</button>
            </div>
            <button @click="openCategorySelector" style="font-family: 'Poppins', sans-serif;" class="btn shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
            Tambah
          </button>
        </div>

        <!-- Tabel General -->
        <div class="overflow-x-auto rounded-box border border-base-content/5  bg-gray-400">
        <table v-if="tab === 'General'" class="w-full text-left">
          <thead>
            <tr>
              <th style="font-family: 'Poppins', sans-serif;" class="overflow-x-auto bg-gray-400 text-white px-4 py-2 shadow-lg">Nominal</th>
              <th style="font-family: 'Poppins', sans-serif;" class="overflow-x-auto bg-gray-400 text-white px-4 py-2 shadow-lg">Keterangan</th>
              <th style="font-family: 'Poppins', sans-serif;" class="overflow-x-auto bg-gray-400 text-white px-4 py-2 shadow-lg">Tanggal</th>
              <th style="font-family: 'Poppins', sans-serif;" class="overflow-x-auto bg-gray-400 text-white px-4 py-2 shadow-lg">Status</th>
              <th style="font-family: 'Poppins', sans-serif;" class="overflow-x-auto bg-gray-400 text-white px-4 py-2 shadow-lg">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white text-cyan-950 px-4 py-2" style="font-family: 'Poppins', sans-serif;">
            <tr v-for="(item, index) in generalList" :key="index">
              <td class="px-4 py-2">{{totalHargaFormat(item.totalExpense) }}</td>
              <td class="px-4 py-2">{{ item.description }}</td>
              <td class="px-4 py-2">{{ Intl.DateTimeFormat('id-ID').format(new Date(item.date)) }}</td>
              <td class="px-4 py-2">{{ item.status }}</td>
              <td class="px-4 py-2">
                <button @click="showDetail(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-700">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Tabel Gaji -->
        <table v-if="tab === 'Gaji'" class="w-full text-left">
          <thead>
            <tr>
              <th class="overflow-x-auto text-white bg-gray-400  px-4 py-2" style="font-family: 'Poppins', sans-serif;">Nama Karyawan</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Total Gaji</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Potongan</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Tanggal</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Status</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white text-cyan-950 px-4 py-2" style="font-family: 'Poppins', sans-serif;">
            <tr v-for="(item, index) in gajiList" :key="index">
              <td class="px-4 py-2">{{ getKaryawanName(item.employeeId) }}</td>
              <td class="px-4 py-2">{{ totalHargaFormat(item.totalSalary) }}</td>
              <td class="px-4 py-2">{{ totalHargaFormat(item.deduction) }}</td>
              <td class="px-4 py-2">{{ Intl.DateTimeFormat('id-ID').format(new Date(item.date)) }}</td>
              <td class="px-4 py-2">{{ item.status }}</td>
              <td>
                <button v-if="item.transaction == 'Cash'" @click="editGaji(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-700">Edit</button>
                <button @click="showDetail(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-700">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Tabel Pinjam -->
        <table v-if="tab === 'Peminjaman'" class="w-full text-left">
          <thead>
            <tr>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Nama Karyawan</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Nominal Pinjaman</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Tanggal</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Status</th>
              <th class="overflow-x-auto text-white bg-gray-400 px-4 py-2" style="font-family: 'Poppins', sans-serif;">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white text-cyan-950 px-4 py-2" style="font-family: 'Poppins', sans-serif;">
            <tr v-for="(item, index) in pinjamList" :key="index">
              <td class="px-4 py-2">{{ getKaryawanName(item.employeeId) }}</td>
              <td class="px-4 py-2">{{ totalHargaFormat(item.amount) }}</td>
              <td class="px-4 py-2">{{ Intl.DateTimeFormat('id-ID').format(new Date(item.date)) }}</td>
              <td class="px-4 py-2">{{ item.status }}</td>
              <td>
                <button v-if="item.transaction == 'Cash'" @click="editPinjam(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-700">Edit</button>
                <button @click="showDetail(item)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-700">Detail</button>
              </td>
            </tr>
          </tbody>
        </table>
        </div>

        <!-- Modal Pilih Kategori -->
        <div class="modal-overlay" v-if="showCategoryModal">
          <div class="modal-content">
            <h2 class="text-xl font-bold text-cyan-950 mb-4" style="font-family: 'Poppins', sans-serif;">Pilih Kategori Pengeluaran</h2>
            <div class="flex gap-2 mb-4">
              <button class="btn hover:bg-gray-300 hover:text-cyan-700 bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;" @click="selectCategory('General')">General</button>
              <button class="btn hover:bg-gray-300 hover:text-cyan-700 bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;" @click="selectCategory('Gaji')">Gaji</button>
              <button class="btn hover:bg-gray-300 hover:text-cyan-700 bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;" @click="selectCategory('Peminjaman')">Peminjaman</button>
            </div>
            <button @click="showCategoryModal = false" class="mt-4 text-gray-500 hover:text-cyan-700" style="font-family: 'Poppins', sans-serif;">Batal</button>
          </div>
        </div>

        <!-- Modal Gaji -->
        <div class="modal-overlay" v-if="showGajiModal">
          <div class="modal-content max-w-xl w-full">
            <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center" style="font-family: 'Poppins', sans-serif;">Form Gaji Karyawan</h2>
            
            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Nama Karyawan</label>
            <select v-model="gajiForm.id_karyawan" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5">
              <option v-for="k in karyawanList" :key="k.id" :value="k.id">{{ k.name }}</option>
            </select>

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Transaksi</label>
            <select v-model="gajiForm.transaksi" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
              <option class="text-cyan-950" disabled value="">Pilih Jenis Transaksi</option>
              <option>Cash</option>
              <option>Transfer</option>
            </select>

               <!-- Tabel Input Jasa -->
               <h3 class="text-lg font-semibold text-cyan-950 mb-2" style="font-family: 'Poppins', sans-serif;">Jasa</h3>

                <!-- Tabel Daftar Extra Ditambahkan -->
                <table class="w-full text-sm border border-gray-300 mb-4" style="font-family: 'Poppins', sans-serif;">
                <thead class="bg-cyan-200">
                <tr>
                  <th class="p-2 border">Produk</th>
                  <th class="p-2 border">Harga per item</th>
                  <th class="p-2 border">Jumlah pengerjaan</th>
                  <th class="p-2 border">Subtotal</th>
                  <th class="p-2 border">Aksi</th>
                </tr>
                </thead>
                <tbody>
                  <tr v-for="(jasa, index) in gajiForm.jasa" :key="index">
                    <td class="border p-2">{{ jasa.produk }}</td>
                    <td class="border p-2">Rp{{ jasa.harga }}</td>
                    <td class="border p-2">{{ jasa.jumlah }}</td>
                    <td class="border p-2">Rp{{ jasa.harga * jasa.jumlah }}</td>
                    <td class="border p-2">
                      <button @click="hapusGaji(index)" class="text-red-600 hover:underline" style="font-family: 'Poppins', sans-serif;">Hapus</button>
                    </td>
                  </tr>
                </tbody>
                </table>

                <!-- Form Tambah Extra -->
                <div class="grid grid-cols-4 gap-2 mb-2">
                <input class="border p-2 rounded" v-model="gajiInput.produk" type="text" placeholder="Nama Produk" />
                <input class="border p-2 rounded" v-model.number="gajiInput.harga" type="number" placeholder="Harga/item" />
                <input class="border p-2 rounded" v-model.number="gajiInput.jumlah" type="number" placeholder="Jumlah item" />
                <input class="border p-2 rounded bg-gray-100" :value="gajiInput.harga * gajiInput.jumlah" type="text" placeholder="Subtotal" disabled />
                </div>

                <button @click="tambahJasa" class="bg-cyan-950 text-white px-3 py-1 rounded mb-4" style="font-family: 'Poppins', sans-serif;">+ Tambah Extra</button>
                <br>

                <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Total Gaji:</label>
                <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" :value="totalHargaJasaFormatted" type="text" placeholder="Harga jasa" disabled />

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Total Pinjaman</label>
            <input v-model="gajiForm.potongan" type="number" style="font-family: 'Poppins', sans-serif;" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>
            
            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Pinjaman yang ingin dibayar</label>
            <input v-model="gajiForm.potongan" type="number" style="font-family: 'Poppins', sans-serif;" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Total yang dibayarkan</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" :value="totalGajiFormatted" type="text" placeholder="Total Seluruh Harga" disabled />

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Tanggal Pengajuan</label>
            <input v-model="gajiForm.tanggal_pengajuan" style="font-family: 'Poppins', sans-serif;" type="date" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5"/>

            <div class="flex justify-end gap-2">
              <button @click="resetGajiForm" class="btn bg-gray-500 text-white" style="font-family: 'Poppins', sans-serif;">Batal</button>
              <button v-if="!isEditGaji" @click="addGaji" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Simpan</button>
              <button v-else @click="updateGaji" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Update</button>
            </div>
          </div>
        </div>

        
        <!-- Modal General Form -->
        <div class="modal-overlay" v-if="showGeneralModal">
          <div class="modal-content">
            <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center" style="font-family: 'Poppins', sans-serif;">Tambah Pengeluaran</h2>
            
            <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Nama</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="generalForm.nama" type="text" />

            <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Email</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="generalForm.email" type="text" />

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Tanggal Pengeluaran</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="generalForm.tanggal" type="date" />

            <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Keterangan</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="generalForm.keterangan" type="text" />

            <label class="text-cyan-950" style="font-family: 'Poppins', sans-serif;">Jumlah</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model.number="generalForm.jumlah" type="number" />

            <div class="flex justify-end space-x-2">
              <button @click="resetGeneralForm" class="btn bg-gray-500 text-white" style="font-family: 'Poppins', sans-serif;">Batal</button>
              <button v-if="!isEditGeneral" @click="addGeneral" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Simpan</button>
              <button v-else @click="updateGeneral" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Update</button>
            </div>
          </div>
        </div>

        <!-- Modal Pinjam Form -->
        <div class="modal-overlay" v-if="showPinjamModal">
          <div class="modal-content">
            <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center" style="font-family: 'Poppins', sans-serif;">Tambah Pengeluaran</h2>

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Nama Karyawan</label>
            <select v-model="pinjamForm.id_karyawan" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;">
              <option v-for="k in karyawanList" :key="k.id" :value="k.id">{{ k.name }}</option>
            </select>

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Transaksi</label>
            <select v-model="pinjamForm.transaksi" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6" style="font-family: 'Poppins', sans-serif;">
              <option class="text-cyan-950" style="font-family: 'Poppins', sans-serif;" disabled value="">Pilih Jenis Transaksi</option>
              <option>Cash</option>
              <option>Transfer</option>
            </select>

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Keterangan</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="pinjamForm.keterangan" type="text" />

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Nominal</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model.number="pinjamForm.jumlah" type="number" />

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Tanggal Pinjam</label>
            <input class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;" v-model="pinjamForm.tanggal" type="date" />

            <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Status</label>
            <select v-model="pinjamForm.status" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;">
              <option>Lunas</option>
              <option>Tunggak</option>
            </select>

            <div class="flex justify-end space-x-2">
              <button @click="resetPinjamForm" class="btn bg-gray-500 text-white" style="font-family: 'Poppins', sans-serif;">Batal</button>
              <button v-if="!isEditPinjam" @click="addPinjam" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Simpan</button>
              <button v-else @click="updatePinjam" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Update</button>
            </div>
          </div>
        </div>
      </div>


      


        <!-- Modal Detail -->
        <div class="modal-overlay " v-if="showDetailModal">
          <div class="modal-content max-w-xl w-full">
            <h2 class="text-3xl font-bold text-black mb-6 text-center" style="font-family: 'Poppins', sans-serif;">Detail {{ tab }}</h2>


            <div v-if="tab === 'General'" class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
              <h1 class="text-2xl font-bold mb-6 border-b pb-4" style="font-family: 'Poppins', sans-serif;">Detail Transaksi</h1>

              <div class="flex justify-between text-sm text-gray-600 mb-1" style="font-family: 'Poppins', sans-serif;">
                <p>Transaksi dikirim ke <strong>{{ detailData.name }}</strong></p>
                <p>ID Transaksi: {{ detailData.id }}</p>
              </div>
              <div class="flex justify-between text-sm text-gray-600 mb-4" style="font-family: 'Poppins', sans-serif;">
                <p>{{ Intl.DateTimeFormat('id-ID').format(new Date(detailData.date)) }}</p>
                <p class="text-xl font-semibold text-right text-cyan-950" style="font-family: 'Poppins', sans-serif;">Jumlah<br><span class="text-2xl text-black" style="font-family: 'Poppins', sans-serif;">{{ totalHargaFormat(detailData.totalExpense) }}</span></p>
              </div>

              <p class="text-sm mb-2">Status Transaksi: 
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-800': detailData.status === 'PAID',
                    'bg-yellow-100 text-yellow-800': detailData.status === 'PENDING',
                    'bg-red-100 text-red-800': detailData.status === 'FAILED',
                    'bg-gray-100 text-black': !['PAID', 'PENDING', 'FAILED'].includes(detailData.status)
                  }"
                >
                  {{ detailData.status }}
                </span>
              </p>

              <table class="w-full text-sm text-left border-t mt-4" style="font-family: 'Poppins', sans-serif;">
                <thead>
                  <tr class="text-gray-500" style="font-family: 'Poppins', sans-serif;">
                    <th class="py-2">Keterangan</th>
                    <th class="py-2">Alamat Email</th>
                    <th class="py-2 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t text-black" style="font-family: 'Poppins', sans-serif;">
                    <td class="py-2">{{ detailData.description }}</td>
                    <td class="py-2">{{ detailData.email }}</td>
                    <td class="py-2 text-right">{{ totalHargaFormat(detailData.totalExpense) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t font-semibold" style="font-family: 'Poppins', sans-serif;">
                    <td colspan="3" class="py-2 text-right">Total</td>
                    <td class="py-2 text-right">{{ totalHargaFormat(detailData.totalExpense) }}</td>
                  </tr>
                </tfoot>
              </table>
              <div class="flex mt-4">
              <button @click="showDetailModal = false" class="btn bg-gray-500 text-white">Tutup</button>
            </div>
            </div>
            

            <div v-else-if="tab === 'Gaji'" class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
              <h1 class="text-2xl font-bold mb-6 border-b pb-4 text-black" style="font-family: 'Poppins', sans-serif;">Detail Transaksi Gaji</h1>

              <div class="flex justify-between text-sm text-gray-600 mb-1" style="font-family: 'Poppins', sans-serif;">
                <p>Transaksi dikirim ke <strong>{{ karyawanName }}</strong></p>
                <p>ID Transaksi: {{ detailData.id }}</p>
              </div>
              <div class="flex justify-between text-sm text-gray-600 mb-4">
                <p>{{ Intl.DateTimeFormat('id-ID').format(new Date(detailData.date)) }}</p>
                <p style="font-family: 'Poppins', sans-serif;" class="text-xl font-semibold text-right text-black">Jumlah<br><span class="text-2xl text-black">{{ totalHargaFormat(detailData.salaryPaid) }}</span></p>
              </div>

              <p class="text-sm mb-2" style="font-family: 'Poppins', sans-serif;">Status Transaksi: 
                <span
                  class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-green-100 text-green-800': detailData.status === 'PAID',
                    'bg-yellow-100 text-yellow-800': detailData.status === 'PENDING',
                    'bg-red-100 text-red-800': detailData.status === 'FAILED',
                    'bg-gray-100 text-black': !['PAID', 'PENDING', 'FAILED'].includes(detailData.status)
                  }"
                >
                  {{ detailData.status }}
                </span>
              </p>


              <!-- Tabel -->
              <table class="w-full text-sm text-left border-t mt-4">
                <thead>
                  <tr class="text-gray-500" style="font-family: 'Poppins', sans-serif;">
                    <th class="py-2">Transaksi</th>
                    <th class="py-2 text-right">Jumlah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr class="border-t text-black" style="font-family: 'Poppins', sans-serif;">
                    <td class="py-2">{{ detailData.transaction }}</td>
                    <td class="py-2 text-right">{{ totalHargaFormat(detailData.salaryPaid) }}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="border-t font-semibold" style="font-family: 'Poppins', sans-serif;">
                    <td colspan="3" class="py-2 text-right">Total</td>
                    <td class="py-2 text-right text-black">{{ totalHargaFormat(detailData.salaryPaid) }}</td>
                  </tr>
                </tfoot>
              </table>
              <div class="flex mt-4">
                <button @click="showDetailModal = false" class="btn bg-gray-500 text-white" style="font-family: 'Poppins', sans-serif;">Tutup</button>
              </div>
            </div>

            

              <div v-else-if="tab === 'Peminjaman'" class="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
                <h1 class="text-2xl font-bold mb-6 border-b pb-4" style="font-family: 'Poppins', sans-serif;">Detail Transaksi Peminjaman</h1>

                <div class="flex justify-between text-sm text-gray-600 mb-1" style="font-family: 'Poppins', sans-serif;">
                  <p>Transaksi dikirim ke <strong>{{ karyawanName }}</strong></p>
                  <p>ID Transaksi: {{ detailData.id }}</p>
                </div>
                <div class="flex justify-between text-sm text-gray-600 mb-4" style="font-family: 'Poppins', sans-serif;">
                  <p>{{ Intl.DateTimeFormat('id-ID').format(new Date(detailData.date)) }}</p>
                  <p class="text-xl font-semibold text-right text-black">Jumlah<br><span class="text-2xl text-black">{{ totalHargaFormat(detailData.amount) }}</span></p>
                </div>

                <p class="text-sm mb-2" style="font-family: 'Poppins', sans-serif;">Status Transaksi: 
                  <span
                    class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    :class="{
                      'bg-green-100 text-green-800': detailData.status === 'PAID',
                      'bg-yellow-100 text-yellow-800': detailData.status === 'PENDING',
                      'bg-red-100 text-red-800': detailData.status === 'FAILED',
                      'bg-gray-100 text-black': !['PAID', 'PENDING', 'FAILED'].includes(detailData.status)
                    }"
                  >
                    {{ detailData.status }}
                  </span>
                </p>

                <!-- Tabel -->
                <table class="w-full text-sm text-left border-t mt-4">
                  <thead>
                    <tr class="text-gray-500" style="font-family: 'Poppins', sans-serif;">
                      <th class="py-2">Keterangan</th>
                      <th class="py-2 text-right">Jumlah</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-t text-black" style="font-family: 'Poppins', sans-serif;">
                      <td class="py-2">{{ detailData.description }}</td>
                      <td class="py-2 text-right">{{ totalHargaFormat(detailData.amount) }}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr class="border-t font-semibold" style="font-family: 'Poppins', sans-serif;">
                      <td colspan="3" class="py-2 text-right">Total</td>
                      <td class="py-2 text-right">{{ totalHargaFormat(detailData.amount) }}</td>
                    </tr>
                  </tfoot>
                </table>
                <div class="flex mt-4">
                  <button @click="showDetailModal = false" class="btn bg-gray-500 text-white" style="font-family: 'Poppins', sans-serif;">Tutup</button>
                </div>
              </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SideBar from '@/components/SideBar.vue'
</script>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: '',
      tab: 'General',
      showDetailModal: false,
      showCategoryModal: false,
      showGajiModal: false,
      showGeneralModal: false,
      showPinjamModal: false,
      selectedDetail: {},
      gajiList: [],
      isEditGaji: false,
      editIndexGaji: null,
      generalList: [],
      isEditGeneral: false,
      editIndexGeneral: null,
      pinjamList: [],
      isEditPinjam: false,
      editIndexPinjam: null,
      pengeluaranList: [],
      detailData: null,
      produkList: [],
      form: {
        tanggal: '',
        kategori: '',
        keterangan: '',
        jumlah: null,
      },
      karyawanList: [],
      gajiForm: {
        id_karyawan: '',
        nama: '',
        produk: '',
        tambahan: '',
        total_gaji: 0,
        potongan: 0,
        tanggal_pengajuan: '',
        transaksi: '',
        total: '',
        vac: '',
        status: 'Lunas',
        jasa: []
      },
      gajiInput: {
        produk: '',
        harga: 0,
        jumlah: 0
      },
      generalForm: {
        kategori: '',
        jumlah: 0,
        tanggal: '',
        nama: '',
        keterangan: '',
        email: '',
        status: 'sukses'
      },
      pinjamForm: {
        id_karyawan: '',
        nama: '',
        transaksi: '',
        keterangan: '',
        jumlah: 0,
        tanggal: '',
        status: 'Tunggak'
      }
    }
  },

  computed: {
    totalHargaJasa() {
      return this.gajiForm.jasa.reduce((total, item) => total + (item.harga * item.jumlah), 0)
    },
    totalHargaJasaFormatted() {
      return 'Rp' + this.totalHargaJasa.toLocaleString('id-ID')
    },
    totalGaji() {
      const total = this.totalHargaJasa - (this.gajiForm.potongan || 0)
      return total
    },
    totalGajiFormatted() {
      return 'Rp' + this.totalGaji.toLocaleString('id-ID')
    },
    filteredByCategory() {
      return this.pengeluaranList.filter(
        p => p.kategori === this.tab && p.keterangan.toLowerCase().includes(this.search.toLowerCase())
      )
    },
    uniqueCategories() {
      return [...new Set(this.pengeluaranList.map(p => p.kategori))]
    },
    karyawanName() {
      if (!this.detailData || !this.detailData.employeeId) return '-';
      const karyawan = this.karyawanList.find(k => k.id === this.detailData.employeeId);
      return karyawan ? karyawan.name : '-';
    },
  },

  methods: {
    tambahJasa() {
      if (!this.gajiInput.produk || !this.gajiInput.harga || !this.gajiInput.jumlah) {
        alert("Mohon isi semua kolom jasa!");
        return;
      }
      const jasaBaru = {
        produk: this.gajiInput.produk,
        harga: this.gajiInput.harga,
        jumlah: this.gajiInput.jumlah,
      }
      this.gajiForm.jasa.push(jasaBaru)
      this.gajiInput = { produk: '', harga: 0, jumlah: 0 }
    },
    hapusGaji(index) {
      this.gajiForm.jasa.splice(index, 1)
    },
    totalHargaFormat(value) {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR'
      }).format(value || 0)
    },
    addGaji() {
      const email = this.getKaryawanEmail(this.gajiForm.id_karyawan);
      axios.post(`https://api.rahayu-konveksi.ydns.eu/api/ewallet/payout/payrolls?Email=${encodeURIComponent(email)}`, {
          EmployeeId: this.gajiForm.id_karyawan,
          TotalSalary: this.totalHargaJasa,
          Date: this.gajiForm.tanggal_pengajuan,
          Transaction: this.gajiForm.transaksi,
          Status: this.gajiForm.status,
          Deduction: this.gajiForm.potongan,
          SalaryPaid: this.totalGaji
      }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(response => {
          this.gajiList.push(response.data)
          this.resetGajiForm()
        })
        .catch(error => {
          console.error('Error adding gaji data:', error)
        })
    },
    editGaji(item) {
      this.gajiForm = {
        ...item,
        jasa: Array.isArray(item.jasa) ? item.jasa : []
      }
      this.isEditGaji = true
      this.showGajiModal = true
      this.editIndexGaji = this.gajiList.indexOf(item)
    },
    updateGaji() {
      if (this.editIndexGaji !== null) {
        const total = this.totalHargaJasa - (this.gajiForm.potongan || 0)
        this.gajiList[this.editIndexGaji] = { ...this.gajiForm, total }
      }
      this.resetGajiForm()
    },
    resetGajiForm() {
      this.gajiForm = {
        id_karyawan: '',
        nama: '',
        produk: '',
        tambahan: '',
        total_gaji: 0,
        potongan: 0,
        tanggal_pengajuan: '',
        transaksi: '',
        total: '',
        status: 'Lunas',
        jasa: []
      }
      this.gajiInput = { produk: '', harga: 0, jumlah: 0 }
      this.showGajiModal = false
      this.isEditGaji = false
      this.editIndexGaji = null
    },
    addGeneral() {
      axios.post('https://api.rahayu-konveksi.ydns.eu/api/ewallet/payout/generals', {
          Email: this.generalForm.email,
          TotalExpense: this.generalForm.jumlah,
          Date: this.generalForm.tanggal,
          Name: this.generalForm.nama,
          Description: this.generalForm.keterangan
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(response => {
          this.generalList.push(response.data)
          this.resetGeneralForm()
        })
        .catch(error => {
          console.error('Error adding general data:', error)
        })
    },
    resetGeneralForm() {
      this.generalForm = {
        kategori: '',
        jumlah: 0,
        tanggal: '',
        nama: '',
        keterangan: '',
        status: ''
      }
      this.showGeneralModal = false
      this.isEditGeneral = false
      this.editIndexGeneral = null
    },
    updateGeneral() {
      if (this.editIndexGeneral !== null) {
        this.generalList[this.editIndexGeneral] = { ...this.generalForm }
      }
      this.resetGeneralForm()
    },
    editGeneral(item) {
      this.generalForm = { ...item }
      this.isEditGeneral = true
      this.showGeneralModal = true
      this.editIndexGeneral = this.generalList.indexOf(item)
    },
    addPinjam() {
      const email = this.getKaryawanEmail(this.pinjamForm.id_karyawan);
      axios.post(`https://api.rahayu-konveksi.ydns.eu/api/ewallet/payout/loans?Email=${encodeURIComponent(email)}`, {
          EmployeeId: this.pinjamForm.id_karyawan,
          Amount: this.pinjamForm.jumlah,
          Date: this.pinjamForm.tanggal,
          Status: this.pinjamForm.status,
          Description: this.pinjamForm.keterangan,
          Transaction: this.pinjamForm.transaksi
        }, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(response => {
          this.pinjamList.push(response.data)
          this.resetPinjamForm()
        })
        .catch(error => {
          console.error('Error adding pinjam data:', error)
        })
    },
    resetPinjamForm() {
      this.pinjamForm = {
        id_karyawan: '',
        nama: '',
        transaksi: '',
        keterangan: '',
        jumlah: 0,
        tanggal: '',
        status: 'Tunggak'
      }
      this.showPinjamModal = false
      this.isEditPinjam = false
      this.editIndexPinjam = null
    },
    updatePinjam() {
      if (this.editIndexPinjam !== null) {
        this.pinjamList[this.editIndexPinjam] = { ...this.pinjamForm }
      }
      this.resetPinjamForm()
    },
    editPinjam(item) {
      this.pinjamForm = { ...item }
      this.isEditPinjam = true
      this.showPinjamModal = true
      this.editIndexPinjam = this.pinjamList.indexOf(item)
    },
    openCategorySelector() {
      this.showCategoryModal = true
    },
    selectCategory(category) {
      this.tab = category
      this.showCategoryModal = false
      if (category === 'Gaji') {
        this.showGajiModal = true
      } else if (category === 'General') {
        this.showGeneralModal = true
      } else if (category === 'Peminjaman') {
        this.showPinjamModal = true
      }
    },
    getTabClass(currentTab) {
      return this.tab === currentTab ? 'btn bg-cyan-950 text-white' : 'btn text-cyan-950 bg-white'
    },
    showDetail(item) {
      this.detailData = item
      this.showDetailModal = true
    },
    formatRupiah(angka) {
      return new Intl.NumberFormat('id-ID').format(angka)
    },
     getKaryawanName(id) {
      const karyawan = this.karyawanList.find(k => k.id === id);
      return karyawan ? karyawan.name : '-';
    },
     getKaryawanEmail(employeeId) {
      const karyawan = this.karyawanList.find(k => k.id === employeeId);
      return karyawan ? karyawan.email : '-';
    },
    fetchKaryawan() {
      axios.get('https://api.rahayu-konveksi.ydns.eu/api/employees', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(response => {
          this.karyawanList = response.data;
        })
        .catch(error => {
          console.error('Error fetching karyawan data:', error);
        });
    },
    fetchGeneral() {
      axios.get('https://api.rahayu-konveksi.ydns.eu/api/generals', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(response => {
          this.generalList = response.data;
          console.log(this.generalList);
        })
        .catch(error => {
          console.error('Error fetching general data:', error);
        });
    },
    fetchGaji() {
      axios.get('https://api.rahayu-konveksi.ydns.eu/api/payrolls', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(response => {
          this.gajiList = response.data;
          console.log(this.gajiList);
        })
        .catch(error => {
          console.error('Error fetching gaji data:', error);
        });
    },
    fetchPinjam() {
      axios.get('https://api.rahayu-konveksi.ydns.eu/api/loans', {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
          }
        })
        .then(response => {
          this.pinjamList = response.data;
          console.log(this.pinjamList);
        })
        .catch(error => {
          console.error('Error fetching pinjam data:', error);
        });
    }
        
  },

  mounted() {
    this.fetchKaryawan();
    this.fetchGeneral();
    this.fetchGaji();
    this.fetchPinjam();
  }
}
</script>