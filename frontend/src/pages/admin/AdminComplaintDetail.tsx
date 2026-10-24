import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft, FileText, Image, Video, ExternalLink, Save, AlertCircle, CheckCircle2, UserCheck
} from "lucide-react";
import AdminSidebar from "../../components/AdminSidebar";
import { complaintsApi, usersApi, type Complaint } from "../../api";
import { getStatusBadge, formatDate } from "../../utils/helpers";

export default function AdminComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [officers, setOfficers] = useState<{ id: string; full_name: string; email: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedOfficer, setSelectedOfficer] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!id) return;
    Promise.all([
      complaintsApi.adminGetDetail(id),
      usersApi.listOfficers(),
    ])
      .then(([c, o]) => {
        setComplaint(c);
        setOfficers(o);
        setSelectedStatus(c.status);
        setSelectedOfficer(c.assigned_officer?.id || "");
        setNotes(c.investigation_notes || "");
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    if (!complaint || !id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const updated = await complaintsApi.adminUpdate(id, {
        status: selectedStatus || undefined,
        assigned_officer_id: selectedOfficer || undefined,
        investigation_notes: notes || undefined,
      });
      setComplaint(updated);
      setSuccess("Complaint updated successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (e: unknown) {
      const err = e instanceof Error ? e.message : "Failed to update complaint";
      setError(err);
    } finally {
      setSaving(false);
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.startsWith("video/")) return Video;
    return FileText;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center text-muted text-xs font-semibold">
          Decrypting administrative case record...
        </main>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="card p-8 text-center max-w-md w-full border border-white/80 shadow-glass">
            <p className="text-rose-700 text-sm font-semibold mb-4">{error || "Complaint not found"}</p>
            <Link to="/admin/complaints" className="btn-primary text-xs shadow-glass">Back to Complaints</Link>
          </div>
        </main>
      </div>
    );
  }

  const badge = getStatusBadge(complaint.status);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-auto p-8 space-y-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header (Glass) */}
          <div className="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/70 shadow-glass">
            <div className="flex items-center gap-3">
              <Link to="/admin/complaints" className="btn-secondary p-2 text-xs">
                <ChevronLeft size={16} />
              </Link>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-muted">Administrative Dossier</span>
                <h1 className="text-xl font-mono font-extrabold text-charcoal">{complaint.complaint_id}</h1>
                <p className="text-xs text-muted mt-0.5">Logged on {formatDate(complaint.created_at)}</p>
              </div>
            </div>
            <span className={badge.className}>{badge.label}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Complaint info (Glass) */}
              <div className="card divide-y divide-white/60 p-0 overflow-hidden border border-white/70 shadow-glass">
                <div className="px-6 py-3.5 flex justify-between items-center bg-white/20">
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider">Citizen Identity</span>
                  <span className="text-xs font-bold text-charcoal">{complaint.citizen?.full_name || "Anonymous Whistleblower"}</span>
                </div>
                {[
                  { label: "Category", value: complaint.category },
                  { label: "Target Department", value: complaint.department },
                  { label: "Incident Location", value: complaint.incident_location },
                  { label: "Incident Date", value: formatDate(complaint.incident_date) },
                  { label: "Last System Audit", value: formatDate(complaint.updated_at) },
                ].map(({ label, value }) => (
                  <div key={label} className="px-6 py-3.5 flex justify-between items-center bg-white/20">
                    <span className="text-xs text-muted font-semibold uppercase tracking-wider">{label}</span>
                    <span className="text-xs font-bold text-charcoal text-right max-w-xs">{value}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div className="card p-6 border border-white/70 shadow-glass space-y-2.5">
                <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Statement of Grievance</h2>
                <p className="text-xs text-charcoal/80 leading-relaxed whitespace-pre-wrap">{complaint.description}</p>
              </div>

              {/* Evidence */}
              {complaint.evidence_files.length > 0 && (
                <div className="card p-6 border border-white/70 shadow-glass space-y-3">
                  <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">
                    Evidence Vault ({complaint.evidence_files.length} Files Attached)
                  </h2>
                  <div className="space-y-3">
                    {complaint.evidence_files.map((ef) => {
                      const Icon = getFileIcon(ef.file_type);
                      const url = complaintsApi.getEvidenceUrl(complaint.id, ef.stored_filename, true);
                      const isImage = ef.file_type.startsWith("image/");
                      return (
                        <div key={ef.id} className="p-3.5 bg-white/50 border border-white/70 rounded-xl shadow-glass-sm space-y-2">
                          {isImage && (
                            <a href={url} target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-lg">
                              <img
                                src={url}
                                alt={ef.original_filename}
                                className="w-full max-h-56 object-cover rounded-lg hover:scale-[1.01] transition-transform"
                              />
                            </a>
                          )}
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-sage/15 flex items-center justify-center shrink-0">
                              <Icon size={16} className="text-sage" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-bold text-charcoal truncate">{ef.original_filename}</p>
                              <p className="text-[10px] text-muted font-mono">{(ef.file_size / 1024).toFixed(0)} KB • SHA-256 Hashed</p>
                            </div>
                            <a
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/70 border border-white/80 text-xs font-semibold text-sage hover:text-charcoal hover:bg-white shadow-xs transition-all"
                            >
                              <span>Inspect</span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Management Panel (Glass) */}
            <div className="space-y-6">
              <div className="card p-6 border border-white/70 shadow-glass space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-white/60">
                  <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Investigation Controls</h2>
                  <UserCheck size={16} className="text-sage" />
                </div>

                {success && (
                  <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-300/40 text-emerald-800 rounded-xl px-3 py-2 text-xs font-medium">
                    <CheckCircle2 size={14} /> {success}
                  </div>
                )}
                {error && (
                  <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-300/40 text-rose-800 rounded-xl px-3 py-2 text-xs font-medium">
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <div>
                  <label className="label">Workflow Stage</label>
                  <select
                    className="select text-xs font-medium"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="pending">Pending Triage</option>
                    <option value="under_investigation">Under Active Investigation</option>
                    <option value="resolved">Resolved / Concluded</option>
                    <option value="rejected">Rejected / Invalid</option>
                  </select>
                </div>

                <div>
                  <label className="label">Assign Investigator</label>
                  <select
                    className="select text-xs font-medium"
                    value={selectedOfficer}
                    onChange={(e) => setSelectedOfficer(e.target.value)}
                  >
                    <option value="">Unassigned</option>
                    {officers.map((o) => (
                      <option key={o.id} value={o.id}>{o.full_name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="label">Official Investigation Notes</label>
                  <textarea
                    rows={5}
                    className="textarea text-xs"
                    placeholder="Enter audit findings, subpoenas issued, interrogation results..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-sage w-full justify-center shadow-glass text-xs font-semibold py-3"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saving changes...
                    </span>
                  ) : (
                    <><Save size={14} /> Update Case Status</>
                  )}
                </button>
              </div>

              {/* Citizen info card */}
              {complaint.citizen && (
                <div className="card p-5 border border-white/70 shadow-glass space-y-3">
                  <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Whistleblower Record</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-white/50">
                      <span className="text-muted">Full Name</span>
                      <span className="font-semibold text-charcoal">{complaint.citizen.full_name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-white/50">
                      <span className="text-muted">Email</span>
                      <span className="font-semibold text-charcoal">{complaint.citizen.email}</span>
                    </div>
                    {complaint.citizen.phone && (
                      <div className="flex justify-between py-1 border-b border-white/50">
                        <span className="text-muted">Telephone</span>
                        <span className="font-semibold text-charcoal">{complaint.citizen.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-1">
                      <span className="text-muted">Onboarding Date</span>
                      <span className="font-semibold text-charcoal">{formatDate(complaint.citizen.created_at)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
