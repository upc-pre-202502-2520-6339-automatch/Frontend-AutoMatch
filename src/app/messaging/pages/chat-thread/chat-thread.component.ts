// messaging/pages/chat-thread/chat-thread.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { MessagingApiService } from '../../services/messaging-api.service';
import { ChatWebsocketService } from '../../services/chat-websocket.service';
import { Message } from '../../models/message.model';

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.css']
})
export class ChatThreadComponent implements OnInit, OnDestroy {

  conversationId!: number;
  receiverId!: number;
  messages: Message[] = [];
  loading = true;

  private wsSub?: Subscription;
  private httpSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private messagingApi: MessagingApiService,
    private chatWs: ChatWebsocketService
  ) {}

  ngOnInit(): void {
    this.conversationId = Number(this.route.snapshot.paramMap.get('conversationId'));

    const receiver = this.route.snapshot.queryParamMap.get('receiverId');
    this.receiverId = receiver ? Number(receiver) : 0;

    // 1) Historial inicial (REST)
    this.httpSub = this.messagingApi
      .getMessagesByConversation(this.conversationId)
      .subscribe({
        next: msgs => {
          this.messages = msgs;
          this.loading = false;
        },
        error: err => {
          console.error('[Chat] Error loading messages', err);
          this.loading = false;
        }
      });

    // 2) Suscripción en tiempo real (WebSocket)
    this.wsSub = this.chatWs
      .subscribeToConversation(this.conversationId)
      .subscribe(msg => {
        // 🔥 SOLO WebSocket agrega al array
        this.messages = [...this.messages, msg];
      });
  }

  onSend(content: string): void {
    const text = content.trim();
    if (!text) return;

    if (!this.receiverId) {
      console.error('[Chat] receiverId es 0 o undefined. Pasa el receiverId por queryParam.');
      return;
    }

    this.messagingApi
      .sendMessage({
        conversationId: this.conversationId,
        receiverId: this.receiverId,
        content: text
      })
      .subscribe({
        next: () => {
          // ✅ NO hacemos this.messages.push(...)
          // El backend guarda el mensaje y lo manda por WebSocket
          // y nuestro subscribe() de arriba lo agregará.
        },
        error: err => console.error('[Chat] Error sending message', err)
      });
  }

  ngOnDestroy(): void {
    this.wsSub?.unsubscribe();
    this.httpSub?.unsubscribe();
  }
}
