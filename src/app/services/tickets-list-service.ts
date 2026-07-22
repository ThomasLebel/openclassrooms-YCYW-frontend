import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { StompSubscription } from '@stomp/stompjs';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { TicketSummaryDTO } from '../models/dto/TicketSummaryDTO';
import { WebSocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class TicketsListService {
  readonly tickets = signal<TicketSummaryDTO[]>([]);
  readonly totalUnread = computed(() => this.tickets().reduce((sum, t) => sum + t.unreadCount, 0));

  private subscription: StompSubscription | null = null;
  private currentPseudo: string | null = null;

  constructor(
    private ws: WebSocketService,
    private http: HttpClient,
  ) {}

  startListeningTicketHistory(pseudo: string): void {
    this.stopListening();
    this.currentPseudo = pseudo;

    this.http
      .get<TicketSummaryDTO[]>(`${environment.apiUrl}supportTickets`, { params: { pseudo } })
      .pipe(tap((list) => this.tickets.set(list)))
      .subscribe({
        next: () => this.subscribeToBadge(pseudo),
        error: (err) => console.error('Failed to load conversation history', err),
      });
  }

  private subscribeToBadge(pseudo: string): void {
    this.subscription = this.ws.subscribe(`/topic/user.${pseudo}.badge`, (message) => {
      const update: TicketSummaryDTO = JSON.parse(message.body);
      if (this.tickets().some((ticket) => ticket.id === update.id)) {
        this.tickets.update((list) =>
          list
            .map((ticket) => (ticket.id === update.id ? { ...update } : ticket))
            .sort(
              (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime(),
            ),
        );
        console.log('Updated tickets:', this.tickets());
      } else {
        this.tickets.update((list) => [update, ...list]);
      }
    });
  }

  stopListening(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.currentPseudo = null;
    this.tickets.set([]);
  }
}
