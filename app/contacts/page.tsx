'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const API = 'http://localhost:8000';
const statusColors: Record<string,string> = { New:'bg-blue-100 text-blue-700', Qualified:'bg-amber-100 text-amber-700', Proposal:'bg-purple-100 text-purple-700', Won:'bg-emerald-100 text-emerald-700' };

export default function ContactsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:'', email:'', phone:'', company:'', status:'New', source:'Web' });

  const load = () => fetch(API+'/contacts').then(r=>r.json()).then(setContacts).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if(!form.name) return;
    await fetch(API+'/contacts',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(form) });
    setForm({ name:'', email:'', phone:'', company:'', status:'New', source:'Web' });
    setShowForm(false);
    load();
  };

  const del = async (id:string) => {
    await fetch(API+'/contacts/'+id,{ method:'DELETE' });
    load();
  };

  const filtered = contacts.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col min-h-screen fixed top-0 left-0">
        <div className="px-4 py-5 text-lg font-bold border-b border-slate-700">Perm CRM</div>
        <nav className="flex-1 text-sm mt-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Dashboard</Link>
          <Link href="/contacts" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Contacts</Link>
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
          <h1 className="text-xl font-bold text-slate-800">Contacts</h1>
          <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Add Contact</button>
        </header>
        <div className="p-6">
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <h2 className="font-bold text-slate-700 mb-4">New Contact</h2>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Full Name *" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Company" value={form.company} onChange={e=>setForm({...form,company:e.target.value})} />
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                  <option>New</option><option>Qualified</option><option>Proposal</option><option>Won</option>
                </select>
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>
                  <option>Web</option><option>Referral</option><option>Email</option><option>Phone</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={add} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                <button onClick={()=>setShowForm(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <input className="border rounded-lg px-3 py-2 text-sm w-72" placeholder="Search contacts..." value={search} onChange={e=>setSearch(e.target.value)} />
              <span className="text-sm text-slate-500">{filtered.length} contacts</span>
            </div>
            {loading ? <p className="text-slate-400 text-sm py-8 text-center">Loading...</p> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-slate-400 text-xs uppercase border-b">
                <th className="pb-3">Name</th><th className="pb-3">Email</th><th className="pb-3">Phone</th><th className="pb-3">Company</th><th className="pb-3">Status</th><th className="pb-3">Source</th><th className="pb-3">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.length===0 && <tr><td colSpan={7} className="py-8 text-center text-slate-400">No contacts yet. Click Add Contact to get started.</td></tr>}
                {filtered.map((c:any)=>(
                  <tr key={c.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="py-3 font-medium">{c.name}</td>
                    <td className="py-3 text-slate-500">{c.email}</td>
                    <td className="py-3 text-slate-500">{c.phone}</td>
                    <td className="py-3 text-slate-500">{c.company}</td>
                    <td className="py-3"><span className={"text-xs px-2 py-0.5 rounded-full font-medium "+(statusColors[c.status]||'bg-slate-100 text-slate-700')}>{c.status}</span></td>
                    <td className="py-3 text-slate-500">{c.source}</td>
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
