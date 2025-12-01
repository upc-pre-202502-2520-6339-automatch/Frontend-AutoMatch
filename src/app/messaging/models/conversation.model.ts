// messaging/models/conversation.model.ts
export interface Conversation {
  id: number;
  buyerId: number;
  sellerId: number;
  lastMessagePreview: string;
  updatedAt: string;
}
