import { Controller, Get } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Auth } from 'src/auth/decorators';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  // Y ahora, ¿Cómo hago para proteger estas rutas en otros lugares? Por ejemplo en seed.controller.ts solo
  // usuarios con role admin pueden ejecutar ese endpoint.
  @Get()
  // Esto falla con error:
  // ERROR [AuthGuard] In order to use "defaultStrategy", please, ensure to import PassportModule in each place
  // where AuthGuard() is being used. Otherwise, passport won't work correctly.
  //@Auth(ValidRoles.admin)
  executeSeed() {
    return this.seedService.runSeed();
  }
}
