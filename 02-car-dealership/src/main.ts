// Punto de entrada a nuestra aplicación.
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

// Hay 4 sitios donde se pueden aplicar los pipes:
// 1. En parámetros.
// 2. En un método de controlador.
// 3. A nivel global de controlador.
// 4. A nivel global de aplicación (en main.ts) con app.useGlobalPipes
//    Indicar que esto no afecta a los GET, sino cuando tenemos un Post, Patch, ... y queremos
//    que nos manden la información correcta.
//
// Para validaciones hay que instalar: yarn add class-validator class-transformer.
//
// NOTA: Hay dos cosas a tener en cuenta:
//   1. No están todos los datos que me indica mi DTO --> Mensaje de error indicando que falta.
//   2. Hay más información que la pedido en mi DTO --> Se puede eliminar con whitelist a true o/y
//      que de error con forbidNonWhitelisted a true.

async function bootstrap() {
  // Mandamos el módulo principal.
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // whitelist a true indica que los parámetros que nos envíen de más y no estén en el DTO
      // directamente se eliminarán. El problema es que el programador piensa que su petición es
      // correcta y la sigue mandando.
      whitelist: true,
      // Con forbidNonWhitelisted a true, las propiedades mandadas en el request que no sean
      // esperadas por mi DTO se marcan como error. El status es 404.
      // El programador sabrá que propiedades no puede mandar.
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
