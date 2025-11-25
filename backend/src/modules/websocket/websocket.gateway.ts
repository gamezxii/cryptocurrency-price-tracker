import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { WebsocketService } from './websocket.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class WebsocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(private readonly websocketService: WebsocketService) {}

  handleConnection(client: Socket) {
    this.websocketService.logger.log(`Client connected: ${client.id}`);
    this.websocketService.setServer(this.server);
  }

  handleDisconnect(client: Socket) {
    this.websocketService.logger.log(`Client disconnected: ${client.id}`);
  }
}
