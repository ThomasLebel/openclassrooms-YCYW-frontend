import { EnumConversationStatus } from '../EnumConversationStatus';

export interface TicketSummaryDTO {
  id: number;
  status: EnumConversationStatus;
  subject: string;
  otherPseudo: string;
  lastMessageAt: string;
  unreadCount: number;
}
