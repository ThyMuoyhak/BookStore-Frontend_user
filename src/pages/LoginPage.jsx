import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "../utils/toast";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast("Please enter your email and password", "error");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      toast("Welcome back!", "success");
      navigate(redirect, { replace: true });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-14">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
        <div className="text-center">
          <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-amber-500 text-white text-2xl shadow-sm">
            📚
          </span>
          <h1 className="font-display text-2xl font-semibold text-stone-900 mt-4">
            Welcome back
          </h1>
          <p className="text-stone-500 text-sm mt-1">Login to your BookStore account.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-stone-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold shadow-sm"
          >
            {submitting ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Don't have an account?{" "}
          <Link
            to={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-amber-600 hover:text-amber-700"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
