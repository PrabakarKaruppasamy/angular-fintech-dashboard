import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../../core/services/auth.service';

interface NavItem {
  label: string;
  icon: string;
  route: string;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  @Input() open = true;
  @Output() closed = new EventEmitter<void>();

  navItems: NavItem[] = [
    { label: 'Dashboard',     icon: 'dashboard',        route: '/dashboard' },
    { label: 'Portfolio',     icon: 'pie_chart',        route: '/dashboard' },
    { label: 'Transactions',  icon: 'receipt_long',     route: '/dashboard/transactions' },
    { label: 'Markets',       icon: 'trending_up',      route: '/dashboard' },
    { label: 'Analytics',     icon: 'bar_chart',        route: '/dashboard', adminOnly: true },
    { label: 'Settings',      icon: 'settings',         route: '/dashboard', adminOnly: true },
  ];

  constructor(public authService: AuthService) {}

  get visibleNav(): NavItem[] {
    return this.navItems.filter(n => !n.adminOnly || this.authService.isAdmin());
  }

  logout(): void { this.authService.logout(); }
}
