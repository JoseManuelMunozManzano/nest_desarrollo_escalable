import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Esta forma de importar sería una forma muy ligera de utilizar el patrón adaptador.
// Si el día de mañana queremos cambiar bcrypt por otro paquete solo tendríamos que cambiar el nombre en el from.
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { ErrorHandleService } from 'src/common/services/error-handle.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  // Usamos el servicio de manejo de errores
  private readonly errorHandler: ErrorHandleService = new ErrorHandleService(
    'AuthService',
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // Para generar el token. Servicio que nos da JwtModule. Ver auth.module.ts
    private readonly jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // Vamos a encriptar la contraseña con hash de una sola vía, lo que significa que una vez
      // encriptadas jamás pueden recuperarse (en teoría), a diferencia de JWT, donde si es posible desencriptarlas.
      // Se va a usar el paquete bcrypt.
      // yarn add bcrypt
      // Y sus tipos.
      // yarn add -D @types/bcrypt
      const { password, ...userData } = createUserDto;

      // Preparando para insertar
      const user = this.userRepository.create({
        ...userData,
        // Esta es la encriptación, con un salt de 10
        password: bcrypt.hashSync(password, 10),
      });

      // Insertamos
      await this.userRepository.save(user);

      // Para no regresar la contraseña en la response.
      // Esta es la forma cutre. Más adelante lo vamos a hacer de otra forma.
      delete user.password;

      return { ...user, token: this.getJwtToken({ email: user.email }) };
    } catch (error) {
      this.errorHandler.errorHandle(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { password, email } = loginUserDto;

    // Buscamos el usuario por su email.
    //const user = await this.userRepository.findOneBy({ email });
    //
    // Jamás debemos regresar el password.
    // Para ello en nuestro user.entity.ts indicamos select en false. Con eso, en findOneBy no aparece el password.
    // Pero ahora tenemos el problema de que necesito el password almacenado en la BD del usuario.
    // Solo la necesito en el login.
    // Por eso sustituimos el findOneBy por este findOne con un where.
    // Con esto solo recibimos del usuario el email y el password, que es lo que realmente necesito para el login.
    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true },
    });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    // Si existe el usuario comparo la contraseña del request con la que tengo en BD.
    if (!bcrypt.compareSync(password, user.password))
      // Solo para fines visuales. JAMAS hay que indicar cual es el dato erroneo.
      throw new UnauthorizedException('Credentials are not valid (password)');

    return { ...user, token: this.getJwtToken({ email: user.email }) };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
