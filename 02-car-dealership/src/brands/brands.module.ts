// Toda la carpeta brands se ha generado con el mandato CLI
// nest g resource brands --no-spec
import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
  // Tenemos que exportar para que otro módulo pueda acceder a este service.
  // Esto es lo que el mundo exterior va a conocer de este módulo.
  exports: [BrandsService],
})
export class BrandsModule {}
