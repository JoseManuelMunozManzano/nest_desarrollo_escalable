// Hay que instalar:
// yarn add @nestjs/websockets @nestjs/platform-socket.io
//
// También instalamos:
// yarn add socket.io
// Para poder tener acceso a funcionalidades como tipo Socket...
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';

import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from '../auth/interfaces';

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
  // Este decorador nos sirve para poder mandar notificaciones a todos los clientes.
  // Tiene la información de todos los clientes conectados.
  @WebSocketServer() wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    // Inyección de depdendencia de JwtService para verificar el JWT que me envía el client.
    // También se podría haber inyectado en messages-ws.service.ts, pero se ha hecho aquí por simplicidad.
    private readonly jwtService: JwtService,
  ) {}

  handleConnection(client: Socket) {
    // Ahora en la variable client viene esa información adicional (token) enviado desde el client.
    // Ver handshake, donde se establece la conexión entre cliente y sevidor para ver esa data adicional.
    //console.log(client);

    // Se indica as string para que no se trate como un arreglo de strings.
    // Falta ahora validar si es un JSON Web Token válido y si lo es, a quien le corresponde.
    // En caso de error, no permitir conectarse al cliente.
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;

    try {
      // El payload, si se verifica correctamente el token, tiene el id de la persona que se quiere conectar.
      payload = this.jwtService.verify(token);
    } catch (error) {
      // No se van a tratar las excepciones como indica Nest: https://docs.nestjs.com/websockets/exception-filters
      // porque no me gustan.
      // En cambio, vamos a desconectar al cliente y salir.
      client.disconnect();
      return;
    }

    console.log({ payload });

    // Indicar que el id es muy volátil
    this.messagesWsService.registerClient(client);

    // Cuando un cliente se conecta queremos mandar una notificación a TODOS los usuarios, mandado el id
    // del nuevo cliente conectado.
    // Indicamos en el evento clients-updated dicha lista de usuarios conectados.
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);

    // Indicamos en el evento clients-updated dicha lista de usuarios conectados.
    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }

  // Para escuchar eventos del cliente se usa el decorador @SubscribeMessage
  // Se indica el nombre del evento que se está escuchando.
  // Usando el decorador tenemos acceso inmediato al cliente, de tipo Socket, que es el socket que está emitiendo
  // el evento, y el payload
  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Posibilidades de emisiones a cliente:

    //! Emitiendo el mensaje al cliente que nos envió el mensaje.
    // client.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!',
    // });

    //! Emitiendo el mensaje a todos MENOS al cliente que nos envió el mensaje.
    // client.broadcast.emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!',
    // });

    //! Emitiendo el mensaje a todos los clientes.
    this.wss.emit('message-from-server', {
      fullName: 'Soy Yo!',
      message: payload.message || 'no-message!!',
    });

    //! Emitiendo el mensaje a todos los clientes de una sala.
    // Añadimos un cliente a una sala y le emitimos el mensaje.
    // client.join('ventas');
    // this.wss.to('ventas').emit('message-from-server', {
    //   fullName: 'Soy Yo!',
    //   message: payload.message || 'no-message!!',
    // });
    //
    // Indicar que todos los clientes están unidos a la siguiente sala:
    // client.join(client.id);
  }
}
