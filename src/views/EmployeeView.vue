<template>
    <div class="flex h-screen">
      <SideBar />
      
      
<!-- Container Utama -->
<div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
  <div class="bg-white rounded-2xl shadow-md flex-grow p-6 max-h-[90vh]">

    <div class="karyawan-page mb-5">

      <div class="flex justify-between bg-white sticky top-0 z-20 py-4">
        <input 
          v-model="search" 
          type="text" 
          placeholder="Cari disini..." 
          class="search-bar text-cyan-950 border px-3 py-2 bg-white rounded" 
          style="font-family: 'Poppins', sans-serif;"
        />
        <button 
          @click="showModal = true" 
          class="btn border-0 shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white"
          style="font-family: 'Poppins', sans-serif;"
          >
          Tambah
        </button>
      </div>

      <!-- Tabel Data -->
      <div class="overflow-x-auto w-full table-fixed rounded-box border border-base-content/5 bg-white">

        <!-- Table -->
        <table class="table text-left w-full">
          <!-- Sticky Table Head -->
          <thead class="sticky top-[80px] bg-gray-400 z-10">
            <tr>
              <th class="w-20 text-white" style="font-family: 'Poppins', sans-serif;">No.</th>
              <th class="text-white" style="font-family: 'Poppins', sans-serif;">Profile</th>
              <th class="text-white" style="font-family: 'Poppins', sans-serif;">Nama</th>
              <th class="w-xs text-white" style="font-family: 'Poppins', sans-serif;">Email</th>
              <th class="text-white" style="font-family: 'Poppins', sans-serif;">Jabatan</th>
              <th class="text-white" style="font-family: 'Poppins', sans-serif;">Status</th>
              <th class="text-white" style="font-family: 'Poppins', sans-serif;">Aksi</th>
            </tr>
          </thead>
        </table>

        <!-- Scrollable Table Body -->
        <div class="max-h-[60vh] overflow-y-auto">
          <table class="table text-left w-full">
            <tbody class="bg-white text-cyan-950">
              <tr v-if="filteredKaryawan.length === 0">
                <td colspan="6" class="text-center py-4" style="font-family: 'Poppins', sans-serif;">Tidak ada data ditemukan</td>
              </tr>
              <tr v-else v-for="(karyawan, index) in filteredKaryawan" :key="index">
                <td class="align-middle">{{ index + 1 }}</td>
                <td class="align-middle">
                  <img :src="karyawan.photo" alt="Profile" class="align-middle w-12 h-12 object-cover rounded-full mx-auto" />
                </td>
                <td class="align-middle">{{ karyawan.name }}</td>
                <td class="align-middle">{{ karyawan.email }}</td>
                <td class="align-middle">{{ karyawan.position }}</td>
                <td class="align-middle">
                  <span class="align-middle" :class="['status-badge', karyawan.status.toLowerCase()]">{{ karyawan.status }}</span>
                </td>
                <td class="align-middle space-x-2">
                  <button @click="editKaryawan(karyawan.id)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-700">Edit</button>
                  <button @click="deleteKaryawan(karyawan.id)" class="btn btn-sm text-white bg-red-500 hover:bg-white hover:text-red-500">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Modal Form -->
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-content">
          <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center" style="font-family: 'Poppins', sans-serif;">Tambah Karyawan</h2>

          <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Nama Karyawan</label>
          <input v-model="form.name" type="text" placeholder="Nama Karyawan" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />
          
          <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Alamat Email</label>
          <input v-model="form.email" type="text" placeholder="Masukkan Alamat Email" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />

          <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Foto Profil</label>
          <input type="file" @change="handleImageUpload" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />

          <div v-if="form.image" class="flex justify-center mb-4">
          <img :src="form.imageUrl" alt="Preview" class="w-24 h-24 rounded-full object-cover border" />
          </div>

          <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Jabatan</label>
          <select v-model="form.position" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
            <option style="font-family: 'Poppins', sans-serif;" class="text-cyan-950" disabled value="">Pilih Jabatan</option>
            <option style="font-family: 'Poppins', sans-serif;" class="text-cyan-950">Penjahit</option>
            <option style="font-family: 'Poppins', sans-serif;" class="text-cyan-950">Pemotong</option>
            <option style="font-family: 'Poppins', sans-serif;" class="text-cyan-950">Pemasak</option>
            <option style="font-family: 'Poppins', sans-serif;" class="text-cyan-950">Packing</option>
          </select>

          <label class="font-medium text-cyan-950" style="font-family: 'Poppins', sans-serif;">Status</label>
          <select v-model="form.status" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
            <option style="font-family: 'Poppins', sans-serif;" class="text-cyan-950" disabled value="">Pilih Status</option>
            <option>Aktif</option>
            <option>Non Aktif</option>
          </select>

          <div class="flex justify-end space-x-2">
            <button @click="resetForm" class="btn bg-gray-500 text-white" style="font-family: 'Poppins', sans-serif;">Batal</button>
            <button v-if="!isEdit" @click="addKaryawan" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Simpan</button>
            <button v-else @click="updateKaryawan" class="btn bg-cyan-950 text-white" style="font-family: 'Poppins', sans-serif;">Update</button>
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
        showModal: false,
        isEdit: false,
        editIndex: null,
        form: {
          name: '',
          email:'',
          image: '',
          position: '',
          status: '',
          imageUrl: ''
        },
        karyawanList: [],
        karyawan: null
      };
    },
    computed: {
      filteredKaryawan() {
        return this.karyawanList.filter(k =>
          k.name.toLowerCase().includes(this.search.toLowerCase())
        );
      }
    },


  methods: {
    resetForm() {
      this.form = {
        name: '',
        email: '',
        image: '',
        position: '',
        status: 'Aktif'
      };
      this.showModal = false;
      this.isEdit = false;
      this.editIndex = null;
    },
    getKaryawan() {
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

    addKaryawan() {
      if (this.form.name && this.form.image && this.form.position && this.form.status) {
        const formData = new FormData();
        formData.append('name', this.form.name);
        formData.append('email', this.form.email);
        formData.append('position', this.form.position);
        formData.append('status', this.form.status);
        formData.append('image', this.form.image);

        axios.post('https://api.rahayu-konveksi.ydns.eu/api/employees', formData, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then(() => {
          alert('Data karyawan berhasil ditambahkan');
          this.getKaryawan();
          this.resetForm();
        }).catch(error => {
          console.error('Error adding karyawan data:', error);
        });
      } else {
        alert('Lengkapi semua field!');
      }
    },
    editKaryawan(id) {
      axios.get(`https://api.rahayu-konveksi.ydns.eu/api/employees/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
          }
        })
        .then(response => {
          this.form = response.data;
          this.isEdit = true;
          this.editIndex = id;
          this.showModal = true;
        })
        .catch(error => {
          console.error('Error fetching karyawan data:', error);
        });
    },
    updateKaryawan() {
      if (this.editIndex !== null && this.form.name && this.form.image && this.form.position) {
        const formData = new FormData();
        formData.append('name', this.form.name);
        formData.append('email', this.form.email);
        formData.append('position', this.form.position);
        formData.append('status', this.form.status);

        // Check if the image is a file or a base64 string
        if (this.form.image instanceof File) {
          formData.append('image', this.form.image);
        }
        
        axios.put(`https://api.rahayu-konveksi.ydns.eu/api/employees/${this.editIndex}`, formData, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token'),
              'Content-Type': 'multipart/form-data'
            }
          }
        ).then(() => {
          alert('Data karyawan berhasil diperbarui');
          this.getKaryawan();
          this.resetForm();
        }).catch(error => {
          console.error('Error updating karyawan data:', error);
        });
      } else {
        alert('Lengkapi semua field!');
      }
    },
    deleteKaryawan(id) {
      if (confirm('Apakah Anda yakin ingin menghapus karyawan ini?')) {
        axios.delete(`https://api.rahayu-konveksi.ydns.eu/api/employees/${id}`, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          })
          .then(() => {
            alert('Data karyawan berhasil dihapus');
            this.getKaryawan();
          })
          .catch(error => {
            console.error('Error deleting karyawan data:', error);
          });
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.form.imageUrl = reader.result;
        };
        this.form.image = file; // Store the file directly 
        reader.readAsDataURL(file);
      }
    }
  },

  mounted() {
    this.getKaryawan();
  }
}
</script>
  
<style scoped>
.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  color: black;
}
.status-badge.active {
  background-color: #82bd90;
}
.status-badge.passive {
  background-color: #6c757d;
}
</style>
  