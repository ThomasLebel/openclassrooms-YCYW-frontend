import {
  Component,
  effect,
  ElementRef,
  inject,
  OnDestroy,
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
import { Message } from './components/message/message';

@Component({
  selector: 'app-chat',
  imports: [Message, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat implements OnInit, OnDestroy {
  @ViewChild('scrollAnchor')
  private scrollAnchor!: ElementRef<HTMLDivElement>;
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly chatService = inject(ChatService);
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
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
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
    this.chatService.openConversation(id, this.userService.getUsername()!).subscribe({
      next: (conversation) => {
        this.readConversation(id);
      },
      error: (err) => {
        console.error('Failed to fetch conversation:', err);
        this.router.navigate(['/chat-history']);
      },
    });
  }

  private readConversation(id: number): void {
    const pseudo = this.userService.getUsername();
    if (!pseudo) {
      console.error('User pseudo is not available.');
      return;
    }
    this.chatService.readConversation(id, pseudo).subscribe({
      error: (err) => {
        console.error('Failed to mark conversation as read:', err);
      },
    });
  }
  sendMessage(): void {
    const message = this.messageInput().trim();
    const pseudo = this.userService.getUsername();
    if (message === '' || !pseudo) return;
    this.chatService.sendMessage(this.messageInput(), pseudo);
    this.messageInput.set('');
  }

  onEnter(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngOnDestroy(): void {
    this.chatService.closeConversation();
  }
}
