"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ReportsPage() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    Promise.all([
      fetch(API+"/contacts").then(r=>r.json()),
      fetch(API+"/deals").then(r=>r.json()),
      fetch(API+"/tasks").then(r=>r.json()),
      fetch(API+"/campaigns").then(r=>r.json()),
    ]).then(([c,d,t,camp])=>{
      setContacts(c); setDeals(d); setTasks(t); setCampaigns(camp);
    }).finally(()=>setLoading(false));
  },[]);

  const totalRevenue = deals.filter(d=>d.stage==="Won").reduce((a:number,b:any)=>a+(Number(b.value)||0),0);
  const activeDeals = deals.filter(d=>!["Won","Lost"].includes(d.stage));
  const convRate = deals.length>0 ? ((deals.filter(d=>d.stage==="Won").length/deals.length)*100).toFixed(0) : 0;
  const avgDeal = deals.filter(d=>d.stage==="Won").length>0 ? (totalRevenue/deals.filter(d=>d.stage==="Won").length).toFixed(0) : 0;

  const stages = ["New","Qualified","Consultation","Proposal","Won","Lost"];
  const sources = [...new Set(contacts.map((c:any)=>c.source))].map(s=>({
    source: s,
    leads: contacts.filter((c:any)=>c.source===s).length,
    pct: Math.round((contacts.filter((c:any)=>c.source===s).length/contacts.length)*100)||0
  }));

  const maxDeals = Math.max(...stages.map(s=>deals.filter(d=>d.stage===s).length),1);

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
          <Link href="/reports" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Reports</Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Settings</Link>
        </nav>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-700">Permitas CRM v1.0</div>
      </aside>
      <section className="flex-1 flex flex-col ml-60">
        <header className="bg-white border-b border-slate-200 px-6 py-3">
          <h1 className="text-xl font-bold text-slate-800">Reports</h1>
        </header>
        <div className="p-6">
          {loading ? <p className="text-slate-400 text-sm">Loading...</p> : (
          <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label:"Total Contacts", value:contacts.length },
              { label:"Conversion Rate", value:convRate+"%" },
              { label:"Total Revenue", value:"GBP "+totalRevenue.toLocaleString() },
              { label:"Avg Deal Value", value:"GBP "+Number(avgDeal).toLocaleString() },
            ].map(k=>(
              <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">{k.label}</p>
                <p className="text-2xl font-bold text-slate-800">{k.value}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-4">Deals by Stage</h2>
              {deals.length===0 ? <p className="text-slate-400 text-sm">No deals yet.</p> : (
              <div className="space-y-3">
                {stages.map(stage=>{
                  const count = deals.filter(d=>d.stage===stage).length;
                  const val = deals.filter(d=>d.stage===stage).reduce((a:number,b:any)=>a+(Number(b.value)||0),0);
                  return (
                    <div key={stage}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-slate-700">{stage}</span>
                        <span className="text-slate-400">{count} deals - GBP {val.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{width:(count/maxDeals*100)+"%"}} />
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-4">Lead Sources</h2>
              {contacts.length===0 ? <p className="text-slate-400 text-sm">No contacts yet.</p> : (
              <div className="space-y-3">
                {sources.map((s:any)=>(
                  <div key={s.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{s.source}</span>
                      <span className="text-slate-400">{s.leads} leads ({s.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-blue-400 h-2 rounded-full" style={{width:s.pct+"%"}} />
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-4">Task Summary</h2>
              {tasks.length===0 ? <p className="text-slate-400 text-sm">No tasks yet.</p> : (
              <div className="space-y-3">
                {[
                  { label:"Total Tasks", value:tasks.length, color:"bg-blue-400" },
                  { label:"Pending", value:tasks.filter(t=>t.status==="Pending").length, color:"bg-amber-400" },
                  { label:"Completed", value:tasks.filter(t=>t.status==="Done").length, color:"bg-emerald-500" },
                  { label:"High Priority", value:tasks.filter(t=>t.priority==="High").length, color:"bg-red-400" },
                ].map(s=>(
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={"w-3 h-3 rounded-full "+s.color} />
                    <span className="text-sm flex-1 text-slate-700">{s.label}</span>
                    <span className="text-sm font-bold text-slate-800">{s.value}</span>
                  </div>
                ))}
              </div>
              )}
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-4">Campaign Summary</h2>
              {campaigns.length===0 ? <p className="text-slate-400 text-sm">No campaigns yet.</p> : (
              <div className="space-y-3">
                {[
                  { label:"Total Campaigns", value:campaigns.length, color:"bg-purple-400" },
                  { label:"Sent", value:campaigns.filter(c=>c.status==="Sent").length, color:"bg-emerald-500" },
                  { label:"Scheduled", value:campaigns.filter(c=>c.status==="Scheduled").length, color:"bg-blue-400" },
                  { label:"Drafts", value:campaigns.filter(c=>c.status==="Draft").length, color:"bg-slate-400" },
                ].map(s=>(
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={"w-3 h-3 rounded-full "+s.color} />
                    <span className="text-sm flex-1 text-slate-700">{s.label}</span>
                    <span className="text-sm font-bold text-slate-800">{s.value}</span>
                  </div>
                ))}
              </div>
              )}
            </div>
          </div>
          </>
          )}
        </div>
      </section>
    </main>
  );
}
