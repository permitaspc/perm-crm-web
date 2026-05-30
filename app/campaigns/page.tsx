"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";
const statusColors: Record<string,string> = { Sent:"bg-emerald-100 text-emerald-700", Draft:"bg-slate-100 text-slate-600", Scheduled:"bg-blue-100 text-blue-700" };
const typeColors: Record<string,string> = { Email:"bg-purple-100 text-purple-700", SMS:"bg-amber-100 text-amber-700", WhatsApp:"bg-green-100 text-green-700" };

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:"", type:"Email", status:"Draft", date:"" });

  const load = () => fetch(API+"/campaigns").then(r=>r.json()).then(setCampaigns).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if(!form.name) return;
    await fetch(API+"/campaigns",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    setForm({ name:"", type:"Email", status:"Draft", date:"" });
    setShowForm(false);
    load();
  };

  const del = async (id:string) => {
    await fetch(API+"/campaigns/"+id,{ method:"DELETE" });
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
          <Link href="/campaigns" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Campaigns</Link>
          <Link href="/automation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Automation</Link>
          <Link href="/reputation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reputation</Link>
          <Link href="/reports" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reports</Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Settings</Link>
        </nav>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-700">Permitas CRM v1.0</div>
      </aside>
      <section className="flex-1 flex flex-col ml-60">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Campaigns</h1>
          <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ New Campaign</button>
        </header>
        <div className="p-6">
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <h2 className="font-bold text-slate-700 mb-4">New Campaign</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className="border rounded-lg px-3 py-2 text-sm col-span-2" placeholder="Campaign name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                  <option>Email</option><option>SMS</option><option>WhatsApp</option>
                </select>
                <input type="date" className="border rounded-lg px-3 py-2 text-sm" value={form.date} onChange={e=>setForm({...form,date:e.target.value})} />
              </div>
              <div className="flex gap-2">
                <button onClick={add} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                <button onClick={()=>setShowForm(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label:"Total", value:campaigns.length },
              { label:"Sent", value:campaigns.filter(c=>c.status==="Sent").length },
              { label:"Scheduled", value:campaigns.filter(c=>c.status==="Scheduled").length },
              { label:"Drafts", value:campaigns.filter(c=>c.status==="Draft").length },
            ].map(k=>(
              <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">{k.label}</p>
                <p className="text-2xl font-bold text-slate-800">{k.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            {loading ? <p className="text-slate-400 text-sm">Loading...</p> : campaigns.length===0 ? (
              <p className="text-slate-400 text-sm py-8 text-center">No campaigns yet. Click New Campaign to get started.</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase border-b">
                    <th className="pb-3">Name</th><th className="pb-3">Type</th><th className="pb-3">Status</th><th className="pb-3">Date</th><th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.map((c:any)=>(
                    <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                      <td className="py-3 font-medium">{c.name}</td>
                      <td className="py-3"><span className={"text-xs px-2 py-0.5 rounded-full font-medium "+(typeColors[c.type]||"")}>{c.type}</span></td>
                      <td className="py-3"><span className={"text-xs px-2 py-0.5 rounded-full font-medium "+(statusColors[c.status]||"")}>{c.status}</span></td>
                      <td className="py-3 text-slate-400">{c.date}</td>
                      <td className="py-3"><button onClick={()=>del(c.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

