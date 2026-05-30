'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = 'http://localhost:8000';
const stages = ['New','Qualified','Consultation','Proposal','Won','Lost'];
const colors: Record<string,string> = { New:'bg-blue-100 text-blue-700', Qualified:'bg-amber-100 text-amber-700', Consultation:'bg-indigo-100 text-indigo-700', Proposal:'bg-purple-100 text-purple-700', Won:'bg-emerald-100 text-emerald-700', Lost:'bg-red-100 text-red-700' };

export default function PipelinePage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:'', value:'', stage:'New', company:'' });

  const load = () => fetch(API+'/deals').then(r=>r.json()).then(setDeals).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if(!form.name) return;
    await fetch(API+'/deals',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...form, value:Number(form.value)||0}) });
    setForm({ name:'', value:'', stage:'New', company:'' });
    setShowForm(false);
    load();
  };

  const move = async (id:string, stage:string) => {
    const deal = deals.find(d=>d.id===id);
    if(!deal) return;
    await fetch(API+'/deals/'+id,{ method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...deal, stage}) });
    load();
  };

  const del = async (id:string) => {
    await fetch(API+'/deals/'+id,{ method:'DELETE' });
    load();
  };

  return (
    <main className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col min-h-screen fixed top-0 left-0">
        <div className="px-4 py-5 text-lg font-bold border-b border-slate-700">Perm CRM</div>
        <nav className="flex-1 text-sm mt-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Dashboard</Link>
          <Link href="/contacts" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Contacts</Link>
          <Link href="/pipeline" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Pipeline</Link>
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
          <h1 className="text-xl font-bold text-slate-800">Pipeline</h1>
          <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Add Deal</button>
        </header>
        <div className="p-6">
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <h2 className="font-bold text-slate-700 mb-4">New Deal</h2>
              <div className="grid grid-cols-4 gap-3 mb-3">
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Deal name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Value (GBP)" value={form.value} onChange={e=>setForm({...form,value:e.target.value})} />
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.stage} onChange={e=>setForm({...form,stage:e.target.value})}>
                  {stages.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={add} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Deal</button>
                <button onClick={()=>setShowForm(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}
          {loading ? <p className="text-slate-400 text-sm">Loading...</p> : (
          <div className="overflow-x-auto">
            <div className="flex gap-4 min-w-max">
              {stages.map(stage=>{
                const col = deals.filter(d=>d.stage===stage);
                const total = col.reduce((a:number,b:any)=>a+(Number(b.value)||0),0);
                return (
                  <div key={stage} className="w-64">
                    <div className="flex items-center justify-between mb-3">
                      <span className={"text-xs font-bold px-2 py-1 rounded-full "+(colors[stage]||'bg-slate-100')}>{stage}</span>
                      <span className="text-xs text-slate-400">{col.length} | GBP {total.toLocaleString()}</span>
                    </div>
                    {col.length===0
                      ? <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center text-xs text-slate-300">Empty</div>
                      : col.map(d=>(
                        <div key={d.id} className="bg-white rounded-xl border border-slate-200 p-3 mb-3">
                          <p className="font-semibold text-sm text-slate-800">{d.name}</p>
                          <p className="text-xs text-slate-400 mb-1">{d.company}</p>
                          <p className="text-sm font-bold text-emerald-700 mb-2">GBP {Number(d.value).toLocaleString()}</p>
                          <select className="w-full text-xs border rounded px-2 py-1 mb-2" value={d.stage} onChange={e=>move(d.id,e.target.value)}>
                            {stages.map(s=><option key={s}>{s}</option>)}
                          </select>
                          <button onClick={()=>del(d.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
                        </div>
                      ))
                    }
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>
      </section>
    </main>
  );
}

