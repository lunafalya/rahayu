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
          <button @click="showModal=true" class="btn hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
          Filter
        </button>
      </div>
      


<!-- Tabel Data Pemasukan -->
<div class="overflow-x-auto rounded-box border border-base-content/5 bg-cyan-950">
    <table class="table">
        <thead>
          <tr>
            <th>No.</th>
            <th>Tanggal</th>
            <th>Keterangan Pemasukan</th>
            <th>Jumlah</th>
          </tr>
        </thead>
        <tbody>

        </tbody>
      </table>
</div>
    
          </div>
         </div>
        </div>
    </div>
</template>

<script setup>
import SideBar from '@/components/SideBar.vue'
</script>