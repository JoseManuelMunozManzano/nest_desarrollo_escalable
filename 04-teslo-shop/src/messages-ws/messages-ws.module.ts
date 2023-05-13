// Creado con el comando CLI
// nest g res messagesWs --no-spec
// Indicar que es un WebSocket y no crear CRUD
//
// Un Gateway es básicamente un controlador que envuelve una implementación de socket.io o ws.
// Su misión es habilitar que el servidor pueda mandar información al cliente sin que este la solicite.
// Ver: https://docs.nestjs.com/websockets/gateways
import { Module } from '@nestjs/common';
import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';

@Module({
  // MessagesWsGateway sería como el controller
  providers: [MessagesWsGateway, MessagesWsService],
})
export class MessagesWsModule {}
