// Punto de entrada a nuestra aplicación.
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Mandamos el módulo principal.
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
