import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  // Petición POST para subir archivos.
  // Se indica product porque queremos indicar que las imágenes son de productos.
  // Pero este módulo PUEDE USARSE DE MANERA GENERICA.
  //
  // Se usa el decorador @UploadedFile() para indicar que es un archivo que se sube y necesitamos indicarle
  // la key, es decir, el nombre de la propiedad en el body.
  // Para esto usaremos interceptores (interceptan las solicitudes y las respuestas y las pueden mutar)
  // con el decorador @UseInterceptors()
  // Hay interceptores globales, para el controlador o, como en este caso, para el método.
  //
  // Por defecto, cuando hacemos esta petición, el archivo se sube a una carpeta temporal. Cuando no se use, Nest
  // lo limpia.
  // Así que tenemos que decirle a Nest que vamos a hacer con el archivo.
  //
  // De nuevo indico que NO ES RECOMENDABLE GRABAR FICHEROS EN FILESYSTEM. Lo vamos a hacer para conocerlo, pero
  // NO HACERLO, especialmente si es un servicio que se va a desplegar en la nube. El motivo es que, aunque tendremos
  // validaciones, alguien podría saltárselas y subir algún archivo maligno que podría eliminar algo, exponer las
  // variables de entorno...
  // DE NUEVO, NO QUEREMOS SUBIR IMAGENES EN EL MISMO SERVIDOR DONDE SE ENCUENTRA EL CODIGO DE LA APLICACION.
  // USAR UN SERVICIO DE TERCEROS.
  @Post('product')
  @UseInterceptors(FileInterceptor('file'))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    return file;
  }
}
