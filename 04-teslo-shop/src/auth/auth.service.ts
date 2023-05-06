import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
      // Preparando para insertar
      const user = this.userRepository.create(createUserDto);

      // Insertamos
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.errorHandler.errorHandle(error);
    }
  }
}
