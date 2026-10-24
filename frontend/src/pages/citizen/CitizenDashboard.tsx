import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, ArrowRight, FileText, Search, History, Sparkles } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import CitizenSidebar from "../../components/CitizenSidebar";
import { complaintsApi, type Complaint, type CitizenStats } from "../../api";
import { getStatusBadge, formatDate, getGreeting } from "../../utils/helpers";
import { useAuth } from "../../contexts/AuthContext";

const COLORS = ["#C9A96E", "#687B69", "#4A5C4B", "#E2DED8"];

const quickActions = [
  {
    icon: FileText,
    title: "Register a New Complaint",
    desc: "Submit corruption report with evidence",
    to: "/portal/new",
  },
  {
    icon: Search,
    title: "Track Complaint Status",
    desc: "Check real-time progress using Complaint ID",
    to: "/portal/complaints",
  },
  {
    icon: History,
    title: "View Complaint History",
    desc: "Browse all previously filed reports",
    to: "/portal/complaints",
  },
];

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [stats, setStats] = useState<CitizenStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [complaintsData, statsData] = await Promise.all([
          complaintsApi.getMy(),
          complaintsApi.getMyStats(),
        ]);
        setComplaints(complaintsData.slice(0, 5));
        setStats(statsData);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const pieData = [
    { name: "Pending", value: stats?.pending || 0 },
    { name: "In Progress", value: stats?.under_investigation || 0 },
    { name: "Resolved", value: stats?.resolved || 0 },
  ].filter((d) => d.value > 0);

  const statCards = [
    { label: "Total Complaints", value: stats?.total ?? 0, sub: "Since registration", color: "text-charcoal" },
    { label: "Pending Review", value: stats?.pending ?? 0, sub: "Awaiting triage", color: "text-amber-700" },
    { label: "In Investigation", value: stats?.under_investigation ?? 0, sub: "Actively assigned", color: "text-blue-700" },
    { label: "Cases Resolved", value: stats?.resolved ?? 0, sub: "Concluded with action", color: "text-emerald-700" },
  ];

  return (
    <div className="flex min-h-screen">
      <CitizenSidebar />

      <main className="flex-1 overflow-auto">
        {/* Top bar (Glass) */}
        <div className="flex items-center justify-between px-8 py-4.5 border-b border-white/60 glass-nav sticky top-0 z-20">
          <div>
            <h1 className="text-lg font-bold text-charcoal tracking-tight flex items-center gap-2">
              <span>{getGreeting()}, {user?.full_name?.split(" ")[0]}</span>
              <Sparkles size={16} className="text-sage" />
            </h1>
            <p className="text-xs text-muted font-medium">Welcome to your secure civic whistleblower workspace.</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/50 border border-white/70 text-charcoal/70">
              {today}
            </span>
            <div className="flex items-center gap-2.5 p-1.5 rounded-full bg-white/50 border border-white/70 shadow-glass-sm">
              <div className="w-8 h-8 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center text-sage font-bold text-xs">
                {user?.full_name?.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden sm:block pr-2">
                <p className="text-xs font-bold text-charcoal leading-none">{user?.full_name}</p>
                <p className="text-[10px] text-sage font-medium mt-0.5">Citizen</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Header Action Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-gradient-to-r from-sage/20 via-white/50 to-beige/30 border border-white/70 shadow-glass">
              <div>
                <h2 className="text-sm font-bold text-charcoal">Witnessed unlawful bribery or extortion?</h2>
                <p className="text-xs text-muted mt-0.5">Your identity is protected under statutory whistleblower immunity.</p>
              </div>
              <Link to="/portal/new" className="btn-sage gap-2 shrink-0 text-xs shadow-glass">
                <PlusCircle size={15} />
                Register New Complaint
              </Link>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((s) => (
                <div key={s.label} className="card-hover p-5 flex flex-col justify-between">
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider">{s.label}</p>
                  <p className={`text-3xl font-extrabold my-2 font-mono ${s.color}`}>
                    {loading ? "—" : s.value}
                  </p>
                  <p className="text-[11px] text-muted font-medium">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Recent Complaints Table (Glass) */}
            <div className="card overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/60 bg-white/30">
                <h2 className="text-sm font-bold text-charcoal">Recent Complaints Filed</h2>
                <Link to="/portal/complaints" className="flex items-center gap-1 text-xs font-semibold text-sage hover:text-charcoal transition-colors">
                  View all complaints <ArrowRight size={13} />
                </Link>
              </div>
              {loading ? (
                <div className="p-10 text-center text-muted text-sm">Loading complaints...</div>
              ) : complaints.length === 0 ? (
                <div className="p-10 text-center space-y-3">
                  <p className="text-sm text-muted">No complaints filed yet.</p>
                  <Link to="/portal/new" className="btn-primary text-xs shadow-glass">File your first complaint</Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-white/40 border-b border-white/50">
                      <tr>
                        <th className="table-header">Case ID</th>
                        <th className="table-header">Category</th>
                        <th className="table-header">Submission Date</th>
                        <th className="table-header">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/40">
                      {complaints.map((c) => {
                        const badge = getStatusBadge(c.status);
                        return (
                          <tr key={c.id} className="table-row">
                            <td className="table-cell font-mono font-bold text-sage">{c.complaint_id}</td>
                            <td className="table-cell font-medium">{c.category}</td>
                            <td className="table-cell text-muted text-xs">{formatDate(c.created_at)}</td>
                            <td className="table-cell">
                              <span className={badge.className}>{badge.label}</span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Complaint Status Donut */}
            {stats && stats.total > 0 && (
              <div className="card p-6">
                <h2 className="text-sm font-bold text-charcoal mb-4">Caseload Distribution Breakdown</h2>
                <div className="flex flex-col sm:flex-row items-center gap-8">
                  <div className="w-44 h-44 relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          innerRadius={48}
                          outerRadius={72}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => [v, "Complaints"]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-3xl font-extrabold text-charcoal font-mono">{stats.total}</p>
                    <p className="text-xs text-muted font-medium">Total Complaints Filed</p>
                  </div>
                  <div className="space-y-2.5 flex-1">
                    {[
                      { name: "Pending Review", value: stats.pending, color: COLORS[0] },
                      { name: "Under Investigation", value: stats.under_investigation, color: COLORS[1] },
                      { name: "Resolved / Concluded", value: stats.resolved, color: COLORS[2] },
                    ].map((item) => (
                      <div key={item.name} className="flex items-center gap-3 text-xs p-2 rounded-xl bg-white/40 border border-white/50">
                        <span className="w-3 h-3 rounded-full shrink-0 shadow-xs" style={{ backgroundColor: item.color }} />
                        <span className="text-charcoal/80 font-medium flex-1">{item.name}</span>
                        <span className="font-bold font-mono text-charcoal">{item.value}</span>
                        <span className="text-muted text-[11px] font-mono">
                          {stats.total > 0 ? Math.round((item.value / stats.total) * 100) : 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-5">
            <div className="card p-5 space-y-4">
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Quick Actions</h2>
              <div className="space-y-2.5">
                {quickActions.map(({ icon: Icon, title, desc, to }) => (
                  <Link
                    key={to + title}
                    to={to}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-white/40 hover:bg-white/80 border border-white/60 shadow-glass-sm transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-sage/15 group-hover:bg-sage/25 flex items-center justify-center shrink-0 transition-colors">
                      <Icon size={16} className="text-sage" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-charcoal">{title}</p>
                      <p className="text-[11px] text-muted mt-0.5 leading-snug">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Whistleblower Protection Banner */}
            <div className="card p-5 space-y-3 bg-gradient-to-b from-white/70 to-sage/10 border-white/70">
              <div className="flex items-center gap-2 text-sage">
                <FileText size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Statutory Rights</span>
              </div>
              <p className="text-xs text-charcoal/80 leading-relaxed font-light">
                Under whistleblower protection guidelines, reporting officials cannot be prosecuted for exposing public treasury misuse.
              </p>
              <Link to="/portal/help" className="text-xs font-bold text-sage hover:underline block pt-1">
                Read Legal Guide &rarr;
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
