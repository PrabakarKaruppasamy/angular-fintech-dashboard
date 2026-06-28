import { Component, Output, EventEmitter, inject } from '@angular/core';

import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent {
  service = inject(NotificationService);

  @Output() closed = new EventEmitter<void>();

  iconMap: Record<string, string> = {
    alert: 'warning', info: 'info', success: 'check_circle', warning: 'error_outline'
  };

  timeAgo(date: Date): string {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }
}
