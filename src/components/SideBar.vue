<template>
    <div class="relative min-h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="ml-5 mt-3 rounded-2xl pr-5 fixed top-0 left-0 h-full bg-base-200 shadow-lg z-30 transition-all duration-300 ease-in-out pl-4"
           :class="{ 'w-20': !isHovering, 'w-60': isHovering }"
           @mouseenter="isHovering = true"
           @mouseleave="isHovering = false">
        
        <ul class="-3 space-y-2 mt-4">
          <!-- Logo -->
          <li class="flex items-center gap-2 mb-6">
            <img src="../assets/rahayuwhite.svg" alt="rahayu logo" class="w-10" />
            <span class="text-lg font-bold text-white transition-opacity duration-300"
                  :class="{ 'opacity-100': isHovering, 'opacity-0': !isHovering }">
              Rahayu Konveksi
            </span>
          </li>
  
          <!-- Menu items -->
          <li v-for="item in menuItems" :key="item.route">
            <div
              class="flex items-center gap-4 cursor-pointer p-3 rounded-md transition-all duration-200 text-white"
              :class="{
                'bg-cyan-700': isActive(item.route),
                'hover:bg-cyan-600': !isActive(item.route)
              }"
              @click="$router.replace(item.route)"
            >
              <font-awesome-icon :icon="item.icon" class="w-6 h-6" />
              <span class="sidebar-text opacity-0 font-semibold group-hover:opacity-100 transition-opacity delay-100 duration-300 whitespace-nowrap overflow-hidden"
                    :class="{ 'opacity-100': isHovering, 'opacity-0': !isHovering }">
                {{ item.name }}
                
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { useRoute } from 'vue-router'
  
  const route = useRoute()
  const isHovering = ref(false)
  
  const menuItems = [
    { name: 'Dashboard', route: '/dashboard', icon: 'house' },
    { name: 'Income', route: '/income', icon: 'sack-dollar' },
    { name: 'Order', route: '/order', icon: ['fab', 'shopify'] },
    { name: 'Product', route: '/product', icon: 'shirt' },
    { name: 'Expense', route: '/expense', icon: 'receipt' },
    { name: 'Employee', route: '/employee', icon: 'user-group' },
    { name: 'Exit', route: '/exit', icon: 'right-from-bracket' }
  ]
  
  const isActive = (menuRoute) => route.path === menuRoute
  </script>