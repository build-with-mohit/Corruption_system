import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ExternalLink, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import CitizenSidebar from "../../components/CitizenSidebar";
import { complaintsApi, type Complaint } from "../../api";
import { getStatusBadge, formatDate } from "../../utils/helpers";

const PAGE_SIZE = 10;

export default function MyComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filtered, setFiltered] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    complaintsApi
      .getMy()
      .then((data) => {
        setComplaints(data);
        setFiltered(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let result = complaints;
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.complaint_id.toLowerCase().includes(s) ||
          c.category.toLowerCase().includes(s) ||
          c.department.toLowerCase().includes(s)
      );
    }
    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }
    setFiltered(result);
    setPage(1);
  }, [search, statusFilter, complaints]);

  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="flex min-h-screen">
      <CitizenSidebar />
      <main className="flex-1 overflow-auto p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-resolved text-[11px] font-bold">Whistleblower Portfolio</span>
            </div>
            <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">My Filed Complaints</h1>
            <p className="text-xs text-muted font-medium">View, search, and track the investigation status of your dossiers.</p>
          </div>
          <Link to="/portal/new" className="btn-sage gap-2 shrink-0 text-xs shadow-glass">
            <PlusCircle size={15} />
            File New Report
          </Link>
        </div>

        {/* Filters (Glass) */}
        <div className="card p-4 flex flex-col sm:flex-row gap-3 border border-white/70 shadow-glass">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Filter by Tracking ID, category, or department..."
              className="input pl-9 text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="select w-full sm:w-48 text-xs font-medium"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status Stages</option>
            <option value="pending">Pending Triage</option>
            <option value="under_investigation">Under Active Inquiry</option>
            <option value="resolved">Resolved / Concluded</option>
            <option value="rejected">Rejected / Dismissed</option>
          </select>
        </div>

        {/* Table (Glass) */}
        <div className="card overflow-hidden border border-white/70 shadow-glass">
          {loading ? (
            <div className="p-12 text-center text-muted text-sm">Loading your cases...</div>
          ) : paged.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <p className="text-sm text-muted">No complaints match your query.</p>
              <Link to="/portal/new" className="btn-primary text-xs shadow-glass">Submit a new complaint</Link>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/40 border-b border-white/50">
                    <tr>
                      <th className="table-header">Tracking ID</th>
                      <th className="table-header">Corruption Category</th>
                      <th className="table-header hidden md:table-cell">Target Department</th>
                      <th className="table-header hidden sm:table-cell">Submission Date</th>
                      <th className="table-header">Status</th>
                      <th className="table-header"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {paged.map((c) => {
                      const badge = getStatusBadge(c.status);
                      return (
                        <tr key={c.id} className="table-row">
                          <td className="table-cell font-mono font-bold text-sage text-xs">{c.complaint_id}</td>
                          <td className="table-cell text-xs font-semibold text-charcoal">{c.category}</td>
                          <td className="table-cell hidden md:table-cell text-xs text-muted font-medium">{c.department}</td>
                          <td className="table-cell hidden sm:table-cell text-xs text-muted">{formatDate(c.created_at)}</td>
                          <td className="table-cell">
                            <span className={badge.className}>{badge.label}</span>
                          </td>
                          <td className="table-cell text-right">
                            <Link
                              to={`/portal/complaints/${c.complaint_id}`}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-sage hover:text-charcoal p-1.5 rounded-lg hover:bg-white/60 transition-all"
                            >
                              <span>Details</span>
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
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} dossiers
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
