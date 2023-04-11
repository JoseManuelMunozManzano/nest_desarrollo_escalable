import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Para que las urls tengan /api como prefijo
  app.setGlobalPrefix('api');

  // GlobalPipe para poder usar las validaciones/transformaciones de DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  await app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
  });
}
bootstrap();
