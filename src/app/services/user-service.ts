import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  fullName: WritableSignal<string> = signal('Bob User');

  setUser(fullName: string): void {
    this.fullName.set(fullName);
    localStorage.setItem('user', fullName);
  }

  getUser(): string {
    return this.fullName();
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');
  }
}
