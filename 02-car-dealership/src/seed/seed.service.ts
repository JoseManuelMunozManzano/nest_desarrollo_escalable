import { Injectable } from '@nestjs/common';

import { CarsService } from 'src/cars/cars.service';
import { BrandsService } from 'src/brands/brands.service';

import { CARS_SEED } from './data/cars.seed';
import { BRANDS_SEED } from './data/brands.seed';

@Injectable()
export class SeedService {
  // Inyecciones de dependencia. Se inyectan automáticamente.
  // La instancia es la misma en toda la aplicación por defecto.
  constructor(
    private readonly carsService: CarsService,
    private readonly brandsService: BrandsService,
  ) {}

  // Cargamos semilla de información (data)
  populateDB() {
    this.carsService.fillCarsWithSeedData(CARS_SEED);
    this.brandsService.fillBrandsWithSeedData(BRANDS_SEED);

    return 'SEED executed';
  }
}
