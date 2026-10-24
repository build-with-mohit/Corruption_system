import AdminSidebar from "../../components/AdminSidebar";
import { Database, Lock, Server } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-resolved text-[11px] font-bold">Security & Compliance</span>
            </div>
            <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">System Settings & Governance</h1>
            <p className="text-xs text-muted font-medium">
              Configure cryptographic anonymity policies, SLA thresholds, and storage vault protections.
            </p>
          </div>

          {/* Whistleblower Engine (Glass) */}
          <div className="card p-6 sm:p-7 border border-white/70 shadow-glass space-y-6">
            <div className="flex items-center gap-3.5 pb-4 border-b border-white/60">
              <div className="p-2.5 bg-charcoal text-white rounded-xl shadow-glass-sm border border-white/10">
                <Lock size={18} />
              </div>
              <div>
                <h2 className="text-base font-bold text-charcoal tracking-tight">Whistleblower Anonymity Engine</h2>
                <p className="text-xs text-muted">Strict zero-knowledge detachment of citizen identity and client telemetry</p>
              </div>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/50">
                <div>
                  <div className="font-bold text-charcoal">Redact IP Address & Client Headers</div>
                  <div className="text-muted text-[11px]">Remove telemetry logs upon complaint ingestion into database</div>
                </div>
                <span className="badge-resolved text-xs font-bold">Enforced</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/50">
                <div>
                  <div className="font-bold text-charcoal">SHA-256 Evidence Checksumming</div>
                  <div className="text-muted text-[11px]">Prevent post-upload file tampering or evidence modification</div>
                </div>
                <span className="badge-resolved text-xs font-bold">Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/50">
                <div>
                  <div className="font-bold text-charcoal">Service Level Agreement (SLA) Escalation</div>
                  <div className="text-muted text-[11px]">Auto-flag cases pending triage without action after 30 days</div>
                </div>
                <span className="badge-investigation text-xs font-bold">30 Days</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6 border border-white/70 shadow-glass space-y-3">
              <div className="flex items-center gap-2">
                <Server size={18} className="text-sage" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal">API & Runtime Engine</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                FastAPI asynchronous REST service with SQLAlchemy persistence and OAuth2 JWT authorization.
              </p>
              <div className="pt-2 text-xs space-y-1 text-muted border-t border-white/60">
                <div>Environment: <span className="font-mono font-bold text-charcoal">Production Ready</span></div>
                <div>CORS Origins: <span className="font-mono font-bold text-charcoal">Configured</span></div>
              </div>
            </div>

            <div className="card p-6 border border-white/70 shadow-glass space-y-3">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-charcoal" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-charcoal">Storage & Evidence Vault</h3>
              </div>
              <p className="text-xs text-muted leading-relaxed">
                Isolated evidence directory with strict MIME validation for documents, video, and forensic photographs.
              </p>
              <div className="pt-2 text-xs space-y-1 text-muted border-t border-white/60">
                <div>Max Upload Limit: <span className="font-mono font-bold text-charcoal">50 MB / file</span></div>
                <div>Retention Period: <span className="font-mono font-bold text-charcoal">Statutory Audit</span></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
