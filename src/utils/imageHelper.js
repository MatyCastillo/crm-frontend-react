const getImgPath = (nombre, imagenes) => {
    const imagenEncontrada = imagenes.find(imagen => imagen.img_nombre === nombre);
  
    if (imagenEncontrada) {
      return imagenEncontrada.img_path;
    } else {
      return 'No se encontró la imagen';
    }
  }
  
  export default getImgPath;
  