import { Injectable, signal, WritableSignal } from '@angular/core';
import { RoleType } from '../models/RoleType';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  username: WritableSignal<string | undefined> = signal('Test');
  role: WritableSignal<RoleType | null> = signal('USER');

  setUser(fullName: string, role: RoleType): void {
    this.username.set(fullName);
    this.role.set(role);
  }

  getUsername(): string | undefined {
    return this.username();
  }

  getRole(): RoleType | null {
    return this.role();
  }

  isLoggedIn(): boolean {
    return this.role() !== null;
  }

  disconnect(): void {
    this.username.set(undefined);
    this.role.set(null);
  }
}
