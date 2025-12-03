const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function consultarLogin(correo, password) {
  console.log('Enviando solicitud de login desde API para:', correo);
  console.log('Contraseña proporcionada desde API:', password);
  const response = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email: correo,
      password: password
    }),
  });
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Email o contraseña incorrectos')
  }

  return response.json();
}

export async function recuperarPassword(correoRecuperar) {
  const resultado = await fetch(`${BACKEND_URL}/verifications/password`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: correoRecuperar }),
  });
  if(!resultado.ok) {
    const error = await resultado.json();
    throw new Error(error.message || 'Error al enviar el correo de recuperación');
  }
  return resultado.json();
}

export async function eliminarTokenSesion(token) {
  console.log('Eliminando token de sesión desde API');
  const mensaje = await fetch(`${BACKEND_URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `bearer ${token}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
  });
  if (!mensaje.ok) {
    const error = await mensaje.json();
    throw new Error(error.message || 'Error desconocido');
  }
  return mensaje.json();
}
