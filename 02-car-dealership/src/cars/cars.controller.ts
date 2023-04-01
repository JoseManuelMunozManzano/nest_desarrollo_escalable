import { Controller, Get } from '@nestjs/common';

// El controlador escucha las solicitudes de los clientes y emite una respuesta
@Controller('cars')
export class CarsController {
  @Get()
  getAllCars() {
    return ['Toyota', 'Honda', 'Jeep'];
  }
}
