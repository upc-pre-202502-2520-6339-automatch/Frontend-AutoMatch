// messaging/components/message-list/message-list.component.ts
import { Component, Input } from '@angular/core';
import { Message } from '../../models/message.model';



export interface ChatMessageView {
  id: number;
  senderId: number;
  content: string;
  createdAt: string | Date;
  status: string;
}

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent {
  @Input() messages: Message[] = [];


  currentUserId: number | null = null;

  ngOnInit(): void {
    const storedId = localStorage.getItem('automatch_user_id');
    this.currentUserId = storedId ? Number(storedId) : null;
  }

  isMine(message: Message): boolean {
    if (this.currentUserId == null) return false;
    return message.senderId === this.currentUserId;
  }
}



