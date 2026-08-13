import { Link } from "react-router-dom";
import { formatPrice, primaryImage, PLACEHOLDER_IMAGE } from "../utils/helpers";

export default function BookCard({ book }) {
  const hasDiscount = book.discount_price != null;
  const image = primaryImage(book);

  return (
    <Link
      to={`/book/${book.id}`}
      className="book-card group block bg-white rounded-2xl border border-stone-200 overflow-hidden"
    >
      <div className="relative aspect-[3/4] bg-stone-100 overflow-hidden">
        <img
          src={image}
          alt={book.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {hasDiscount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
            Sale
          </span>
        )}
        <span className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-[11px] font-semibold text-stone-700 px-2.5 py-1 rounded-full">
          {book.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 line-clamp-2 min-h-[2.6rem]">
          {book.title}
        </h3>
        {book.description && (
          <p className="mt-1 text-sm text-stone-500 line-clamp-2">{book.description}</p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span
            className={`text-lg font-bold ${hasDiscount ? "text-red-600" : "text-stone-900"}`}
          >
            {hasDiscount ? formatPrice(book.discount_price) : formatPrice(book.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(book.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
