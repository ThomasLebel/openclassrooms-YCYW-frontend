import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username: string = '';
  role: 'USER' | 'SUPPORT' | undefined = undefined;

  login(): void {
    // Here you would typically call a service to handle authentication
    console.log(`Logging in with username: ${this.username} and role: ${this.role}`);
  }
}
