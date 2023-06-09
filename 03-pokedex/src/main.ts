import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Utilizando ConfigurationService para obtener el puerto.
  // Así queda mejor que usando las variables de entorno, pero como para desplegar nos basaremos en las variables
  // de entorno, esto lo comentamos y usamos directamente process.env.PORT
  //const configService = app.get(ConfigService);
  //const PORT = configService.get<number>('port');

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

  await app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
  });
}
bootstrap();
