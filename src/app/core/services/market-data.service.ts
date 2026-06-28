import { Injectable } from '@angular/core';
import { Observable, interval, BehaviorSubject } from 'rxjs';
import {
  PortfolioSummary, Holding, StockQuote,
  ChartDataPoint, ChartPeriod, Transaction } from '../models';

// ── Mock Data ─────────────────────────────────────────────────────
const BASE_QUOTES: StockQuote[] = [
  { symbol: 'AAPL',  name: 'Apple Inc.',           price: 189.30, change: 2.15,  changePercent: 1.15,  volume: 58200000, marketCap: '$2.93T', high52w: 198.23, low52w: 124.17 },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',       price: 415.60, change: -1.80, changePercent: -0.43, volume: 21300000, marketCap: '$3.09T', high52w: 430.82, low52w: 309.45 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',         price: 167.45, change: 3.20,  changePercent: 1.95,  volume: 25100000, marketCap: '$2.09T', high52w: 193.31, low52w: 120.21 },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',       price: 186.75, change: -0.95, changePercent: -0.51, volume: 35600000, marketCap: '$1.95T', high52w: 201.20, low52w: 118.35 },
  { symbol: 'TSLA',  name: 'Tesla Inc.',            price: 248.50, change: 8.75,  changePercent: 3.65,  volume: 110500000,marketCap: '$790B',  high52w: 299.29, low52w: 152.37 },
  { symbol: 'NVDA',  name: 'NVIDIA Corporation',   price: 875.35, change: 22.40, changePercent: 2.63,  volume: 48700000, marketCap: '$2.16T', high52w: 974.00, low52w: 410.17 },
];

const MOCK_HOLDINGS: Holding[] = [
  { symbol: 'AAPL',  name: 'Apple Inc.',         quantity: 50,  avgBuyPrice: 165.00, currentPrice: 189.30, value: 9465,  pnl: 1215,  pnlPercent: 14.73, sector: 'Technology' },
  { symbol: 'MSFT',  name: 'Microsoft Corp.',    quantity: 20,  avgBuyPrice: 380.00, currentPrice: 415.60, value: 8312,  pnl: 712,   pnlPercent: 9.37,  sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.',      quantity: 30,  avgBuyPrice: 145.00, currentPrice: 167.45, value: 5024,  pnl: 674,   pnlPercent: 15.48, sector: 'Technology' },
  { symbol: 'AMZN',  name: 'Amazon.com Inc.',    quantity: 25,  avgBuyPrice: 195.00, currentPrice: 186.75, value: 4669,  pnl: -206,  pnlPercent: -4.23, sector: 'Consumer' },
  { symbol: 'TSLA',  name: 'Tesla Inc.',         quantity: 15,  avgBuyPrice: 210.00, currentPrice: 248.50, value: 3728,  pnl: 578,   pnlPercent: 18.33, sector: 'Automotive' },
  { symbol: 'NVDA',  name: 'NVIDIA Corporation', quantity: 8,   avgBuyPrice: 650.00, currentPrice: 875.35, value: 7003,  pnl: 1803,  pnlPercent: 34.67, sector: 'Technology' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'T001', type: 'BUY',        symbol: 'NVDA', name: 'NVIDIA Corporation',   quantity: 5,   price: 862.00, amount: 4310,   status: 'COMPLETED', date: new Date('2024-05-01'), description: 'Market order' },
  { id: 'T002', type: 'SELL',       symbol: 'TSLA', name: 'Tesla Inc.',           quantity: 10,  price: 265.30, amount: 2653,   status: 'COMPLETED', date: new Date('2024-04-28'), description: 'Limit order' },
  { id: 'T003', type: 'DIVIDEND',   symbol: 'AAPL', name: 'Apple Inc.',           quantity: undefined, price: undefined, amount: 96,  status: 'COMPLETED', date: new Date('2024-04-25'), description: 'Quarterly dividend' },
  { id: 'T004', type: 'DEPOSIT',    symbol: undefined, name: 'Bank Transfer',     quantity: undefined, price: undefined, amount: 10000, status: 'COMPLETED', date: new Date('2024-04-20'), description: 'Wire transfer from HDFC' },
  { id: 'T005', type: 'BUY',        symbol: 'MSFT', name: 'Microsoft Corp.',      quantity: 5,   price: 408.20, amount: 2041,   status: 'COMPLETED', date: new Date('2024-04-18'), description: 'Market order' },
  { id: 'T006', type: 'BUY',        symbol: 'GOOGL', name: 'Alphabet Inc.',       quantity: 10,  price: 161.00, amount: 1610,   status: 'PENDING',   date: new Date('2024-05-03'), description: 'Limit order @161.00' },
  { id: 'T007', type: 'SELL',       symbol: 'AMZN', name: 'Amazon.com Inc.',      quantity: 5,   price: 182.40, amount: 912,    status: 'FAILED',    date: new Date('2024-04-15'), description: 'Insufficient funds' },
  { id: 'T008', type: 'WITHDRAWAL', symbol: undefined, name: 'Bank Transfer',    quantity: undefined, price: undefined, amount: 5000, status: 'COMPLETED', date: new Date('2024-04-10'), description: 'Transfer to savings' },
  { id: 'T009', type: 'DIVIDEND',   symbol: 'MSFT', name: 'Microsoft Corp.',      quantity: undefined, price: undefined, amount: 52,  status: 'COMPLETED', date: new Date('2024-04-05'), description: 'Quarterly dividend' },
  { id: 'T010', type: 'BUY',        symbol: 'AAPL', name: 'Apple Inc.',           quantity: 20,  price: 168.50, amount: 3370,   status: 'COMPLETED', date: new Date('2024-03-28'), description: 'Market order' },
];

// ── Helpers ───────────────────────────────────────────────────────
function jitter(base: number, pct = 0.003): number {
  return base + base * (Math.random() - 0.5) * pct;
}

function generateChartData(basePrice: number, points: number): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  let price = basePrice * 0.85;
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const ts = new Date(now.getTime() - i * 3_600_000);
    const open = price;
    const change = (Math.random() - 0.48) * basePrice * 0.015;
    price = Math.max(price + change, basePrice * 0.5);
    data.push({ timestamp: ts, open, high: Math.max(open, price) * 1.002, low: Math.min(open, price) * 0.998, close: price, volume: Math.floor(Math.random() * 5_000_000 + 1_000_000) });
  }
  return data;
}

@Injectable({ providedIn: 'root' })
export class MarketDataService {

  private _quotes = new BehaviorSubject<StockQuote[]>(BASE_QUOTES);
  private _selectedSymbol = new BehaviorSubject<string>('AAPL');
  private _selectedPeriod = new BehaviorSubject<ChartPeriod>('1M');

  readonly quotes$ = this._quotes.asObservable();
  readonly selectedSymbol$ = this._selectedSymbol.asObservable();
  readonly selectedPeriod$ = this._selectedPeriod.asObservable();

  constructor() {
    // Simulate real-time price updates every 3 seconds
    interval(3000).subscribe(() => {
      const updated = this._quotes.getValue().map(q => ({
        ...q,
        price: parseFloat(jitter(q.price).toFixed(2)),
        change: parseFloat((jitter(q.change, 0.05)).toFixed(2)),
        changePercent: parseFloat((jitter(q.changePercent, 0.05)).toFixed(2))
      }));
      this._quotes.next(updated);
    });
  }

  getPortfolioSummary(): Observable<PortfolioSummary> {
    return new Observable(obs => {
      setTimeout(() => {
        obs.next({
          totalValue: 38201,
          totalInvested: 34550,
          totalPnL: 4776,
          totalPnLPercent: 13.83,
          dayChange: 412.50,
          dayChangePercent: 1.09,
          cashBalance: 8240
        });
        obs.complete();
      }, 400);
    });
  }

  getHoldings(): Observable<Holding[]> {
    return new Observable(obs => {
      setTimeout(() => { obs.next(MOCK_HOLDINGS); obs.complete(); }, 500);
    });
  }

  getChartData(symbol: string, period: ChartPeriod): Observable<ChartDataPoint[]> {
    const pointsMap: Record<ChartPeriod, number> = { '1D': 24, '1W': 48, '1M': 60, '3M': 90, '6M': 120, '1Y': 180 };
    const base = BASE_QUOTES.find(q => q.symbol === symbol)?.price ?? 200;
    return new Observable(obs => {
      setTimeout(() => { obs.next(generateChartData(base, pointsMap[period])); obs.complete(); }, 300);
    });
  }

  getTransactions(): Observable<Transaction[]> {
    return new Observable(obs => {
      setTimeout(() => { obs.next(MOCK_TRANSACTIONS); obs.complete(); }, 400);
    });
  }

  selectSymbol(symbol: string): void { this._selectedSymbol.next(symbol); }
  selectPeriod(period: ChartPeriod): void { this._selectedPeriod.next(period); }
}
