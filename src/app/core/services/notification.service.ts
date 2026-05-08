import { Injectable, signal, computed } from '@angular/core';
import { Notification, NotificationType } from '../models';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'alert',   title: 'Price Alert: TSLA',   message: 'Tesla crossed your target price of $245.00',       timestamp: new Date(Date.now() - 300000),   read: false, actionLabel: 'View', actionRoute: '/dashboard' },
  { id: 'n2', type: 'success', title: 'Order Executed',      message: 'BUY 5 NVDA @ $862.00 executed successfully',       timestamp: new Date(Date.now() - 3600000),  read: false, actionLabel: 'Details', actionRoute: '/dashboard/transactions' },
  { id: 'n3', type: 'info',    title: 'Dividend Received',   message: 'AAPL quarterly dividend of ₹96.00 credited',        timestamp: new Date(Date.now() - 86400000), read: false },
  { id: 'n4', type: 'warning', title: 'Portfolio Rebalance', message: 'Tech sector exceeds 70% of your portfolio',         timestamp: new Date(Date.now() - 172800000),read: true },
  { id: 'n5', type: 'alert',   title: 'Market Volatility',   message: 'High VIX detected. Consider reviewing your positions', timestamp: new Date(Date.now() - 259200000),read: true },
];

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private _notifications = signal<Notification[]>(MOCK_NOTIFICATIONS);
  readonly notifications = this._notifications.asReadonly();
  readonly unreadCount = computed(() => this._notifications().filter(n => !n.read).length);

  markAsRead(id: string): void {
    this._notifications.update(ns => ns.map(n => n.id === id ? { ...n, read: true } : n));
  }

  markAllRead(): void {
    this._notifications.update(ns => ns.map(n => ({ ...n, read: true })));
  }

  dismiss(id: string): void {
    this._notifications.update(ns => ns.filter(n => n.id !== id));
  }

  add(type: NotificationType, title: string, message: string): void {
    const n: Notification = {
      id: `n_${Date.now()}`, type, title, message,
      timestamp: new Date(), read: false
    };
    this._notifications.update(ns => [n, ...ns]);
  }
}
