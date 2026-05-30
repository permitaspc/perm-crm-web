'use client';
import Link from 'next/link';

const monthly = [
  { month:'Jan', leads:18, deals:8, revenue:12400 },
  { month:'Feb', leads:22, deals:11, revenue:15800 },
  { month:'Mar', leads:19, deals:9, revenue:13200 },
  { month:'Apr', leads:31, deals:14, revenue:21000 },
  { month:'May', leads:28, deals:12, revenue:18600 },
  { month:'Jun', leads:34, deals:16, revenue:24200 },
];

const team = [
  { name:'You', calls:34, emails:89, tasks:23, deals:12 },
  { name:'Sarah', calls:28, emails:67, tasks:18, deals:9 },
  { name:'James', calls:19, emails:45, tasks:14, deals:6 },
];

const sources = [
  { source:'Web', leads:45, pct:36 },
  { source:'Referral', leads:38, pct:31 },
  { source:'Email', leads:24, pct:19 },
  { source:'Phone', leads:17, pct:14 },
];

export default function ReportsPage() {
  const maxRevenue = Math.max(...monthly.map(m=>m.revenue));
  const maxLeads = Math.max(...monthly.map(m=>m.leads));

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
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { label:'Total Leads', value:'152', change:'+14%' },
              { label:'Conversion Rate', value:'31%', change:'+3%' },
              { label:'Total Revenue', value:'GBP 105,200', change:'+18%' },
              { label:'Avg Deal Value', value:'GBP 6,575', change:'+7%' },
            ].map(k => (
              <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-4">
                <p className="text-xs text-slate-400 uppercase font-semibold mb-1">{k.label}</p>
                <p className="text-2xl font-bold text-slate-800">{k.value}</p>
                <p className="text-xs text-emerald-600 mt-1">{k.change} vs last period</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-4">Monthly Revenue (GBP)</h2>
              <div className="flex items-end gap-2 h-40">
                {monthly.map(m => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-400">{(m.revenue/1000).toFixed(0)}k</span>
                    <div className="w-full bg-emerald-500 rounded-t-md" style={{height: (m.revenue/maxRevenue*120)+'px'}} />
                    <span className="text-xs text-slate-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-4">Monthly Leads</h2>
              <div className="flex items-end gap-2 h-40">
                {monthly.map(m => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs text-slate-400">{m.leads}</span>
                    <div className="w-full bg-blue-400 rounded-t-md" style={{height: (m.leads/maxLeads*120)+'px'}} />
                    <span className="text-xs text-slate-500">{m.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-4">Lead Sources</h2>
              <div className="space-y-3">
                {sources.map(s => (
                  <div key={s.source}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-700">{s.source}</span>
                      <span className="text-slate-400">{s.leads} leads ({s.pct}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{width:s.pct+'%'}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <h2 className="font-bold text-slate-700 mb-4">Team Activity</h2>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 text-xs uppercase border-b">
                    <th className="pb-2">Name</th>
                    <th className="pb-2">Calls</th>
                    <th className="pb-2">Emails</th>
                    <th className="pb-2">Tasks</th>
                    <th className="pb-2">Deals</th>
                  </tr>
                </thead>
                <tbody>
                  {team.map(t => (
                    <tr key={t.name} className="border-b last:border-0">
                      <td className="py-2 font-medium">{t.name}</td>
                      <td className="py-2 text-slate-500">{t.calls}</td>
                      <td className="py-2 text-slate-500">{t.emails}</td>
                      <td className="py-2 text-slate-500">{t.tasks}</td>
                      <td className="py-2 text-slate-500">{t.deals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
