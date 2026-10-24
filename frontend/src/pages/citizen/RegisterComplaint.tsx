import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  Upload, X, FileText, Image, Video, AlertCircle, ChevronRight, ChevronLeft, ShieldCheck, CheckCircle2
} from "lucide-react";
import CitizenSidebar from "../../components/CitizenSidebar";
import { complaintsApi } from "../../api";

const CATEGORIES = [
  "Bribery",
  "Misuse of Power",
  "Fraud",
  "Disproportionate Assets",
  "Nepotism",
  "Embezzlement",
  "Other",
];

const DEPARTMENTS = [
  "Municipal Corporation",
  "Revenue Department",
  "Transport Department",
  "Police Department",
  "Education Department",
  "Health Department",
  "Public Works Department",
  "Water Supply Board",
  "Electricity Board",
  "Land Revenue Office",
  "Passport Office",
  "Income Tax Department",
  "Other",
];

interface FormData {
  category: string;
  department: string;
  incident_location: string;
  incident_date: string;
  description: string;
}

type Step = "form" | "review" | "success";

interface UploadedFile {
  file: File;
  preview?: string;
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) return Image;
  if (type.startsWith("video/")) return Video;
  return FileText;
}

export default function RegisterComplaint() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("form");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successData, setSuccessData] = useState<{ complaint_id: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []);
    const newFiles: UploadedFile[] = selected.map((file) => ({
      file,
      preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => {
      const copy = [...prev];
      if (copy[index].preview) URL.revokeObjectURL(copy[index].preview!);
      copy.splice(index, 1);
      return copy;
    });
  };

  const onFormSubmit = () => {
    setStep("review");
  };

  const onFinalSubmit = async () => {
    setSubmitting(true);
    setError("");
    try {
      const vals = getValues();
      const fd = new FormData();
      fd.append("category", vals.category);
      fd.append("department", vals.department);
      fd.append("incident_location", vals.incident_location);
      fd.append("incident_date", new Date(vals.incident_date).toISOString());
      fd.append("description", vals.description);
      files.forEach((f) => fd.append("files", f.file));

      const result = await complaintsApi.create(fd);
      setSuccessData({ complaint_id: result.complaint_id });
      setStep("success");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Submission failed. Please try again.";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const vals = getValues();

  if (step === "success" && successData) {
    return (
      <div className="flex min-h-screen">
        <CitizenSidebar />
        <main className="flex-1 flex items-center justify-center p-8">
          <div className="card p-10 max-w-md w-full text-center border border-white/80 shadow-glass">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center mx-auto mb-5 shadow-glass-sm">
              <CheckCircle2 size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-extrabold text-charcoal mb-2 tracking-tight">Dossier Registered!</h2>
            <p className="text-xs text-muted mb-6 leading-relaxed">
              Your complaint has been cryptographically logged and entered into the investigation review pipeline.
            </p>
            <div className="p-4 rounded-2xl bg-white/50 border border-white/70 shadow-glass-sm mb-6">
              <p className="text-[10px] uppercase tracking-wider text-muted font-bold mb-1">Assigned Case ID</p>
              <p className="text-2xl font-mono font-extrabold text-sage tracking-wider">
                {successData.complaint_id}
              </p>
              <p className="text-[11px] text-muted mt-1">Keep this ID for anonymous status tracking</p>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => navigate("/portal/complaints")}
                className="btn-primary w-full justify-center shadow-glass"
              >
                Track In My Complaints
              </button>
              <button
                onClick={() => navigate("/portal")}
                className="btn-secondary w-full justify-center"
              >
                Back to Dashboard
              </button>
              <button
                onClick={() => { setStep("form"); setFiles([]); setSuccessData(null); }}
                className="btn-ghost w-full justify-center text-xs text-muted font-medium"
              >
                File Another Complaint
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (step === "review") {
    return (
      <div className="flex min-h-screen">
        <CitizenSidebar />
        <main className="flex-1 overflow-auto p-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setStep("form")} className="btn-secondary px-3 py-1.5 text-xs">
                <ChevronLeft size={14} /> Back
              </button>
              <div>
                <h1 className="text-lg font-bold text-charcoal tracking-tight">Review Complaint Summary</h1>
                <p className="text-xs text-muted">Verify all details before cryptographic submission.</p>
              </div>
            </div>

            <div className="card divide-y divide-white/60 p-0 overflow-hidden border border-white/70 shadow-glass">
              {[
                { label: "Category", value: vals.category },
                { label: "Target Department", value: vals.department },
                { label: "Incident Location", value: vals.incident_location },
                { label: "Incident Date", value: vals.incident_date ? new Date(vals.incident_date).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "" },
              ].map(({ label, value }) => (
                <div key={label} className="px-6 py-4 flex justify-between items-center bg-white/20">
                  <span className="text-xs text-muted font-semibold uppercase tracking-wider">{label}</span>
                  <span className="text-xs text-charcoal font-bold">{value}</span>
                </div>
              ))}
              <div className="px-6 py-5 bg-white/10">
                <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2">Description Statement</p>
                <p className="text-xs text-charcoal leading-relaxed whitespace-pre-wrap">{vals.description}</p>
              </div>
              {files.length > 0 && (
                <div className="px-6 py-5 bg-white/10">
                  <p className="text-xs text-muted font-semibold uppercase tracking-wider mb-2.5">
                    Attached Evidence ({files.length})
                  </p>
                  <div className="space-y-2">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-charcoal p-2 rounded-xl bg-white/50 border border-white/60">
                        <FileText size={14} className="text-sage" />
                        <span className="font-medium truncate flex-1">{f.file.name}</span>
                        <span className="text-muted font-mono text-[11px]">{(f.file.size / 1024).toFixed(0)} KB</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-300/40 text-rose-800 rounded-xl px-4 py-3 text-xs font-medium">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button onClick={() => setStep("form")} className="btn-secondary flex-1 justify-center">
                Edit Details
              </button>
              <button
                onClick={onFinalSubmit}
                disabled={submitting}
                className="btn-sage flex-1 justify-center shadow-glass"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting Dossier...
                  </span>
                ) : (
                  <>Confirm & Submit <ChevronRight size={15} /></>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <CitizenSidebar />
      <main className="flex-1 overflow-auto p-8">
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <span className="badge-resolved text-[11px] font-bold">Whistleblower Entry</span>
            <h1 className="text-2xl font-extrabold text-charcoal mt-2 mb-1 tracking-tight">Register a Complaint</h1>
            <p className="text-xs text-muted font-medium">
              Document corrupt practices, extortion, or misuse of authority with complete confidentiality.
            </p>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
            <div className="card p-6 sm:p-7 space-y-5 border border-white/70 shadow-glass">
              <div className="flex items-center justify-between pb-3 border-b border-white/60">
                <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Incident Details</h2>
                <span className="text-[11px] text-sage font-semibold flex items-center gap-1">
                  <ShieldCheck size={14} /> End-to-End Encrypted
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select
                    className={`select ${errors.category ? "border-red-400" : ""}`}
                    {...register("category", { required: "Please select a category" })}
                  >
                    <option value="">Select category...</option>
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <p className="text-xs text-red-500 mt-1">{errors.category.message}</p>}
                </div>

                <div>
                  <label className="label">Department *</label>
                  <select
                    className={`select ${errors.department ? "border-red-400" : ""}`}
                    {...register("department", { required: "Please select a department" })}
                  >
                    <option value="">Select department...</option>
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {errors.department && <p className="text-xs text-red-500 mt-1">{errors.department.message}</p>}
                </div>
              </div>

              <div>
                <label className="label">Incident Location *</label>
                <input
                  type="text"
                  className={`input ${errors.incident_location ? "border-red-400" : ""}`}
                  placeholder="e.g. Zonal Office, Ward 4, Municipal Building"
                  {...register("incident_location", { required: "Location is required" })}
                />
                {errors.incident_location && <p className="text-xs text-red-500 mt-1">{errors.incident_location.message}</p>}
              </div>

              <div>
                <label className="label">Incident Date *</label>
                <input
                  type="date"
                  max={new Date().toISOString().split("T")[0]}
                  className={`input ${errors.incident_date ? "border-red-400" : ""}`}
                  {...register("incident_date", { required: "Date is required" })}
                />
                {errors.incident_date && <p className="text-xs text-red-500 mt-1">{errors.incident_date.message}</p>}
              </div>

              <div>
                <label className="label">Detailed Description *</label>
                <textarea
                  rows={5}
                  className={`textarea ${errors.description ? "border-red-400" : ""}`}
                  placeholder="Describe the demand for bribery, financial irregularities, public asset diversion, or abuse of position in detail..."
                  {...register("description", {
                    required: "Description is required",
                    minLength: { value: 30, message: "Please provide at least 30 characters" },
                  })}
                />
                {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>}
              </div>
            </div>

            {/* File Upload (Glass) */}
            <div className="card p-6 sm:p-7 border border-white/70 shadow-glass space-y-4">
              <div>
                <h2 className="text-sm font-bold text-charcoal uppercase tracking-wider">Supporting Evidence</h2>
                <p className="text-xs text-muted mt-0.5">
                  Attach photographs, audio/video recordings, official notices, or invoices. Max 50MB per file.
                </p>
              </div>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/80 rounded-2xl p-7 text-center cursor-pointer hover:border-sage hover:bg-white/40 transition-all duration-200 bg-white/20 shadow-glass-sm"
              >
                <Upload size={28} className="text-sage mx-auto mb-2.5" />
                <p className="text-xs font-bold text-charcoal">Click or drag files here to upload</p>
                <p className="text-[11px] text-muted mt-1">PNG, JPG, MP4, PDF, DOCX supported</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*,video/*,.pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2 pt-2">
                  {files.map((f, i) => {
                    const Icon = getFileIcon(f.file.type);
                    return (
                      <div key={i} className="flex items-center gap-3 p-3 bg-white/60 border border-white/70 rounded-xl shadow-glass-sm">
                        {f.preview ? (
                          <img src={f.preview} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/80" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-sage/15 flex items-center justify-center shrink-0">
                            <Icon size={16} className="text-sage" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-charcoal truncate">{f.file.name}</p>
                          <p className="text-[10px] text-muted font-mono">{(f.file.size / 1024).toFixed(0)} KB</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="p-1.5 rounded-lg text-muted hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button type="button" onClick={() => window.history.back()} className="btn-secondary flex-1 justify-center">
                Cancel
              </button>
              <button type="submit" className="btn-primary flex-1 justify-center shadow-glass">
                Review & Confirm <ChevronRight size={15} />
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
