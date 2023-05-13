import { Socket } from 'socket.io';
import { User } from '../../auth/entities/user.entity';

// El id va a apuntar a un socket
// Ejemplo:
//  {
//      'dsafldsfds1': socket,
//      'dsafldsfds2': socket,
//       ......
//      'dsafldsfdsn': socket,
//  }
//
// Adicionamos el usuario
export interface ConnectedClients {
  [id: string]: {
    socket: Socket;
    user: User;
    // Esto es una forma de permitir que un usuario tenga más de una conexión en función del dispositivo.
    //desktop: boolean;
    //mobile: boolean;
  };
}
