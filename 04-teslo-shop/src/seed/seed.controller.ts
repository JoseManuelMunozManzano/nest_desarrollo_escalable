import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SeedService } from './seed.service';
//import { Auth } from '../auth/decorators';
//import { ValidRoles } from '../auth/interfaces';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // Y ahora, ¿Cómo hago para proteger estas rutas en otros lugares? Por ejemplo en seed.controller.ts solo
  // usuarios con role admin pueden ejecutar ese endpoint.
  @Get()
  // Esto falla con error:
  // ERROR [AuthGuard] In order to use "defaultStrategy", please, ensure to import PassportModule in each place
  // where AuthGuard() is being used. Otherwise, passport won't work correctly.
  //
  // El problema es que @Auth() usa AuthGuard() que está conectado a passport, y passport es un módulo.
  // Tenemos que exportar y hacer visible para todo el mundo nuestro módulo Auth. Ver auth.module.ts y seed.module.ts
  // Una vez hechas las exportaciones / importaciones, ya funciona correctamente.
  //
  // Se quita porque no tenemos usuarios y queremos que se ejecute.
  // Luego, tenemos que tener mucho cuidado con producción, quitar la posibilidad de ejecutar esto o con role admin...
  //@Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
