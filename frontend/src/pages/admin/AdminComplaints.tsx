import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import { complaintsApi, type Complaint } from "../../api";
import { getStatusBadge, formatDate } from "../../utils/helpers";

const PAGE_SIZE = 15;

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const fetchComplaints = useCallback(async () => {
    setLoading(true);
    try {
      const data = await complaintsApi.adminGetAll({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
        status: statusFilter || undefined,
        category: categoryFilter || undefined,
      });
      setComplaints(data.items);
      setTotal(data.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [page, search, statusFilter, categoryFilter]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar totalComplaints={total} />
      <main className="flex-1 overflow-auto p-8 space-y-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="badge-resolved text-[11px] font-bold">Investigation Roster</span>
          </div>
          <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Complaints & Case Files</h1>
          <p className="text-xs text-muted font-medium">{total} total registered cases awaiting review, triage, and officer assignment.</p>
        </div>

        {/* Filters (Glass) */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3 border border-white/70 shadow-glass">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Filter by Tracking ID, department, or incident location..."
              className="input pl-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="select w-full sm:w-44 text-xs font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Triage</option>
            <option value="under_investigation">Under Investigation</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select
            className="select w-full sm:w-48 text-xs font-medium"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Bribery">Bribery</option>
            <option value="Misuse of Power">Misuse of Power</option>
            <option value="Fraud">Fraud</option>
            <option value="Disproportionate Assets">Disproportionate Assets</option>
            <option value="Nepotism">Nepotism</option>
            <option value="Embezzlement">Embezzlement</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Table (Glass) */}
        <div className="card overflow-hidden border border-white/70 shadow-glass">
          {loading ? (
            <div className="p-12 text-center text-muted text-sm">Loading complaints directory...</div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center text-muted text-sm">No complaints match the current filter criteria.</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/40 border-b border-white/50">
                    <tr>
                      <th className="table-header">Case ID</th>
                      <th className="table-header">Category</th>
                      <th className="table-header hidden md:table-cell">Accused Dept</th>
                      <th className="table-header hidden sm:table-cell">Filing Date</th>
                      <th className="table-header">Status</th>
                      <th className="table-header hidden lg:table-cell">Assigned Officer</th>
                      <th className="table-header"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {complaints.map((c) => {
                      const badge = getStatusBadge(c.status);
                      return (
                        <tr key={c.id} className="table-row">
                          <td className="table-cell font-mono font-bold text-sage text-xs">{c.complaint_id}</td>
                          <td className="table-cell text-xs font-semibold text-charcoal">{c.category}</td>
                          <td className="table-cell hidden md:table-cell text-xs text-muted font-medium">
                            {c.department.replace(" Department", "").replace(" Corporation", " Corp")}
                          </td>
                          <td className="table-cell hidden sm:table-cell text-xs text-muted">
                            {formatDate(c.created_at)}
                          </td>
                          <td className="table-cell">
                            <span className={badge.className}>{badge.label}</span>
                          </td>
                          <td className="table-cell hidden lg:table-cell text-xs text-muted font-medium">
                            {c.assigned_officer?.full_name || "Unassigned"}
                          </td>
                          <td className="table-cell text-right">
                            <Link
                              to={`/admin/complaints/${c.complaint_id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage hover:text-charcoal p-1.5 rounded-lg hover:bg-white/60 transition-all"
                            >
                              <span>Manage</span>
                              <ExternalLink size={12} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination (Glass) */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-4 border-t border-white/50 bg-white/30">
                  <span className="text-xs text-muted font-medium">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total} cases
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="btn-ghost px-2.5 py-1 text-xs disabled:opacity-40"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    <span className="text-xs font-mono font-bold text-charcoal">{page} / {totalPages}</span>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="btn-ghost px-2.5 py-1 text-xs disabled:opacity-40"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
