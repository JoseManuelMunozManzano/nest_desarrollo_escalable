import { Injectable } from '@nestjs/common';

import { ConnectedClients } from './interfaces/connected-clients.interface';
import { Socket } from 'socket.io';

@Injectable()
export class MessagesWsService {
  // Almacenamiento de todos mis sockets (clientes) para poder identificarlos.
  // No merece la pena guardarlos en BD porque es muy volátil y es mejor manejarlo en memoria.
  private connectedClients: ConnectedClients = {};

  // Cuando un cliente se conecta
  registerClient(client: Socket) {
    this.connectedClients[client.id] = client;
  }

  // Cuando un cliente se desconecta
  removeClient(clientId: string) {
    delete this.connectedClients[clientId];
  }

  // Conteo de clientes conectados
  getConnectedClients(): number {
    return Object.keys(this.connectedClients).length;
  }
}
