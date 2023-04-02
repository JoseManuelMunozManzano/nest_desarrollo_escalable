import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarsService } from './cars.service';

// El controlador escucha las solicitudes de los clientes y emite una respuesta
@Controller('cars')
export class CarsController {
  // Inyección de dependencia.
  // Para que Nest cree la instancia de CarsController tiene la dependencia de CarsService.
  // Nest creará (si no existe ya porque en tal caso la reutiliza por motivos de eficiencia) la
  // instancia de CarsService.
  constructor(private readonly carsService: CarsService) {}

  @Get()
  getAllCars() {
    return this.carsService.findAll();
  }

  // Tenemos que validar que el id sea un número, y de hecho queremos que sea un número de entrada,
  // no el string que entra por defecto, y no tener que transformarlo nosotros.
  // Habría que realizar un manejo de excepciones, pero Nest ya nos puede ayudar con ello (Pipes).
  // Los pipes transforman la data recibida en los requests.
  // Con @UsePipes indicamos que usamos pipes. Se usa ValidationPipe para validar la información del request.
  // Se pueden informar varios pipes en cadena.
  // Si ahora se mandara un texto, por ejemplo: http://localhost:3000/cars/1
  // daría un status 400 (antes de usar pipes era 200) con un mensaje indicando que se espera un
  // número
  @Get(':id')
  getCarById(@Param('id', ParseIntPipe) id: number) {
    return this.carsService.findOneById(id);
  }
}
