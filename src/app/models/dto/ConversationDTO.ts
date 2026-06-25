import { IMessage } from '../IMessage';

export interface ConversationDTO {
  id: number;
  userPseudo: string;
  agentPseudo: string | null;
  messages: IMessage[];
  createdAt: string;
  updatedAt: string;
}
