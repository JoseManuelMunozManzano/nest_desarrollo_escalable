// Creadp con el mandato CLI
//  nest g res auth --no-spec
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

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
  // Como la estrategia Jwt es un provider, lo ponemos aquí.
  providers: [AuthService, JwtStrategy],
  imports: [
    // Esto no hace falta porque se importó de manera global ConfigModule en app.module.ts
    // ConfigModule,
    TypeOrmModule.forFeature([User]),
    // La estrategia que vamos a usar (jwt).
    // Se puede usar registerAsync para asegurarnos de que las variables de entorno están cargadas antes de
    // usarlas, o si la configuración del módulo depende de algún servicio externo o config. en la nube y
    // necesitamos esa respuesta antes de configurar mi módulo.
    // Por ahora se va a usar register, pero lo vamos a cambiar por registerAsync.
    PassportModule.register({ defaultStrategy: 'jwt' }),
    // Configuración del módulo jwt de manera asíncrona.
    // Cambia un poco la configuración con respecto a no asíncrono.
    // Se indica el secret, el cual no debería conocer nadie (Mucho cuidado en github)
    //    Se usan variables de entorno.
    // El tiempo de expiración.
    JwtModule.registerAsync({
      // NOTA: Para fines educativos, importaremos ConfigModule e inyectaremos ConfigService para poder
      // usar variables de entorno, aunque no haría falta (ver línea comentada que hace uso de process.env)
      imports: [ConfigModule],
      inject: [ConfigService],
      // useFactory es la función que se va a mandar a llamar cuando se intente registrar el módulo
      // de manera asíncrona.
      // NOTA: useClass se usa mucho para la parte de testing
      useFactory: (configService: ConfigService) => {
        // console.log('JWT secret', configService.get('JWT_SECRET'));
        // console.log('JWT SECRET', process.env.JWT_SECRET);
        return {
          // secret: process.env.JWT_SECRET,
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2d',
          },
        };
      },
    }),
  ],
  // Todavía no haría falta, pero sabemos que vamos a usar el modelo User y la configuración que hemos hecho aquí
  // en otros módulos.
  // Para poder exportar nuestra estrategia de Jwt a otros módulos, por si queremos validar el token manualmente...
  //
  // Esto hace falta para poder usar en otros módulos todo lo referente a la autenticación - autorización.
  exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
