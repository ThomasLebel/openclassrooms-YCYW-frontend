import { Injectable, signal, WritableSignal } from '@angular/core';
import { RoleType } from '../models/RoleType';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  username: WritableSignal<string | null> = signal(null);
  role: WritableSignal<RoleType | null> = signal(null);
  isAgent: WritableSignal<boolean> = signal(false);

  setUser(fullName: string, role: RoleType): void {
    this.username.set(fullName);
    this.role.set(role);
    this.isAgent.set(role === 'SUPPORT');
  }

  getUsername(): string | null {
    return this.username();
  }

  getRole(): RoleType | null {
    return this.role();
  }

  getIsAgent(): boolean {
    return this.isAgent();
  }

  isLoggedIn(): boolean {
    return this.role() !== null;
  }

  disconnect(): void {
    this.username.set(null);
    this.role.set(null);
  }
}
