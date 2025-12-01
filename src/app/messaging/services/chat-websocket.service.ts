// messaging/services/chat-websocket.service.ts
import { Injectable, OnDestroy } from '@angular/core';
import { Client, IMessage, Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Observable, Subject } from 'rxjs';
import { Message } from '../models/message.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ChatWebsocketService implements OnDestroy {
  private client?: Client;
  private connected = false;

  private ensureConnected(): void {
    if (this.connected && this.client?.connected) return;

    this.client = Stomp.over(() => {
      // ⚠️ Si el gateway expone /ws-chat, usa environment.apiUrl.
      // Si conectas directo al microservicio, cambia host/puerto.
      return new SockJS(`${environment.backendApiBaseUrl}/ws-chat`);
    });

    this.client.reconnectDelay = 5000;

    this.client.onConnect = () => {
      this.connected = true;
      console.log('[WS] Connected to /ws-chat');
    };

    this.client.onStompError = (frame) => {
      console.error('[WS] STOMP error', frame.headers['message'], frame.body);
    };

    this.client.activate();
  }

  subscribeToConversation(conversationId: number): Observable<Message> {
    const subject = new Subject<Message>();

    this.ensureConnected();

    const trySubscribe = () => {
      if (!this.client || !this.connected) {
        setTimeout(trySubscribe, 200);
        return;
      }

      this.client.subscribe(
        `/topic/conversations/${conversationId}`,
        (msg: IMessage) => {
          const payload = JSON.parse(msg.body) as Message; // es casi igual que MessageResource
          subject.next(payload);
        }
      );
    };

    trySubscribe();
    return subject.asObservable();
  }

  ngOnDestroy(): void {
    this.client?.deactivate();
  }
}
