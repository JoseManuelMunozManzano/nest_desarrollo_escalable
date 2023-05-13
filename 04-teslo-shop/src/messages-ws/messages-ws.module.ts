// Creado con el comando CLI
// nest g res messagesWs --no-spec
// Indicar que es un WebSocket y no crear CRUD
//
// Un Gateway es básicamente un controlador que envuelve una implementación de socket.io o ws.
// Su misión es habilitar que el servidor pueda mandar información al cliente sin que este la solicite.
// Ver: https://docs.nestjs.com/websockets/gateways
//
// Para saber más sobre socket.io: https://socket.io/
import { Module } from '@nestjs/common';

import { MessagesWsService } from './messages-ws.service';
import { MessagesWsGateway } from './messages-ws.gateway';
import { AuthModule } from '../auth/auth.module';

@Module({
  // MessagesWsGateway sería como el controller
  providers: [MessagesWsGateway, MessagesWsService],

  // Importamos el módulo AuthModule, que es donde está JwtService, para poder usarlo.
  // Notar que en auth.module.ts ya se exportó en su momento JwtModule.
  imports: [AuthModule],
})
export class MessagesWsModule {}
