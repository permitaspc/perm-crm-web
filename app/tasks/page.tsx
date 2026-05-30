'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = 'http://localhost:8000';
const pColors: Record<string,string> = { High:'bg-red-100 text-red-700', Medium:'bg-amber-100 text-amber-700', Low:'bg-blue-100 text-blue-700' };

export default function TasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title:'', due:'', priority:'Medium', assigned:'You', contact:'' });

  const load = () => fetch(API+'/tasks').then(r=>r.json()).then(setTasks).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if(!form.title) return;
    await fetch(API+'/tasks',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setForm({ title:'', due:'', priority:'Medium', assigned:'You', contact:'' });
    setShowForm(false);
    load();
  };

  const toggle = async (t:any) => {
    await fetch(API+'/tasks/'+t.id,{ method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify({...t, status:t.status==='Done'?'Pending':'Done'}) });
    load();
  };

  const del = async (id:string) => {
    await fetch(API+'/tasks/'+id,{ method:'DELETE' });
    load();
  };

  const filtered = filter==='All' ? tasks : tasks.filter(t=>t.status===filter);

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
          <Link href="/tasks" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Tasks</Link>
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
          <h1 className="text-xl font-bold text-slate-800">Tasks</h1>
          <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Add Task</button>
        </header>
        <div className="p-6">
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <h2 className="font-bold text-slate-700 mb-4">New Task</h2>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input className="border rounded-lg px-3 py-2 text-sm col-span-2" placeholder="Task title *" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Contact name" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} />
                <input type="date" className="border rounded-lg px-3 py-2 text-sm" value={form.due} onChange={e=>setForm({...form,due:e.target.value})} />
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.priority} onChange={e=>setForm({...form,priority:e.target.value})}>
                  <option>High</option><option>Medium</option><option>Low</option>
                </select>
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Assigned to" value={form.assigned} onChange={e=>setForm({...form,assigned:e.target.value})} />
              </div>
              <div className="flex gap-2">
                <button onClick={add} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save Task</button>
                <button onClick={()=>setShowForm(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}
          <div className="flex gap-2 mb-4">
            {['All','Pending','Done'].map(f=>(
              <button key={f} onClick={()=>setFilter(f)} className={"px-4 py-2 rounded-lg text-sm font-semibold "+(filter===f?'bg-emerald-700 text-white':'bg-white text-slate-600 border border-slate-200')}>{f}</button>
            ))}
            <span className="ml-auto text-sm text-slate-400 self-center">{filtered.length} tasks</span>
          </div>
          {loading ? <p className="text-slate-400 text-sm">Loading...</p> : (
          <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
            {filtered.length===0 && <p className="text-slate-400 text-sm p-8 text-center">No tasks yet. Click Add Task to get started.</p>}
            {filtered.map((t:any)=>(
              <div key={t.id} className="flex items-center gap-4 px-4 py-3 hover:bg-slate-50">
                <input type="checkbox" checked={t.status==='Done'} onChange={()=>toggle(t)} className="w-4 h-4 accent-emerald-600" />
                <div className="flex-1">
                  <p className={"font-medium text-sm "+(t.status==='Done'?'line-through text-slate-400':'text-slate-800')}>{t.title}</p>
                  <p className="text-xs text-slate-400">{t.contact} {t.due ? '- Due: '+t.due : ''}</p>
                </div>
                <span className={"text-xs px-2 py-0.5 rounded-full font-medium "+(pColors[t.priority]||'bg-slate-100')}>{t.priority}</span>
                <span className="text-xs text-slate-400">{t.assigned}</span>
                <button onClick={()=>del(t.id)} className="text-xs text-red-500 hover:text-red-700">Delete</button>
              </div>
            ))}
          </div>
          )}
        </div>
      </section>
    </main>
  );
}

