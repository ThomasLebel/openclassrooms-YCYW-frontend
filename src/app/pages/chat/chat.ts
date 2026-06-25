import {
  Component,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConversationDTO } from '../../models/dto/ConversationDTO';
import { ChatService } from '../../services/chat-service';
import { UserService } from '../../services/user-service';
import { WebSocketService } from '../../services/websocket.service';
import { Message } from './components/message/message';

@Component({
  selector: 'app-chat',
  imports: [Message, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit {
  @ViewChild('scrollAnchor')
  private scrollAnchor!: ElementRef<HTMLDivElement>;
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly chatService = inject(ChatService);
  private readonly webservice = inject(WebSocketService);
  messageInput = signal('');
  private conversationId: number | null = null;

  conversation: WritableSignal<ConversationDTO | null> = this.chatService.conversation;

  constructor() {
    effect(() => {
      this.chatService.conversation()?.messages;

      queueMicrotask(() => {
        this.scrollToBottom();
      });
    });
  }

  ngOnInit(): void {
    this.conversationId = this.route.snapshot.paramMap.get('id')
      ? Number(this.route.snapshot.paramMap.get('id'))
      : null;
    if (!this.conversationId) {
      this.router.navigate(['/chat-history']);
      return;
    }
    this.getConversation(this.conversationId);
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    this.scrollAnchor?.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }

  private getConversation(id: number): void {
    this.chatService.openConversation(id).subscribe({
      error: (err) => {
        console.error('Failed to fetch conversation:', err);
        this.router.navigate(['/chat-history']);
      },
    });
  }
  sendMessage(): void {
    if (this.messageInput().trim() === '') return;
    this.chatService.sendMessage(this.messageInput(), this.userService.getRole() === 'SUPPORT');
    this.messageInput.set('');
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}
