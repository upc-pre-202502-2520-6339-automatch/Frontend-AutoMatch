// messaging/messaging.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ConversationsComponent } from './pages/conversations/conversations.component';
import { ChatThreadComponent } from './pages/chat-thread/chat-thread.component';
import { MessageListComponent } from './components/message-list/message-list.component';
import { MessageInputComponent } from './components/message-input/message-input.component';

const routes: Routes = [
  { path: '', component: ConversationsComponent },
  { path: ':conversationId', component: ChatThreadComponent },
];

@NgModule({
  declarations: [
    ConversationsComponent,
    ChatThreadComponent,
    MessageListComponent,
    MessageInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ]
})
export class MessagingModule { }
