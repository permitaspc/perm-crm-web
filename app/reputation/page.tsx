"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = "http://localhost:8000";

export default function ReputationPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showRequest, setShowRequest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<Record<string,string>>({});
  const [showReply, setShowReply] = useState<string|null>(null);
  const [form, setForm] = useState({ contact:"", rating:5, source:"Google", review:"" });

  const load = () => fetch(API+"/reviews").then(r=>r.json()).then(setReviews).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const add = async () => {
    if(!form.contact) return;
    await fetch(API+"/reviews",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(form) });
    setForm({ contact:"", rating:5, source:"Google", review:"" });
    setShowForm(false);
    load();
  };

  const reply = async (id:string) => {
    await fetch(API+"/reviews/"+id+"/reply",{ method:"PUT" });
    setShowReply(null);
    load();
  };

  const avg = reviews.length>0 ? (reviews.reduce((a,b)=>a+b.rating,0)/reviews.length).toFixed(1) : "0.0";
  const stars = (n:number) => Array.from({length:5},(_,i)=><span key={i} className={i<n?"text-amber-400":"text-slate-200"}>★</span>);

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
          <Link href="/reputation" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Reputation</Link>
          <Link href="/reports" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reports</Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Settings</Link>
        </nav>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-700">Permitas CRM v1.0</div>
      </aside>
      <section className="flex-1 flex flex-col ml-60">
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold text-slate-800">Reputation</h1>
          <div className="flex gap-2">
            <button onClick={()=>setShowRequest(!showRequest)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">Request Review</button>
            <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">+ Add Review</button>
          </div>
        </header>
        <div className="p-6">
          {showRequest && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h2 className="font-bold text-blue-800 mb-2">Send Review Request</h2>
              <p className="text-sm text-blue-600 mb-3">Enter contact details to send a review request via SMS or Email.</p>
              <div className="grid grid-cols-3 gap-3">
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Contact name" />
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Email or Phone" />
                <button onClick={()=>setShowRequest(false)} className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Send Request</button>
              </div>
            </div>
          )}
          {showForm && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
              <h2 className="font-bold text-slate-700 mb-4">Add Review</h2>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Contact name *" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} />
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.source} onChange={e=>setForm({...form,source:e.target.value})}>
                  <option>Google</option><option>Facebook</option><option>Trustpilot</option>
                </select>
                <select className="border rounded-lg px-3 py-2 text-sm" value={form.rating} onChange={e=>setForm({...form,rating:Number(e.target.value)})}>
                  <option value={5}>5 Stars</option><option value={4}>4 Stars</option><option value={3}>3 Stars</option><option value={2}>2 Stars</option><option value={1}>1 Star</option>
                </select>
                <input className="border rounded-lg px-3 py-2 text-sm" placeholder="Review text" value={form.review} onChange={e=>setForm({...form,review:e.target.value})} />
              </div>
              <div className="flex gap-2">
                <button onClick={add} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Save</button>
                <button onClick={()=>setShowForm(false)} className="bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">Cancel</button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label:"Avg Rating", value:avg+" / 5" },
              { label:"Total Reviews", value:reviews.length },
              { label:"5 Star", value:reviews.filter(r=>r.rating===5).length },
              { label:"Needs Reply", value:reviews.filter(r=>!r.replied).length },
            ].map(k=>(
              <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">{k.label}</p>
                <p className="text-2xl font-bold text-slate-800">{k.value}</p>
              </div>
            ))}
          </div>
          {loading ? <p className="text-slate-400 text-sm">Loading...</p> : reviews.length===0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <p className="text-slate-400 text-sm">No reviews yet. Click Add Review to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((r:any)=>(
                <div key={r.id} className="bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-bold text-slate-800">{r.contact}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-lg">{stars(r.rating)}</div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">{r.source}</span>
                        <span className="text-xs text-slate-400">{r.date}</span>
                      </div>
                    </div>
                    <span className={"text-xs px-2 py-1 rounded-full font-medium "+(r.replied?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700")}>{r.replied?"Replied":"Needs Reply"}</span>
                  </div>
                  <p className="text-sm text-slate-600 mb-3">{r.review}</p>
                  {!r.replied && (
                    showReply===r.id ? (
                      <div className="flex gap-2">
                        <input className="flex-1 border rounded-lg px-3 py-2 text-sm" placeholder="Write your reply..." value={replyText[r.id]||""} onChange={e=>setReplyText({...replyText,[r.id]:e.target.value})} />
                        <button onClick={()=>reply(r.id)} className="bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">Send</button>
                        <button onClick={()=>setShowReply(null)} className="bg-slate-200 text-slate-600 px-3 py-2 rounded-lg text-sm">Cancel</button>
                      </div>
                    ) : (
                      <button onClick={()=>setShowReply(r.id)} className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg font-semibold">Reply</button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
