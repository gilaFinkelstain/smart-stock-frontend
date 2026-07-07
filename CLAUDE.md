# CLAUDE.md — Frontend

This file provides guidance to Claude Code when working with code in the `frontend/` directory.

## Commands

```bash
npm run dev       # Start dev server on localhost:3000
npm run build     # TypeScript check + Vite production build
npm run preview   # Preview production build locally
```

Node.js 18+ required. The dev server proxies `/api/*` to the Flask backend at `http://localhost:5000` (configured in [vite.config.ts](vite.config.ts)).

## Architecture

This is a **React 18 + TypeScript SPA** for the Smart Stock household inventory management system. The backend is a separate Python/Flask server.

### Stack
- **Routing:** React Router v6 in [src/routes/index.tsx](src/routes/index.tsx)
- **State:** Redux Toolkit with 9 slices. Use `useAppSelector` and `useAppDispatch` from [src/store/hooks.ts](src/store/hooks.ts) — never raw `useSelector`/`useDispatch`
- **HTTP:** Single Axios instance at [src/lib/api.ts](src/lib/api.ts) — base URL from `VITE_API_URL` env var (default `http://localhost:5000`), errors normalized via response interceptor
- **Forms:** React Hook Form + Zod (raw inputs styled with Tailwind)
- **Charts:** Chart.js via `react-chartjs-2`
- **Notifications:** `sonner` toast — already mounted in `App.tsx`, call `toast.success()` / `toast.error()`
- **Styling:** Tailwind CSS 3, RTL layout, CSS variables for theme colors (light/dark) in [src/index.css](src/index.css)
- **Icons:** `lucide-react`

## Directory Map

```
src/
├── lib/
│   ├── api.ts              # Axios instance with error interceptor
│   └── utils.ts            # cn() helper (clsx + tailwind-merge)
├── types/
│   └── models.ts           # All TypeScript interfaces — single source of truth
├── store/
│   ├── index.ts            # configureStore with 9 slices
│   ├── hooks.ts            # useAppSelector, useAppDispatch
│   └── slices/
│       ├── authSlice.ts
│       ├── productsSlice.ts
│       ├── categoriesSlice.ts
│       ├── rangesSlice.ts
│       ├── receiptsSlice.ts
│       ├── shoppingListSlice.ts
│       ├── productRangeSlice.ts
│       ├── statisticsSlice.ts
│       └── uiSlice.ts
├── services/
│   ├── authService.ts
│   ├── productsService.ts
│   ├── categoriesService.ts
│   ├── rangesService.ts
│   ├── receiptsService.ts
│   ├── shoppingListService.ts
│   ├── productRangeService.ts
│   ├── statisticsService.ts
│   └── ramiLevyService.ts
├── routes/
│   ├── index.tsx           # AppRoutes — all route definitions
│   └── ProtectedRoute.tsx  # Auth guard, hydrates from localStorage
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx   # Sidebar + Header + <Outlet />
│   │   ├── Sidebar.tsx     # RTL sidebar, right-anchored
│   │   └── Header.tsx
│   ├── shared/
│   │   ├── DataTable.tsx
│   │   ├── PageHeader.tsx
│   │   ├── ConfirmDialog.tsx
│   │   ├── FileUploader.tsx
│   │   ├── StatCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── LoadingPage.tsx
│   └── charts/
│       ├── CycleBarChart.tsx
│       ├── PurchaseTimeline.tsx
│       └── StabilityScatter.tsx
└── pages/
    ├── LoginPage.tsx
    ├── DashboardPage.tsx
    ├── ProductsPage.tsx / ProductFormPage.tsx
    ├── CategoriesPage.tsx / CategoryFormPage.tsx
    ├── RangesPage.tsx / RangeFormPage.tsx
    ├── ProductRangePage.tsx / ProductRangeFormPage.tsx
    ├── ReceiptsPage.tsx / ReceiptDetailPage.tsx
    ├── ShoppingListPage.tsx
    └── StatisticsPage.tsx
```

## Entity Pattern

Every entity follows the same three-layer pattern:

1. **Service** (`src/services/xService.ts`) — plain functions calling `api.get/post/put/delete`, returning typed promises
2. **Slice** (`src/store/slices/xSlice.ts`) — `createAsyncThunk` calling the service, then `createSlice` with `pending/fulfilled/rejected` cases. State shape: `{ items[], selectedX, loading, error }`
3. **Pages** — dispatch thunks, read state via `useAppSelector`

## API Conventions

- `POST` responses return `{ id }` only — slices merge `action.meta.arg` into the items array
- `PUT` returns `{ message: "updated" }` — update thunks return `{ id, data }` so the reducer can `Object.assign(state.items[idx], data)`
- `DELETE` returns `{ message: "deleted" }` — the reducer filters by id
- File uploads (`POST /receipts/upload`) use `multipart/form-data` via Axios `FormData`
- Errors have shape `{ error: string }` — Axios interceptor extracts `error.response.data.error`

## Auth

Login stores `userId`, `userName`, and `userEmail` in both Redux and localStorage (keys: `smartstock_userId/Name/Email`). `ProtectedRoute` checks `auth.isLoggedIn` which hydrates from localStorage on init.

## Routes

All routes except `/login` are protected.

| Route | Page |
|---|---|
| `/login` | LoginPage |
| `/` | DashboardPage |
| `/products` | ProductsPage |
| `/products/new` | ProductFormPage |
| `/products/:id/edit` | ProductFormPage |
| `/categories` | CategoriesPage |
| `/categories/new` | CategoryFormPage |
| `/categories/:id/edit` | CategoryFormPage |
| `/ranges` | RangesPage |
| `/ranges/new` | RangeFormPage |
| `/ranges/:id/edit` | RangeFormPage |
| `/receipts` | ReceiptsPage |
| `/receipts/:id` | ReceiptDetailPage |
| `/shopping-list` | ShoppingListPage |
| `/product-range` | ProductRangePage |
| `/product-range/new` | ProductRangeFormPage |
| `/product-range/:id/edit` | ProductRangeFormPage |
| `/statistics` | StatisticsPage |

## RTL

The app is right-to-left (Hebrew). `index.html` sets `<html dir="rtl">`. Sidebar uses `right-0`, `border-l`, `translate-x-full`. Content area uses `lg:mr-64`/`lg:mr-16`. Chart.js canvases are set to LTR for correct rendering.
