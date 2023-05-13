import { Socket } from 'socket.io';

// El id va a apuntar a un socket
// Ejemplo:
//  {
//      'dsafldsfds1': socket,
//      'dsafldsfds2': socket,
//       ......
//      'dsafldsfdsn': socket,
//  }
export interface ConnectedClients {
  [id: string]: Socket;
}
