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
  @Input() message!: IMessage;
  @Input() senderPseudo: string | null | undefined = null;
  isCurrentUser: boolean = false;

  private readonly userService = inject(UserService);

  ngOnInit(): void {
    const role = this.userService.getRole();
    const isAgent = role === 'SUPPORT';
    this.isCurrentUser = this.message.fromAgent === isAgent;
    console.log(this.message.sentAt);
  }
}
