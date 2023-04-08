import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // En vez de indicar la url /api/v2 en pokemon.controller.ts lo hacemos aquí, a nivel de aplicación.
  app.setGlobalPrefix('api/v2');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      // Forma 1 de transformar un valor de query parameter de string a number.
      // Aquí, en nuestros GlobalPipes, podemos transformar nuestros DTOs en el tipo de datos que queremos usar.
      // Tiene pros y contras.
      // Como pros, es que es fácil de validar la data de los DTO porque ya vienen como queremos.
      // Como contras, hay que procesar la información, lo que consume más memoria.
      // transform: true,
      // transformOptions: {
      //   enableImplicitConversion: true,
      // },
    }),
  );

  await app.listen(3000);
}
bootstrap();
