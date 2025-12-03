import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/lib/stores/userStore'
import Login from '@/views/login/loginView.vue'
import Inicio from '@/views/security/inicioView.vue'
import RecuperarPassword from '@/views/login/RecuperarPassword.vue'
import NotFound from '@/views/NotFound.vue'

import AdminView from '@/views/admin/AdminView.vue';
import UsuariosComponent from "@/views/admin/users/UsuariosComponent.vue";
import VehiculosComponent from "@/views/admin/vehicles/VehiculosComponent.vue";
import EventosComponent from "@/views/admin/events/EventosComponent.vue";
import Profile from '@/views/profile/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [

    {
      path: '/',
      redirect: () => {
        // Redirect inteligente basado en autenticación
        const userStore = useUserStore()
        return userStore.isAuthenticated ? '/inicio' : '/login'
      }
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      beforeEnter: (to, from, next) => {
        // Si ya está autenticado, redirigir a inicio
        const userStore = useUserStore()
        if (userStore.isAuthenticated) {
          next('/inicio')
        } else {
          next()
        }
      }
    },
    {
      path: '/admin',
      name: 'admin',
      component:AdminView ,
      redirect: '/admin/vehicles',
       children: [
      {
        path: "users",
        name: "admin.users",
        component: UsuariosComponent
      },
      {
        path: "vehicles",
        name: "admin.vehicles",
        component: VehiculosComponent
      },
      {
        path: "events",
        name: "admin.events",
        component: EventosComponent
      }

    ]

    },
    {
      path: '/profile/:uuid',
      name: 'profile',
      component: Profile,
      meta: { requiresAuth: true },
      props: true
    },
    {
      path: '/inicio',
      name: 'inicio',
      component: Inicio,
      meta: { requiresAuth: true } // Marcar como ruta protegida
    },
    {
      path: "/recuperar-password",
      name: "recuperar-password",
      component: RecuperarPassword
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: NotFound

    },

  ],
})

// Guard global ANTES de cada navegación
router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // store con isAuthenticated y role
  const role = userStore.userRole; // usar computed del store
  // Verificar si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (!userStore.isAuthenticated) {
      console.log('Acceso denegado: usuario no autenticado');
      return next({ name: 'login', query: { msg: 'no-auth' } });
    }
  }

  // Verificar rutas de admin
  if (to.path.startsWith('/admin') && role !== 'admin') {
    console.log('Acceso denegado: solo admins');
    return next({ name: 'inicio', query: { msg: 'no-permission' } });
  }

  /*  // Verificar rutas de admin
  if (to.path.startsWith('/inicio') && role !== 'security') {
    console.log('Acceso denegado: solo seguridad');
   falta redireccionar
    return next({ name: 'inicio', query: { msg: 'no-permission' } });
  }*/


  next(); // todo bien, permitir acceso
});


export default router
