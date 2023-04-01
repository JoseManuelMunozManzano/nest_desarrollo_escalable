// Este es el módulo principal.
// Va a tener las referencias a todos los otros módulos, servicios, etc. que conforman mi aplicación.
import { Module } from '@nestjs/common';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [CarsModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
