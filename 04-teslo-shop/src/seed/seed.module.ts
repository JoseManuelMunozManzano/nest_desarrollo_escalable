// Creado con el mandato CLI
// nest g res seed --no-spec
// Luego se ha borrado casi todo y se ha rehecho con lo necesario.

import { Module } from '@nestjs/common';

import { ProductsModule } from './../products/products.module';
import { AuthModule } from './../auth/auth.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  // Recordar que se importa el módulo.
  // Importamos AuthModule para poder usar el decorador Auth() en este módulo.
  imports: [ProductsModule, AuthModule],
})
export class SeedModule {}
