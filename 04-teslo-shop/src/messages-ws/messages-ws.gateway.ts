// Hay que instalar:
// yarn add @nestjs/websockets @nestjs/platform-socket.io
import { WebSocketGateway } from '@nestjs/websockets';
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
@WebSocketGateway({ cors: true })
export class MessagesWsGateway {
  constructor(private readonly messagesWsService: MessagesWsService) {}
}
