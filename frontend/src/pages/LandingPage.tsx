import { Link } from "react-router-dom";
import { Shield, FileText, Search, Users, ArrowRight, AlertTriangle, TrendingDown, CheckCircle2, Lock } from "lucide-react";
import Navbar from "../components/Navbar";

const processSteps = [
  {
    icon: Shield,
    label: "Step 01",
    sublabel: "Report Corruption",
  },
  {
    icon: FileText,
    label: "Step 02",
    sublabel: "Submit Evidence",
  },
  {
    icon: Search,
    label: "Step 03",
    sublabel: "Track Progress",
  },
  {
    icon: Users,
    label: "Step 04",
    sublabel: "Enforce Justice",
  },
];

const aboutCards = [
  {
    icon: AlertTriangle,
    title: "What is Corruption?",
    desc: "Corruption is the abuse of entrusted power for private gain. It undermines democratic institutions, distorts market competition, and stalls public welfare delivery.",
    tag: "Integrity Threat",
  },
  {
    icon: TrendingDown,
    title: "Impact on Society",
    desc: "Corruption diverts vital revenues away from healthcare, school infrastructure, and roads — disproportionately burdening vulnerable civic communities.",
    tag: "Socioeconomic Cost",
  },
  {
    icon: Shield,
    title: "How CivicLedger Protects You",
    desc: "CivicLedger enforces strict cryptographic detachment of whistleblower metadata, SHA-256 evidence hashing, and transparent tracking.",
    tag: "Protected Whistleblowing",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* ─── Hero Section ──────────────────────────────────────────────────── */}
      <section className="pt-24 pb-12 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40">
            {/* Background image & deep atmospheric gradient */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1600&q=80&auto=format')`,
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/75 to-charcoal/40 backdrop-blur-[2px]" />

            {/* Content Container */}
            <div className="relative min-h-[520px] p-8 sm:p-14 flex flex-col justify-center max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold uppercase tracking-wider mb-5 w-fit">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Next-Gen Whistleblower Infrastructure
              </div>

              <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 tracking-tight">
                Your Voice Against
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-beige to-sage-light">
                  Institutional Abuse.
                </span>
              </h1>

              <p className="text-white/80 text-base leading-relaxed mb-8 max-w-lg">
                Report bribery, fraud, and misconduct with zero exposure. Cryptographically secured, anonymously filed, and tracked with statutory accountability.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/register" className="btn-sage px-7 py-3 text-sm font-semibold shadow-glass">
                  File a Complaint &rarr;
                </Link>
                <a
                  href="#how-it-works"
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md border border-white/25 transition-all duration-200"
                >
                  How It Works
                </a>
              </div>

              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-white/15 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <Lock size={14} className="text-emerald-400" />
                  <span>256-bit Anonymity</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Legally Protected</span>
                </div>
              </div>
            </div>

            {/* Floating Glass Accent Card */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block w-72">
              <div className="card-dark p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="badge-resolved text-[11px] font-bold">Encrypted Case Vault</span>
                  <Shield size={16} className="text-sage-light" />
                </div>
                <p className="text-xs text-white/80 leading-relaxed font-light">
                  "Every citizen report dismantles a corrupt network. Submit documents, contracts, and audio records with tamper-proof audit trails."
                </p>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
                  <span>Zero Server IP Logging</span>
                  <span className="text-emerald-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Frosted Process Steps Strip ─────────────────────────────────── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="glass-panel p-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {processSteps.map(({ icon: Icon, label, sublabel }) => (
                <div
                  key={label}
                  className="flex items-center gap-3.5 p-4 rounded-xl bg-white/40 hover:bg-white/70 border border-white/40 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-xl bg-sage/15 border border-sage/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-sage" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{label}</p>
                    <p className="text-xs font-bold text-charcoal">{sublabel}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── About Section (Glassified) ────────────────────────────────────── */}
      <section id="about" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="badge-pending text-xs font-semibold px-3 py-1 mb-3">Institutional Integrity</span>
            <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mt-2 mb-3">
              Understanding Civic Corruption
            </h2>
            <p className="text-muted text-sm max-w-xl mx-auto leading-relaxed">
              Bribery, extortion, and tender collusion cripple societal progress. CivicLedger establishes a direct, transparent channel for civic accountability.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {aboutCards.map(({ icon: Icon, title, desc, tag }) => (
              <div key={title} className="card-hover p-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-xl bg-white/80 border border-white/80 shadow-glass-sm flex items-center justify-center">
                      <Icon size={20} className="text-sage" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-black/5 text-charcoal/70">
                      {tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-charcoal mb-2.5">{title}</h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-normal">{desc}</p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/40 flex items-center gap-1.5 text-xs font-semibold text-sage">
                  <span>Learn more about protections</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works (Glass Flow) ─────────────────────────────────────── */}
      <section id="how-it-works" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel p-8 sm:p-12">
            <div className="text-center mb-12">
              <span className="badge-investigation text-xs font-semibold px-3 py-1 mb-3">Workflow</span>
              <h2 className="text-3xl font-extrabold text-charcoal tracking-tight mt-2 mb-3">
                How Citizens Can Report
              </h2>
              <p className="text-muted text-sm max-w-xl mx-auto">
                Submitting a corruption dossier takes under three minutes and safeguards your digital identity.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { step: "01", title: "Create Anonymous ID", desc: "Register securely with hashed credentials. No telephone or real name required." },
                { step: "02", title: "Document Incident", desc: "Select department, specify date, location, and description of the unlawful demand." },
                { step: "03", title: "Upload Evidence", desc: "Attach images, recordings, invoices, or PDFs. Files are cryptographically sealed." },
                { step: "04", title: "Track Case Status", desc: "Follow investigation updates and officer notes with your immutable Complaint ID." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="p-6 rounded-2xl bg-white/50 border border-white/70 shadow-glass-sm flex flex-col justify-between hover:bg-white/80 transition-all duration-200">
                  <div>
                    <span className="text-3xl font-extrabold text-sage/30 block mb-3 font-mono">{step}</span>
                    <h3 className="text-sm font-bold text-charcoal mb-2">{title}</h3>
                    <p className="text-xs text-charcoal/70 leading-relaxed">{desc}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/60 text-[11px] font-semibold text-sage flex items-center gap-1">
                    <CheckCircle2 size={12} /> Verified Protocol
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center pt-6 border-t border-white/50">
              <Link to="/register" className="btn-primary px-8 py-3.5 text-sm font-semibold shadow-glass">
                File a Complaint Now
              </Link>
              <p className="mt-3 text-xs text-muted">
                Already registered?{" "}
                <Link to="/login" className="text-charcoal font-semibold underline hover:text-sage">
                  Sign in to your portal
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-12 border-t border-white/50 bg-charcoal-dark text-white/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
                  <Shield size={16} className="text-sage-light" />
                </div>
                <span className="text-white font-bold text-base tracking-tight">CivicLedger</span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed max-w-sm">
                Next-generation platform for citizens to report corruption, submit evidence, and demand institutional accountability.
              </p>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Platform</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><a href="/#about" className="hover:text-white transition-colors">About</a></li>
                <li><a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-3">Security & Legal</h4>
              <ul className="space-y-2 text-xs text-white/60">
                <li><span>Whistleblower Rights Act</span></li>
                <li><span>End-to-End Encryption</span></li>
                <li><span>Evidence Retention Standards</span></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
            <p>© 2025 CivicLedger. Independent civic integrity platform.</p>
            <p>Not affiliated with any government agency. Private whistleblower framework.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
