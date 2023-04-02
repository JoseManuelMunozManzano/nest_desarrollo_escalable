// La idea de este módulo es precargar datos ficticios para pruebas, sobre todo para otro programador
// que se baja de GitHub el código y quiere probar que todos los endpoints funcionan,
// que haga un GET y tenga data, y si se ejecuta un comando destructivo, que no haya problemas en
// recuperar la data.
//
// Esto solo tiene que funcionar en desarrollo.
//
// Lo suyo sería precargar una BD de Docker para las pruebas, o variables de entorno.
import { Module } from '@nestjs/common';

import { CarsModule } from 'src/cars/cars.module';
import { BrandsModule } from 'src/brands/brands.module';

import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  // Tenemos que importar el módulo para acceder a su servicio, controlador...
  // Se tratan como Singleton.
  // No olvidar en los módulos CarsModule y BrandsModule exportar el servicio,
  // controlador... que necesitemos.
  imports: [CarsModule, BrandsModule],
})
export class SeedModule {}
