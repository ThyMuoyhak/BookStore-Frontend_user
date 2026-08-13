import { Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Footer() {
  return (
    <footer className="mt-20 bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <span className="w-9 h-9 rounded-xl bg-amber-500 text-white grid place-items-center">
              📚
            </span>
            <span className="font-display text-lg font-semibold text-white">
              Book<span className="text-amber-500">Store</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed text-stone-400">
            Browse a curated collection of books. Simple, fast, and built on FastAPI + React +
            Tailwind CSS.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-amber-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/shop" className="hover:text-amber-400">
                Shop Books
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:text-amber-400">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-amber-400">
                Register
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">API</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <span className="text-stone-500">Backend:</span>{" "}
              <code className="text-amber-400">{API_BASE_URL}</code>
            </li>
            <li>
              <a
                className="hover:text-amber-400"
                target="_blank"
                rel="noopener noreferrer"
                href={API_BASE_URL + "/docs"}
              >
                API Docs (Swagger)
              </a>
            </li>
            <li>
              <a
                className="hover:text-amber-400"
                target="_blank"
                rel="noopener noreferrer"
                href={API_BASE_URL + "/api/health"}
              >
                Health Check
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-stone-800">
        <p className="max-w-7xl mx-auto px-4 py-5 text-xs text-stone-500">
          © {new Date().getFullYear()} Book Store. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
