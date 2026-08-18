/* ============================================================
   Global configuration for the Book Store user frontend.
   ============================================================ */

// Base URL of the FastAPI backend.
// Default points at the deployed Render backend. For local development
// against a local backend, set REACT_APP_API_URL=http://127.0.0.1:8000
// (it takes priority and is inlined at build/start time).
export const API_BASE_URL =
  (typeof process !== "undefined" && process.env && process.env.REACT_APP_API_URL) ||
  "https://bookstore-backend-50ri.onrender.com";

// Currency symbol used when formatting prices.
export const CURRENCY = "$";

// Number of books shown per page on the shop page.
export const BOOKS_PER_PAGE = 12;

