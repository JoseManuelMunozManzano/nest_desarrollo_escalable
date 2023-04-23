// Creado todo products con el mandato de CLI
// nest g res products --no-spec
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';

import { Product, ProductImage } from './entities';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  // No olvidar. En imports se importan módulos
  imports: [
    // forFeature() porque nos permite registrar las entidades en el modulo donde lo configuremos.
    // Se definen todas las entidades que este módulo está definiendo.
    TypeOrmModule.forFeature([Product, ProductImage]),
  ],
})
export class ProductsModule {}
