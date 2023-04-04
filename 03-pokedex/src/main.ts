import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // En vez de indicar la url /api/v2 en pokemon.controller.ts lo hacemos aquí, a nivel de aplicación.
  app.setGlobalPrefix('api/v2');

  await app.listen(3000);
}
bootstrap();
