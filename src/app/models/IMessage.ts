export interface IMessage {
  id: number;
  fromAgent: boolean;
  content: string;
  sentAt: string;
  readAt: string | null;
}
