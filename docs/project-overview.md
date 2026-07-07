# Frontend Architecture

## Application Flow

Component
|
v
Redux Action
|
v
AsyncThunk
|
v
API Service
|
v
Backend REST API
|
v
Redux Store

---

# Main Layers

## Components

Responsible for:

- UI rendering
- User interaction
- Displaying state

---

## Redux Store

Contains application state:

- Authentication
- Products
- Categories
- Receipts
- Shopping List
- Statistics
- UI State

---

## API Layer

Axios instance handles:

- API requests
- Base URL configuration
- Error handling

---

# Frontend Features

- Protected routes
- Form validation
- Charts and statistics display
- RTL layout support
- Responsive UI