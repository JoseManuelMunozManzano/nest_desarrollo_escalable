import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

// Todavía nos hace falta un punto muy importante en nuestra app. Es que, cuando recibamos el JWT (no sabemos
// como y donde) tenemos que saber que corresponde a X usuario y que información tiene
// de ese usuario (payload).
// IMPORTANTE!! No grabar información sensible del usuario como tarjetas de crédito, etc. en el payload,
// porque esa información es visible por cualquier persona que intercepte el JWT.
// Ver: https://jwt.io/
//
// Para hacer esa verificación y pasar esa información del usuario necesitamos establecer una estrategia.
// La estrategia indica si el token es válido.
//
// En nuestro caso vamos a usar una estrategia personalizada que nos indicará si el usuario está activo,
// usando el mail, y si no lo está, que el token sea válido nos dará igual porque no se podrá autenticar.

// Para poder usar esta clase, indicar que los Strategies son Providers, de ahí que indicamos el decorador
// @Injectable y ya podemos enlazarlo en el módulo que queramos (ver auth.module.ts).
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get('JWT_SECRET'),
      // Cuando se manda una petición http, ¿en donde espero el token? header, header de autenticación
      // con Bearer Token...
      // Las peticiones se van a hacer con JWT como Bearer Token, y así se indica:
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // Esta función se ejecutará automáticamente cuando el token es válido y no ha expirado.
  async validate(payload: JwtPayload): Promise<User> {
    const { email } = payload;

    const user = await this.userRepository.findOneBy({ email });

    if (!user) throw new UnauthorizedException('Token not valid');

    if (!user.isActive)
      throw new UnauthorizedException('User is inactive, talk with an admin');

    // Haciendo el return del user conseguimos que se añada a la request.
    // Más tarde vamos a usar decoradores personalizados para obtener información de la request, de este user.
    return user;
  }
}

// NOTA: Usar varias estrategias:
//    export class JwtStrategy extends PassportStrategy( Strategy, 'admin' ) {
// y para usarla:
//    @UseGuards( AuthGuard('admin') )
