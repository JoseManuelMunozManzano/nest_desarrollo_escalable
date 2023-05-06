import { createReadStream } from 'fs';

import {
  Controller,
  FileTypeValidator,
  Get,
  Header,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { diskStorage } from 'multer';

import { FilesService } from './files.service';
import { fileNamer } from './helpers/index';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    // Añadimos configService para tener acceso a las variables de entorno.
    private readonly configService: ConfigService,
  ) {}

  // Servir archivo de manera controlada
  // Regresamos la imagen!! Para ello usamos el decorador @Res que es la response de Nest.
  //
  // IMPORTANTE: Al usar el decorador @Rest() se rompe la funcionalidad de Nest en el método, es decir, indicamos
  //  a Nest que NO queremos que tome el control de la respuesta porque la vamos a emitir nosotros manualmente.
  //  También nos saltamos interceptores que tengamos definidos de manera global y restricciones que usa Nest,
  //  pasos del ciclo de vida de Nest. MUCHO CUIDADO AL USARLO.
  //
  // NOTA: Indicamos res de tipo Response en vez de Express.Response porque con este último TS no nos da la ayuda.
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);

    // EJEMPLO de respuesta manual en vez de un return.
    // res.status(403).json({
    //   ok: false,
    //   path,
    // });

    // Enviamos el archivo. Si da un error no va a continuar.
    res.sendFile(path);
  }

  // Otra forma de mostrar la imagen sin usar @Res, y por tanto siguiendo el ciclo de vida de Nest.
  // Se usa el decorador @Header porque sin el, al ingresar el secureUrl en el navegador intenta descargar la imagen
  // en vez de solo mostrarla.
  @Get('productNoRes/:imageName')
  @Header('Content-Type', 'image/jpeg')
  findProductImageWithoutRes(@Param('imageName') imageName: string) {
    const stream = createReadStream(
      this.filesService.getStaticProductImage(imageName),
    );

    return new StreamableFile(stream);
  }

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
  // Vamos a dejar la imagen en un archivo de la carpeta static/products
  // Para ello se usa en el FileInterceptor la propiedad storage y se usa la función diskStorage() indicando
  // el destino.
  // Esto crea la imagen en ese directorio, con un nombre único, pero sin extensión.
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
  //
  // Para cambiar el nombre de la imagen usamos filename. Se ha hecho una función helper que devuelve el nuevo
  // nombre. Pasamos su referencia.
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer,
      }),
    }),
  )
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
    // Problema: Nadie desde fuera puede acceder a mi filesystem.
    // Incluso aunque en este console.log se indique el path:
    // path: 'static/products/c282102e-ac3f-45ed-8bfe-cb1b3f95da74.jpeg',
    // No se puede llegar.
    // Hay que servir el archivo de manera controlada o poner la carpeta de forma pública, visible a todo el mundo.
    //
    //console.log(file);

    // Retornando el secureUrl verdadero usando variables de entorno.
    // La idea es que me devuelva un path y al pulsar en el se muestre la imagen en el navegador.
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;

    return { secureUrl };
  }
}
