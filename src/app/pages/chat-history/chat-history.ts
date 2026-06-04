import { Component } from '@angular/core';
import { ChatHistoryElement } from './components/chat-history-element/chat-history-element';

@Component({
  selector: 'app-chat-history',
  imports: [ChatHistoryElement],
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory {}
