import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { API } from "../api";
import { toast } from "../utils/toast";

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) {
      toast("Please fill in all required fields", "error");
      return;
    }
    if (username.trim().length < 3) {
      toast("Username must be at least 3 characters", "error");
      return;
    }
    if (password.length < 6) {
      toast("Password must be at least 6 characters", "error");
      return;
    }
    if (password !== confirm) {
      toast("Passwords do not match", "error");
      return;
    }
    setSubmitting(true);
    try {
      await API.signup({
        full_name: fullName.trim() || undefined,
        username: username.trim(),
        email: email.trim(),
        password,
      });
      await login(email.trim(), password); // auto-login after signup
      toast("Account created! Welcome to BookStore 🎉", "success");
      navigate(redirect, { replace: true });
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-2 focus:ring-amber-400 text-stone-800";
  const labelClass = "block text-sm font-semibold text-stone-700 mb-1.5";

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-14">
      <div className="bg-white rounded-3xl border border-stone-200 p-8 shadow-sm">
        <div className="text-center">
          <span className="inline-grid place-items-center w-12 h-12 rounded-2xl bg-amber-500 text-white text-2xl shadow-sm">
            📚
          </span>
          <h1 className="font-display text-2xl font-semibold text-stone-900 mt-4">
            Create your account
          </h1>
          <p className="text-stone-500 text-sm mt-1">Join BookStore in a few seconds.</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className={labelClass}>Full name (optional)</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              autoComplete="name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Username *</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_doe"
              autoComplete="username"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Confirm password *</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white font-semibold shadow-sm"
          >
            {submitting ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-stone-500">
          Already have an account?{" "}
          <Link
            to={`/login?redirect=${encodeURIComponent(redirect)}`}
            className="font-semibold text-amber-600 hover:text-amber-700"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
