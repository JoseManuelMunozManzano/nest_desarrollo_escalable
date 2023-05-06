// Se va a realizar la carga de archivos, imágenes en este proyecto pero podría ser cualquier tipo de archivo.
// Indicar que lo mejor es siempre usar un servicio tipo AWS S3 o Cloudinary para gestionar la subida de archivos
// y que no estén en nuestro backend, pero también es útil conocer como trabajar con el filesystem.
//
// Se va a seguir la documentación siguiente:
// https://docs.nestjs.com/techniques/file-upload
//
// Donde, para poder usar TS se indica instalar:
// yarn add -D @types/multer
// Y esta es la única configuración que hay que hacer.
//
// Y más adelante se indica usar ParseFilePipe, pero aquí no se usa porque el instructor parece no tenía la versión
// 9 de NestJs que es la versión a partir de la cual puede usarse este Pipe.
//
// Toda la carpeta files creada con el mandato CLI
// nest g res files --no-spec
// Y se borra lo que no vamos a usar.

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';

@Module({
  controllers: [FilesController],
  providers: [FilesService],
  // Para poder usar ConfigService y tener acceso a las variables de entorno, importamos su módulo ConfigModule
  imports: [ConfigModule],
})
export class FilesModule {}
