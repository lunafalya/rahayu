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
    
    </div>
</template>