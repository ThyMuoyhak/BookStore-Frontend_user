import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../utils/toast";

export default function AccountPage() {
  const { user, initialized, logout } = useAuth();

  if (!initialized) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse h-40 bg-stone-200 rounded-3xl" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=%2Faccount" replace />;
  }

  const initial = (user.full_name || user.username || "U").trim()[0].toUpperCase();
  const joined = user.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "—";

  const handleLogout = () => {
    logout();
    toast("You have been logged out", "success");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-3xl font-semibold text-stone-900 mb-8">My account</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile card */}
        <div className="bg-white rounded-3xl border border-stone-200 p-8 text-center">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-stone-900 text-amber-400 grid place-items-center text-3xl font-bold">
            {initial}
          </div>
          <h2 className="mt-4 font-display text-2xl font-semibold text-stone-900">
            {user.full_name || user.username}
          </h2>
          <p className="text-stone-500">@{user.username}</p>
          <span
            className={`inline-block mt-3 text-xs font-semibold ${
              user.is_active ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
            } px-3 py-1 rounded-full`}
          >
            {user.is_active ? "Active member" : "Account disabled"}
          </span>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 p-8">
          <h3 className="font-display text-xl font-semibold text-stone-900">Profile details</h3>
          <dl className="mt-6 divide-y divide-stone-100 text-sm">
            <div className="py-3 grid sm:grid-cols-3 gap-1">
              <dt className="text-stone-500 font-medium">Full name</dt>
              <dd className="sm:col-span-2 text-stone-800 font-medium">
                {user.full_name || "—"}
              </dd>
            </div>
            <div className="py-3 grid sm:grid-cols-3 gap-1">
              <dt className="text-stone-500 font-medium">Username</dt>
              <dd className="sm:col-span-2 text-stone-800 font-medium">@{user.username}</dd>
            </div>
            <div className="py-3 grid sm:grid-cols-3 gap-1">
              <dt className="text-stone-500 font-medium">Email</dt>
              <dd className="sm:col-span-2 text-stone-800 font-medium">{user.email}</dd>
            </div>
            <div className="py-3 grid sm:grid-cols-3 gap-1">
              <dt className="text-stone-500 font-medium">Member since</dt>
              <dd className="sm:col-span-2 text-stone-800 font-medium">{joined}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-semibold"
            >
              Log out
            </button>
            <Link
              to="/shop"
              className="px-5 py-2.5 rounded-xl border border-stone-300 hover:border-amber-500 text-stone-700 text-sm font-semibold"
            >
              Browse books
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
