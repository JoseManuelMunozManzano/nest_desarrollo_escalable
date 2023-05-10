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
import { Observable } from 'rxjs';

import { User } from 'src/auth/entities/user.entity';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';

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
    // Se modifica del método get() a getAllAndOverride() y se incluye context.getClass() para que funcione
    // el role en products.controller.ts a nivel de controlador, porque si no, no funciona correctamente
    // al indicar un rol concreto en @Auth
    // Ver: https://docs.nestjs.com/security/authorization#basic-rbac-implementation
    const validRoles: string[] = this.reflector.getAllAndOverride(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ]);

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
