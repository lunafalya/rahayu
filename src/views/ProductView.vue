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
    <div class="rounded-2xl shadow-md flex-grow p-6">
    <div class="order-page">
      <div class="flex mt-8 justify-between pb-6">
          <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-white border px-3" />
          <button @click="showModal=true" class="btn hover:text-gray-300 hover:bg-cyan-950 text-cyan-950 bg-white">
          Tambah
        </button>
      </div>

        <!-- Product Grid Berdasarkan Kategori -->
<div v-for="(items, category) in groupedProducts" :key="category" class="mb-10">
  <h2 class="text-xl font-bold mb-4 text-white">{{ category }}</h2>
  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <div
      v-for="(item, index) in items"
      :key="index"
      class="border rounded-lg shadow hover:shadow-lg p-4 text-center bg-white"
    >
      <img :src="item.imageUrl" alt="Produk" class="w-full h-48 object-cover rounded mb-2" />
      <h3 class="font-semibold text-cyan-950">{{ item.name }}</h3>
      <p class="text-sm text-gray-600">{{ item.priceRange }}</p>
      <button @click="editProduct(item.originalIndex)" class="bg-cyan-950 text-white px-4 py-1 mt-2 rounded">Edit</button>
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

.modal-content {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 1rem;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 4px;
}
</style>