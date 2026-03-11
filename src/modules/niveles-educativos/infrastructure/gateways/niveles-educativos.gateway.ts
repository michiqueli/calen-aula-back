import {
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { NivelEducativo } from '../../domain/entities/nivel-educativo.entity.js';

/**
 * Gateway WebSocket para notificar cambios en niveles educativos en tiempo real.
 */
@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/niveles-educativos',
})
export class NivelesEducativosGateway {
  @WebSocketServer()
  server!: Server;

  /**
   * Emite un evento de cambio a todos los clientes conectados.
   */
  broadcastChange(event: 'INSERT' | 'UPDATE' | 'DELETE', data: NivelEducativo | { id: string }): void {
    this.server.emit('change', { event, data });
  }
}
