import { DatePipe, NgClass } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { TicketSummaryDTO } from '../../../../models/dto/TicketSummaryDTO';
import { EnumConversationStatus } from '../../../../models/EnumConversationStatus';

@Component({
  selector: 'app-chat-history-element',
  imports: [DatePipe, NgClass],
  templateUrl: './chat-history-element.html',
  styleUrl: './chat-history-element.scss',
})
export class ChatHistoryElement {
  ticket = input.required<TicketSummaryDTO>();
  private readonly router = inject(Router);
  statusLabel = computed(() => this.getStatusLabel(this.ticket().status));

  private getStatusLabel(status: EnumConversationStatus): string {
    switch (status) {
      case EnumConversationStatus.WAITING:
        return 'En attente';
      case EnumConversationStatus.ASSIGNED:
        return 'En cours';
      case EnumConversationStatus.CLOSED:
        return 'Fermé';
      default:
        return 'Inconnu';
    }
  }
}
