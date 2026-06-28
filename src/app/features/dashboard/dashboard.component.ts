import { Component, OnInit, signal, inject } from '@angular/core';

import { MarketDataService } from '../../core/services/market-data.service';
import { PortfolioSummary, Holding, StockQuote } from '../../core/models';
import { PortfolioSummaryComponent } from './components/portfolio-summary/portfolio-summary.component';
import { StockChartComponent } from './components/stock-chart/stock-chart.component';
import { TransactionTableComponent } from './components/transaction-table/transaction-table.component';
import { HoldingsTableComponent } from './components/holdings-table/holdings-table.component';
import { MarketTickerComponent } from './components/market-ticker/market-ticker.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    PortfolioSummaryComponent,
    StockChartComponent,
    TransactionTableComponent,
    HoldingsTableComponent,
    MarketTickerComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  private marketService = inject(MarketDataService);

  portfolio = signal<PortfolioSummary | null>(null);
  holdings = signal<Holding[]>([]);
  quotes = signal<StockQuote[]>([]);
  loading = signal(true);


  ngOnInit(): void {
    this.marketService.getPortfolioSummary().subscribe(p => this.portfolio.set(p));
    this.marketService.getHoldings().subscribe(h => { this.holdings.set(h); this.loading.set(false); });
    this.marketService.quotes$.subscribe(q => this.quotes.set(q));
  }
}
