# System Architecture

## Architecture Style

**Client-Server** with a layered backend:

```
Frontend (React SPA)
        │  HTTP/REST (JSON)
        ▼
   Flask REST API
        │
        ▼
   Service Layer      ← business logic, receipt parsing, statistics
        │
        ▼
   Repository Layer   ← SQLAlchemy ORM
        │
        ▼
   SQL Server 2022
```

Additional services are standalone and may run independently:

- **Receipt Processing** — file upload → PDF/text/JSON parsing → product extraction → database insert
- **Shopping List Generator** — queries user product ranges → creates list entries for due items
- **Statistics Engine** — purchase cycle analysis from receipt history
- **Rami Levy Adapter** — Playwright browser automation (standalone, not part of Flask app)

---

## Component Architecture

### Frontend (React 18 + TypeScript)

| Layer | Technology | Description |
|---|---|---|
| Routing | React Router v6 | Protected routes with auth guard |
| State | Redux Toolkit | 9 slices — auth, products, categories, ranges, receipts, shoppingList, productRange, statistics, ui |
| HTTP | Axios | Single instance, base URL from `VITE_API_URL`, error interceptor |
| Forms | React Hook Form + Zod | Client-side validation |
| Charts | Chart.js + react-chartjs-2 | Bar charts, timelines, scatter plots |
| Styling | Tailwind CSS 3 | RTL layout, CSS variables for theme |
| Notifications | Sonner | Toast messages |
| Icons | Lucide React | Icon library |

**State Management Pattern:**
```
Service (typed API call) → AsyncThunk → Slice (pending/fulfilled/rejected) → Component (useAppSelector)
```

### Backend (Python Flask)

| Layer | Location | Responsibility |
|---|---|---|
| Routes | `Controler/` | HTTP request handling, input validation, response formatting |
| Services | `Service/` | Business logic, file parsing, statistics computation, browser automation |
| Repositories | `Repository/` | Data access, SQLAlchemy queries |
| Models | `models/` | SQLAlchemy ORM declarations |
| DTOs | `DTO/` | Data transfer objects for request/response shapes |

**Key Design Decisions:**
- No JWT or session management — login returns `user_id`, client stores it in localStorage
- CORS enabled globally via `flask-cors`
- Blueprint-based route organization (one blueprint per entity)
- `BaseController` base class provides shared SQLAlchemy session handling

### Database (SQL Server 2022)

8 tables with referential integrity via foreign keys and `ON DELETE CASCADE`:

```
users ──┬── receipts ──┬── reception_products ── products ── category ── Range
        │              │
        ├── Shopping_list ── products, Range
        │
        └── product_range_for_the_user ── products, Range
```

See [Database Schema](database-schema.md) for full ER diagram and table definitions.

---

## Data Flow

### Receipt Upload Flow

```
1. User uploads file (PDF/JSON/text) via multipart form
2. ReceiptService.parse_receipt_file() extracts raw products
3. ReceiptService.filter_real_products() removes noise
4. ReceiptService.find_or_create_product() matches each item by barcode → name → create
5. New Receipt record created (user_id, timestamp)
6. ReceptionProducts created (receipt_id, product_id, amount)
7. Response: receipt_id + list of processed products
```

### Shopping List Generation Flow

```
1. GET /shopping/generate/<user_id>
2. ShoppingService queries product_range_for_the_user for the user
3. For each product-range mapping, checks if already in Shopping_list
4. Creates new Shopping_list entries (amount=1, range_enum from the mapping)
5. Response: total_added + list of products added
```

### Statistics Computation Flow

```
1. StatisticsEngine queries all receipts + reception_products for a user
2. Computes purchase dates per product
3. Calculates: cycle (avg days between), stability (0-1), trend (acceleration), days_since
4. Computes urgency score from weighted combination
5. Requires ≥3 purchases per product for meaningful results
```

---

## Network & Ports

| Component | Port | Description |
|---|---|---|
| React Dev Server | 3000 | Vite with HMR, proxies `/api/*` → 5000 |
| Flask API | 5000 | All REST endpoints |
| SQL Server | 1433 | MSSQL database |

---

## Deployment Architecture

```
┌──────────────────────────────────────────────┐
│                 Docker Host                   │
│                                               │
│  ┌─────────────┐  ┌─────────────┐            │
│  │ smart-stock  │  │ smart-stock │            │
│  │   (Flask)    │  │    (DB)     │            │
│  │   port 5000  │  │   port 1433 │            │
│  └─────────────┘  └─────────────┘            │
│        │                 │                    │
│        │    ┌────────────┘                    │
│        │    │                                 │
│  ┌─────┴────┴──────┐                         │
│  │  smart-stock    │  (one-time init)        │
│  │  db-init         │                         │
│  └─────────────────┘                         │
│                                               │
│  Volumes:                                     │
│    sql_data, sql_log, debug_screenshots       │
└──────────────────────────────────────────────┘
```

`db-init` runs the SQL schema + seed data once, waits for SQL Server health check, then exits. The Flask app depends on both `db` (healthy) and `db-init` (completed).

Planned: Azure/AWS cloud deployment.
