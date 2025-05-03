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
      meta: {
        title: 'Login',
      },
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
      meta: {
        title: 'Employee',
      },
    },
    {
      path: '/income',
      name: 'income',
      component: IncomeView,
      meta: {
        title: 'Income',
      },
    },
    {
      path: '/expense',
      name: 'expense',
      component: ExpenseView,
      meta: {
        title: 'Expense',
      },
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView,
      meta: {
        title: 'Order',
      },
    },
    {
      path: '/product',
      name: 'product',
      component: ProductView,
      meta: {
        title: 'Product',
      },
    },
    {
      path: '/forgotpassword',
      name: 'forgot',
      component: ForgotView,
    },
  ],
})

export default router
