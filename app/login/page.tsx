"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function LoginPage() {
  const [email, setEmail] = useState("planning@permitas.co.uk");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API+"/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { setError("Invalid email or password"); setLoading(false); return; }
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_name", data.name);
      localStorage.setItem("user_email", data.email);
      router.push("/");
    } catch(e) {
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Perm CRM</h1>
          <p className="text-slate-400">Permitas Planning Consultants</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Sign in</h2>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
          )}
          <form onSubmit={login} className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Email</p>
              <input type="email" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Password</p>
              <input type="password" className="w-full border border-slate-200 rounded-lg px-4 py-3 text-sm" value={password} onChange={e=>setPassword(e.target.value)} placeholder="permitas2026" required />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-emerald-700 text-white py-3 rounded-lg font-semibold text-sm hover:bg-emerald-800">
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs text-slate-500">Email: planning@permitas.co.uk</p>
            <p className="text-xs text-slate-500">Password: permitas2026</p>
          </div>
        </div>
      </div>
    </main>
  );
}
