// Creado con el mandato CLI
// nest g res seed --no-spec
// Luego se ha borrado casi todo y se ha rehecho con lo necesario.

import { Module } from '@nestjs/common';

import { ProductsModule } from 'src/products/products.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  // Recordar que se importa el módulo.
  imports: [ProductsModule],
})
export class SeedModule {}
