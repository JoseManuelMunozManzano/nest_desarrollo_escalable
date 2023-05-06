import { join } from 'path';
import { existsSync } from 'fs';

import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class FilesService {
  // Esto valdría para validar cualquier tipo de fichero.
  // Podría ser más genérico y recibir el tipo de dato para saber en qué carpeta buscar.
  getStaticProductImage(imageName: string) {
    const path = join(__dirname, '../../static/products', imageName);

    if (!existsSync(path)) {
      // Solo indicamos el nombre y no el path para no dar más información a un supuesto hacker.
      throw new BadRequestException(`No product found with image ${imageName}`);
    }

    // Devolvemos path completo para mostrar la imagen.
    return path;
  }
}
