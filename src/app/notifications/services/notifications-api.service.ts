import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Notification } from '../models/notification.model';

export interface NotificationSendRequest {
  type: 'SMS' | 'WHATSAPP' | 'EMAIL';
  recipient: string;
  message: string;
  sourceEvent?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationsApiService {
  private baseUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  list(): Observable<Notification[]> {
    return this.http.get<Notification[]>(this.baseUrl);
  }

  getById(id: number): Observable<Notification> {
    return this.http.get<Notification>(`${this.baseUrl}/${id}`);
  }

  send(request: NotificationSendRequest): Observable<Notification> {
    return this.http.post<Notification>(`${this.baseUrl}/send`, request);
  }
}
