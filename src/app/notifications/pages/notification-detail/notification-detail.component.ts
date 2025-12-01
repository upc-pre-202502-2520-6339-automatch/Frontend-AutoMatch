import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationsApiService } from '../../services/notifications-api.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './notification-detail.component.html',
  styleUrls: ['./notification-detail.component.css']
})
export class NotificationDetailComponent implements OnInit {

  notification: Notification | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private notificationsApi: NotificationsApiService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : null;

    if (!id) {
      this.error = 'Invalid notification ID';
      this.loading = false;
      return;
    }

    this.notificationsApi.getById(id).subscribe({
      next: (n) => {
        this.notification = n;
        this.loading = false;
      },
      error: (err) => {
        console.error('[Notifications] Error loading detail', err);
        this.error = 'Error loading notification detail';
        this.loading = false;
      }
    });
  }
}
