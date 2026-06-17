import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  private readonly userService = inject(UserService);
  private readonly router = inject(Router);
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
    this.userService.setUser(this.username, this.role);
    this.router.navigate(['/']);
  }
}
