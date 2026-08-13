import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../utils/toast";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const displayName = user ? user.full_name || user.username || "User" : "";
  const initial = (displayName.trim()[0] || "U").toUpperCase();

  const linkClass = ({ isActive }) =>
    `hover:text-amber-600 transition-colors ${isActive ? "text-amber-600" : "text-stone-600"}`;

  const handleLogout = () => {
    logout();
    toast("You have been logged out", "success");
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-stone-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="w-9 h-9 rounded-xl bg-amber-500 text-white grid place-items-center shadow-sm">
            📚
          </span>
          <span className="font-display text-xl font-semibold text-stone-900">
            Book<span className="text-amber-600">Store</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-semibold">
          <NavLink to="/" end className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/shop" className={linkClass}>
            Shop Books
          </NavLink>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-stone-200 py-1.5 pl-1.5 pr-3 hover:bg-stone-50"
              >
                <span className="w-8 h-8 rounded-lg bg-stone-900 text-amber-400 grid place-items-center font-bold text-sm">
                  {initial}
                </span>
                <span className="hidden sm:block text-sm font-semibold text-stone-800 max-w-[8rem] truncate">
                  {displayName}
                </span>
                <svg
                  className="w-4 h-4 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl border border-stone-200 shadow-xl overflow-hidden z-50">
                  <Link
                    to="/account"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    👤 My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    ↪ Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-stone-700 hover:text-stone-900"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-sm"
              >
                Register
              </Link>
            </>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden w-10 h-10 grid place-items-center rounded-xl border border-stone-200 text-stone-700"
            aria-label="Menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Home
          </NavLink>
          <NavLink
            to="/shop"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
          >
            Shop Books
          </NavLink>
          {user ? (
            <>
              <NavLink
                to="/account"
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-stone-700 hover:bg-stone-50"
              >
                My Account
              </NavLink>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link
                to="/login"
                className="flex-1 text-center px-4 py-2 rounded-xl border border-stone-200 text-sm font-semibold text-stone-700"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="flex-1 text-center px-4 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
