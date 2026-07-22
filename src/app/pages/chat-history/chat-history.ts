import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketsListService } from '../../services/tickets-list-service';
import { UserService } from '../../services/user-service';
import { ChatHistoryElement } from './components/chat-history-element/chat-history-element';

@Component({
  selector: 'app-chat-history',
  imports: [ChatHistoryElement],
  templateUrl: './chat-history.html',
  styleUrl: './chat-history.scss',
})
export class ChatHistory implements OnInit {
  public readonly router = inject(Router);
  public readonly ticketsListService = inject(TicketsListService);
  private readonly userService = inject(UserService);

  ngOnInit(): void {
    const pseudo = this.userService.getUsername();
    if (!pseudo) {
      this.userService.disconnect();
      this.router.navigate(['/login']);
      return;
    }
  }
}
