import { useUserStore } from '@/lib/stores/userStore'

function irAdmin(router) {
  router.push({ path: '/admin' });
}


function irAInicio(router) {
  router.push({ path: '/inicio' });
}

function irALogin(router) {
  router.push({ path: '/login' });
}

export async function loginUsuario(router, correo, password) {
  const userStore = useUserStore()

  const resultado = await userStore.loginUsuario(correo, password)

  if (resultado.success) {

    if(userStore.userRole === 'admin') {
      irAdmin(router)
    } else {
      irAInicio(router)
    }
  }

  return resultado
}

export async function cerrarSesion(router) {
  const userStore = useUserStore()
  console.log('Cerrando sesión desde la función de rutas')
  const resultado = await userStore.cerrarSesion()
  console.log('Resultado de cerrar sesión:', resultado)
  if (resultado.success) {
    irALogin(router)
  } else {
    console.error('Error al cerrar sesión:', resultado.mensaje)
  }

  return resultado
}
