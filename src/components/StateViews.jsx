import { Link } from "react-router-dom";

export function SkeletonCards({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[3/4] bg-stone-200 rounded-2xl" />
          <div className="mt-3 h-4 bg-stone-200 rounded w-3/4" />
          <div className="mt-2 h-4 bg-stone-200 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, message }) {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">📚</div>
      <h3 className="font-display text-2xl font-semibold text-stone-800">{title}</h3>
      <p className="mt-2 text-stone-500">{message}</p>
      <Link
        to="/shop"
        className="inline-block mt-5 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold"
      >
        Browse all books
      </Link>
    </div>
  );
}
