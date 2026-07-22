import { DatePipe, NgClass } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IMessage } from '../../../../models/IMessage';
import { UserService } from '../../../../services/user-service';

@Component({
  selector: 'app-message',
  imports: [DatePipe, NgClass],
  templateUrl: './message.html',
  styleUrl: './message.scss',
})
export class Message implements OnInit {
  private readonly userService = inject(UserService);
  @Input() message!: IMessage;
  isCurrentUser!: boolean;

  ngOnInit(): void {
    this.isCurrentUser =
      this.message.senderPseudo.toLowerCase() === this.userService.getUsername()?.toLowerCase();
  }
}
