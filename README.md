# Book Store — User Frontend

React.js storefront for the Book Store app, styled with the **Tailwind CSS CDN** and connected
to the FastAPI backend in `../backend`.

## Tech Stack

- **React 18** + **react-router-dom 6** (scaffolded with Create React App)
- **Tailwind CSS** via CDN (`https://cdn.tailwindcss.com`) — no build step for styles
- **Google Fonts** — Fraunces (display) + Inter (body)

## Features

- 🏠 **Home** — hero with search, category chips, featured books, hot deals
- 🛒 **Shop** — search by title, filter by category, pagination (12 per page)
- 📖 **Book detail** — image gallery (primary + thumbnails), price/discount, description
- 👤 **Auth** — register, login (JWT), logout
- 🗂 **My Account** — profile details pulled from `/api/auth/me`

## Prerequisites

1. The backend must be running (see `../backend/README.md`):

   ```bash
   cd ../backend
   python -m uvicorn app.main:app --reload
   ```

   Backend API: `http://127.0.0.1:8000`

2. **Node.js** (v18+ recommended) with npm.

## Setup

```bash
npm install
```

## Run (development)

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000). The dev server proxies nothing — the
frontend calls the backend directly, so make sure the backend is up first.

## Build (production)

```bash
npm run build
```

Output goes to `build/` and can be served by any static host.

## Connecting to the backend

The API base URL is configured in `src/config.js`:

```js
export const API_BASE_URL = "http://127.0.0.1:8000";
```

**CORS:** the backend allows origins `http://localhost:3000`, `http://localhost:5173` and
`http://localhost:8000` (see `backend/app/core/config.py`). If you serve the frontend from a
different origin, add it to `CORS_ORIGINS` in `backend/.env`.

## API endpoints used

| Method | Endpoint             | Purpose                        |
| ------ | -------------------- | ------------------------------ |
| POST   | `/api/auth/signup`   | Create an account              |
| POST   | `/api/auth/login`    | Login (returns JWT token)      |
| GET    | `/api/auth/me`       | Current user (Bearer token)    |
| GET    | `/api/books`         | List books (search/category/pagination) |
| GET    | `/api/books/{id}`    | Book detail                    |
