import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationsApiService, NotificationSendRequest } from '../../services/notifications-api.service';
import { Notification } from '../../models/notification.model';

@Component({
  selector: 'app-notification-test',
  templateUrl: './notification-test.component.html',
  styleUrls: ['./notification-test.component.css']
})
export class NotificationTestComponent {

  form: FormGroup;
  sending = false;
  lastNotification: Notification | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private notificationsApi: NotificationsApiService
  ) {
    this.form = this.fb.group({
      type: ['SMS', Validators.required],
      recipient: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.maxLength(500)]],
      sourceEvent: ['MANUAL_TEST']
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const request: NotificationSendRequest = this.form.value;
    this.sending = true;
    this.error = null;
    this.lastNotification = null;

    this.notificationsApi.send(request).subscribe({
      next: (n) => {
        this.lastNotification = n;
        this.sending = false;
      },
      error: (err) => {
        console.error('[Notifications] Error sending test notification', err);
        this.error = err?.error?.details || 'Error sending notification';
        this.sending = false;
      }
    });
  }
}
