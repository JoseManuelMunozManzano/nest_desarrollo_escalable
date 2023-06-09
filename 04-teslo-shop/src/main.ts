import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Para que las urls tengan /api como prefijo
  app.setGlobalPrefix('api');

  // GlobalPipe para poder usar las validaciones/transformaciones de DTO
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Open API:
  // Ruta:
  // https://docs.nestjs.com/openapi/introduction
  // Instalaciones:
  // yarn add @nestjs/swagger
  //
  // Nota: Los tags no los vamos a hacer aquí.
  // Ir a la ruta siguiente para ver Swagger: http://localhost:3001/api
  // Nos falta todavía mucha información de los endpoints pero ya podríamos lanzar pruebas.
  //
  // Vamos a agrupar con tags todo lo que tiene relación, en vez de tenerlo todo bajo default.
  // Para ello, ver en cada controller el decorador @ApiTags()
  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFul API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    // En swagger se verá un candado indicando que tiene seguridad y que hay que indicar un bearer-token.
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      // This name here is important for matching up with @ApiBearerAuth()in your controller!)
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Este es el endpoint al que tenemos que apuntar para ver swagger.
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT, () => {
    // En vez de un console.log que se ve más feo, usamos el logger.
    logger.log(`App running on port ${process.env.PORT}`);
  });
}
bootstrap();
