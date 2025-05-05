import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import EmployeeView from '../views/EmployeeView.vue'
import IncomeView from '../views/IncomeView.vue'
import ExpenseView from '../views/ExpenseView.vue'
import ProductView from '../views/ProductView.vue'
import OrderView from '../views/OrderView.vue'
import ForgotView from '../views/ForgotView.vue'

function isAuthenticated() {
  const token = localStorage.getItem('token')
  return !!token
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Login',
        requiresAuth: false,
      },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard',
        requiresAuth: true,
      },
    },
    {
      path: '/employee',
      name: 'employee',
      component: EmployeeView,
      meta: {
        title: 'Employee',
        requiresAuth: true,
      },
    },
    {
      path: '/income',
      name: 'income',
      component: IncomeView,
      meta: {
        title: 'Income',
        requiresAuth: true,
      },
    },
    {
      path: '/expense',
      name: 'expense',
      component: ExpenseView,
      meta: {
        title: 'Expense',
        requiresAuth: true,
      },
    },
    {
      path: '/order',
      name: 'order',
      component: OrderView,
      meta: {
        title: 'Order',
        requiresAuth: true,
      },
    },
    {
      path: '/product',
      name: 'product',
      component: ProductView,
      meta: {
        title: 'Product',
        requiresAuth: true,
      },
    },
    {
      path: '/forgotpassword',
      name: 'forgot',
      component: ForgotView,
      meta: {
        title: 'Forgot Password',
        requiresAuth: false,
      },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !isAuthenticated()) {
    // If the route requires authentication and the user is not authenticated
    next({ name: 'login' }); // Redirect to the login page
  } else {
    next(); // Proceed to the route
  }
});

export default router
