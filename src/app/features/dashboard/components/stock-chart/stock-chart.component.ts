import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MarketDataService } from '../../../../core/services/market-data.service';
import { ChartDataPoint, ChartPeriod, StockQuote } from '../../../../core/models';
import { Subscription, switchMap, combineLatest } from 'rxjs';

declare const Chart: any;

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stock-chart.component.html',
  styleUrls: ['./stock-chart.component.scss']
})
export class StockChartComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;

  periods: ChartPeriod[] = ['1D','1W','1M','3M','6M','1Y'];
  selectedPeriod = signal<ChartPeriod>('1M');
  selectedSymbol = signal<string>('AAPL');
  selectedQuote = signal<StockQuote | null>(null);
  chartData = signal<ChartDataPoint[]>([]);
  loading = signal(true);

  symbols = ['AAPL','MSFT','GOOGL','AMZN','TSLA','NVDA'];

  private chart: any = null;
  private sub!: Subscription;

  constructor(private marketService: MarketDataService) {}

  ngOnInit(): void {
    this.sub = this.marketService.quotes$.subscribe(quotes => {
      const q = quotes.find(q => q.symbol === this.selectedSymbol());
      if (q) this.selectedQuote.set(q);
    });
  }

  ngAfterViewInit(): void {
    this.loadChart();
  }

  loadChart(): void {
    this.loading.set(true);
    this.marketService.getChartData(this.selectedSymbol(), this.selectedPeriod()).subscribe(data => {
      this.chartData.set(data);
      this.loading.set(false);
      this.renderChart(data);
    });
  }

  selectSymbol(symbol: string): void {
    this.selectedSymbol.set(symbol);
    this.loadChart();
  }

  selectPeriod(period: ChartPeriod): void {
    this.selectedPeriod.set(period);
    this.loadChart();
  }

  private renderChart(data: ChartDataPoint[]): void {
    if (!this.chartCanvas) return;
    if (this.chart) { this.chart.destroy(); this.chart = null; }

    const isDark = document.body.classList.contains('dark-theme');
    const isPositive = data.length > 1 && data[data.length-1].close >= data[0].close;
    const lineColor = isPositive ? '#38a169' : '#e53e3e';
    const fillColor = isPositive ? 'rgba(56,161,105,0.08)' : 'rgba(229,62,62,0.08)';
    const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
    const textColor = isDark ? '#718096' : '#888';

    const labels = data.map(d => {
      const dt = new Date(d.timestamp);
      if (this.selectedPeriod() === '1D') return dt.toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' });
      return dt.toLocaleDateString([], { month:'short', day:'numeric' });
    });

    const script = document.getElementById('chartjs-script');
    if (!script) {
      const s = document.createElement('script');
      s.id = 'chartjs-script';
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
      s.onload = () => this.drawChart(data, labels, lineColor, fillColor, gridColor, textColor);
      document.head.appendChild(s);
    } else {
      this.drawChart(data, labels, lineColor, fillColor, gridColor, textColor);
    }
  }

  private drawChart(data: ChartDataPoint[], labels: string[], lineColor: string, fillColor: string, gridColor: string, textColor: string): void {
    if (!(window as any).Chart) return;
    const C = (window as any).Chart;
    const ctx = this.chartCanvas.nativeElement.getContext('2d')!;

    this.chart = new C(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          data: data.map(d => d.close),
          borderColor: lineColor,
          backgroundColor: fillColor,
          borderWidth: 2,
          fill: true,
          tension: 0.3,
          pointRadius: 0,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: lineColor
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            titleColor: '#fff',
            bodyColor: '#a0aec0',
            padding: 10,
            callbacks: {
              label: (ctx: any) => ` $${ctx.parsed.y.toFixed(2)}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: gridColor },
            ticks: { color: textColor, maxTicksLimit: 8, font: { size: 11 } },
            border: { display: false }
          },
          y: {
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { size: 11 },
              callback: (v: number) => `$${v.toFixed(0)}`
            },
            border: { display: false },
            position: 'right'
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
    this.chart?.destroy();
  }
}
