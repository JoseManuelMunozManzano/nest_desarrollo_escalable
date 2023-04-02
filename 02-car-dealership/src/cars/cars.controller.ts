import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dtos/create-car.dto';
import { UpdateCarDto } from './dtos/update-car.dto';

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

  // Para validar que el id es realmente un uuid usamos el pipe ParseUUIDPipe.
  // Si el id no es un uuid correcto ni siquiera llega al servicio.
  // Probar uuid incorrecto: http://localhost:3000/cars/xx1
  // UUID trabaja con varias versiones. Se puede validar un UUID de una versión en concreto.
  // También se puede validar el mensaje si hay error, el status code y varias cosas más.
  @Get(':id')
  getCarById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.carsService.findOneById(id);
  }

  // Obtenemos la data createCarDto de la petición con el decorador @Body()
  // Tendremos que validar que el body de la petición incluya las properties brand y model, como string.
  // Para conseguir esto usamos el DTO CreateCarDto.
  // Pero por si solo esto no funciona. Hay que decirle a Nest que aplique la validación de los DTO
  // (ver main.ts)
  @Post()
  createCar(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  // Nota: es indiferente indicar '/:id' o ':id'
  // Tendremos que validar que el id a actualizar existe y que el body (updateCarDto) tenga las
  // properties que necesitamos, como string.
  // Hay que tener cuidado con que DTO usar porque a lo mejor solo queremos actualizar el modelo
  // y nuestro DTO CreateCarDto nos indica que tenemos que informar tanto la marca como el modelo.
  // Creamos un nuevo DTO UpdateCarDto.
  @Patch(':id')
  updateCar(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    // Veremos que cuando vaya a BBDD esto queda igual porque Nest esperará al resultado de la
    // Promise para devolver la respuesta.
    return this.carsService.update(id, updateCarDto);
  }

  // Tendremos que validar que el id a eliminar existe
  @Delete(':id')
  deleteCar(@Param('id', ParseUUIDPipe) id: string) {
    return this.carsService.delete(id);
  }
}
