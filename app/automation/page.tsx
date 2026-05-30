"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = "http://localhost:8000";

export default function AutomationPage() {
  const [automations, setAutomations] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:"", trigger:"New Contact Created" });

  const load = () => fetch(API+"/automations").then(r=>r.json()).then(setAutomations).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if(!form.name) return;
    await fetch(API+"/automations",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({...form, status:"Active", runs:0, actions:["Send Email"]}) });
    setForm({ name:"", trigger:"New Contact Created" });
    setShowForm(false);
    load();
  };

  const toggle = async (id:string) => {
    await fetch(API+"/automations/"+id+"/toggle",{ method:"PUT" });
    load();
  };

  const del = async (id:string) => {
    await fetch(API+"/automations/"+id,{ method:"DELETE" });
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
          <Link href="/calendar" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Calendar</Link>
          <Link href="/inbox" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Inbox</Link>
          <Link href="/tasks" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Tasks</Link>
          <Link href="/campaigns" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Campaigns</Link>
          <Link href="/automation" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Automation</Link>
          <Link href="/reputation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reputation</Link>
          <Link href="/reports" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reports</Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Settings</Link>
        </nav>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-700">Permitas CRM v1.0</div>
      </aside>
      <section className="flex-1 flex flex-col ml-60">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Automation</h1>
          <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ New Automation</button>
        </header>
        <div className="p-6">
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <h2 className="font-bold text-slate-700 mb-4">New Automation</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Automation name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.trigger} onChange={e=>setForm({...form,trigger:e.target.value})}>
                  <option>New Contact Created</option>
                  <option>Appointment Booked</option>
                  <option>Deal Stage Changed</option>
                  <option>No Activity 30 days</option>
                  <option>Form Submitted</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={add} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                <button onClick={()=>setShowForm(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label:"Total", value:automations.length },
              { label:"Active", value:automations.filter(a=>a.status==="Active").length },
              { label:"Paused", value:automations.filter(a=>a.status==="Paused").length },
            ].map(k=>(
              <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">{k.label}</p>
                <p className="text-2xl font-bold text-slate-800">{k.value}</p>
              </div>
            ))}
          </div>
          {loading ? <p className="text-slate-400 text-sm">Loading...</p> : automations.length===0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-400 text-sm">No automations yet. Click New Automation to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {automations.map((a:any)=>(
                <div key={a.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-slate-800">{a.name}</h3>
                      <p className="text-xs text-slate-400 mt-1">Trigger: {a.trigger}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={"text-xs px-2 py-1 rounded-full font-medium "+(a.status==="Active"?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-500")}>{a.status}</span>
                      <button onClick={()=>toggle(a.id)} className={"text-xs px-3 py-1 rounded-lg font-semibold "+(a.status==="Active"?"bg-amber-100 text-amber-700":"bg-emerald-100 text-emerald-700")}>{a.status==="Active"?"Pause":"Activate"}</button>
                      <button onClick={()=>del(a.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                  <div className="flex gap-4 text-xs text-slate-400 mt-2">
                    <span>Runs: <strong className="text-slate-600">{a.runs}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
