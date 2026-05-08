import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockQuote } from '../../../../core/models';

@Component({
  selector: 'app-market-ticker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="ticker-bar">
      <div class="ticker-track">
        <div class="ticker-item" *ngFor="let q of quotes; let i = index">
          <span class="sym">{{ q.symbol }}</span>
          <span class="price">$ {{ q.price | number:'1.2-2' }}</span>
          <span class="chg" [class]="q.changePercent >= 0 ? 'up' : 'down'">
            <span class="material-icons sm">{{ q.changePercent >= 0 ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
            {{ q.changePercent >= 0 ? '+' : '' }}{{ q.changePercent | number:'1.2-2' }}%
          </span>
        </div>
        <!-- Duplicate for seamless loop -->
        <div class="ticker-item" *ngFor="let q of quotes">
          <span class="sym">{{ q.symbol }}</span>
          <span class="price">$ {{ q.price | number:'1.2-2' }}</span>
          <span class="chg" [class]="q.changePercent >= 0 ? 'up' : 'down'">
            <span class="material-icons sm">{{ q.changePercent >= 0 ? 'arrow_drop_up' : 'arrow_drop_down' }}</span>
            {{ q.changePercent >= 0 ? '+' : '' }}{{ q.changePercent | number:'1.2-2' }}%
          </span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ticker-bar {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--border-radius);
      overflow: hidden;
      height: 40px;
    }
    .ticker-track {
      display: flex;
      align-items: center;
      height: 100%;
      animation: ticker 30s linear infinite;
      white-space: nowrap;
      width: max-content;
    }
    @keyframes ticker {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .ticker-bar:hover .ticker-track { animation-play-state: paused; }
    .ticker-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 0 24px;
      border-right: 1px solid var(--border-color);
    }
    .sym { font-weight: 700; font-size: 13px; color: var(--text-primary); }
    .price { font-size: 13px; color: var(--text-secondary); }
    .chg {
      display: flex; align-items: center; font-size: 12px; font-weight: 600;
      &.up { color: var(--positive); }
      &.down { color: var(--negative); }
    }
  `]
})
export class MarketTickerComponent {
  @Input() quotes: StockQuote[] = [];
}
