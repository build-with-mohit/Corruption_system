import CitizenSidebar from "../../components/CitizenSidebar";
import { CheckCircle2, AlertTriangle, Info, Clock, Bell } from "lucide-react";
import { Link } from "react-router-dom";

export default function CitizenNotifications() {
  const notifications = [
    {
      id: 1,
      type: "success",
      title: "Complaint Status Updated to In Progress",
      message: "Your complaint regarding Public Works Department has been acknowledged and assigned to Senior Officer Priya Sharma.",
      time: "2 hours ago",
      icon: CheckCircle2,
      color: "text-emerald-700 bg-emerald-500/15 border-emerald-300/40",
      link: "/portal/complaints",
    },
    {
      id: 2,
      type: "info",
      title: "Evidence Vault SHA-256 Hashed",
      message: "Uploaded photographic evidence has been cryptographically signed and archived to prevent post-submission tampering.",
      time: "1 day ago",
      icon: Info,
      color: "text-blue-700 bg-blue-500/15 border-blue-300/40",
      link: "/portal/complaints",
    },
    {
      id: 3,
      type: "alert",
      title: "Preliminary Review Notice",
      message: "The anti-corruption committee has begun formal triage for the Municipal Corporation tender allocation complaint.",
      time: "3 days ago",
      icon: AlertTriangle,
      color: "text-amber-800 bg-amber-500/15 border-amber-300/40",
      link: "/portal/complaints",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <CitizenSidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="badge-resolved text-[11px] font-bold">Alert Telemetry</span>
              </div>
              <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Notifications & Case Updates</h1>
              <p className="text-xs text-muted font-medium">Real-time status changes and investigator alerts.</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/60 border border-white/70 shadow-glass-sm text-charcoal flex items-center gap-1.5">
              <Bell size={13} className="text-sage" /> 3 New Updates
            </span>
          </div>

          <div className="space-y-3.5">
            {notifications.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="card-hover p-5 border border-white/70 shadow-glass flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 ${item.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-charcoal">{item.title}</h3>
                      <div className="flex items-center gap-1 text-[11px] text-muted font-mono">
                        <Clock size={12} />
                        <span>{item.time}</span>
                      </div>
                    </div>
                    <p className="text-xs text-charcoal/70 mt-1.5 leading-relaxed">{item.message}</p>
                    <div className="mt-3">
                      <Link
                        to={item.link}
                        className="text-xs font-bold text-sage hover:underline inline-flex items-center gap-1"
                      >
                        Inspect Case File &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
