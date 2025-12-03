
const apiDjangoUrl = import.meta.env.VITE_API_DJANGO_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

//! Peticion para escanear placa de vehículo CARRO
export async function escanearPlacaCarro(fotos, vehiculo) {
  console.log('Escaneando placa con fotos:', fotos);
  console.log('Tipo de vehículo:', vehiculo);

  try {
   const fd = new FormData();
    // let imagesArray = [];

    fotos.forEach((foto, index) => {
      if (foto && foto.imagen instanceof Blob) {
        const nombreArchivo = foto.fileName || `foto_${index}.jpg`;
        // imagesArray.push( nombreArchivo);
        fd.append('images', foto.imagen, nombreArchivo);
      } else {
        console.log(`La foto en posición ${index} no es válida:`, foto);
      }
    });
    // fd.append('images', imagesArray);
    fd.append('vehicleType', vehiculo);

    fd.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    // console.log('FormData preparado, enviando a API...',fd);
    const resultado = await fetch(`${apiDjangoUrl}/plate-recognition-two/`, {
      method: 'POST',
      // NO incluir Content-Type, FormData lo maneja automáticamente
      body: fd
    });

    if (!resultado.ok) {
      const error = await resultado.json();
      throw new Error(error.message || 'Error al escanear la placa');
    }

    return resultado.json();
  } catch (error) {
    console.error('Error en escanearPlaca:', error);
    throw error;
  }
}

//! Peticion para escanear placa de vehículo CARRO
export async function escanearPlacaMoto(fotos, vehiculo) {

  console.log('Escaneando placa con fotos:', fotos);
  console.log('Tipo de vehículo:', vehiculo);

  try {
    const fd = new FormData();

    fotos.forEach((foto, index) => {
      if (foto && foto.imagen instanceof Blob) {
        const nombreArchivo = foto.fileName || `foto_${index}.jpg`;
        fd.append('images[]', foto.imagen, nombreArchivo);
      } else {
        console.log(`La foto en posición ${index} no es válida:`, foto);
      }
    });

    fd.append('vehicleType', vehiculo);

    console.log('FormData preparado, enviando a API...',fd);
    const resultado = await fetch(`${apiDjangoUrl}/plate-recognition/`, {
      method: 'POST',
      // NO incluir Content-Type, FormData lo maneja automáticamente
      body: fd
    });

    if (!resultado.ok) {
      const error = await resultado.json();
      throw new Error(error.message || 'Error al escanear la placa');
    }
    // console.log('Resultado del escaneo:', await resultado.json());
    return resultado.json();
  } catch (error) {
    console.error('Error en escanearPlaca:', error);
    throw error;
  }
}

export async function consultarEventosAPI(token) {
  try {
    const respuesta = await fetch(`${BACKEND_URL}/events`, {
      method: 'GET',
      headers: {
        'Authorization': `bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Error al consultar eventos');
    }

    const datos = await respuesta.json();
    console.log('Eventos obtenidos:', datos);
    return datos;
  } catch (error) {
    console.error('Error al consultar eventos:', error);
    throw error;
  }
}
export async function crearEventoAPI(token, placa, tipoEvento) {
  try {
    const respuesta = await fetch(`${BACKEND_URL}/events`, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'plate_detected': placa,
        'event_type': tipoEvento
      })
    });

    if (!respuesta.ok) {
      const errorData = await respuesta.json();
      throw new Error(errorData.message || 'Error al enviar evento');
    }

    const datos = await respuesta.json();
    console.log('Eventos obtenidos:', datos);
    return datos;
  } catch (error) {
    console.error('Error al consultar eventos:', error);
    throw error;
  }
}
