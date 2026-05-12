# 📊 PulseBoard — Real-Time Data Visualization Platform

A high-performance real-time analytics dashboard built with Vue 3 + TypeScript, simulating a modern monitoring system with live-streaming data, smooth chart updates, and interactive controls.

---

## Live Link


## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- npm v9+

### Installation


```bash
# Clone the repository
git clone <https://github.com/Funmi-Oba/PulseBoard>
cd realtime-dashboard

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 🏗️ Architecture Explanation
src/
├── assets/          # Global CSS, color tokens
├── components/
│   ├── charts/      # LineChart, BarChart, AreaChart
│   └── ui/          # MetricCard, ActivityFeed, DashboardControls, ConnectionBanner
├── composables/     # Reusable Vue composition functions
├── stores/          # Pinia state management (dashboardStore)
├── types/           # TypeScript interfaces and types
├── utils/           # Data generator (simulates live streaming)
└── views/           # Page-level components

The app follows a **unidirectional data flow**:
- `dataGenerator.ts` produces new data points
- `dashboardStore.ts` consumes and manages that data centrally
- Components read from the store reactively and re-render automatically

---

## 🗄️ State Management Strategy

**Pinia** was chosen for state management because:
- It is the official recommended store for Vue 3
- It is lightweight, TypeScript-friendly, and requires no boilerplate
- The composition API style (`defineStore`) matches Vue 3 patterns naturally

All dashboard state lives in a single `dashboardStore`:
- `metrics` — the 4 live metric card values
- `series` — time-series data for all charts
- `activityFeed` — the live event log
- `connectionStatus` — tracks stream health
- `isStreaming` — controls pause/resume
- `timeRange` — controls data filtering

---

## ⚡ Rendering Optimization Decisions

- **`computed` for filtered data** — `filteredSeries` is a computed property, so it only recalculates when `series` or `timeRange` changes
- **`MAX_DATA_POINTS = 100`** — old data points are sliced off to prevent unbounded memory growth
- **`MAX_FEED_ITEMS = 50`** — activity feed is capped to avoid DOM bloat
- **ECharts with `autoresize`** — charts resize responsively without manual listeners
- **`TransitionGroup`** — feed items animate in smoothly without layout thrashing
- **`setInterval` cleanup** — all intervals are cleared on component unmount to prevent memory leaks

---

## 📡 Data Streaming Approach

A **mocked streaming generator** was used via `setInterval`:
- Every **2 seconds** — metric cards and chart series update with new data points
- Every **3 seconds** — a new activity event is added to the feed

The generator (`dataGenerator.ts`) simulates realistic data by applying small random changes to the previous value, staying within defined min/max ranges per metric. This mimics real WebSocket behaviour without requiring a backend.

---

## ⚖️ Trade-offs Made

| Decision | Trade-off |
|---|---|
| Mocked streaming via `setInterval` | No real backend needed, but not a true WebSocket |
| ECharts over D3.js | Easier API and better Vue integration, less low-level control |
| Pinia over Vuex | Simpler and modern, but less familiar to Vuex users |
| Single store for all data | Simple and centralized, could be split per domain in larger apps |
| CSS variables + Tailwind v4 | Clean theming system, but requires understanding of both systems |

---

## 🎨 Features

- ✅ Real-time metric cards with trend indicators
- ✅ Live line chart, bar chart, and stacked area chart
- ✅ Live activity feed with event severity badges
- ✅ Stream summary with progress bars
- ✅ Pause/resume streaming controls
- ✅ Time range filtering (1 min, 5 min, 1 hour, live)
- ✅ Dark/light mode toggle
- ✅ Connection status banner
- ✅ Responsive layout (mobile, tablet, desktop)
- ✅ Memory leak prevention
- ✅ Smooth transitions and animations

---

## 🛠️ Tech Stack

- **Vue 3** — Composition API
- **TypeScript** — Type safety
- **Pinia** — State management
- **ECharts + vue-echarts** — Charts
- **Tailwind CSS v4** — Styling
- **@vueuse/core** — Dark mode, utilities
- **Vite** — Build tool