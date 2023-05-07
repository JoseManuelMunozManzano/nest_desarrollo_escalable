// Creadp con el mandato CLI
//  nest g res auth --no-spec
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

// Necesitamos generar un JWT, que será el que los usuarios almacenan en su dispositivo.
// Cada vez que quieran acceder a un endpoint que requiera autenticación van a proporcionarnoslo.
// Mi backend sabrá si fue o no manipulado, y va a tener cierta información que me va a ayudar a saber qué
// usuario es el que está intentando logearse, entre otras cosas.
//
// Vamos a usar la librería Passport.
// Ver: https://docs.nestjs.com/security/authentication
//      https://docs.nestjs.com/recipes/passport
// NOTA: No vamos a instalar passport-local porque vamos a hacerlo con JWT.
// Ver: https://docs.nestjs.com/recipes/passport#jwt-functionality
//
// Instalaciones:
// yarn add @nestjs/passport passport
// yarn add @nestjs/jwt passport-jwt
// yarn add -D @types/passport-jwt

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    TypeOrmModule.forFeature([User]),
    // La estrategia que vamos a usar (jwt).
    // Se puede usar registerAsync para asegurarnos de que las variables de entorno están cargadas antes de
    // usarlas, o si la configuración del módulo depende de algún servicio externo o config. en la nube y
    // necesitamos esa respuesta antes de configurar mi módulo.
    // Por ahora se va a usar register, pero lo vamos a cambiar por registerAsync.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configuración del módulo jwt.
    // Se indica el secret, el cual no debería conocer nadie (Mucho cuidado en github)
    //    Se usan variables de entorno.
    // El tiempo de expiración.
    // PROBLEMA: Podría no estar todavía el valor en la variable de entorno. Hay que hacerlo asíncrono.
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '2d',
      },
    }),
  ],
  // Todavía no haría falta, pero sabemos que vamos a usar el modelo User y la configuración que hemos hecho aquí
  // en otros módulos.
  exports: [TypeOrmModule],
})
export class AuthModule {}
