<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar />
    
<!-- Kontainer Utama -->
<div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
  <!-- Konten Putih -->
  <div class="bg-cyan-950 rounded-2xl shadow-md flex-grow p-6">
    <!-- Search bar dan tombol tambah -->
    <div class="flex mt-8 justify-between pb-6">
      <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-white border px-3 py-2" />
      <button @click="showModal = true" class="btn shadow-lg hover:bg-gray-300 hover:text-cyan-700 bg-cyan-700 text-white">
        Tambah
      </button>
    </div>

    <!-- Scrollable Produk Grid -->
    <div class="overflow-y-auto mt-4 pr-2" style="max-height: calc(100vh - 250px);">
      <div v-for="(items, category) in groupedProducts" :key="category" class="mb-10">
        <h2 class="text-xl font-bold mb-4 text-white">{{ category }}</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="(item, index) in items"
            :key="index"
            class="rounded-lg shadow hover:shadow-lg p-4 text-center bg-cyan-700"
          >
            <img :src="item.imageUrl" alt="Produk" class="w-full h-48 object-cover rounded mb-2" />
            <h3 class="font-semibold text-white">{{ item.name }}</h3>
            <p class="text-sm text-white ">{{ item.priceRange }}</p>
            <button
              @click="editProduct(item.originalIndex)"
              class="bg-cyan-950 text-white px-4 py-1 mt-2 rounded hover:bg-cyan-800"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
      

        
      <!-- Modal Form -->
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-content">
          <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Tambah Produk</h2>
          <label class="block mb-2  text-cyan-950">Kategori Produk</label>
            <select v-model="form.category" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5">
              <option disabled value="">Pilih Kategori</option>
              <option>Kaos</option>
              <option>Almamater</option>
              <option>Seragam Jas</option>
              <option>Jaket</option>
              <option>Jersey</option>
            </select>

            <label class="block mb-2 text-cyan-950">Nama Produk</label>
            <input v-model="form.name" type="text" placeholder="Nama Produk" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6" />

            <label class="block mb-2 text-cyan-950">Harga</label>
            <input v-model="form.priceRange" type="number" placeholder="Kisaran harga" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6" />

            <label class="block mb-2 text-cyan-950">Gambar Produk</label>
            <input type="file" @change="handleImageUpload" class="text-cyan-950 border p-2 rounded mt-1 mb-6" />

            <div class="flex justify-end space-x-2">
              <button @click="closeModal" type="button" class="bg-gray-300 px-4 py-2 rounded">Batal</button>
              <button @click="saveProduct" type="submit" class="bg-cyan-950 text-white px-4 py-2 rounded">Simpan</button>
            </div>
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
// import Sidebar from '../components/Sidebar.vue'

const showModal = ref(false)
const editing = ref(false)
const editIndex = ref(null)
const search = ref('')
const products = ref([])


const form = ref({
  name: '',
  category: '',
  priceRange: '',
  imageUrl: '',
})

function handleImageUpload(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      form.value.imageUrl = reader.result
    }
    reader.readAsDataURL(file)
  }
}

function saveProduct() {
  if (editing.value && editIndex.value !== null) {
    products.value[editIndex.value] = { ...form.value }
  } else {
    products.value.push({ ...form.value })
  }
  closeModal()
}

function editProduct(index) {
  const product = products.value[index]
  form.value = { ...product }
  showModal.value = true
  editing.value = true
  editIndex.value = index
}

function closeModal() {
  showModal.value = false
  editing.value = false
  editIndex.value = null
  form.value = {
    name: '',
    category: '',
    priceRange: '',
    imageUrl: '',
  }
}

const groupedProducts = computed(() => {
  const groups = {}
  filteredProducts.value.forEach((product, index) => {
    if (!groups[product.category]) {
      groups[product.category] = []
    }
    groups[product.category].push({ ...product, originalIndex: index })
  })
  return groups
})

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>
