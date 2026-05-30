"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = "http://localhost:8000";
const typeColors: Record<string,string> = { Consultation:"bg-blue-100 text-blue-700", "Site Visit":"bg-amber-100 text-amber-700", Proposal:"bg-purple-100 text-purple-700", "Follow Up":"bg-emerald-100 text-emerald-700" };

export default function CalendarPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title:"", contact:"", date:"", time:"09:00", type:"Consultation" });

  const load = () => fetch(API+"/bookings").then(r=>r.json()).then(setBookings).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if(!form.title || !form.date) return;
    await fetch(API+"/bookings",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    setForm({ title:"", contact:"", date:"", time:"09:00", type:"Consultation" });
    setShowForm(false);
    load();
  };

  const del = async (id:string) => {
    await fetch(API+"/bookings/"+id,{ method:"DELETE" });
    load();
  };

  return (
    <main className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col min-h-screen fixed top-0 left-0">
        <div className="px-4 py-5 text-lg font-bold border-b border-slate-700">Perm CRM</div>
        <nav className="flex-1 text-sm mt-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Dashboard</Link>
          <Link href="/contacts" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Contacts</Link>
          <Link href="/pipeline" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Pipeline</Link>
          <Link href="/calendar" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Calendar</Link>
          <Link href="/inbox" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Inbox</Link>
          <Link href="/tasks" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Tasks</Link>
          <Link href="/campaigns" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Campaigns</Link>
          <Link href="/automation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Automation</Link>
          <Link href="/reputation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reputation</Link>
          <Link href="/reports" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reports</Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Settings</Link>
        </nav>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-700">Permitas CRM v1.0</div>
      </aside>
      <section className="flex-1 flex flex-col ml-60">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Calendar</h1>
          <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Book Appointment</button>
        </header>
        <div className="p-6">
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <h2 className="font-bold text-slate-700 mb-4">New Appointment</h2>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Title *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Contact Name" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} />
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option>Consultation</option><option>Site Visit</option><option>Proposal</option><option>Follow Up</option>
                </select>
                <input type="date" className="border rounded-lg px-3 py-2 text-sm" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
                <input type="time" className="border rounded-lg px-3 py-2 text-sm" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} />
              </div>
              <div className="flex gap-2">
                <button onClick={add} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                <button onClick={()=>setShowForm(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h2 className="font-bold text-slate-700 mb-4">Upcoming Appointments</h2>
            {loading ? <p className="text-slate-400 text-sm">Loading...</p> : bookings.length===0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">No appointments yet. Click Book Appointment to get started.</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((b:any)=>(
                  <div key={b.id} className="flex items-center gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50">
                    <div className="text-center bg-slate-100 rounded-lg px-3 py-2 min-w-16">
                      <p className="text-xs text-slate-400">{b.date}</p>
                      <p className="text-lg font-bold text-slate-800">{b.time}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{b.title}</p>
                      <p className="text-xs text-slate-400">{b.contact}</p>
                    </div>
                    <span className={"text-xs px-2 py-1 rounded-full font-medium "+(typeColors[b.type]||"bg-slate-100")}>{b.type}</span>
                    <button onClick={()=>del(b.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
