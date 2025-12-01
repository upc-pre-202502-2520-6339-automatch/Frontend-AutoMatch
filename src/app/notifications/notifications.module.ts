import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NotificationListComponent } from './pages/notification-list/notification-list.component';
import { NotificationDetailComponent } from './pages/notification-detail/notification-detail.component';
import { NotificationTestComponent } from './pages/notification-test/notification-test.component';

const routes: Routes = [
  { path: '', component: NotificationListComponent },
  { path: 'test', component: NotificationTestComponent },
  { path: ':id', component: NotificationDetailComponent },
];

@NgModule({
  declarations: [
    NotificationListComponent,
    NotificationDetailComponent,
    NotificationTestComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class NotificationsModule { }
