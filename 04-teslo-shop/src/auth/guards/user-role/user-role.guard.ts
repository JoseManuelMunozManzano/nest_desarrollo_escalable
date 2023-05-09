// Para crear un custom guard usamos el CLI:
//    nest g gu auth/guards/userRole --no-spec
import { Reflector } from '@nestjs/core';
import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';

import { User } from 'src/auth/entities/user.entity';

// Para que un guard sea válido tiene que implementar el método canActivate() que devolverá un booleano.
// Si es true lo deja pasar y si es false no lo deja pasar y devuelve un 403 Forbidden.
//
// Una cosa muy buena de los Guards es que se encuentra dentro del flujo de vida de Nest (dentro del Exception Zone).
// Si lanzamos una excepción en vez de devolver true o false, esta excepción es controlada por el Exception Zone
// de Nest.
@Injectable()
export class UserRoleGuard implements CanActivate {
  // Es muy importante obtener la metadata para ver, evaluándola, si lo dejamos pasar o no.
  // Se usa un parámetro de tipo Reflector porque me ayuda a ver información de decoradores y de metadata del método
  // o lo que sea donde se use este Guard.
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(
      'roles',
      context.getHandler(),
    );

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    // ¿Tiene el usuario alguno de los roles definidos en validRoles?
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role)) {
        return true;
      }
    }

    throw new ForbiddenException(
      `User ${user.fullName} need a valid role: [${validRoles}]`,
    );

    return true;
  }
}
