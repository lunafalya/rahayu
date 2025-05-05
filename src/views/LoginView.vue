<template>
    <div class="flex flex-col gap-4 justify-center items-center w-screen mx-auto h-screen bg-cyan-950">
        <img src="../assets/rahayu.svg" alt="Rahayu Logo" class="w-32 h-32" />
        <fieldset class="fieldset w-xs bg-base-200 border border-base-300 p-5 rounded-xl">

            <label class="fieldset-label">Username</label>
            <input type="text" class="input" placeholder="Username" />
            
            <label class="fieldset-label">Password</label>
            <div class="relative">
                <input :type="showPassword ? 'text' : 'password'" class="input w-full" placeholder="Password" />
                <button type="button" class="absolute right-3 top-3 bg-transparent" @click="togglePasswordVisibility">
                    <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
                </button>
            </div>

            <a href="/forgotpassword" class="text-sm text-blue-500 hover:underline block text-end">
                Forgot Password?
            </a>

            <button class="btn w-full my-4 hover:text-cyan-950 hover:bg-cyan-400 bg-cyan-950 text-white" type="button" @click="$router.push('/dashboard')">
                <p>Login</p>
            </button>
        </fieldset>
    </div>
</template>

<script>
export default {
    data() {
        return {
            showPassword: false,
        };
    },
    methods: {
        togglePasswordVisibility() {
            this.showPassword = !this.showPassword;
        },
        Login() {
            
        },
    },
};
</script>