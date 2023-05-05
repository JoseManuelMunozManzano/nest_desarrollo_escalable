import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FilesService } from './files.service';
import { fileFilter } from './helpers/fileFilter.helper';

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
  //
  // Vamos a validar que realmente el usuario sube una imagen. Esto puede implementarse en files o también en common.
  // Para este caso, como solo lo vamos a utilizar aquí, lo vamos a dejar en files. Se crea un módulo helpers dentro
  // del módulo files, que contendrá funciones específicas de este módulo.
  // Y se usará en el FileInterceptor (mirar la firma para ver qué se pide y que se devuelve, que es void)
  // mandando la referencia, es decir, sin los paréntesis. El FileInterceptor ejecutará la función.
  //
  // Se incluye un ejemplo con ParseFilePipe que sustituye a fileFilter. Se indica el tipo de archivos que espera
  // y que el tamaño máximo es de 1024x1024 y 3 Mb. Si no se envía fichero da un error de File is required, y
  // si el tipo es distinto de los indicados también da una excepción Validation failed.
  @Post('product')
  @UseInterceptors(FileInterceptor('file'))
  uploadProductImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({ fileType: '.(png|jpeg|jpg|gif)' }),
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 3 }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // TODO Cambiar el nombre porque si no, si existiese, reemplazaría la imagen por esta.
    return { fileName: file.originalname };
  }
}
