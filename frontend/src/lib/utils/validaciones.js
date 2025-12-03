// Esta función se utiiliza para saber si un texto tiene la estructura de Correo Electrónico
 export const validarCorreo = (correo) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(correo);
};
