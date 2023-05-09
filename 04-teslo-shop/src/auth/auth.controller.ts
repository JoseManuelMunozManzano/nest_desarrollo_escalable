// Recordar que los controladores son los que escuchan los requests y emiten una respuesta.
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  // Creamos la primera ruta privada.
  // Su misión es asegurarse de que el JSON Web Token esté presente en el header como un bearer token,
  // Que el usuario exista, esté activo y el token no haya expirado.
  // Primero la vamos a poner aquí en el controller, pero luego la llevaremos a su sitio definitivo.
  //
  // Para hacer una ruta privada tenemos que implementar Guards, que se usan para permitir o prevenir acceso
  // a una ruta (aquí es donde se debe autorizar una solicitud)
  // Primero se hace aquí con AuthGuard(), que ya lo hace todo automático, y luego se harán Guards personalizados.
  // Una vez hecho esto, en Postman con este Get: http://localhost:3001/api/auth/private
  // el resultado será 401, Unauthorized SI NO TENEMOS TOKEN O NO TENEMOS IMPLEMENTADO AUTHORIZATION
  // CON BEARER TOKEN O EL USUARIO ESTA INACTIVO.
  //
  // Indicar que en la request tenemos el usuario
  // porque en nuestra estrategia jwt.strategy.ts devolvimos el usuario. Ya lo tenemos y usamos @Req para usarlo.
  // Pero tenemos que tener el decorador @UserGuards(AuthGuard()) porque sino no va a funcionar.
  // Para esto es mejor hacer un custom property decorator. Ver get-user.decorator.ts
  //
  // Vamos a hacer que GetUser reciba un argumento (si fuera más de uno se usaría un arreglo ['email' 'passord']
  // por ejemplo), es decir, vamos a usar GetUser de las dos maneras, con argumentos y sin argumentos.
  // Si no mandamos argumentos esperaríamos ver todo el usuario. Si le mandamos el email queremos solo el email.
  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    /* @Req() request: Express.Request */
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    // Hacemos otro custom property decorator para obtener el header del request. Es una práctica para aprender.
    @RawHeaders() rawHeaders: string[],
    // Indicar que para obtener los headers Nest nos ofrece ya un decorator.
    @Headers() headers: IncomingHttpHeaders,
  ) {
    //console.log({ user: request.user });

    return {
      ok: true,
      mesage: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }
}
