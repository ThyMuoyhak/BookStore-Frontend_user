import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { API } from "../api";
import BookCard from "../components/BookCard";
import { EmptyState, SkeletonCards } from "../components/StateViews";
import { toast } from "../utils/toast";

export default function HomePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const data = await API.getBooks({ limit: 100, skip: 0 });
        if (active) {
          setItems(data.items || []);
          setError("");
        }
      } catch (err) {
        if (active) {
          setError(err.message);
          toast(err.message, "error");
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const categories = [...new Set(items.map((b) => b.category).filter(Boolean))];
  const featured = items.slice(0, 8);
  const deals = items.filter((b) => b.discount_price != null).slice(0, 4);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(search.trim() ? `/shop?search=${encodeURIComponent(search.trim())}` : "/shop");
  };

  return (
    <div>
      {/* Hero */}
      <section className="hero-texture bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-amber-600 bg-amber-100/70 px-4 py-1.5 rounded-full">
            Welcome to BookStore
          </span>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-semibold text-stone-900 mt-5 leading-tight">
            Discover your next <span className="text-amber-600">favorite book</span>
          </h1>
          <p className="mt-4 text-stone-600 max-w-2xl mx-auto text-lg">
            Browse our collection, find great deals, and explore books by category.
          </p>
          <form onSubmit={submitSearch} className="mt-8 max-w-xl mx-auto flex gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title…"
              className="flex-1 px-5 py-3.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
            />
            <button className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-sm">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Categories */}
        {categories.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="font-display text-2xl font-semibold text-stone-900">
                Browse categories
              </h2>
              <Link to="/shop" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
                View all →
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {categories.map((c) => (
                <Link
                  key={c}
                  to={`/shop?category=${encodeURIComponent(c)}`}
                  className="shrink-0 px-4 py-2 rounded-full border border-stone-300 bg-white text-sm font-semibold text-stone-700 hover:border-amber-500 hover:text-amber-600 transition-colors"
                >
                  {c}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Featured */}
        <section>
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-display text-2xl font-semibold text-stone-900">
              Featured books
            </h2>
            <Link to="/shop" className="text-sm font-semibold text-amber-600 hover:text-amber-700">
              View all →
            </Link>
          </div>
          {loading ? (
            <SkeletonCards />
          ) : error ? (
            <EmptyState title="Could not load books" message={error} />
          ) : featured.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No books yet"
              message="Check back soon — books will appear here once the store is stocked."
            />
          )}
        </section>

        {/* Deals */}
        {deals.length > 0 && (
          <section className="bg-gradient-to-br from-amber-50 to-stone-50 border border-amber-100 rounded-3xl p-6 sm:p-10">
            <h2 className="font-display text-2xl font-semibold text-stone-900">🔥 Hot deals</h2>
            <p className="text-stone-500 text-sm mt-1 mb-6">
              Hand-picked discounts, while they last.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {deals.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
