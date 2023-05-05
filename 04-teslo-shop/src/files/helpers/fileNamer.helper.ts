import { v4 as uuid } from 'uuid';

export const fileNamer = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  // En este momento SIEMPRE deberíamos tener un archivo, pero vamos a dejar esta validación por si acaso.
  if (!file) return callback(new Error('File is empty'), false);

  const fileExtension = file.mimetype.split('/')[1];

  // CUIDADO!! Si algún fichero se llamara igual este reemplaza al anterior.
  // Usamos uuid que nos da un nombre único.
  // yarn add uuid
  const fileName = `${uuid()}.${fileExtension}`;

  // Si no hay errores se retorna el nuevo nombre del archivo
  callback(null, fileName);
};
