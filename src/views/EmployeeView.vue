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
                    <font-awesome-icon icon="shirt" class="w-12 h-auto" />
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
                    <font-awesome-icon icon="user-group" class="w-10 h-10 p-2 transition-all duration-300 bg-cyan-300 rounded-sm" />
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
    
      <!-- Expense -->
  <div class="flex-grow px-6 pt-12 flex gap-6 main-content">
    <div class="bg-white rounded-2xl shadow-md flex-grow p-6">
    <div class="karyawan-page">      
        <div class="flex mt-8 justify-between pb-6">
          <input v-model="search" type="text" placeholder="Search ..." class="search-bar text-cyan-950 border px-3" />
          <button @click="showModal=true" class="btn hover:bg-gray-300 hover:text-cyan-950 bg-cyan-950 text-white">
          Tambah
        </button>
      </div>


      <!-- Tabel Data Karyawan -->
      <div class="overflow-x-auto w-full table-fixed rounded-box border border-base-content/5 bg-cyan-950">
        <table class="table text-left">
          <thead>
            <tr>
              <th class="w-20">No.</th>
              <th class="w-30 pl-9">Profile</th>
              <th >Nama</th>
              <th>Jabatan</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody class="bg-white text-cyan-950">
            <tr v-for="(karyawan, index) in filteredKaryawan" :key="index">
              <td class="align-middle">{{ index + 1 }}</td>
              <td class="align-middle"><img :src="karyawan.imageUrl" alt="Profile" class="align-middle w-12 h-12 object-cover rounded-full mx-auto" /></td>
              <td class="align-middle">{{ karyawan.nama }}</td>
              <td class="align-middle">{{ karyawan.jabatan }}</td>
              <td class="flex items-center gap-2 align-middle">
                <span class="align-middle" :class="['status-badge', karyawan.status.toLowerCase()]">{{ karyawan.status }}</span>
              </td>
              <td class="align-middle"><button @click="editKaryawan(index)" class="btn btn-sm text-white bg-cyan-950 hover:bg-white hover:text-cyan-950">Edit</button></td>
            </tr>
          </tbody>
        </table>
      </div>
  
      <!-- Modal Form -->
      <div class="modal-overlay" v-if="showModal">
        <div class="modal-content">
          <h2 class="text-xl font-bold text-cyan-950 mb-6 text-center">Tambah Karyawan</h2>
          <label class="font-medium text-cyan-950">Nama Karyawan</label>
          <input v-model="form.nama" type="text" placeholder="Nama Karyawan" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />
          
          <label class="font-medium text-cyan-950">Foto Profil</label>
          <input type="file" @change="handleImageUpload" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-5" />

          <div v-if="form.imageUrl" class="flex justify-center mb-4">
          <img :src="form.imageUrl" alt="Preview" class="w-24 h-24 rounded-full object-cover border" />
          </div>

          <label class="font-medium text-cyan-950">Jabatan</label>
          <select v-model="form.jabatan" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
            <option class="text-cyan-950" disabled value="">Pilih Jabatan</option>
            <option class="text-cyan-950">Penjahit</option>
            <option class="text-cyan-950">Pemotong</option>
            <option class="text-cyan-950">Pemasak</option>
            <option class="text-cyan-950">Packing</option>
          </select>

          <label class="font-medium text-cyan-950">Status</label>
          <select v-model="form.status" class="text-cyan-950 border p-2 w-full rounded mt-1 mb-6">
            <option class="text-cyan-950" disabled value="">Pilih Status</option>
            <option>Active</option>
            <option>Passive</option>
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
  
  <script>
  export default {
    data() {
      return {
        search: '',
        showModal: false,
        isEdit: false,
        editIndex: null,
        form: {
          nama: '',
          imageUrl: '',
          jabatan: '',
          status: 'Active',
          aksi: ''
        },
        karyawanList: []
      };
    },
    computed: {
      filteredKaryawan() {
        return this.karyawanList.filter(k =>
          k.nama.toLowerCase().includes(this.search.toLowerCase())
        );
      }
    },


  methods: {
  resetForm() {
    this.form = { nama: '',  imageUrl: '', jabatan: '', status: 'Active' };
    this.showModal = false;
    this.isEdit = false;
    this.editIndex = null;
  },
  addKaryawan() {
    if (this.form.nama && this.form.imageUrl && this.form.jabatan ) {
      this.karyawanList.push({ ...this.form });
      this.resetForm();
    } else {
      alert('Lengkapi semua field!');
    }
  },
  editKaryawan(index) {
    this.editIndex = index;
    this.form = { ...this.karyawanList[index] }; // prefill modal
    this.isEdit = true;
    this.showModal = true;
  },
  updateKaryawan() {
    if (this.editIndex !== null && this.form.nama && this.form.imageUrl && this.form.jabatan) {
      this.karyawanList.splice(this.editIndex, 1, { ...this.form });
      this.resetForm();
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
  