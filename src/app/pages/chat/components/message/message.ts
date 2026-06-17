import { Component, inject, Input, OnInit } from '@angular/core';
import { IMessage } from '../../../../models/message';
import { DatePipe, NgClass } from '@angular/common';
import { UserService } from '../../../../services/user-service';

@Component({
  selector: 'app-message',
  imports: [DatePipe, NgClass],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class Message implements OnInit {
  @Input() message!: IMessage;
  isCurrentUser: boolean = false;

  private readonly userService = inject(UserService);

  ngOnInit(): void {
    const username = this.userService.getUsername();
    if (!username) return;
    this.isCurrentUser = this.message.sendBy === username;
  }
}
