export interface IMessage {
  id: number;
  senderPseudo: string;
  content: string;
  sentAt: string;
  readAt: string | null;
}
