"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        redirectTo: "/admin/dashboard",
      });

      if (!result) {
        setError("Unable to sign in.");
        return;
      }

      if (result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(result.url || "/admin/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-10 bg-amber-300" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="h-px w-10 bg-amber-300" />
          </div>
          <h1
            className="text-3xl text-stone-800 mb-1"
            style={{ fontFamily: "Georgia, serif" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-stone-400 text-sm">
            Anniversary App · Organizer Access
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white border border-stone-200 rounded p-8 space-y-5 shadow-sm"
        >
          <div>
            <label className="block text-stone-600 text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-2.5 border border-stone-200 rounded text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-stone-600 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-stone-200 rounded text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-200"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-stone-200 disabled:text-stone-400 text-white text-sm tracking-widest uppercase transition-colors rounded"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
