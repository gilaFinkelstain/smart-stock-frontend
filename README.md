# Smart Stock — Frontend

React 18 + TypeScript single-page application for the Smart Stock purchasing management system.

---

## Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI framework |
| Vite 5 | Build tool + dev server |
| Redux Toolkit | State management (9 slices) |
| React Router v6 | Client-side routing |
| Tailwind CSS 3 | Utility-first styling, RTL layout |
| Chart.js + react-chartjs-2 | Data visualization (bar, timeline, scatter) |
| Axios | HTTP client |
| React Hook Form + Zod | Form handling + validation |
| Sonner | Toast notifications |
| Lucide React | Icon library |

---

## Quick Start

```bash
npm install
npm run dev       # → http://localhost:3000
npm run build     # TypeScript check + production build
npm run preview   # Preview production build
```

The dev server proxies `/api/*` requests to `http://localhost:5000` (configurable via `VITE_API_URL` in `.env`).

**Prerequisites:** Node.js 18+, npm 9+, backend running on port 5000.

---

## Project Structure

```
src/
├── main.tsx                    # React entry point
├── App.tsx                     # Root component (toast provider + router)
├── index.css                   # Tailwind directives + CSS variables
├── lib/
│   ├── api.ts                  # Axios instance (base URL, error interceptor)
│   └── utils.ts                # cn() helper (clsx + tailwind-merge)
├── types/
│   └── models.ts               # All TypeScript interfaces
├── store/
│   ├── index.ts                # configureStore (all reducers)
│   ├── hooks.ts                # useAppDispatch, useAppSelector
│   └── slices/                 # 9 Redux slices (one per entity + auth + ui)
├── services/                   # Typed Axios wrappers (one per entity)
├── routes/
│   ├── index.tsx               # Route definitions
│   └── ProtectedRoute.tsx      # Auth guard wrapper
├── components/
│   ├── layout/                 # AppLayout, Sidebar, Header
│   ├── shared/                 # DataTable, PageHeader, ConfirmDialog, etc.
│   └── charts/                 # CycleBarChart, PurchaseTimeline, StabilityScatter
└── pages/                      # One component per route
```

---

## State Management

Every entity follows the same three-layer pattern:

```
Service (typed API call) → AsyncThunk → Slice (pending/fulfilled/rejected) → Component (useAppSelector)
```

### Slice State Shape

```typescript
{
  items: T[],           // List of entities
  selectedX: T | null,  // Currently viewed/editing item
  loading: boolean,     // True during async operations
  error: string | null  // Error message or null
}
```

### Auth Slice (special)

Stores `userId`, `userName`, `userEmail`, and `isLoggedIn`. On login, saves to both Redux and localStorage keys: `smartstock_userId`, `smartstock_userName`, `smartstock_userEmail`. `ProtectedRoute` reads `auth.isLoggedIn` (hydrated from localStorage on init).

---

## API Conventions

| Operation | Response | Client Handling |
|---|---|---|
| POST (create) | `{"id": int}` | Merge `action.meta.arg` + returned ID into items array |
| PUT (update) | `{"message": "updated"}` | Thunk returns `{id, data}`, reducer does `Object.assign(item, data)` |
| DELETE | `{"message": "deleted"}` | Filter item by ID from items array |
| File upload | multipart/form-data | Axios FormData |
| Error | `{"error": string}` | Interceptor extracts `error.response.data.error` |

---

## Routes

All routes except `/login` are protected (auth guard).

| Route | Page | Description |
|---|---|---|
| `/login` | LoginPage | Email + password login |
| `/` | DashboardPage | Overview + quick stats |
| `/products` | ProductsPage | Product list |
| `/products/new` | ProductFormPage | Add product |
| `/products/:id/edit` | ProductFormPage | Edit product |
| `/categories` | CategoriesPage | Category list |
| `/categories/new` | CategoryFormPage | Add category |
| `/categories/:id/edit` | CategoryFormPage | Edit category |
| `/ranges` | RangesPage | Range list |
| `/ranges/new` | RangeFormPage | Add range |
| `/ranges/:id/edit` | RangeFormPage | Edit range |
| `/receipts` | ReceiptsPage | Upload + receipt list |
| `/receipts/:id` | ReceiptDetailPage | Receipt line items |
| `/shopping-list` | ShoppingListPage | Smart shopping list |
| `/product-range` | ProductRangePage | Product-range mappings |
| `/product-range/new` | ProductRangeFormPage | Add mapping |
| `/product-range/:id/edit` | ProductRangeFormPage | Edit mapping |
| `/statistics` | StatisticsPage | Analytics + charts |

---

## RTL / Hebrew Support

- `<html dir="rtl" lang="he">` in `index.html`
- All UI text in Hebrew
- Sidebar positioned from right edge (`right-0`, `border-l`, `translate-x-full`)
- Main content adjusts with responsive margin: `lg:mr-64` (sidebar open) / `lg:mr-16` (sidebar closed)
- Chart.js canvases default to LTR (sufficient for numeric charts)

---

## Component Catalog

### Layout
- **AppLayout** — sidebar + header + `<Outlet />` for nested routes
- **Sidebar** — navigation links, collapsible, responsive
- **Header** — top bar with user info, sidebar toggle

### Shared
- **DataTable** — generic table with columns config, loading/empty states
- **PageHeader** — page title + action buttons (add, back, etc.)
- **ConfirmDialog** — modal confirmation for destructive actions
- **FileUploader** — drag-and-drop file input for receipt uploads
- **StatCard** — metric card with label, value, icon, trend indicator
- **EmptyState** — placeholder for empty lists
- **LoadingPage** — full-page spinner

### Charts
- **CycleBarChart** — bar chart showing purchase cycle length per product
- **PurchaseTimeline** — line chart of purchases over time
- **StabilityScatter** — scatter plot of stability vs. cycle for all products
