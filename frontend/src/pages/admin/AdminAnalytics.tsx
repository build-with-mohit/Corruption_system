import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import AdminSidebar from "../../components/AdminSidebar";
import { complaintsApi, type Analytics } from "../../api";
import { BarChart3 } from "lucide-react";

const COLORS = ["#687B69", "#C9A96E", "#4A5C4B", "#B5A48A", "#8A9E8B", "#9E9B95", "#242622"];

export default function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    complaintsApi
      .adminAnalytics()
      .then(setAnalytics)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center text-muted text-xs font-semibold">
          Compiling civic intelligence analytics...
        </main>
      </div>
    );
  }

  if (!analytics) return null;

  const pieData = analytics.category_distribution.map((c) => ({ name: c.category, value: c.count }));

  return (
    <div className="flex min-h-screen">
      <AdminSidebar totalComplaints={analytics.stats.total} />
      <main className="flex-1 overflow-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-resolved text-[11px] font-bold">Audit Intelligence</span>
            </div>
            <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Reports & Caseload Analytics</h1>
            <p className="text-xs text-muted font-medium">Departmental distribution patterns and corruption categorization metrics.</p>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/50 border border-white/70 text-charcoal/70 flex items-center gap-1.5 shadow-glass-sm">
            <BarChart3 size={14} className="text-sage" /> Real-time Telemetry
          </span>
        </div>

        {/* Stat Summary (Glass) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Cases", value: analytics.stats.total, color: "text-charcoal", sub: "All time records" },
            { label: "Pending Triage", value: analytics.stats.pending, color: "text-amber-700", sub: "Awaiting assignment" },
            { label: "Active Inquiry", value: analytics.stats.under_investigation, color: "text-blue-700", sub: "Assigned to officers" },
            { label: "Resolved Cases", value: analytics.stats.resolved, color: "text-emerald-700", sub: "Disciplinary action taken" },
          ].map((s) => (
            <div key={s.label} className="card-hover p-5 flex flex-col justify-between">
              <p className="text-xs text-muted font-semibold uppercase tracking-wider">{s.label}</p>
              <p className={`text-3xl font-extrabold my-2 font-mono ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-muted font-medium">{s.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category Distribution (Glass) */}
          <div className="card p-6 border border-white/70 shadow-glass">
            <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-4 pb-3 border-b border-white/60">
              Corruption Classification Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={70}
                  outerRadius={105}
                  paddingAngle={3}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Department-wise Bar Chart (Glass) */}
          <div className="card p-6 border border-white/70 shadow-glass">
            <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-4 pb-3 border-b border-white/60">
              Top Departments by Incident Volume
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={analytics.department_stats.slice(0, 8)}
                layout="vertical"
                margin={{ left: 16, right: 16 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.6)" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: "#8A8780" }} />
                <YAxis
                  type="category"
                  dataKey="department"
                  tick={{ fontSize: 10, fill: "#1F2320" }}
                  width={130}
                  tickFormatter={(v) => v.replace(" Department", "").replace(" Corporation", "")}
                />
                <Tooltip />
                <Bar dataKey="count" fill="#5B735D" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category table (Glass) */}
          <div className="card overflow-hidden border border-white/70 shadow-glass">
            <div className="px-6 py-4 border-b border-white/60 bg-white/30">
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Classification Breakdown</h2>
            </div>
            <table className="w-full">
              <thead className="bg-white/40 border-b border-white/50">
                <tr>
                  <th className="table-header">Category</th>
                  <th className="table-header text-right">Case Count</th>
                  <th className="table-header text-right">Percentage Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {analytics.category_distribution.map((cat, i) => (
                  <tr key={cat.category} className="table-row">
                    <td className="table-cell">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: COLORS[i % COLORS.length] }}
                        />
                        <span className="text-xs font-semibold text-charcoal">{cat.category}</span>
                      </div>
                    </td>
                    <td className="table-cell text-right font-mono font-bold text-charcoal text-xs">{cat.count}</td>
                    <td className="table-cell text-right font-mono text-muted text-xs">{cat.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Department table (Glass) */}
          <div className="card overflow-hidden border border-white/70 shadow-glass">
            <div className="px-6 py-4 border-b border-white/60 bg-white/30">
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Departmental Incidence Share</h2>
            </div>
            <table className="w-full">
              <thead className="bg-white/40 border-b border-white/50">
                <tr>
                  <th className="table-header">Department</th>
                  <th className="table-header text-right">Complaints</th>
                  <th className="table-header text-right">Caseload Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/40">
                {analytics.department_stats.slice(0, 10).map((dept) => (
                  <tr key={dept.department} className="table-row">
                    <td className="table-cell text-xs font-semibold text-charcoal">{dept.department}</td>
                    <td className="table-cell text-right font-mono font-bold text-charcoal text-xs">{dept.count}</td>
                    <td className="table-cell text-right font-mono text-muted text-xs">
                      {analytics.stats.total > 0
                        ? Math.round((dept.count / analytics.stats.total) * 100)
                        : 0}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
