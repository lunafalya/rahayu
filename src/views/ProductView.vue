<template>
    <div class="flex h-screen">
      <!-- Sidebar -->
      <SideBar />
    
<!-- Kontainer Utama -->
<div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
  <!-- Konten Putih -->
  <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
    <!-- Search bar dan tombol tambah -->
    <div class="flex mt-8 justify-between pb-6">
      <input v-model="search" type="text" placeholder="Cari disini..." class="search-bar text-cyan-950 border px-3 py-2" style="font-family: 'Poppins', sans-serif;" />
      <button @click="showModal = true" class="btn shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">
        Tambah
      </button>
    </div>

    <!-- Scrollable Produk Grid -->
    <div class="overflow-y-auto mt-4 pr-2" style="max-height: calc(100vh - 250px);">
      <div v-if="products.length > 0">
        <div v-for="(items, category) in groupedProducts" :key="category" class="mb-10">
          <h2 class="text-xl font-bold mb-4 text-black">{{ category.toUpperCase() }}</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div
              v-for="(item, index) in items"
              :key="index"
              class="rounded-lg shadow hover:shadow-lg p-4 text-center bg-white"
            >
              <img :src="item.photo" alt="Produk" class="w-full h-48 object-cover rounded mb-2" />
              <h3 style="font-family: 'Poppins', sans-serif;" class="font-semibold text-cyan-950">{{ item.name }}</h3>
              <p style="font-family: 'Poppins', sans-serif;"class="text-sm text-cyan-950 ">{{ Intl.NumberFormat('id-ID').format(item.price) }}</p>
              <div class="justify-between gap-2">
              <button
                @click="editProduct(item.originalIndex)"
                class="btn btn-sm bg-cyan-950 text-white px-4 py-1 mt-2 rounded hover:bg-cyan-300"
                style="font-family: 'Poppins', sans-serif;"
              >
                Edit
              </button>
              <button
                @click="deleteProduct(item.id)"
                class="btn btn-sm bg-red-500 text-white px-4 py-1 mt-2 rounded hover:bg-red-300"
                style="font-family: 'Poppins', sans-serif;"
              >
                Hapus
              </button>
              </div>

            </div>
          </div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="n in 3" :key="n" class="flex w-64 justify-center flex-col gap-4 m-3" style="font-family: 'Poppins', sans-serif;">
          <div class="skeleton h-48 w-full bg-gray-400"></div>
          <div class="skeleton h-4 w-28 bg-gray-400"></div>
          <div class="skeleton h-4 w-full bg-gray-400"></div>
          <div class="skeleton h-4 w-full bg-gray-400"></div>
        </div>
        
      </div>
      

        
      <!-- Modal Form -->
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-content">
          <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center" style="font-family: 'Poppins', sans-serif;">TAMBAH PRODUK</h2>
          <label class="block mb-2  text-cyan-950" style="font-family: 'Poppins', sans-serif;">Kategori Produk</label>
            <select v-model="form.category" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" style="font-family: 'Poppins', sans-serif;">
              <option disabled value="">Pilih Kategori</option>
              <option value="kaos">Kaos</option>
              <option value="kemeja">Kemeja</option>
              <option value="almamater">Almamater</option>
              <option value="seragam jas">Seragam Jas</option>
              <option value="jaket">Jaket</option>
              <option value="jersey">Jersey</option>
              <option value="jersey">Extra</option>
            </select>

            <label class="block mb-2 text-cyan-950" style="font-family: 'Poppins', sans-serif;">Nama Produk</label>
            <input v-model="form.name" type="text" placeholder="Nama Produk" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6" />

            <label class="block mb-2 text-cyan-950" style="font-family: 'Poppins', sans-serif;">Harga</label>
            <input v-model="form.price" type="number" placeholder="Kisaran harga" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6" />

            <label class="block mb-2 text-cyan-950" style="font-family: 'Poppins', sans-serif;">Gambar Produk</label>
            <input type="file" @change="handleImageUpload" class="text-cyan-950 border p-2 rounded mt-1 mb-6" />

            <div class="flex justify-end space-x-2">
              <button @click="closeModal" type="button" class="bg-gray-300 px-4 py-2 rounded" style="font-family: 'Poppins', sans-serif;">Batal</button>
              <button v-if="editing" @click="saveProduct(editIndex)" type="submit" style="font-family: 'Poppins', sans-serif;" class="bg-cyan-950 text-white px-4 py-2 rounded">Simpan</button>
              <button v-else @click="addProduct()" type="submit" style="font-family: 'Poppins', sans-serif;" class="bg-cyan-950 text-white px-4 py-2 rounded">Tambah</button>
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
</script>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      showModal: false,
      editing: false,
      editIndex: null,
      search: '',
      products: [],
      form: {
        name: '',
        category: '',
        price: '',
        image: '',
        imageUrl: '',
      },
    }
  },
  methods: {
    handleImageUpload(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = () => {
          this.form.imageUrl = reader.result
        }
        this.form.image = file
        reader.readAsDataURL(file)
      }
    },
    getProducts() {
      axios
        .get('https://api.rahayu-konveksi.ydns.eu/api/products', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(response => {
          this.products = response.data
        })
        .catch(error => {
          console.error('Error fetching products:', error)
        })
    },
    editProduct(index) {
      const product = this.products[index]
      this.form = { ...product }
      this.showModal = true
      this.editing = true
      this.editIndex = index
    },
    addProduct() {
      if (this.form.name && this.form.category && this.form.price) {
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('category', this.form.category)
        formData.append('price', this.form.price)
        formData.append('image', this.form.image)

        axios
          .post('https://api.rahayu-konveksi.ydns.eu/api/products', formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            }
          })
          .then(() => {
            this.getProducts()
            this.closeModal()
          })
          .catch(error => {
            console.error('Error adding product:', error)
          })
      } else {
        alert('Please fill in all fields.')
      }
    },
    saveProduct(index) {
      if (this.form.name && this.form.category && this.form.price && this.form.image) {
        const formData = new FormData()
        formData.append('name', this.form.name)
        formData.append('category', this.form.category)
        formData.append('price', this.form.price)
        formData.append('image', this.form.image)

        axios
          .put(`https://api.rahayu-konveksi.ydns.eu/api/products/${this.products[index].id}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then(() => {
            this.getProducts()
            this.closeModal()
          })
          .catch(error => {
            console.error('Error updating product:', error)
          })
      } else {
        alert('Please fill in all fields.')
      }
    },
    deleteProduct(id) {
      if (confirm('Are you sure you want to delete this product?')) {
        axios
          .delete(`https://api.rahayu-konveksi.ydns.eu/api/products/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          })
          .then(() => {
            this.getProducts()
          })
          .catch(error => {
            console.error('Error deleting product:', error)
          })
      }
    },
    closeModal() {
      this.showModal = false
      this.editing = false
      this.editIndex = null
      this.form = {
        name: '',
        category: '',
        priceRange: '',
        image: '',
        imageUrl: '',
      }
    },
  },
  computed: {
    groupedProducts() {
      const groups = {}
      this.filteredProducts.forEach((product, index) => {
        if (!groups[product.category]) {
          groups[product.category] = []
        }
        groups[product.category].push({ ...product, originalIndex: index })
      })
      return groups
    },
    filteredProducts() {
      if (!this.search) return this.products
      return this.products.filter(p =>
        p.name.toLowerCase().includes(this.search.toLowerCase())
      )
    },
  },
  mounted() {
    this.getProducts()
  },
}
</script>
