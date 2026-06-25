import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { NewSupportTicketPayload } from '../../models/payload/NewSupportTicketPayload';
import { RoleType } from '../../models/RoleType';
import { ChatService } from '../../services/chat-service';
import { UserService } from '../../services/user-service';
import { WebSocketService } from '../../services/websocket.service';
import { ChatHistoryElement } from '../chat-history/components/chat-history-element/chat-history-element';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ChatHistoryElement],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  role: WritableSignal<RoleType | null> = signal(null);
  username: WritableSignal<string | undefined> = signal(undefined);
  chatSubject = signal('');
  chatContent = signal('');
  isLoading = signal(false);
  contentError = signal(false);
  subjectError = signal(false);
  serverError = signal(false);

  private readonly userService = inject(UserService);
  public readonly router = inject(Router);
  private readonly webSocketService = inject(WebSocketService);
  private readonly chatService = inject(ChatService);

  ngOnInit(): void {
    console.log(this.userService.getRole());
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.role.set(this.userService.getRole());
    this.username.set(this.userService.getUsername());
    this.webSocketService.connect();
  }

  onHistoryClick(): void {
    this.router.navigate(['/chat-history']);
  }

  createNewSupportTicket(): void {
    this.contentError.set(!this.chatContent().trim());
    this.subjectError.set(!this.chatSubject().trim());
    this.serverError.set(false);
    if (this.contentError() || this.subjectError()) {
      return;
    }
    if (this.chatSubject().trim() && this.chatContent().trim()) {
      const payload: NewSupportTicketPayload = {
        subject: this.chatSubject(),
        message: this.chatContent(),
        userPseudo: this.username() || '',
      };
      this.chatService
        .createConversation(payload)
        .pipe(
          finalize(() => {
            this.isLoading.set(false);
          }),
        )
        .subscribe({
          next: (supportTicketDTO) => {
            if (supportTicketDTO.id) {
              this.chatSubject.set('');
              this.chatContent.set('');
              this.router.navigate(['/chat', supportTicketDTO.id]);
              return;
            }
            this.serverError.set(true);
          },
          error: (err) => {
            this.serverError.set(true);
          },
        });
    }
  }
}
