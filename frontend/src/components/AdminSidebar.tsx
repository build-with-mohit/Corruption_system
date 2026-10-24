import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  Activity,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
  { label: "Complaints", to: "/admin/complaints", icon: FileText },
  { label: "Assign Officers", to: "/admin/officers", icon: UserCheck },
  { label: "Investigation Tracker", to: "/admin/tracker", icon: Activity },
  { label: "Users & Officers", to: "/admin/users", icon: Users, sub: true },
  { label: "Reports & Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", to: "/admin/settings", icon: Settings },
];

export default function AdminSidebar({ totalComplaints = 0 }: { totalComplaints?: number }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-52 shrink-0 glass-sidebar-dark flex flex-col h-screen sticky top-0 overflow-y-auto z-20">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <Logo dark />
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ label, to, icon: Icon, sub }) => {
          const active = location.pathname === to || (to !== "/admin" && location.pathname.startsWith(to));
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                active
                  ? "bg-white/15 text-white border border-white/20 shadow-glass-sm backdrop-blur-md"
                  : "text-white/60 hover:bg-white/5 hover:text-white border border-transparent"
              }`}
            >
              <Icon size={15} className={`shrink-0 ${active ? "text-sage-light" : "text-white/50"}`} />
              <span className="flex-1">{label}</span>
              {label === "Complaints" && totalComplaints > 0 && (
                <span className="bg-sage/40 text-emerald-200 border border-sage/50 text-[10px] font-bold rounded-full px-2 py-0.5">
                  {totalComplaints}
                </span>
              )}
              {sub && <ChevronRight size={12} className="opacity-40" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-white/10">
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 mb-3">
          <p className="text-[11px] text-white/50 leading-relaxed font-medium">
            Integrity & Audit Console
          </p>
          <span className="text-[10px] text-sage-light font-semibold uppercase tracking-wider">
            Secured Session
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-white/50 hover:text-rose-300 hover:bg-rose-500/10 p-2 rounded-lg text-xs font-medium transition-colors w-full"
        >
          <LogOut size={13} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
