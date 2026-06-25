// websocket.service.ts
import { Injectable, signal } from '@angular/core';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';

@Injectable({ providedIn: 'root' })
export class WebSocketService {
  private client: Client | null = null;
  readonly connected = signal(false);

  connect(): void {
    if (this.client?.active) return;

    this.client = new Client({
      brokerURL: 'ws://localhost:8080/ws',
      reconnectDelay: 5000,
      onConnect: () => {
        this.connected.set(true);
        console.log('WebSocket connected');
      },
      onDisconnect: () => this.connected.set(false),
      onWebSocketClose: (event) => {
        this.connected.set(false);
        console.warn('WebSocket closed', event);
      },

      onWebSocketError: (event) => {
        console.error('WebSocket transport error', event);
      },
    });

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
    this.connected.set(false);
  }

  subscribe(topic: string, callback: (message: IMessage) => void): StompSubscription | null {
    if (!this.client?.active) {
      console.warn(`Subscribe to ${topic} called before connection ready`);
      return null;
    }
    return this.client.subscribe(topic, callback);
  }

  publish(destination: string, body: unknown): void {
    this.client?.publish({ destination, body: JSON.stringify(body) });
  }
}
