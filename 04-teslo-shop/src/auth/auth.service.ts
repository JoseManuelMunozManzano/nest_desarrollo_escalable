import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// Esta forma de importar sería una forma muy ligera de utilizar el patrón adaptador.
// Si el día de mañana queremos cambiar bcrypt por otro paquete solo tendríamos que cambiar el nombre en el from.
import * as bcrypt from 'bcrypt';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ErrorHandleService } from 'src/common/services/error-handle.service';

@Injectable()
export class AuthService {
  // Usamos el servicio de manejo de errores
  private readonly errorHandler: ErrorHandleService = new ErrorHandleService(
    'AuthService',
  );

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

      // TODO: Retornar el JWT de acceso
      return user;
    } catch (error) {
      this.errorHandler.errorHandle(error);
    }
  }
}
