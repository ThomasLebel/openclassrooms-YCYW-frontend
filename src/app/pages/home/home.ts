import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../../services/user-service';
import { role } from '../../models/role';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatHistoryElement } from '../chat-history/components/chat-history-element/chat-history-element';

@Component({
  selector: 'app-home',
  imports: [FormsModule, ChatHistoryElement],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  role: role = null;
  username: string | undefined = undefined;
  chatSubject: string = '';
  chatContent: string = '';
  isAvailable: boolean = false;

  private readonly userService = inject(UserService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    console.log(this.userService.getRole());
    if (!this.userService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
    this.role = this.userService.getRole();
    this.username = this.userService.getUsername();
  }

  onAvailabilityChange(): void {
    // Handle availability change logic here
  }

  onHistoryClick(): void {
    this.router.navigate(['/chat-history']);
  }
}
