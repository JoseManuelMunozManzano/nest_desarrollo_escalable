import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService],
  // Tenemos que exportar para que otro módulo pueda acceder a este service.
  // Esto es lo que el mundo exterior va a conocer de este módulo.
  exports: [CarsService],
})
export class CarsModule {}
