# 📈 Angular FinTech Dashboard

> **Enterprise-grade Financial Portfolio Dashboard** built with Angular 19, standalone components, NgRx signals, real-time Chart.js charts, SSO-style authentication, RBAC, and light/dark theme toggle.

[![Angular](https://img.shields.io/badge/Angular-18-DD0031?style=flat-square&logo=angular)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-007ACC?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Chart.js](https://img.shields.io/badge/Chart.js-4.4-FF6384?style=flat-square)](https://chartjs.org)
[![RxJS](https://img.shields.io/badge/RxJS-7.8-B7178C?style=flat-square)](https://rxjs.dev)

---

## 🚀 Live Demo

> Deploy to Vercel/Netlify in one command — see [Deployment](#deployment) below.

**Demo Credentials:**
| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@fintech.com | admin123 |
| Viewer | viewer@fintech.com | viewer123 |

---

## ✨ Features

- **📊 Real-Time Portfolio Summary** — Total value, P&L, day change, cash balance with live updates every 3 seconds
- **📈 Interactive Stock Charts** — Chart.js line charts for AAPL, MSFT, GOOGL, AMZN, TSLA, NVDA with 1D/1W/1M/3M/6M/1Y periods
- **💼 Holdings Table** — Current positions with live P&L calculations
- **🧾 Transaction History** — Filterable/searchable transaction log with type and status filters
- **🔔 Notifications Panel** — Unread badge counter, mark-as-read, dismiss — price alerts, order fills, dividends
- **🔐 Role-Based Access Control** — Admin sees analytics and settings nav items; Viewer sees core dashboard
- **🌙 Light / Dark Theme Toggle** — Persisted in localStorage, respects system preference on first load
- **🏃 Market Ticker** — Scrolling real-time price ticker at the top of the dashboard
- **📱 Responsive Design** — Mobile-first layout with collapsible sidebar

---

## 🏗️ Architecture

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # TypeScript interfaces (User, Portfolio, Transaction...)
│   │   ├── services/        # AuthService, MarketDataService, ThemeService, NotificationService
│   │   ├── guards/          # authGuard, adminGuard, guestGuard (functional guards)
│   │   └── interceptors/    # authInterceptor (JWT Bearer token injection)
│   ├── features/
│   │   ├── auth/            # Login component with SSO-style form
│   │   ├── layout/          # Shell, Header, Sidebar, Notifications panel
│   │   └── dashboard/       # Portfolio summary, Stock chart, Holdings, Transactions, Ticker
│   └── shared/              # Reusable components, directives, pipes
└── styles.scss              # CSS custom properties, light/dark themes, global utilities
```

### Key Angular 18 Patterns Used

| Pattern | Usage |
|---|---|
| **Standalone Components** | All components — no NgModules |
| **Signals** (`signal`, `computed`, `effect`) | Theme, auth state, notification count |
| **Functional Guards** | `authGuard`, `adminGuard`, `guestGuard` |
| **Functional HTTP Interceptors** | Bearer token injection |
| **Lazy-loaded routes** | All feature routes loaded on demand |
| **`withViewTransitions()`** | Smooth page transitions |
| **OnPush-ready** | Services use signals and observables for efficient updates |
| **RxJS** | Real-time market data streams, HTTP calls |

---

## 🔐 Security Patterns

- **SSO-style authentication** — simulates OIDC token exchange with session storage
- **Route guards** — all dashboard routes protected, login route blocked for authenticated users
- **HTTP interceptor** — automatically attaches Bearer token to all API requests
- **RBAC** — sidebar navigation items conditionally rendered by user role
- **No hardcoded credentials** in production — mock data isolated in service layer

---

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Angular CLI 18: `npm install -g @angular/cli@18`

### Installation

```bash
# Extract the zip and navigate into the project
cd angular-fintech-dashboard

# Install dependencies
npm install

# Start development server
ng serve

# Open browser
# Navigate to http://localhost:4200
```

### Build for Production

```bash
ng build --configuration production
# Output in dist/angular-fintech-dashboard/
```

### Run Unit Tests

```bash
ng test
```

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel --prod
```

### Netlify

```bash
ng build --configuration production
# Drag dist/angular-fintech-dashboard/browser folder to Netlify dashboard
```

### GitHub Pages

```bash
ng add angular-cli-ghpages
ng deploy --base-href=/angular-fintech-dashboard/
```

---

## 📦 Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| Angular | 18.x | Application framework |
| TypeScript | 5.4 | Type safety |
| RxJS | 7.8 | Reactive data streams |
| Chart.js | 4.4 | Financial charts |
| Angular Router | 18.x | Lazy-loaded routing |
| Angular Forms | 18.x | Reactive login form |
| SCSS | — | Component styles + CSS variables |

---

## 🗂️ Mock Data

All data is mocked in `MarketDataService` — no real API calls. This makes the project:
- Self-contained (runs offline)
- Safe to demo publicly
- Easy to swap with a real API by replacing service method bodies

To connect to a real API, update `src/environments/environment.ts` with your `apiUrl` and replace the Observable mock bodies in `market-data.service.ts` with `this.http.get(...)` calls.

---

## 👤 Author

**Prabakar Karuppasamy** — Frontend Architect & Technical Lead  
14+ years building enterprise Angular applications for BNP Paribas and Bank of America.

[![LinkedIn](https://img.shields.io/badge/LinkedIn-prabakarsamy-0077B5?style=flat-square&logo=linkedin)](https://linkedin.com/in/prabakarsamy)
[![GitHub](https://img.shields.io/badge/GitHub-PrabakarKaruppasamy-333?style=flat-square&logo=github)](https://github.com/PrabakarKaruppasamy)

> ⭐ If this project helped you, give it a star — it helps others find it!
