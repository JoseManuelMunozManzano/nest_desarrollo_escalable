// Toda la carpeta brands se ha generado con el mandato CLI
// nest g resource brands --no-spec
import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';

@Module({
  controllers: [BrandsController],
  providers: [BrandsService],
})
export class BrandsModule {}
