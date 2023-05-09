// Para crear un custom guard usamos el CLI:
//    nest g gu auth/guards/userRole --no-spec
import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

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

    return true;
  }
}
