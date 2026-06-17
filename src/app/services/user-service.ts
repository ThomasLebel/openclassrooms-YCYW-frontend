import { Injectable, signal, WritableSignal } from '@angular/core';
import { role } from '../models/role';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  username: WritableSignal<string | undefined> = signal(undefined);
  role: WritableSignal<role | null> = signal(null);

  setUser(fullName: string, role: role): void {
    this.username.set(fullName);
    this.role.set(role);
  }

  getUsername(): string | undefined {
    return this.username();
  }

  getRole(): role | null {
    return this.role();
  }

  isLoggedIn(): boolean {
    return this.role() !== null;
  }
}
