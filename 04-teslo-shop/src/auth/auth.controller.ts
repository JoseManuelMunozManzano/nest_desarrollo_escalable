// Recordar que los controladores son los que escuchan los requests y emiten una respuesta.
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Headers,
  SetMetadata,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { Auth, GetUser, RawHeaders } from './decorators';
import { User } from './entities/user.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interfaces';

@ApiTags('Auth')
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

  // Método cuando se refresca el navegador, para devolver la información del usuario con un nuevo token.
  @Get('check-status')
  @Auth()
  checkAuthStatus(
    @GetUser(/*Si solo quisiéramos el id aquí indicaríamos 'id' */) user: User,
  ) {
    return this.authService.checkAuthStatus(user);
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

  // Vamos a crear un Custom Guard y un Custom Decorator que nos sirva para decorar que el get necesita
  // ciertos roles, es decir, a nivel macro voy a decir que privateRoute2 necesita ciertos roles.
  //
  // Primero vamos a hacer esto de una manera fea y luego lo haremos de la manera recomendada por el equipo de Nest.
  //
  // La forma "fea" se hace con el decorador @SetMetadata() que nos sirve para incluir información extra al método
  // o al controlador que quiero ejecutar.
  // En este caso quiero que roles tenga un conjunto posible de valores.
  // Para evaluar esta información se usa un Custom Guard que verá la data y, dependiendo del usuario y de los roles
  // que están en la metadata, lo dejará o no pasar.
  //
  // Vemos que el custom guard se informa también en @UseGuards(), pero notar que es sin paréntesis.
  // Se puede informar new UserRoleGuard() y crear una instancia, pero normalmente los vamos a informar aquí
  // sin crear instancia, para que no cree una instancia por llamada, sino usar siempre la misma.
  //
  // Indicar que esta forma no le gusta a Nest porque en @SetMetadata es difícil equivocarse y poner otra cosa en
  // vez de roles.
  // Por eso desde Nest prefieren crear Custom Decorators.
  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-user'])
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  // Creando el Custom Decorator (recomendado por el equipo de Nest), para indicar que este get
  // necesita ciertos roles.
  // Ver el custom decorator del fuente role-protected.decorator.ts
  //
  // PROBLEMA: Es muy fácil olvidarse de poner @RoleProtected y es muy fácil olvidarse de poner AuthGuard()
  //    En ambos casos todos los usuarios independientemente del role pasarían.
  @Get('private3')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin, ValidRoles.user)
  // NOTA: AuthGuard es autenticación y UserRoleGuard es autorización.
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  // SOLUCION: Crear un único decorador que haga todo este trabajo (@RoleProtected y @UseGuards)
  //    Vamos a crear un decorador basado en otros decoradores (@Auth())
  //    Esto se llama Composición de Decoradores.
  //    Ver: https://docs.nestjs.com/custom-decorators#decorator-composition
  @Get('private4')
  // NOTA: Si solo fuera admitido un role como admin, lo indicamos y ya.
  @Auth(ValidRoles.admin)
  privateRoute4(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
