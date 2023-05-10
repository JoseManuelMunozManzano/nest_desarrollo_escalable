// Creado todo products con el mandato de CLI
// nest g res products --no-spec
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './../auth/auth.module';

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
    AuthModule,
  ],
  // Recordar que se exporta lo que necesitemos.
  exports: [
    ProductsService,
    // Es muy típico exportar también el módulo de TypeOrm en caso de que queramos trabajar con los dos
    // repositorios de las dos entidades creadas (Product y ProductImage)
    TypeOrmModule,
  ],
})
export class ProductsModule {}
