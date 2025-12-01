// messaging/pages/conversations/conversations.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessagingApiService } from '../../services/messaging-api.service';
import { Conversation } from '../../models/conversation.model';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit {

  conversations: Conversation[] = [];
  loading = true;

  constructor(
    private messagingApi: MessagingApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.messagingApi.getConversationsForCurrentUser().subscribe({
      next: convs => {
        this.conversations = convs;
        this.loading = false;
      },
      error: err => {
        console.error('[Conversations] Error', err);
        this.loading = false;
      }
    });
  }

  openConversation(conv: Conversation): void {
    // Por ahora asumimos que el usuario es el buyer -> receiver = seller
    const receiverId = conv.sellerId;
    this.router.navigate(['/messages', conv.id], {
      queryParams: { receiverId }
    });
  }
}
