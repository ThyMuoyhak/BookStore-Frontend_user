import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { API } from "../api";
import { BOOKS_PER_PAGE } from "../config";
import BookCard from "../components/BookCard";
import { EmptyState, SkeletonCards } from "../components/StateViews";
import { toast } from "../utils/toast";

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10) || 1);
  const limit = BOOKS_PER_PAGE;

  const [input, setInput] = useState(search);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Keep the search box in sync when the URL changes externally.
  useEffect(() => {
    setInput(search);
  }, [search]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [cats, books] = await Promise.all([
          categories.length
            ? Promise.resolve({ items: [] })
            : API.getBooks({ limit: 100, skip: 0 }),
          API.getBooks({ skip: (page - 1) * limit, limit, category, search }),
        ]);
        if (!active) return;
        if (!categories.length) {
          setCategories([
            ...new Set((cats.items || []).map((b) => b.category).filter(Boolean)),
          ]);
        }
        setData(books);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, page]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) next.set(k, String(v));
      else next.delete(k);
    });
    if (!updates.page) next.delete("page"); // reset page when a filter changes
    setSearchParams(next);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    updateParams({ search: input.trim(), category, page: 1 });
  };

  const total = data ? data.total : 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const items = data ? data.items : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-stone-900">Shop books</h1>
        <p className="text-stone-500 mt-1">Search by title or filter by category.</p>
      </header>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={submitSearch} className="flex-1 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search by title…"
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
          />
          <button className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold">
            Search
          </button>
        </form>
        <select
          value={category}
          onChange={(e) => updateParams({ search, category: e.target.value, page: 1 })}
          className="px-4 py-2.5 rounded-xl border border-stone-300 bg-white text-stone-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        {(search || category) && (
          <button
            onClick={() => updateParams({ search: "", category: "", page: 1 })}
            className="px-4 py-2.5 rounded-xl border border-stone-300 hover:border-amber-500 text-stone-700 text-sm font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-sm text-stone-500 mb-5">
        {loading ? (
          "Loading…"
        ) : (
          <>
            <span className="font-medium text-stone-900">{total}</span> book
            {total === 1 ? "" : "s"}
            {(search || category) && (
              <>
                {" "}
                for {[search && `"${search}"`, category].filter(Boolean).join(" in ")}
              </>
            )}
          </>
        )}
      </p>

      {/* Grid */}
      {loading ? (
        <SkeletonCards count={limit} />
      ) : error ? (
        <EmptyState title="Could not load books" message={error} />
      ) : items.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No books found"
          message={
            search
              ? `Nothing matched "${search}". Try a different keyword.`
              : "There are no books in this category yet."
          }
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => updateParams({ search, category, page: page - 1 })}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-white text-stone-700 border border-stone-300 hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ← Prev
          </button>
          <span className="px-2 text-sm text-stone-500">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => updateParams({ search, category, page: page + 1 })}
            className="px-3.5 py-2 rounded-xl text-sm font-semibold bg-white text-stone-700 border border-stone-300 hover:border-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </nav>
      )}
    </div>
  );
}
