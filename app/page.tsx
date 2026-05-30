'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const API = 'http://localhost:8000';

export default function Home() {
  const [stats, setStats] = useState({ total_leads:0, active_deals:0, tasks_due:0, revenue:0 });
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);

  useEffect(()=>{
    fetch(API+'/stats').then(r=>r.json()).then(setStats);
    fetch(API+'/contacts').then(r=>r.json()).then(setContacts);
    fetch(API+'/deals').then(r=>r.json()).then(setDeals);
  },[]);

  const stages = ['New','Qualified','Proposal','Won'];

  return (
    <main className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col min-h-screen fixed top-0 left-0">
        <div className="px-4 py-5 text-lg font-bold border-b border-slate-700">Perm CRM</div>
        <nav className="flex-1 text-sm mt-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Dashboard</Link>
          <Link href="/contacts" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Contacts</Link>
          <Link href="/pipeline" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Pipeline</Link>
          <Link href="/calendar" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Calendar</Link>
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
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Welcome back</span>
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold">P</div>
          </div>
        </header>
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label:'Total Leads', value:stats.total_leads, color:'bg-blue-50 border-blue-200' },
              { label:'Active Deals', value:stats.active_deals, color:'bg-emerald-50 border-emerald-200' },
              { label:'Tasks Due', value:stats.tasks_due, color:'bg-amber-50 border-amber-200' },
              { label:'Revenue Won', value:'GBP '+stats.revenue.toLocaleString(), color:'bg-purple-50 border-purple-200' },
            ].map(k=>(
              <div key={k.label} className={"rounded-xl border p-4 "+k.color}>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">{k.label}</p>
                <p className="text-2xl font-bold text-slate-800">{k.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-3">Recent Contacts</h2>
              {contacts.length===0
                ? <p className="text-slate-400 text-sm">No contacts yet.</p>
                : <table className="w-full text-sm">
                    <thead><tr className="text-left text-slate-400 text-xs uppercase border-b"><th className="pb-2">Name</th><th className="pb-2">Status</th><th className="pb-2">Source</th></tr></thead>
                    <tbody>
                      {contacts.slice(0,5).map((c:any)=>(
                        <tr key={c.id} className="border-b last:border-0">
                          <td className="py-2 font-medium">{c.name}</td>
                          <td className="py-2"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{c.status}</span></td>
                          <td className="py-2 text-slate-400">{c.source}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-3">Pipeline Summary</h2>
              {deals.length===0
                ? <p className="text-slate-400 text-sm">No deals yet.</p>
                : stages.map(stage=>{
                    const col = deals.filter((d:any)=>d.stage===stage);
                    const total = col.reduce((a:number,b:any)=>a+(Number(b.value)||0),0);
                    return (
                      <div key={stage} className="flex items-center gap-3 mb-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-sm flex-1 font-medium">{stage}</span>
                        <span className="text-xs text-slate-400">{col.length} deals</span>
                        <span className="text-sm font-bold text-slate-700">GBP {total.toLocaleString()}</span>
                      </div>
                    );
                  })
              }
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

