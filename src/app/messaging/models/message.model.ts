// messaging/models/message.model.ts
export interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  receiverId: number;
  content: string;
  status: 'SENT' | 'DELIVERED' | 'READ' | null;

  createdAt: string | null;
  deliveredAt?: string | null;
  readAt?: string | null;

  // campos extra que vienen del WebSocket (ChatMessagePayload)
  senderName?: string | null;
  senderPhone?: string | null;
  receiverName?: string | null;
  receiverPhone?: string | null;
}
