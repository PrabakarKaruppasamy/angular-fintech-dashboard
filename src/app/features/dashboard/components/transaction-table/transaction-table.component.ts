import { Component, Input, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MarketDataService } from '../../../../core/services/market-data.service';
import { Transaction, TransactionType, TransactionStatus } from '../../../../core/models';

@Component({
  selector: 'app-transaction-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './transaction-table.component.html',
  styleUrls: ['./transaction-table.component.scss']
})
export class TransactionTableComponent implements OnInit {
  @Input() limit: number | null = null;

  transactions = signal<Transaction[]>([]);
  loading = signal(true);
  filterType = signal<string>('ALL');
  filterStatus = signal<string>('ALL');
  search = signal('');

  types = ['ALL','BUY','SELL','DIVIDEND','DEPOSIT','WITHDRAWAL'];
  statuses = ['ALL','COMPLETED','PENDING','FAILED'];

  filtered = computed(() => {
    let list = this.transactions();
    if (this.filterType() !== 'ALL') list = list.filter(t => t.type === this.filterType());
    if (this.filterStatus() !== 'ALL') list = list.filter(t => t.status === this.filterStatus());
    if (this.search()) list = list.filter(t => t.name.toLowerCase().includes(this.search().toLowerCase()) || t.symbol?.toLowerCase().includes(this.search().toLowerCase()));
    return this.limit ? list.slice(0, this.limit) : list;
  });

  constructor(private marketService: MarketDataService) {}

  ngOnInit(): void {
    this.marketService.getTransactions().subscribe(t => { this.transactions.set(t); this.loading.set(false); });
  }

  typeIcon(type: TransactionType): string {
    const map: Record<TransactionType, string> = { BUY:'add_shopping_cart', SELL:'sell', DIVIDEND:'payments', DEPOSIT:'arrow_downward', WITHDRAWAL:'arrow_upward' };
    return map[type];
  }

  typeClass(type: TransactionType): string {
    const map: Record<TransactionType, string> = { BUY:'type-buy', SELL:'type-sell', DIVIDEND:'type-div', DEPOSIT:'type-dep', WITHDRAWAL:'type-with' };
    return map[type];
  }

  statusClass(s: TransactionStatus): string {
    return { COMPLETED:'status-ok', PENDING:'status-pending', FAILED:'status-fail', CANCELLED:'status-fail' }[s];
  }
}
