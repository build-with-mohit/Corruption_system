import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "About", to: "/#about" },
    { label: "How It Works", to: "/#how-it-works" },
  ];

  return (
    <nav className="fixed top-0 inset-x-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="transition-transform duration-200 hover:scale-[1.02]">
            <Logo />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/40 border border-white/60 shadow-glass-sm backdrop-blur-md">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.to}
                className="text-xs font-semibold px-4 py-1.5 rounded-full text-charcoal/70 hover:text-charcoal hover:bg-white/70 transition-all duration-200"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/portal"}
                  className="btn-ghost text-sm font-medium"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="btn-primary text-sm shadow-glass">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-xl bg-white/50 border border-white/60 backdrop-blur-md text-charcoal"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/60 bg-white/90 backdrop-blur-2xl px-5 py-4 space-y-2 shadow-glass">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.to}
              className="block py-2 text-sm font-medium text-charcoal hover:text-sage transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={user.role === "admin" ? "/admin" : "/portal"}
                  className="btn-secondary w-full justify-center"
                >
                  Dashboard
                </Link>
                <button onClick={handleLogout} className="btn-primary w-full justify-center">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary w-full justify-center">
                  Login
                </Link>
                <Link to="/register" className="btn-primary w-full justify-center">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
