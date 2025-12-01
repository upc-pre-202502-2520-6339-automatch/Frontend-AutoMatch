import { Component, OnInit } from '@angular/core';
import { NotificationsApiService } from '../../services/notifications-api.service';
import { Notification } from '../../models/notification.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.css']
})
export class NotificationListComponent implements OnInit {

  notifications: Notification[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private notificationsApi: NotificationsApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.notificationsApi.list().subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('[Notifications] Error loading notifications', err);
        this.error = 'Error loading notifications';
        this.loading = false;
      }
    });
  }

  openDetail(n: Notification): void {
    this.router.navigate(['/notifications', n.id]);
  }
}
