import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API } from "../api";
import { formatPrice, PLACEHOLDER_IMAGE, primaryImage } from "../utils/helpers";
import { EmptyState } from "../components/StateViews";
import { toast } from "../utils/toast";

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mainImg, setMainImg] = useState("");

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const b = await API.getBook(id);
        if (active) {
          setBook(b);
          setMainImg(primaryImage(b));
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
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse grid md:grid-cols-2 gap-10">
          <div className="aspect-[3/4] bg-stone-200 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-6 bg-stone-200 rounded w-1/3" />
            <div className="h-10 bg-stone-200 rounded w-3/4" />
            <div className="h-8 bg-stone-200 rounded w-1/4" />
            <div className="h-40 bg-stone-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <EmptyState
          title="Book not found"
          message={error || "This book does not exist or was removed."}
        />
      </div>
    );
  }

  const hasDiscount = book.discount_price != null;
  const pct =
    hasDiscount && Number(book.price) > 0
      ? Math.round((1 - Number(book.discount_price) / Number(book.price)) * 100)
      : 0;
  const created = book.created_at
    ? new Date(book.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";
  const description = book.description || "No description available for this book yet.";
  const images = book.images && book.images.length ? book.images : [];

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: book.title, url });
      } catch {
        // user dismissed the native share sheet
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        toast("Link copied to clipboard", "success");
      } catch {
        toast("Could not copy link", "error");
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
        {/* Gallery */}
        <div>
          <div className="rounded-3xl overflow-hidden border border-stone-200 bg-white aspect-[3/4]">
            <img
              src={mainImg}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>
          {images.length > 0 && (
            <div className="mt-4 flex gap-3 flex-wrap">
              {images.map((im, idx) => (
                <button
                  key={im.id || idx}
                  onClick={() => setMainImg(im.image_url)}
                  className={`thumb ${mainImg === im.image_url ? "thumb-active" : ""}`}
                >
                  <img
                    src={im.image_url}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <Link
            to={`/shop?category=${encodeURIComponent(book.category)}`}
            className="inline-block text-xs font-bold uppercase tracking-wider text-amber-600 hover:text-amber-700"
          >
            {book.category}
          </Link>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold text-stone-900 mt-2 leading-tight">
            {book.title}
          </h1>
          <div className="mt-5 flex items-baseline gap-3 flex-wrap">
            <span
              className={`text-3xl font-bold ${hasDiscount ? "text-red-600" : "text-stone-900"}`}
            >
              {hasDiscount ? formatPrice(book.discount_price) : formatPrice(book.price)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-lg text-stone-400 line-through">
                  {formatPrice(book.price)}
                </span>
                <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-1 rounded-full">
                  −{pct}%
                </span>
              </>
            )}
          </div>
          {created && <p className="mt-2 text-sm text-stone-400">Added {created}</p>}
          <div className="mt-6 border-t border-stone-200 pt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
              Description
            </h2>
            <p className="mt-2 text-stone-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold"
            >
              ← Back to shop
            </Link>
            <button
              onClick={share}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-stone-300 hover:border-amber-500 text-stone-700 text-sm font-semibold"
            >
              Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
