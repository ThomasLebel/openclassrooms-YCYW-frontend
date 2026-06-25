import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ChatHistoryElement } from './components/chat-history-element/chat-history-element';

@Component({
  selector: 'app-chat-history',
  imports: [ChatHistoryElement],
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory {
  public readonly router = inject(Router);
}
