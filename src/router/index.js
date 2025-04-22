import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import EmployeeView from '../views/EmployeeView.vue'
import IncomeView from '../views/IncomeView.vue'
import ExpenseView from '../views/ExpenseView.vue'
import ProductView from '../views/ProductView.vue'
import OrderView from '../views/OrderView.vue'
import ForgotView from '../views/ForgotView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
    },
    {
      path: '/employee',
      name: 'employee',
      component: EmployeeView,
    },
    {
      path: '/income',
      name: 'income',
      component: IncomeView,
    },
    {
      path: '/expense',
      name: 'expense',
      component: ExpenseView,
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView,
    },
    {
      path: '/product',
      name: 'product',
      component: ProductView,
    },
    {
      path: '/forgotpassword',
      name: 'forgot',
      component: ForgotView,
    },
  ],
})

export default router
