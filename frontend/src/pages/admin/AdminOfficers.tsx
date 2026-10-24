import { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import { usersApi } from "../../api";
import { UserCheck, Mail, Shield, UserPlus, CheckCircle2, AlertCircle } from "lucide-react";

interface OfficerUser {
  id: string;
  full_name: string;
  email: string;
}

export default function AdminOfficers() {
  const [officers, setOfficers] = useState<OfficerUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        setLoading(true);
        const data = await usersApi.listOfficers();
        setOfficers(data);
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : "Failed to load officers";
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar totalComplaints={officers.length} />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-resolved text-[11px] font-bold">Investigator Directory</span>
              </div>
              <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Investigation Officers</h1>
              <p className="text-xs text-muted font-medium">
                Authorized integrity officers assigned to evaluate evidence and audit civic complaints.
              </p>
            </div>
            <span className="text-xs bg-white/60 border border-white/70 shadow-glass-sm text-charcoal px-3.5 py-1.5 rounded-full font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-600" /> {officers.length} Active Officers
            </span>
          </div>

          {error && (
            <div className="bg-rose-500/10 border border-rose-300/40 text-rose-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {loading ? (
            <div className="card text-center py-12 text-muted text-xs font-semibold border border-white/70">
              Loading officers directory...
            </div>
          ) : officers.length === 0 ? (
            <div className="card text-center py-12 space-y-3 border border-white/70 shadow-glass">
              <div className="w-12 h-12 bg-white/60 border border-white/80 rounded-2xl flex items-center justify-center mx-auto text-sage">
                <UserCheck size={24} />
              </div>
              <h3 className="text-sm font-bold text-charcoal">No Officers Registered Yet</h3>
              <p className="text-xs text-muted max-w-md mx-auto">
                Admin and officer accounts can be registered using the administrative onboarding API endpoint.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {officers.map((officer) => (
                <div key={officer.id} className="card-hover p-6 border border-white/70 shadow-glass-sm flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-11 h-11 rounded-2xl bg-charcoal text-white flex items-center justify-center font-bold text-base shadow-glass-sm border border-white/15">
                        {officer.full_name[0].toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-charcoal">{officer.full_name}</h3>
                        <span className="badge-investigation text-[10px] uppercase font-bold tracking-wider">
                          Official Investigator
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/60 text-xs">
                      <div className="flex items-center gap-2 text-charcoal/70">
                        <Mail size={13} className="text-sage" />
                        <span className="truncate font-medium">{officer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-charcoal/70">
                        <Shield size={13} className="text-emerald-600" />
                        <span className="font-medium">Security Clearance Level 3</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-white/60 flex items-center justify-between text-[11px] text-muted">
                    <span>Integrity & Anti-Graft Division</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* System Info Box (Glass) */}
          <div className="glass-panel p-5 space-y-2">
            <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
              <UserPlus size={14} className="text-sage" /> Officer Provisioning Guidelines
            </h4>
            <p className="text-xs text-muted leading-relaxed">
              New investigators are onboarded through the centralized directory service. Officers can be allocated to complaints directly within the Complaint Details view.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
