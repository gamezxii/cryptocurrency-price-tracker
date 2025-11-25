import { Injectable, Logger } from '@nestjs/common';
import { Server } from 'socket.io';
import { PriceEventPayload } from 'src/interfaces/ws';

@Injectable()
export class WebsocketService {
  public readonly logger = new Logger(WebsocketService.name);

  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitToAll(event: string, payload: PriceEventPayload) {
    if (!this.server) return;
    this.logger.log(`Emit event: ${event} ${JSON.stringify(payload)}`);
    this.server.emit(event, payload);
  }

  emitToClient(clientId: string, event: string, payload: PriceEventPayload) {
    if (!this.server) return;
    this.logger.log(`Emit event: ${event} ${JSON.stringify(payload)}`);
    this.server.to(clientId).emit(event, payload);
  }

  emitToRoom(room: string, event: string, payload: PriceEventPayload) {
    if (!this.server) return;
    this.logger.log(`Emit event: ${event} ${JSON.stringify(payload)}`);
    this.server.to(room).emit(event, payload);
  }
}
