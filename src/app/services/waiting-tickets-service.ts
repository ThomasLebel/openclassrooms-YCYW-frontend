import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { StompSubscription } from '@stomp/stompjs';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupportTicketDTO } from '../models/dto/SupportTicketDTO';
import { TicketSummaryDTO } from '../models/dto/TicketSummaryDTO';
import { WebSocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class WaitingTicketsService {
  readonly waitingTickets = signal<TicketSummaryDTO[]>([]);

  private waitingSubscription: StompSubscription | null = null;
  private assignedSubscription: StompSubscription | null = null;

  constructor(
    private ws: WebSocketService,
    private http: HttpClient,
  ) {}

  startListening(): void {
    this.stopListening();

    this.http
      .get<TicketSummaryDTO[]>(`${environment.apiUrl}supportTickets/waiting`)
      .pipe(tap((list) => this.waitingTickets.set(list)))
      .subscribe({
        next: () => {
          this.subscribeToWaitingChannel();
          this.subscribeToAssignedChannel();
        },
        error: (err) => console.error('Failed to load waiting tickets', err),
      });
  }

  assignToMe(ticketId: number, agentPseudo: string): Observable<SupportTicketDTO> {
    return this.http.post<SupportTicketDTO>(
      `${environment.apiUrl}supportTickets/${ticketId}/assign`,
      null,
      { params: { agentPseudo } },
    );
  }

  private subscribeToWaitingChannel(): void {
    this.waitingSubscription = this.ws.subscribe('/topic/supportTickets.waiting', (message) => {
      const ticket: TicketSummaryDTO = JSON.parse(message.body);
      this.waitingTickets.update((list) => [...list, ticket]);
    });
  }

  private subscribeToAssignedChannel(): void {
    this.assignedSubscription = this.ws.subscribe('/topic/supportTickets.assigned', (message) => {
      const ticketID: number = JSON.parse(message.body);
      this.waitingTickets.update((list) => list.filter((ticket) => ticket.id !== ticketID));
    });
  }

  stopListening(): void {
    this.waitingSubscription?.unsubscribe();
    this.assignedSubscription?.unsubscribe();
    this.waitingSubscription = null;
    this.assignedSubscription = null;
    this.waitingTickets.set([]);
  }
}
