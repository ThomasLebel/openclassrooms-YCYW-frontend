import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TicketsListService } from '../../services/tickets-list-service';
import { UserService } from '../../services/user-service';
import { WebSocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly webSocketService = inject(WebSocketService);
  private readonly ticketsListService = inject(TicketsListService);
  username: string = '';
  role: 'USER' | 'SUPPORT' | undefined = undefined;
  usernameError: boolean = false;
  roleError: boolean = false;

  login(): void {
    this.usernameError = false;
    this.roleError = false;

    if (!this.username) {
      this.usernameError = true;
    }

    if (!this.role) {
      this.roleError = true;
    }

    if (!this.username || !this.role) {
      return;
    }
    // Here you would typically call a service to handle authentication
    this.userService.setUser(this.username.toLowerCase(), this.role);
    this.webSocketService.connect();
    this.ticketsListService.startListeningTicketHistory(this.username.toLowerCase());
    this.router.navigate(['/']);
  }
}
