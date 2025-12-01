// messaging/services/messaging-api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Conversation } from '../models/conversation.model';
import { Message } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessagingApiService {
  private baseUrl = `${environment.apiUrl}/messages`;

  constructor(private http: HttpClient) {}

  // OJO: este endpoint probablemente lo provee otro microservicio (conversaciones)
  getConversationsForCurrentUser(): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}/conversations/me`);
  }

  getMessagesByConversation(conversationId: number): Observable<Message[]> {
    const params = new HttpParams().set('conversationId', conversationId);
    return this.http.get<Message[]>(this.baseUrl, { params });
  }

  sendMessage(payload: { conversationId: number; receiverId: number; content: string }): Observable<Message> {
    return this.http.post<Message>(`${this.baseUrl}/send`, payload);
  }

  markAsRead(messageId: number): Observable<Message> {
    return this.http.patch<Message>(`${this.baseUrl}/${messageId}/read`, {});
  }
}
