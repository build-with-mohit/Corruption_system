import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, FileText, Image, Video, ExternalLink, ShieldAlert } from "lucide-react";
import CitizenSidebar from "../../components/CitizenSidebar";
import { complaintsApi, type Complaint } from "../../api";
import { getStatusBadge, formatDate } from "../../utils/helpers";

export default function ComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    complaintsApi
      .getMyDetail(id)
      .then(setComplaint)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <CitizenSidebar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted text-xs font-semibold">Decrypting dossier details...</p>
        </main>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="flex min-h-screen">
        <CitizenSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="card p-8 text-center max-w-md w-full border border-white/80 shadow-glass">
            <p className="text-rose-700 text-sm font-semibold mb-4">{error || "Complaint not found"}</p>
            <Link to="/portal/complaints" className="btn-primary text-xs shadow-glass">Back to My Complaints</Link>
          </div>
        </main>
      </div>
    );
  }

  const badge = getStatusBadge(complaint.status);

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("video/")) return Video;
    return FileText;
  };

  return (
    <div className="flex min-h-screen">
      <CitizenSidebar />
      <main className="flex-1 overflow-auto p-8 space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header (Glass) */}
          <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/70 shadow-glass">
            <div className="flex items-center gap-3">
              <Link to="/portal/complaints" className="btn-secondary p-2 text-xs">
                <ChevronLeft size={16} />
              </Link>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Incident Record</span>
                <h1 className="text-xl font-mono font-extrabold text-charcoal">{complaint.complaint_id}</h1>
                <p className="text-xs text-muted mt-0.5">Logged on {formatDate(complaint.created_at)}</p>
              </div>
            </div>
            <div>
              <span className={badge.className}>{badge.label}</span>
            </div>
          </div>

          {/* Details (Glass) */}
          <div className="card divide-y divide-white/60 p-0 overflow-hidden border border-white/70 shadow-glass">
            {[
              { label: "Category", value: complaint.category },
              { label: "Accused Department", value: complaint.department },
              { label: "Incident Location", value: complaint.incident_location },
              { label: "Date of Incident", value: formatDate(complaint.incident_date) },
              { label: "Investigating Officer", value: complaint.assigned_officer?.full_name || "Under Triage" },
              { label: "Last System Audit", value: formatDate(complaint.updated_at) },
            ].map(({ label, value }) => (
              <div key={label} className="px-6 py-3.5 flex justify-between items-center bg-white/20">
                <span className="text-xs text-muted font-semibold uppercase tracking-wider">{label}</span>
                <span className="text-xs text-charcoal font-bold text-right max-w-sm">{value}</span>
              </div>
            ))}
          </div>

          {/* Description (Glass) */}
          <div className="card p-6 border border-white/70 shadow-glass space-y-2.5">
            <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Statement of Grievance</h2>
            <p className="text-xs text-charcoal/80 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
          </div>

          {/* Investigation Notes (Glass) */}
          {complaint.investigation_notes && (
            <div className="card p-6 border border-sage/40 shadow-glass bg-gradient-to-r from-sage/10 to-white/40 space-y-2">
              <div className="flex items-center gap-2 text-sage">
                <ShieldAlert size={16} />
                <h2 className="text-xs font-bold uppercase tracking-wider">Investigating Officer Findings & Action Notes</h2>
              </div>
              <p className="text-xs text-charcoal/90 leading-relaxed font-medium">{complaint.investigation_notes}</p>
            </div>
          )}

          {/* Evidence Files (Glass) */}
          {complaint.evidence_files.length > 0 && (
            <div className="card p-6 border border-white/70 shadow-glass space-y-3">
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Attached Evidence Vault ({complaint.evidence_files.length})
              </h2>
              <div className="space-y-2.5">
                {complaint.evidence_files.map((ef) => {
                  const Icon = getFileIcon(ef.file_type);
                  const url = complaintsApi.getEvidenceUrl(complaint.id, ef.stored_filename, false);
                  return (
                    <div key={ef.id} className="flex items-center gap-3 p-3.5 bg-white/50 border border-white/70 rounded-xl shadow-glass-sm hover:bg-white/80 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-sage/15 flex items-center justify-center shrink-0">
                        <Icon size={16} className="text-sage" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-charcoal truncate">{ef.original_filename}</p>
                        <p className="text-[10px] text-muted font-mono">{(ef.file_size / 1024).toFixed(0)} KB • Cryptographically Verified</p>
                      </div>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/70 border border-white/80 text-xs font-semibold text-sage hover:text-charcoal hover:bg-white shadow-xs transition-all"
                      >
                        <span>Open</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
