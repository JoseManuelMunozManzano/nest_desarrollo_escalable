// Ojo a la firma de esta función
export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  // Control para ver por consola que realmente se está llamando a este interceptor.
  //console.log({ file });

  if (!file) return callback(new Error('File is empty'), false);

  // OJO!! El usuario ha podido cambiar la extensión por ejemplo de .pdf a .jpeg y nosostros vamos a creer
  // que realmente es una imagen.
  // Ver:    https://www.ibm.com/support/pages/what-magic-number
  const fileExtension = file.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(fileExtension)) {
    // null indica que no hay errores.
    // true indica que aceptamos el archivo.
    return callback(null, true);
  }

  callback(null, false);

  // OJO!! Esto no es todo. Esto no lanza una excepción de forma automática por el lado de Nest.
  // ESTO ES SOLO PARA ACEPTAR O NO UN ARCHIVO!
};
