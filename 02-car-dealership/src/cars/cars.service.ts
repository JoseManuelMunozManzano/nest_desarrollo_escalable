// To-dos los servicios son providers pero no todos los providers son servicios.
//
// Un servicio aloja la lógica de negocio de forma que sea reutilizable mediante inyección de
// dependencias (decorador @Injectable()).
//
// Los providers son clases que se pueden inyectar. Pero no todos los providers van a tener
// lógica de negocio (no todos son servicios)
import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { Car } from './interfaces/car.interface';
// No se informa, pero es './dtos/index.ts
import { CreateCarDto, UpdateCarDto } from './dtos';

@Injectable()
export class CarsService {
  // Se ha creado la interface Car para obligar a que nos envíen la data de la manera que queremos.
  // También dejamos de usar el id como un correlativo y usamos uuid.
  // https://www.npmjs.com/package/uuid
  // Para instalar: yarn add uuid
  // Y para la definición de tipos para TypeScript: yarn add -D @types/uuid
  private cars: Car[] = [
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

  // Como cars es privado, los devolvemos desde este método público
  findAll() {
    return this.cars;
  }

  // Sigue habiendo otro error.
  // Si se manda como id un string que no existe devuelve un status 200 en vez de un 404.
  // Para corregir esto, Nest dispone de varios Exception Filters.
  // Como nos encontramos dentro de la exception zone definida por Nest, Nest se encarga de manejar
  // las excepciones que lancemos (throw).
  // La Exception zone incluye:
  //   Guards -> Before Interceptor -> Pipes -> Controllers -> Decorators -> After Interceptor
  findOneById(id: string) {
    const car = this.cars.find((car) => car.id === id);

    // Para probar en Postman ir a la ruta: localhost:3000/cars/4
    if (!car)
      http: throw new NotFoundException(`Car with id '${id}' not found`);

    return car;
  }

  create(createCarDto: CreateCarDto) {
    const car: Car = {
      id: uuid(),
      ...createCarDto,
    };

    // El brand, model podría existir, pero no nos importa. Queremos aprender como se hace el POST.
    // En los ejemplos sobre BBDD esto se controlará.
    // Igualmente, si fuera sobre BBDD habría que hacer un async await y esperar que la inserción
    // fuera correcta.
    this.cars.push(car);

    return car;
  }

  update(id: string, updateCarDto: UpdateCarDto) {}
}
