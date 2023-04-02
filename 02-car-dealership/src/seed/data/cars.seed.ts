// Las interfaces y las entities, clases que no tengan ninguna dependencia, se pueden importar aquí
// aunque no sean parte del módulo.
// Las clases con dependencias deben importarse en su fuente módule.ts correspondiente.
import { v4 as uuid } from 'uuid';
import { Car } from 'src/cars/interfaces/car.interface';

export const CARS_SEED: Car[] = [
  {
    id: uuid(),
    brand: 'Toyota',
    model: 'Corolla',
  },
  {
    id: uuid(),
    brand: 'Honda',
    model: 'Civic',
  },
  {
    id: uuid(),
    brand: 'Jeep',
    model: 'Cherokee',
  },
];
