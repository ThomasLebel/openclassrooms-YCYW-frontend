import {
  Component,
  effect,
  ElementRef,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import { Message } from './components/message/message';
import { IMessage } from '../../models/message';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [Message, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.scss',
})
export class Chat {
  @ViewChild('scrollAnchor')
  private scrollAnchor!: ElementRef<HTMLDivElement>;
  private readonly userService = inject(UserService);
  messageInput: string = '';
  messages: WritableSignal<IMessage[]> = signal([
    {
      content: 'Hello, how are you?',
      timestamp: new Date(),
      sendBy: 'Alice Admin',
    },
    {
      content: 'I am fine, thank you! How about you?',
      timestamp: new Date(),
      sendBy: 'Bob User',
    },
    {
      content: 'I am fine, thank you! How about you?',
      timestamp: new Date(),
      sendBy: 'Bob User',
    },
    {
      content: 'I am fine, thank you! How about you?',
      timestamp: new Date(),
      sendBy: 'Bob User',
    },
    {
      content: 'I am fine, thank you! How about you?',
      timestamp: new Date(),
      sendBy: 'Bob User',
    },
    {
      content: 'I am fine, thank you! How about you?',
      timestamp: new Date(),
      sendBy: 'Bob User',
    },
  ]);

  constructor() {
    effect(() => {
      this.messages();

      queueMicrotask(() => {
        this.scrollToBottom();
      });
    });
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
  sendMessage(): void {
    const newMessage: IMessage = {
      content: this.messageInput,
      timestamp: new Date(),
      sendBy: this.userService.getUser(),
    };
    this.messages.set([...this.messages(), newMessage]);
    this.messageInput = '';
  }
}
