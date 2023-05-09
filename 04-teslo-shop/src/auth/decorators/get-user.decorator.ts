import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';

// Creando un custom property decorator.
// createParamDecorator espera como argumento un callback, y tenemos la data, que es lo que
// enviamos (un arreglo si hay más de un argumento) como argumento al usar este decorador, y el contexto,
// que es como se encuentra en este momento la aplicación. Lo importante es que tenemos acceso a la request,
// que es lo que necesitamos porque ahí tenemos el user (incluido en jwt.strategy.ts)
export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    // Un error 500 es mío, el desarrollador de backend cometió el error. En este caso porque no está en una
    // ruta autenticada (y por tanto no obtengo el usuario)
    if (!user)
      throw new InternalServerErrorException('User not found (request)');

    return !data ? user : user[data];
  },
);
