// To-dos los servicios son providers pero no todos los providers son servicios.
//
// Un servicio aloja la lógica de negocio de forma que sea reutilizable mediante inyección de
// dependencias (decorador @Injectable()).
//
// Los providers son clases que se pueden inyectar. Pero no todos los providers van a tener
// lógica de negocio (no todos son servicios)
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class CarsService {
  private cars = [
    {
      id: 1,
      brand: 'Toyota',
      model: 'Corolla',
    },
    {
      id: 2,
      brand: 'Honda',
      model: 'Civic',
    },
    {
      id: 3,
      brand: 'Jeep',
      model: 'Cherokee',
    },
  ];

  // Como cars es privado, los devolvemos desde este método público
  findAll() {
    return this.cars;
  }

  // Sigue habiendo otro error.
  // Si se manda como id un número que no existe devuelve un status 200 en vez de un 404.
  // Para corregir esto, Nest dispone de varios Exception Filters.
  // Como nos encontramos dentro de la exception zone definida por Nest, Nest se encarga de manejar
  // las excepciones que lancemos (throw).
  // La Exception zone incluye:
  //   Guards -> Before Interceptor -> Pipes -> Controllers -> Decorators -> After Interceptor
  findOneById(id: number) {
    const car = this.cars.find((car) => car.id === id);

    // Para probar en Postman ir a la ruta: localhost:3000/cars/4
    if (!car)
      http: throw new NotFoundException(`Car with id '${id}' not found`);

    return car;
  }
}
