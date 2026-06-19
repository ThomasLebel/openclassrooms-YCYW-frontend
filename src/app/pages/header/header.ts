import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);
  public readonly userService = inject(UserService);
  goHome(): void {
    this.router.navigate(['/']);
  }

  disconnect(): void {
    this.userService.disconnect();
    this.router.navigate(['/login']);
  }
}
