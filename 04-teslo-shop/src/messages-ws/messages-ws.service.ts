import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Socket } from 'socket.io';
import { Repository } from 'typeorm';

import { ConnectedClients } from './interfaces/connected-clients.interface';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class MessagesWsService {
  // Almacenamiento de todos mis sockets (clientes) para poder identificarlos.
  // No merece la pena guardarlos en BD porque es muy volátil y es mejor manejarlo en memoria.
  // Pero si hay muchos usuarios, para evitar problemas de memoria, entonces si es necesario usar la BD.
  private connectedClients: ConnectedClients = {};

  // Para verificar la BD de usuarios puedo inyectar el repositorio que maneja la BD.
  // Como estamos importando todo el AuthModule, que a su vez contiene todo el TypeOrmModule que indica
  // que entidades puede manejar (User en este caso) no tenemos que hacer ninguna otra importación.
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  // Cuando un cliente se conecta
  async registerClient(client: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error('User not found');
    if (!user.isActive) throw new Error('User not active');

    this.connectedClients[client.id] = {
      socket: client,
      user: user,
    };
  }

  // Cuando un cliente se desconecta
  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  // Conteo de clientes conectados
  getConnectedClients(): string[] {
    return Object.keys(this.connectedClients);
  }

  getUserFullName(socketId: string) {
    return this.connectedClients[socketId].user.fullName;
  }
}
