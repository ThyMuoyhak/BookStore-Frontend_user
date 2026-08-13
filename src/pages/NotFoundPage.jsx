import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="font-display text-7xl font-semibold text-amber-500">404</p>
      <h1 className="font-display text-3xl font-semibold text-stone-900 mt-4">
        Page not found
      </h1>
      <p className="mt-3 text-stone-500">
        The page you are looking for doesn't exist or may have been moved.
      </p>
      <Link
        to="/"
        className="inline-block mt-8 px-6 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold"
      >
        Back to home
      </Link>
    </div>
  );
}
