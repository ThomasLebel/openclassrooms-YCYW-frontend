// chat.service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { StompSubscription } from '@stomp/stompjs';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ConversationDTO } from '../models/dto/ConversationDTO';
import { SupportTicketDTO } from '../models/dto/SupportTicketDTO';
import { IMessage } from '../models/IMessage';
import { NewSupportTicketPayload } from '../models/payload/NewSupportTicketPayload';
import { WebSocketService } from './websocket.service';

@Injectable({ providedIn: 'root' })
export class ChatService {
  readonly conversation = signal<ConversationDTO | null>(null);
  private currentSubscription: StompSubscription | null = null;
  private currentConversationId: number | null = null;
  private currentPseudo: string | null = null;

  private readonly ws: WebSocketService = inject(WebSocketService);
  private http: HttpClient = inject(HttpClient);

  createConversation(payload: NewSupportTicketPayload): Observable<SupportTicketDTO> {
    return this.http.post<SupportTicketDTO>(`${environment.apiUrl}supportTickets`, payload);
  }

  openConversation(conversationId: number, pseudo: string): Observable<ConversationDTO> {
    this.closeConversation();
    return this.http
      .get<ConversationDTO>(`${environment.apiUrl}supportTickets/${conversationId}/messages`, {
        params: { pseudo },
      })
      .pipe(
        tap((conversation) => {
          this.conversation.set(conversation);
          this.currentConversationId = conversationId;
          this.currentPseudo = pseudo;
          this.conversationSubscription();
        }),
      );
  }

  readConversation(conversationId: number, pseudo: string): Observable<void> {
    return this.http.post<void>(
      `${environment.apiUrl}supportTickets/${conversationId}/read`,
      null,
      {
        params: { readerPseudo: pseudo },
      },
    );
  }

  conversationSubscription(): void {
    this.currentSubscription = this.ws.subscribe(
      `/topic/supportTicket.${this.currentConversationId}`,
      (message) => {
        const newMsg: IMessage = JSON.parse(message.body);
        if (!this.conversation()) return this.closeConversation();
        this.conversation.update((current) => {
          if (!current) return current;
          return {
            ...current,
            messages: [...current.messages, newMsg],
          };
        });
        this.readConversation(this.currentConversationId!, this.currentPseudo!).subscribe();
      },
    );
  }

  closeConversation(): void {
    this.currentSubscription?.unsubscribe();
    this.currentSubscription = null;
    this.currentConversationId = null;
    this.conversation.set(null);
  }

  sendMessage(content: string, pseudo: string): void {
    if (!this.currentConversationId) return;
    this.ws.publish('/app/message.send', {
      conversationId: this.currentConversationId,
      pseudo,
      content,
    });
  }
}
