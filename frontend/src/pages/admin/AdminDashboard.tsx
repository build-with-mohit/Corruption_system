import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from "recharts";
import AdminSidebar from "../../components/AdminSidebar";
import { complaintsApi, type Analytics, type Complaint } from "../../api";
import { getStatusBadge, formatDate } from "../../utils/helpers";
import { useAuth } from "../../contexts/AuthContext";
import { Bell, Search, UserCheck, RefreshCw, FileBarChart, Eye, ShieldAlert } from "lucide-react";

const COLORS = ["#687B69", "#C9A96E", "#4A5C4B", "#B5A48A", "#E2DED8"];

const quickActions = [
  { icon: UserCheck, label: "Assign Officer", desc: "Allocate complaints to officers", to: "/admin/complaints" },
  { icon: RefreshCw, label: "Update Status", desc: "Change complaint stage", to: "/admin/complaints" },
  { icon: Eye, label: "View Evidence", desc: "Access submitted proofs", to: "/admin/complaints" },
  { icon: FileBarChart, label: "Generate Report", desc: "Audit and analytics reports", to: "/admin/analytics" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [recentComplaints, setRecentComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      complaintsApi.adminAnalytics(),
      complaintsApi.adminGetAll({ page: 1, limit: 5 }),
    ])
      .then(([a, c]) => {
        setAnalytics(a);
        setRecentComplaints(c.items);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short", day: "2-digit", month: "short", year: "numeric",
  });

  const statCards = analytics
    ? [
        {
          label: "Total Complaints",
          value: analytics.stats.total,
          change: analytics.stats.total_change,
          color: "text-charcoal",
          tag: "Dossiers Filed",
        },
        {
          label: "Pending Review",
          value: analytics.stats.pending,
          change: analytics.stats.pending_change,
          color: "text-amber-700",
          tag: "Triage Required",
        },
        {
          label: "In Investigation",
          value: analytics.stats.under_investigation,
          change: analytics.stats.under_investigation_change,
          color: "text-blue-700",
          tag: "Active Inquiry",
        },
        {
          label: "Resolved",
          value: analytics.stats.resolved,
          change: analytics.stats.resolved_change,
          color: "text-emerald-700",
          tag: "Legally Concluded",
        },
      ]
    : [];

  const maxDept = Math.max(...(analytics?.department_stats.map((d) => d.count) || [1]));

  return (
    <div className="flex min-h-screen">
      <AdminSidebar totalComplaints={analytics?.stats.total} />

      <main className="flex-1 overflow-auto">
        {/* Top bar (Glass) */}
        <div className="flex items-center gap-4 px-8 py-3.5 border-b border-white/60 glass-nav sticky top-0 z-20">
          <div className="flex-1 relative max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search complaints, tracking IDs, or accused departments..."
              className="input pl-9 text-xs py-2"
            />
          </div>
          <div className="flex-1" />
          <button className="p-2 rounded-xl bg-white/50 border border-white/70 shadow-glass-sm hover:bg-white text-charcoal relative">
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          </button>
          <div className="flex items-center gap-2.5 p-1.5 rounded-full bg-white/50 border border-white/70 shadow-glass-sm">
            <div className="w-8 h-8 rounded-full bg-charcoal text-white flex items-center justify-center font-bold text-xs">
              {user?.full_name?.slice(0, 2).toUpperCase()}
            </div>
            <div className="hidden sm:block pr-2">
              <p className="text-xs font-bold text-charcoal leading-none">{user?.full_name}</p>
              <p className="text-[10px] text-muted font-medium mt-0.5">Administrator</p>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-resolved text-[11px] font-bold">Investigation Intelligence</span>
              </div>
              <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Admin Executive Overview</h1>
              <p className="text-xs text-muted font-medium">Monitoring civic integrity, triage timelines, and departmental corruption indexes.</p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/50 border border-white/70 text-charcoal/70">
                {today}
              </span>
            </div>
          </div>

          {/* Stat Cards (Glass) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {loading
              ? Array(4).fill(0).map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse border border-white/70">
                    <div className="h-3 bg-white/60 rounded w-24 mb-3" />
                    <div className="h-8 bg-white/60 rounded w-16 mb-2" />
                    <div className="h-3 bg-white/60 rounded w-20" />
                  </div>
                ))
              : statCards.map((s) => (
                  <div key={s.label} className="card-hover p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-muted font-semibold uppercase tracking-wider">{s.label}</p>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/60 text-charcoal/60">
                        {s.tag}
                      </span>
                    </div>
                    <p className={`text-3xl font-extrabold my-2 font-mono ${s.color}`}>{s.value}</p>
                    <p className={`text-[11px] font-semibold flex items-center gap-1 ${s.change >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      {s.change >= 0 ? "↑" : "↓"} {Math.abs(s.change)}% trend vs 30d
                    </p>
                  </div>
                ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left: Category chart + Recent complaints */}
            <div className="xl:col-span-2 space-y-6">
              {/* Category Donut (Glass) */}
              <div className="card p-6 border border-white/70 shadow-glass">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/60">
                  <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Complaint Classification Breakdown</h2>
                  <span className="text-xs text-muted font-mono">{analytics?.stats.total} Total Cases</span>
                </div>
                {!loading && analytics && (
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-48 h-48 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.category_distribution}
                            dataKey="count"
                            nameKey="category"
                            innerRadius={50}
                            outerRadius={78}
                            paddingAngle={3}
                          >
                            {analytics.category_distribution.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v, name) => [v, name]} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex-1 min-w-0 space-y-2">
                      {analytics.category_distribution.map((cat, i) => (
                        <div key={cat.category} className="flex items-center gap-2.5 text-xs p-2 rounded-xl bg-white/40 border border-white/50">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-charcoal/80 font-medium flex-1 truncate">{cat.category}</span>
                          <span className="font-bold font-mono text-charcoal w-6 text-right">{cat.count}</span>
                          <span className="text-muted font-mono text-[11px] w-10 text-right">{cat.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Complaints Table (Glass) */}
              <div className="card overflow-hidden border border-white/70 shadow-glass">
                <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/60 bg-white/30">
                  <h2 className="text-sm font-bold text-charcoal">Recent Filed Complaints</h2>
                  <Link to="/admin/complaints" className="text-xs font-semibold text-sage hover:text-charcoal flex items-center gap-1">
                    Manage all cases &rarr;
                  </Link>
                </div>
                {loading ? (
                  <div className="p-8 text-center text-sm text-muted">Loading complaints...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white/40 border-b border-white/50">
                        <tr>
                          <th className="table-header">Case ID</th>
                          <th className="table-header">Category</th>
                          <th className="table-header hidden md:table-cell">Target Dept</th>
                          <th className="table-header hidden sm:table-cell">Date</th>
                          <th className="table-header">Status</th>
                          <th className="table-header hidden lg:table-cell">Assigned Officer</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/40">
                        {recentComplaints.map((c) => {
                          const badge = getStatusBadge(c.status);
                          return (
                            <tr
                              key={c.id}
                              className="table-row cursor-pointer"
                              onClick={() => window.location.href = `/admin/complaints/${c.complaint_id}`}
                            >
                              <td className="table-cell font-mono font-bold text-sage text-xs">{c.complaint_id}</td>
                              <td className="table-cell text-xs font-medium">{c.category}</td>
                              <td className="table-cell hidden md:table-cell text-xs text-muted">
                                {c.department.replace(" Department", "").replace(" Corporation", " Corp")}
                              </td>
                              <td className="table-cell hidden sm:table-cell text-xs text-muted">{formatDate(c.created_at)}</td>
                              <td className="table-cell">
                                <span className={badge.className}>{badge.label}</span>
                              </td>
                              <td className="table-cell hidden lg:table-cell text-xs text-muted font-medium">
                                {c.assigned_officer?.full_name?.split(" ").pop() || "Unassigned"}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Department stats + Quick actions */}
            <div className="space-y-6">
              {/* Department stats (Glass) */}
              <div className="card p-6 border border-white/70 shadow-glass space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                  <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Departmental Incident Density</h2>
                  <ShieldAlert size={14} className="text-amber-600" />
                </div>
                {!loading && analytics && (
                  <div className="space-y-3.5">
                    {analytics.department_stats.slice(0, 6).map((d) => (
                      <div key={d.department} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="text-charcoal/80 font-medium truncate">{d.department.replace(" Department", "")}</span>
                          <span className="font-bold font-mono text-charcoal ml-2 shrink-0">{d.count}</span>
                        </div>
                        <div className="h-2 bg-white/60 border border-white/80 rounded-full overflow-hidden p-0.5 shadow-inner">
                          <div
                            className="h-full bg-gradient-to-r from-sage-light to-sage rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${(d.count / maxDept) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions (Glass) */}
              <div className="card p-5 border border-white/70 shadow-glass space-y-3">
                <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider mb-2">Investigation Actions</h2>
                <div className="space-y-2">
                  {quickActions.map(({ icon: Icon, label, desc, to }) => (
                    <Link
                      key={label}
                      to={to}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/40 hover:bg-white/80 border border-white/60 shadow-glass-sm transition-all duration-200 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sage/15 group-hover:bg-sage/25 flex items-center justify-center shrink-0 transition-colors">
                        <Icon size={14} className="text-sage" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-charcoal">{label}</p>
                        <p className="text-[11px] text-muted mt-0.5">{desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
