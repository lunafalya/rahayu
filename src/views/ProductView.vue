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
                    <font-awesome-icon icon="shirt" class="w-10 h-10 p-2 transition-all duration-300 bg-cyan-300 rounded-sm" />
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
    
    <!-- Search Bar and Add Button -->
    <div class="flex-grow p-6 flex gap-6 main-content">
    <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
    <div class="order-page">
      <div class="flex mt-8 justify-between pb-6">
          <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-cyan-950 border px-3" />
          <button @click="showModal=true" class="btn hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
          Tambah
        </button>
      </div>

        <!-- Product Grid -->
        <h2 class="text-xl font-bold mb-4">Baju Olahraga</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <div
            v-for="(item, index) in filteredProducts"
            :key="index"
            class="border rounded-lg shadow hover:shadow-lg p-4 text-center bg-white"
          >
            <img :src="item.imageUrl" alt="Produk" class="w-full h-48 object-cover rounded mb-2" />
            <h3 class="font-semibold">{{ item.name }}</h3>
            <p class="text-sm text-gray-600">{{ item.priceRange }}</p>
            <button @click="editProduct(index)" class="bg-cyan-950 text-white px-4 py-1 mt-2 rounded">Edit</button>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div v-if="openModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white p-6 rounded-lg shadow w-full max-w-md">
          <h2 class="text-lg font-bold mb-4">{{ editing ? 'Edit Produk' : 'Tambah Produk' }}</h2>
          <form @submit.prevent="saveProduct">
            <label class="block mb-2">Kategori Produk</label>
            <select v-model="form.category" class="w-full border p-2 rounded mb-4">
              <option disabled value="">Pilih Kategori</option>
              <option>Kaos</option>
              <option>Almamater</option>
              <option>Seragam Jas</option>
              <option>Jaket</option>
              <option>Jersey</option>
            </select>

            <label class="block mb-2">Nama Produk</label>
            <input v-model="form.name" type="text" class="w-full border p-2 rounded mb-4" />

            <label class="block mb-2">Harga</label>
            <input v-model="form.priceRange" type="text" class="w-full border p-2 rounded mb-4" />

            <label class="block mb-2">Gambar Produk</label>
            <input type="file" @change="handleImageUpload" class="w-full border p-2 rounded mb-4" />

            <div class="flex justify-end space-x-2">
              <button @click="closeModal" type="button" class="bg-gray-300 px-4 py-2 rounded">Batal</button>
              <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
// import Sidebar from '../components/Sidebar.vue'

const openModal = ref(false)
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
  openModal.value = true
  editing.value = true
  editIndex.value = index
}

function closeModal() {
  openModal.value = false
  editing.value = false
  editIndex.value = null
  form.value = {
    name: '',
    category: '',
    priceRange: '',
    imageUrl: '',
  }
}

const filteredProducts = computed(() => {
  if (!search.value) return products.value
  return products.value.filter(p =>
    p.name.toLowerCase().includes(search.value.toLowerCase())
  )
})
</script>

<style scoped>
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
</style>