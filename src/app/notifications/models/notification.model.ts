export interface Notification {
  id: number;
  type: 'SMS' | 'WHATSAPP' | 'EMAIL';
  recipient: string;
  message: string;
  status: 'PENDING' | 'SENT' | 'FAILED';
  sourceEvent: string;
  createdAt: string;
  sentAt?: string;
  failedAt?: string;
}
