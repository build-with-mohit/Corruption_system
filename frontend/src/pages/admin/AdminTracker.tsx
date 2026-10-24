import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { complaintsApi, type Complaint } from "../../api";
import { Link } from "react-router-dom";
import { Activity, Clock, CheckCircle2, ArrowRight } from "lucide-react";
import { getStatusBadge } from "../../utils/helpers";

export default function AdminTracker() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const data = await complaintsApi.adminGetAll({ limit: 50 });
        setComplaints(data.items);
      } catch (err) {
        console.error("Failed to load complaints for tracker", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const pending = complaints.filter((c) => c.status === "pending");
  const investigating = complaints.filter((c) => c.status === "under_investigation");
  const resolved = complaints.filter((c) => c.status === "resolved");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar totalComplaints={complaints.length} />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-resolved text-[11px] font-bold">Investigation Pipeline</span>
            </div>
            <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Active Case Tracker</h1>
            <p className="text-xs text-muted font-medium">
              Live progression of corruption complaints through statutory inquiry and resolution phases.
            </p>
          </div>

          {loading ? (
            <div className="card text-center py-12 text-muted text-xs font-semibold border border-white/70">
              Loading investigation pipeline...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: Pending Triage (Glass) */}
              <div className="glass-panel p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-amber-600" />
                    <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Pending Review</h2>
                  </div>
                  <span className="badge-pending text-xs font-mono font-bold">
                    {pending.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {pending.map((c) => {
                    const badge = getStatusBadge(c.status);
                    return (
                      <div key={c.id} className="card-hover p-4 space-y-2.5 border border-white/70 shadow-glass-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-sage">{c.complaint_id}</span>
                          <span className={badge.className}>{badge.label}</span>
                        </div>
                        <h3 className="text-xs font-bold text-charcoal line-clamp-1">{c.category}</h3>
                        <p className="text-[11px] text-charcoal/70 line-clamp-2 leading-relaxed">{c.description}</p>
                        <div className="pt-2.5 border-t border-white/60 flex items-center justify-between text-[11px] text-muted">
                          <span className="font-medium truncate max-w-[130px]">{c.department}</span>
                          <Link to={`/admin/complaints/${c.complaint_id}`} className="text-sage font-bold hover:underline flex items-center gap-0.5">
                            Review <ArrowRight size={10} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {pending.length === 0 && (
                    <div className="text-center py-8 text-xs text-muted border border-dashed border-white/80 rounded-xl bg-white/20">
                      No pending cases in queue
                    </div>
                  )}
                </div>
              </div>

              {/* Column 2: In Investigation (Glass) */}
              <div className="glass-panel p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-blue-600" />
                    <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Under Investigation</h2>
                  </div>
                  <span className="badge-investigation text-xs font-mono font-bold">
                    {investigating.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {investigating.map((c) => {
                    const badge = getStatusBadge(c.status);
                    return (
                      <div key={c.id} className="card-hover p-4 space-y-2.5 border border-white/70 shadow-glass-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-sage">{c.complaint_id}</span>
                          <span className={badge.className}>{badge.label}</span>
                        </div>
                        <h3 className="text-xs font-bold text-charcoal line-clamp-1">{c.category}</h3>
                        <p className="text-[11px] text-charcoal/70 line-clamp-2 leading-relaxed">{c.description}</p>
                        <div className="pt-2.5 border-t border-white/60 flex items-center justify-between text-[11px] text-muted">
                          <span className="font-medium truncate max-w-[130px]">{c.assigned_officer?.full_name || "Assigned"}</span>
                          <Link to={`/admin/complaints/${c.complaint_id}`} className="text-sage font-bold hover:underline flex items-center gap-0.5">
                            Manage <ArrowRight size={10} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {investigating.length === 0 && (
                    <div className="text-center py-8 text-xs text-muted border border-dashed border-white/80 rounded-xl bg-white/20">
                      No cases under active inquiry
                    </div>
                  )}
                </div>
              </div>

              {/* Column 3: Resolved (Glass) */}
              <div className="glass-panel p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Resolved Cases</h2>
                  </div>
                  <span className="badge-resolved text-xs font-mono font-bold">
                    {resolved.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {resolved.map((c) => {
                    const badge = getStatusBadge(c.status);
                    return (
                      <div key={c.id} className="card-hover p-4 space-y-2.5 border border-white/70 shadow-glass-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-sage">{c.complaint_id}</span>
                          <span className={badge.className}>{badge.label}</span>
                        </div>
                        <h3 className="text-xs font-bold text-charcoal line-clamp-1">{c.category}</h3>
                        <p className="text-[11px] text-charcoal/70 line-clamp-2 leading-relaxed">{c.description}</p>
                        <div className="pt-2.5 border-t border-white/60 flex items-center justify-between text-[11px] text-muted">
                          <span className="font-medium truncate max-w-[130px]">{c.department}</span>
                          <Link to={`/admin/complaints/${c.complaint_id}`} className="text-sage font-bold hover:underline flex items-center gap-0.5">
                            View <ArrowRight size={10} />
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                  {resolved.length === 0 && (
                    <div className="text-center py-8 text-xs text-muted border border-dashed border-white/80 rounded-xl bg-white/20">
                      No resolved cases yet
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
