// https://www.npmjs.com/package/joi
// yarn add joi
// El paquete para validar nuestros objetos es joi. También lanza errores, poner valores por defecto y,
// en pocas palabras, revisa que un objeto luzca de la manera esperada. En este caso las variables de
// entorno.

// Hay que importarlo así para que funcione:
import * as Joi from 'joi';

// Nos creamos ahora el ValidationSchema, es decir, que tenga las propiedades que estoy esperando y que el
// objeto luzca como quiero.
export const JoiValidationSchema = Joi.object({
  // Si no viene MONGODB, como es obligatorio, lanzará un error.
  MONGODB: Joi.required(),
  // Si no viene el puerto pongo un valor por defecto.
  PORT: Joi.number().default(3005),
  DEFAULT_LIMIT: Joi.number().default(6),
});
