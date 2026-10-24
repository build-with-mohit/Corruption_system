import { useAuth } from "../../contexts/AuthContext";
import CitizenSidebar from "../../components/CitizenSidebar";
import { Mail, Phone, ShieldCheck, Calendar, Lock } from "lucide-react";
import { formatDate } from "../../utils/helpers";

export default function CitizenProfile() {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen">
      <CitizenSidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-resolved text-[11px] font-bold">Account Security</span>
            </div>
            <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Citizen Whistleblower Profile</h1>
            <p className="text-xs text-muted font-medium">
              Manage your personal credentials and cryptographic anonymity settings.
            </p>
          </div>

          {/* Profile Card (Glass) */}
          <div className="card p-7 border border-white/70 shadow-glass space-y-6">
            <div className="flex items-center gap-4 pb-6 border-b border-white/60">
              <div className="w-16 h-16 rounded-2xl bg-sage/20 border border-sage/30 text-sage font-extrabold text-2xl flex items-center justify-center shadow-glass-sm">
                {user?.full_name ? user.full_name[0].toUpperCase() : "U"}
              </div>
              <div>
                <h2 className="text-lg font-bold text-charcoal">{user?.full_name}</h2>
                <span className="badge-resolved capitalize mt-1">Verified Citizen Account</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white/40 border border-white/50 flex items-start gap-3.5">
                <div className="p-2 bg-sage/15 rounded-lg text-sage shrink-0">
                  <Mail size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-muted font-semibold uppercase tracking-wider">Email Address</div>
                  <div className="text-xs font-bold text-charcoal mt-0.5">{user?.email}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/40 border border-white/50 flex items-start gap-3.5">
                <div className="p-2 bg-sage/15 rounded-lg text-sage shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-muted font-semibold uppercase tracking-wider">Telephone</div>
                  <div className="text-xs font-bold text-charcoal mt-0.5">{user?.phone || "Not specified (Protected)"}</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/40 border border-white/50 flex items-start gap-3.5">
                <div className="p-2 bg-sage/15 rounded-lg text-sage shrink-0">
                  <Calendar size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-muted font-semibold uppercase tracking-wider">Account Active Since</div>
                  <div className="text-xs font-bold text-charcoal mt-0.5">
                    {user?.created_at ? formatDate(user.created_at) : "Recently"}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white/40 border border-white/50 flex items-start gap-3.5">
                <div className="p-2 bg-emerald-500/15 rounded-lg text-emerald-700 shrink-0">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <div className="text-[11px] text-muted font-semibold uppercase tracking-wider">Whistleblower Protection</div>
                  <div className="text-xs font-bold text-emerald-700 mt-0.5">Active & Cryptographically Isolated</div>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy & Security Card (Glass) */}
          <div className="card p-6 border border-white/70 shadow-glass space-y-3">
            <div className="flex items-center gap-2">
              <Lock size={18} className="text-charcoal" />
              <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider">Identity Concealment Protocol</h3>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              When filing complaints, you have full control over whether your personal identity is revealed to investigation officers.
              Your account password is encrypted using high-security bcrypt salting.
            </p>
            <div className="pt-2">
              <span className="badge-resolved font-bold text-xs">
                Zero-Telemetry Logging: Active
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
