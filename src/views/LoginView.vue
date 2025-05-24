<template>
    <div class="flex flex-col gap-4 justify-center items-center w-screen mx-auto h-screen bg-cyan-950">
        <img src="../assets/rahayu.svg" alt="Rahayu Logo" class="w-32 h-32" />
        <fieldset class="fieldset w-xs bg-base-200 border bg-blue-200 border-base-300 p-5 rounded-xl">

            <label class="fieldset-label" style="font-family: 'Poppins', sans-serif;">Nama Pengguna</label>
            <input type="text" class="input" placeholder="Username" v-model="username" />
            
            <label class="fieldset-label" style="font-family: 'Poppins', sans-serif;">Kata Sandi</label>
            <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" class="input w-full" placeholder="Password" v-model="password" />
                <button type="button" class="absolute right-3 top-3 bg-transparent" @click="togglePasswordVisibility">
                    <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>

            <a href="/forgotpassword" class="text-sm text-blue-500 hover:underline block text-end" style="font-family: 'Poppins', sans-serif;">
                Lupa Sandi?
            </a>

            <button class="btn w-full my-4 hover:text-white hover:bg-cyan-900 bg-cyan-700 text-white" style="font-family: 'Poppins', sans-serif;" type="button" @click="Login()">
                <p>Masuk</p>
            </button>
        </fieldset>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: '',
            password: '',
            showPassword: false,
        };
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        Login() {
            axios.post('https://api.rahayu-konveksi.ydns.eu/api/auth/login', {
                Username: this.username,
                Password: this.password,
            }).then(response => {
                if (response.status === 200) {
                    localStorage.setItem('token', response.data.token); 
                    this.$router.push('/dashboard');
                } else {
                    alert('Login failed: ' + response.data.message);
                }
            }).catch(error => {
                console.error('Login error:', error);
                alert('An error occurred during login. Please try again later.');
            });
        },
    },
};
</script>