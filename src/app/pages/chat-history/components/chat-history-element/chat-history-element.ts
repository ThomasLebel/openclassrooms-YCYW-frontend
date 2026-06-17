import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat-history-element',
  imports: [],
  templateUrl: './chat-history-element.html',
  styleUrl: './chat-history-element.scss',
})
export class ChatHistoryElement {
  private readonly router = inject(Router);
  onChatHistoryElementClick(): void {
    this.router.navigate(['/chat']);
  }
}
