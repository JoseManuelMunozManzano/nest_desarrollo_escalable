// También se le suele denominar env.config.ts ya que es la configuración del archivo de las variables
// de entorno.
// Se exporta una función que mapea las variables de entorno.
export const EnvConfiguration = () => ({
  // Si la variable de entorno no esta declarada en el fichero .env, por ejemplo con
  // el valor de producción 'prod', por defecto será 'dev'
  environment: process.env.NODE_ENV || 'dev',
  // Si miramos mongodb, vemos que no tiene un valor por defecto en caso de que la variable de entorno
  // no esté definida en el fichero .env
  // Entonces SI que debería haber un error que fuera atrapado de una mejor manera.
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3002,
  defaultLimit: +process.env.DEFAULT_LIMIT || 7,
});

// En teoría esta configuración es más que suficiente para la mayor parte de las apps.

// Se usa el archivo joi.validation.ts, Este fuente NO se va a usar.

// Se ha puesto el + por lo siguiente: En el fichero .env no se ha informado la variable de entorno
// DEFAULT_LIMIT.
// Va al fichero joi.validation.ts e informa process.env.DEFAULT_LIMIT con el valor 6 como número.
// Luego viene a este fichero y recoge el valor process.env.DEFAULT_LIMIT. Como está informado
// LO TRATA COMO STRING. Por eso se pone el +, para que lo trate como número.
