"use client";
import { useState } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [name, setName] = useState("Admin User");
  const [email, setEmail] = useState("admin@permitas.co.uk");
  const [phone, setPhone] = useState("+44 7000 000000");
  const [company, setCompany] = useState("Permitas");
  const [saved, setSaved] = useState(false);
  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  return (
    <main className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col min-h-screen fixed top-0 left-0">
        <div className="px-4 py-5 text-lg font-bold border-b border-slate-700">Perm CRM</div>
        <nav className="flex-1 text-sm mt-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Dashboard</Link>
          <Link href="/contacts" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Contacts</Link>
          <Link href="/pipeline" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Pipeline</Link>
          <Link href="/calendar" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Calendar</Link>
          <Link href="/inbox" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Inbox</Link>
          <Link href="/tasks" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Tasks</Link>
          <Link href="/campaigns" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Campaigns</Link>
          <Link href="/automation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Automation</Link>
          <Link href="/reputation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reputation</Link>
          <Link href="/reports" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reports</Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Settings</Link>
        </nav>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-700">Permitas CRM v1.0</div>
      </aside>
      <section className="flex-1 flex flex-col ml-60">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Settings</h1>
          {saved && <span className="text-sm text-emerald-600 font-semibold">Saved!</span>}
        </header>
        <div className="p-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-2xl">
            <h2 className="font-bold text-slate-800 mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Full Name</p>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={name} onChange={e => setName(e.target.value)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Email</p>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Phone</p>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={phone} onChange={e => setPhone(e.target.value)} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Company</p>
                <input className="w-full border rounded-lg px-3 py-2 text-sm" value={company} onChange={e => setCompany(e.target.value)} />
              </div>
              <button onClick={save} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Profile</button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
