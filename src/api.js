/* ============================================================
   Book Store — API client & auth helpers.
   Talks to the FastAPI backend at API_BASE_URL (see config.js).
   ============================================================ */

import { API_BASE_URL } from "./config";

const TOKEN_KEY = "bs_token";
const USER_KEY = "bs_user";

export const Auth = {
  getToken: () => localStorage.getItem(TOKEN_KEY),
  setToken: (token) => localStorage.setItem(TOKEN_KEY, token),
  clearToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY));
    } catch {
      return null;
    }
  },
  setUser: (user) => localStorage.setItem(USER_KEY, JSON.stringify(user)),
};

// Turn FastAPI's `detail` field (string | array | object) into a readable message.
function detailMessage(detail) {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail) && detail.length) {
    return detail.map((d) => d.msg || d.message || JSON.stringify(d)).join(" ");
  }
  if (detail && typeof detail === "object") {
    return detail.msg || detail.message || JSON.stringify(detail);
  }
  return "Something went wrong. Please try again.";
}

async function apiRequest(
  path,
  { method = "GET", body, isForm = false, auth = true, timeout = 15000 } = {}
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = {};
    if (!isForm && body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) {
      const token = Auth.getToken();
      if (token) headers["Authorization"] = "Bearer " + token;
    }

    let payload;
    if (isForm) payload = body; // already a URLSearchParams object
    else if (body !== undefined) payload = JSON.stringify(body);

    const res = await fetch(API_BASE_URL + path, {
      method,
      headers,
      body: payload,
      signal: controller.signal,
    });

    if (res.status === 204) return null;

    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const err = new Error(detailMessage(data && data.detail));
      err.status = res.status;
      if (res.status === 401) Auth.clearToken();
      throw err;
    }
    return data;
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out — is the backend running?");
    }
    if (err instanceof TypeError) {
      throw new Error(
        "Cannot reach server at " + API_BASE_URL + ". Please start the backend first."
      );
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const API = {
  request: apiRequest,

  // ---------- Auth ----------
  async login(email, password) {
    // Backend uses OAuth2PasswordRequestForm -> form-urlencoded body.
    const form = new URLSearchParams();
    form.append("username", email);
    form.append("password", password);
    return apiRequest("/api/auth/login", {
      method: "POST",
      isForm: true,
      body: form,
      auth: false,
    });
  },

  async signup(payload) {
    return apiRequest("/api/auth/signup", {
      method: "POST",
      body: payload,
      auth: false,
    });
  },

  async me() {
    return apiRequest("/api/auth/me");
  },

  // ---------- Books ----------
  async getBooks({ skip = 0, limit = 100, category = "", search = "" } = {}) {
    const q = new URLSearchParams();
    q.set("skip", String(skip));
    q.set("limit", String(limit));
    if (category) q.set("category", category);
    if (search) q.set("search", search);
    return apiRequest("/api/books?" + q.toString());
  },

  async getBook(id) {
    return apiRequest("/api/books/" + encodeURIComponent(id));
  },
};
