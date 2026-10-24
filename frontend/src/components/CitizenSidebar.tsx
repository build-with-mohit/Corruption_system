import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  Bell,
  User,
  HelpCircle,
  LogOut,
} from "lucide-react";
import Logo from "./Logo";
import { useAuth } from "../contexts/AuthContext";

const links = [
  { label: "Dashboard", to: "/portal", icon: LayoutDashboard },
  { label: "Register Complaint", to: "/portal/new", icon: PlusCircle },
  { label: "My Complaints", to: "/portal/complaints", icon: FileText },
  { label: "Notifications", to: "/portal/notifications", icon: Bell, badge: 0 },
  { label: "Profile", to: "/portal/profile", icon: User },
  { label: "Help & Support", to: "/portal/help", icon: HelpCircle },
];

export default function CitizenSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-56 shrink-0 glass-sidebar flex flex-col h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/50">
        <Logo />
      </div>

      {/* User Info */}
      <div className="px-4 py-4 border-b border-white/50">
        <div className="p-2.5 rounded-xl bg-white/45 border border-white/60 shadow-glass-sm flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-sage/20 border border-sage/30 flex items-center justify-center text-sage font-bold text-sm shrink-0">
            {user?.full_name?.slice(0, 2).toUpperCase() || "CI"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-charcoal truncate">{user?.full_name}</p>
            <p className="text-[11px] font-medium text-sage truncate flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block animate-pulse" />
              Citizen
            </p>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ label, to, icon: Icon, badge }) => {
          const active = location.pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                active
                  ? "bg-white/85 text-charcoal shadow-glass-sm border border-white/90"
                  : "text-charcoal/70 hover:bg-white/45 hover:text-charcoal border border-transparent"
              }`}
            >
              <Icon size={16} className={`shrink-0 ${active ? "text-sage" : "text-charcoal/50"}`} />
              <span className="flex-1">{label}</span>
              {typeof badge === "number" && badge > 0 && (
                <span className="bg-sage text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 shadow-sm">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-white/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-charcoal/70 hover:bg-rose-500/10 hover:text-rose-700 hover:border-rose-300/30 border border-transparent transition-all duration-200 w-full"
        >
          <LogOut size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
