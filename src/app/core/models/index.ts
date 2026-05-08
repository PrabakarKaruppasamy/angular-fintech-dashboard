// ── User & Auth ────────────────────────────────────────────────
export type UserRole = 'admin' | 'viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// ── Portfolio ──────────────────────────────────────────────────
export interface PortfolioSummary {
  totalValue: number;
  totalInvested: number;
  totalPnL: number;
  totalPnLPercent: number;
  dayChange: number;
  dayChangePercent: number;
  cashBalance: number;
}

export interface Holding {
  symbol: string;
  name: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercent: number;
  sector: string;
}

// ── Stock / Market ─────────────────────────────────────────────
export interface StockQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  high52w: number;
  low52w: number;
}

export interface ChartDataPoint {
  timestamp: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type ChartPeriod = '1D' | '1W' | '1M' | '3M' | '6M' | '1Y';

// ── Transactions ───────────────────────────────────────────────
export type TransactionType = 'BUY' | 'SELL' | 'DIVIDEND' | 'DEPOSIT' | 'WITHDRAWAL';
export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'CANCELLED';

export interface Transaction {
  id: string;
  type: TransactionType;
  symbol?: string;
  name: string;
  quantity?: number;
  price?: number;
  amount: number;
  status: TransactionStatus;
  date: Date;
  description: string;
}

// ── Notifications ──────────────────────────────────────────────
export type NotificationType = 'alert' | 'info' | 'success' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionLabel?: string;
  actionRoute?: string;
}

// ── Theme ──────────────────────────────────────────────────────
export type Theme = 'light' | 'dark';

export interface AppState {
  theme: Theme;
  sidebarOpen: boolean;
}
