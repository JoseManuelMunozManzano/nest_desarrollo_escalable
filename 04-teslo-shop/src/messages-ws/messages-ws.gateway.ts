// Hay que instalar:
// yarn add @nestjs/websockets @nestjs/platform-socket.io
//
// También instalamos:
// yarn add socket.io
// Para poder tener acceso a funcionalidades como tipo Socket...
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';

// La única diferencia entre este controlador y los otros que hemos visto en el curso es este decorador.
// Con esto que tenemos aquí vamos a poder escuchar clientes que se conectan, acceso al WebSocket server y
// ya tenemos toda la configuración hecha.
//
// Para probar en Postman hacer un GET a la ruta:
// http://localhost:3001/socket.io/socket.io.js
// Debería devolver una respuesta, que es librería que vamos a necesitar para establecer la conexión con el backend.
// Además este es el url que tenemos que dar al cliente para conectarse.
//
// Habilitamos cors
//
// Cuando un cliente se conecta, queremos saber el id de ese cliente y cuando un cliente se desconecta queremos saber
// que cliente se desconectó. Para esto implementamos dos interfaces: OnGatewayConnection y OnGatewayDisconnect
@WebSocketGateway({ cors: true })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly messagesWsService: MessagesWsService) {}

  handleConnection(client: Socket) {
    // Indicar que el id es muy volátil
    this.messagesWsService.registerClient(client);

    //console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

    //console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }
}
