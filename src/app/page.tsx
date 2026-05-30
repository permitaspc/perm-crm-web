import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex bg-slate-100">
      <aside className="w-60 bg-slate-900 text-slate-50 flex flex-col min-h-screen">
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
      <section className="flex-1 flex flex-col">
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
              { label: "Total Leads", value: "124", change: "+12%", color: "bg-blue-50 border-blue-200" },
              { label: "Active Deals", value: "38", change: "+5%", color: "bg-emerald-50 border-emerald-200" },
              { label: "Tasks Due", value: "9", change: "-3", color: "bg-amber-50 border-amber-200" },
              { label: "Revenue", value: "GBP 48200", change: "+18%", color: "bg-purple-50 border-purple-200" },
            ].map((kpi) => (
              <div key={kpi.label} className={"rounded-xl border p-4 " + kpi.color}>
                <p className="text-xs text-slate-500 uppercase font-semibold mb-1">{kpi.label}</p>
                <p className="text-2xl font-bold text-slate-800">{kpi.value}</p>
                <p className="text-xs text-slate-500 mt-1">{kpi.change} this month</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-3">Recent Contacts</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase border-b">
                    <th className="pb-2">Name</th><th className="pb-2">Status</th><th className="pb-2">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Alice Builder", status: "New", source: "Web" },
                    { name: "Bob Loft", status: "Qualified", source: "Referral" },
                    { name: "Carol Plans", status: "Proposal", source: "Email" },
                    { name: "David Ext", status: "Won", source: "Phone" },
                  ].map((c) => (
                    <tr key={c.name} className="border-b last:border-0">
                      <td className="py-2 font-medium">{c.name}</td>
                      <td className="py-2"><span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{c.status}</span></td>
                      <td className="py-2 text-slate-400">{c.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-3">Pipeline Summary</h2>
              {[
                { stage: "New", count: 34, value: "12400", color: "bg-blue-400" },
                { stage: "Qualified", count: 22, value: "18900", color: "bg-amber-400" },
                { stage: "Proposal", count: 15, value: "9200", color: "bg-purple-400" },
                { stage: "Won", count: 8, value: "7700", color: "bg-emerald-500" },
              ].map((s) => (
                <div key={s.stage} className="flex items-center gap-3 mb-3">
                  <div className={"w-2 h-2 rounded-full " + s.color} />
                  <span className="text-sm flex-1 font-medium">{s.stage}</span>
                  <span className="text-xs text-slate-400">{s.count} deals</span>
                  <span className="text-sm font-bold text-slate-700">GBP {s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
