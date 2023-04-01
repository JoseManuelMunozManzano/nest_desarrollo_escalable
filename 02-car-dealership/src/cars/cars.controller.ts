import { Controller, Get, Param } from '@nestjs/common';
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

  @Get(':id')
  getCarById(@Param('id') id: string) {
    return this.carsService.findOneById(+id);
  }
}
