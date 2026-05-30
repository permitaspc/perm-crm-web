"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function InboxPage() {
  const [messages, setMessages] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [contact, setContact] = useState("");
  const [newMsg, setNewMsg] = useState("");
  const [channel, setChannel] = useState("Email");
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch(API+"/messages").then(r=>r.json()).then((d:any[])=>{
    setMessages(d);
    if(d.length>0 && !selected) setSelected(d[d.length-1]);
  }).finally(()=>setLoading(false));

  useEffect(()=>{ load(); },[]);

  const send = async () => {
    if(!reply.trim() || !selected) return;
    await fetch(API+"/messages",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ contact:selected.contact, message:reply, channel:selected.channel, direction:"outbound" }) });
    setReply("");
    load();
  };

  const addNew = async () => {
    if(!contact || !newMsg) return;
    await fetch(API+"/messages",{ method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ contact, message:newMsg, channel, direction:"inbound" }) });
    setContact(""); setNewMsg(""); setShowForm(false);
    load();
  };

  const contacts = [...new Map(messages.map(m=>[m.contact,m])).values()];
  const thread = selected ? messages.filter(m=>m.contact===selected.contact) : [];
  const chColors: Record<string,string> = { Email:"bg-blue-100 text-blue-700", SMS:"bg-emerald-100 text-emerald-700", WhatsApp:"bg-green-100 text-green-700" };

  return (
    <main className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col min-h-screen fixed top-0 left-0">
        <div className="px-4 py-5 text-lg font-bold border-b border-slate-700">Perm CRM</div>
        <nav className="flex-1 text-sm mt-2">
          <Link href="/" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Dashboard</Link>
          <Link href="/contacts" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Contacts</Link>
          <Link href="/pipeline" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Pipeline</Link>
          <Link href="/calendar" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Calendar</Link>
          <Link href="/inbox" className="flex items-center gap-2 px-4 py-3 bg-slate-700 font-semibold">Inbox</Link>
          <Link href="/tasks" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Tasks</Link>
          <Link href="/campaigns" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Campaigns</Link>
          <Link href="/automation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Automation</Link>
          <Link href="/reputation" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reputation</Link>
          <Link href="/reports" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Reports</Link>
          <Link href="/settings" className="flex items-center gap-2 px-4 py-3 hover:bg-slate-800">Settings</Link>
        </nav>
        <div className="px-4 py-3 text-xs text-slate-400 border-t border-slate-700">Permitas CRM v1.0</div>
      </aside>
      <section className="flex-1 flex ml-60 overflow-hidden" style={{height:"100vh"}}>
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-slate-800">Inbox</h1>
              <p className="text-xs text-slate-400">{contacts.length} conversations</p>
            </div>
            <button onClick={()=>setShowForm(!showForm)} className="bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-semibold">+ New</button>
          </div>
          {showForm && (
            <div className="p-3 border-b bg-slate-50 space-y-2">
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Contact name *" value={contact} onChange={e=>setContact(e.target.value)} />
              <input className="w-full border rounded px-2 py-1 text-xs" placeholder="Message *" value={newMsg} onChange={e=>setNewMsg(e.target.value)} />
              <select className="w-full border rounded px-2 py-1 text-xs" value={channel} onChange={e=>setChannel(e.target.value)}>
                <option>Email</option><option>SMS</option><option>WhatsApp</option>
              </select>
              <button onClick={addNew} className="w-full bg-emerald-700 text-white py-1 rounded text-xs font-semibold">Send</button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            {loading ? <p className="text-xs text-slate-400 p-4">Loading...</p> :
             contacts.length===0 ? <p className="text-xs text-slate-400 p-4">No messages yet. Click New to start.</p> :
             contacts.map((m:any)=>(
              <div key={m.contact} onClick={()=>setSelected(m)} className={"px-4 py-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 "+(selected?.contact===m.contact?"bg-slate-100":"")}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{m.contact[0]?.toUpperCase()}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800">{m.contact}</p>
                    <p className="text-xs text-slate-400 truncate">{m.message}</p>
                  </div>
                </div>
                <span className={"text-xs px-2 py-0.5 rounded-full mt-1 inline-block "+(chColors[m.channel]||"bg-slate-100")}>{m.channel}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col">
          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-slate-400">Select a conversation</div>
          ) : (
            <>
              <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm font-bold">{selected.contact[0]?.toUpperCase()}</div>
                <div>
                  <p className="font-semibold text-slate-800">{selected.contact}</p>
                  <span className={"text-xs px-2 py-0.5 rounded-full "+(chColors[selected.channel]||"bg-slate-100")}>{selected.channel}</span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {thread.map((m:any)=>(
                  <div key={m.id} className={"flex "+(m.direction==="outbound"?"justify-end":"justify-start")}>
                    <div className={"max-w-xs px-4 py-2 rounded-2xl text-sm "+(m.direction==="outbound"?"bg-emerald-700 text-white":"bg-white border border-slate-200 text-slate-800")}>
                      <p>{m.message}</p>
                      <p className={"text-xs mt-1 "+(m.direction==="outbound"?"text-emerald-200":"text-slate-400")}>{m.created_at ? new Date(m.created_at).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"}) : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white border-t border-slate-200 px-4 py-3 flex gap-2">
                <input className="flex-1 border rounded-xl px-4 py-2 text-sm" placeholder="Type a message..." value={reply} onChange={e=>setReply(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} />
                <button onClick={send} className="bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold">Send</button>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

