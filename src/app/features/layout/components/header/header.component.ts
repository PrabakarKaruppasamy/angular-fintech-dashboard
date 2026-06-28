import { Component, Output, EventEmitter, inject } from '@angular/core';

import { ThemeService } from '../../../../core/services/theme.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NotificationsComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  themeService = inject(ThemeService);
  notificationService = inject(NotificationService);
  authService = inject(AuthService);

  @Output() menuToggled = new EventEmitter<void>();
  showNotifications = false;

  
}
