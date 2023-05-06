// Creadp con el mandato CLI
//  nest g res auth --no-spec
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([User])],
  // Todavía no haría falta, pero sabemos que vamos a usar el modelo User y la configuración que hemos hecho aquí
  // en otros módulos.
  exports: [TypeOrmModule],
})
export class AuthModule {}
