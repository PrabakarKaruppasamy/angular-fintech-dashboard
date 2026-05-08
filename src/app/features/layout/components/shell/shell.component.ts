import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  template: `
    <div class="shell" [class.sidebar-open]="sidebarOpen()">
      <app-sidebar [open]="sidebarOpen()" (closed)="sidebarOpen.set(false)" />
      <div class="main-area">
        <app-header (menuToggled)="sidebarOpen.set(!sidebarOpen())" />
        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [`
    .shell {
      display: flex;
      min-height: 100vh;
      background: var(--bg-primary);
    }
    .main-area {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      margin-left: var(--sidebar-width);
      transition: margin-left 0.3s ease;
    }
    .content {
      flex: 1;
      padding: 24px;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      .main-area { margin-left: 0; }
    }
  `]
})
export class ShellComponent {
  sidebarOpen = signal(true);
}
