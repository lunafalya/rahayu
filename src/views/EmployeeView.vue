<template>
    <div class="flex h-screen">
      <SideBar />
      
      
      <!-- Expense -->
      <div class="ml-30 p-8 flex-grow px-6 pt-12 flex gap-6 main-content">
        <div class="bg-cyan-950 rounded-2xl shadow-md flex-grow p-6">
        <div class="karyawan-page">      
            <div class="flex mt-8 justify-between pb-6">
              <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-white border px-3 py-2" />
              <button @click="showModal=true" class="btn border-0 shadow-lg hover:bg-gray-300 hover:text-cyan-950 bg-cyan-700 text-white">
              Tambah
            </button>
          </div>


      <!-- Tabel Data Karyawan -->
      <div class="overflow-x-auto w-full table-fixed rounded-box border border-base-content/5 bg-cyan-700">
        <table class="table text-left">
          <thead>
            <tr>
              <th class="w-20 text-white">No.</th>
              <th class="w-30 pl-9 text-white">Profile</th>
              <th class="text-white">Nama</th>
              <th class="text-white">Jabatan</th>
              <th class="text-white">Status</th>
              <th class="text-white">Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-cyan-600 text-white">
            <tr v-if="filteredKaryawan.length === 0">
              <td colspan="6" class="text-center py-4">Tidak ada data ditemukan</td>
            </tr>
            <tr v-else v-for="(karyawan, index) in filteredKaryawan" :key="index">
              <td class="align-middle">{{ index + 1 }}</td>
              <td class="align-middle"><img :src="karyawan.imageUrl" alt="Profile" class="align-middle w-12 h-12 object-cover rounded-full mx-auto" /></td>
              <td class="align-middle">{{ karyawan.name }}</td>
              <td class="align-middle">{{ karyawan.position }}</td>
              <td class="align-middle">
                <span class="align-middle" :class="['status-badge', karyawan.status.toLowerCase()]">{{ karyawan.status }}</span>
              </td>
              <td class="align-middle"><button @click="editKaryawan(karyawan.id)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-700">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal Form -->
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-content">
          <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Tambah Karyawan</h2>

          <label class="font-medium text-cyan-950">Nama Karyawan</label>
          <input v-model="form.name" type="text" placeholder="Nama Karyawan" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />
          
          <label class="font-medium text-cyan-950">Foto Profil</label>
          <input type="file" @change="handleImageUpload" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />

          <div v-if="form.imageUrl" class="flex justify-center mb-4">
          <img :src="form.imageUrl" alt="Preview" class="w-24 h-24 rounded-full object-cover border" />
          </div>

          <label class="font-medium text-cyan-950">Jabatan</label>
          <select v-model="form.position" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
            <option class="text-cyan-950" disabled value="">Pilih Jabatan</option>
            <option class="text-cyan-950">Penjahit</option>
            <option class="text-cyan-950">Pemotong</option>
            <option class="text-cyan-950">Pemasak</option>
            <option class="text-cyan-950">Packing</option>
          </select>

          <label class="font-medium text-cyan-950">Status</label>
          <select v-model="form.status" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
            <option class="text-cyan-950" disabled value="">Pilih Status</option>
            <option>Aktif</option>
            <option>Non Aktif</option>
          </select>

          <div class="flex justify-end space-x-2">
            <button @click="resetForm" class="btn bg-gray-500 text-white">Batal</button>
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
          imageUrl: '',
          position: '',
          status: ''
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
        imageUrl: '',
        position: '',
        status: 'Aktif'
      };
      this.showModal = false;
      this.isEdit = false;
      this.editIndex = null;
    },
    getKaryawan() {
      axios.get('https://great-distinctly-seasnail.ngrok-free.app/api/employees', {
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
      if (this.form.nama && this.form.imageUrl && this.form.jabatan  ) {
        this.karyawanList.push({ ...this.form });
        this.resetForm();
      } else {
        alert('Lengkapi semua field!');
      }
    },

    editKaryawan(id) {
      axios.get(`https://great-distinctly-seasnail.ngrok-free.app/api/employees/${id}`, {
          headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
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
      if (this.editIndex !== null && this.form.name && this.form.imageUrl && this.form.position) {
        axios.put(`https://great-distinctly-seasnail.ngrok-free.app/api/employees/${this.editIndex}`, this.form, {
            headers: {
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          }
        );
      } else {
        alert('Lengkapi semua field!');
      }
    },
    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.form.imageUrl = reader.result;
        };
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
  color: white;
}
.status-badge.active {
  background-color: #28a745;
}
.status-badge.passive {
  background-color: #6c757d;
}
</style>
  