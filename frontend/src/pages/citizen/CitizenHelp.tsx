import CitizenSidebar from "../../components/CitizenSidebar";
import { HelpCircle, Shield, PhoneCall, BookOpen, ExternalLink, ShieldCheck } from "lucide-react";

export default function CitizenHelp() {
  const faqs = [
    {
      q: "Can the accused official or department access my whistleblower identity?",
      a: "No. CivicLedger enforces cryptographic separation between user authentication credentials and complaint records. Accused entities only receive anonymized factual statements and audited evidence files.",
    },
    {
      q: "What types of evidence are accepted by investigation officers?",
      a: "You can upload high-resolution photos (JPEG, PNG), audio recordings, video clips (MP4), and documents (PDF, DOCX) up to 50MB per file. Each file is SHA-256 hashed upon ingestion.",
    },
    {
      q: "What is the typical timeline for complaint triage and investigation?",
      a: "Triage is completed within 48 to 72 hours. Formal investigations are assigned to dedicated compliance officers with statutory audit timelines under our 30-day escalation protocol.",
    },
    {
      q: "What protections exist against retaliatory harassment?",
      a: "Whistleblowers are protected under statutory whistleblower immunity provisions. Filing verified reports cannot be cited as grounds for official disciplinary retribution.",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <CitizenSidebar />

      <main className="flex-1 p-8 overflow-y-auto space-y-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="badge-resolved text-[11px] font-bold">Whistleblower Support</span>
            </div>
            <h1 className="text-2xl font-extrabold text-charcoal mt-1 tracking-tight">Legal Protection & Help Center</h1>
            <p className="text-xs text-muted font-medium">
              Guidelines, Whistleblower Immunity Rights, and Emergency Integrity Hotlines.
            </p>
          </div>

          {/* Emergency Helpline Banner (Dark Glass) */}
          <div className="card-dark p-7 border border-white/15 shadow-glass-dark space-y-3.5">
            <div className="flex items-center gap-2 text-sage-light">
              <Shield size={20} />
              <span className="text-xs uppercase tracking-wider font-extrabold">Emergency Whistleblower Hotline</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed font-light">
              If you or your family are facing direct intimidation, physical threats, or coercion regarding a corruption filing, reach out immediately to the Independent Protective Inspectorate:
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs bg-white/10 border border-white/15 px-3.5 py-2 rounded-xl text-white font-mono">
                <PhoneCall size={14} className="text-emerald-400" />
                1-800-CIVIC-ALERT (Toll Free 24/7)
              </div>
              <div className="flex items-center gap-2 text-xs bg-white/10 border border-white/15 px-3.5 py-2 rounded-xl text-white font-mono">
                secure-tips@civicledger.org
              </div>
            </div>
          </div>

          {/* FAQ Accordion (Glass) */}
          <div className="card p-6 border border-white/70 shadow-glass space-y-4">
            <div className="flex items-center gap-2 border-b border-white/60 pb-3.5">
              <BookOpen size={18} className="text-charcoal" />
              <h2 className="text-xs font-bold text-charcoal uppercase tracking-wider">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-white/50">
              {faqs.map((faq, idx) => (
                <div key={idx} className="py-4 first:pt-1 last:pb-1">
                  <div className="text-xs font-bold text-charcoal flex items-start gap-2.5">
                    <HelpCircle size={15} className="text-sage shrink-0 mt-0.5" />
                    <span>{faq.q}</span>
                  </div>
                  <p className="text-xs text-charcoal/70 mt-2 pl-6 leading-relaxed font-normal">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines Box (Glass) */}
          <div className="glass-panel p-6 space-y-2">
            <h3 className="text-xs font-bold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck size={16} className="text-sage" /> Statutory Legal Standards
            </h3>
            <p className="text-xs text-muted leading-relaxed">
              CivicLedger strictly adheres to international transparency guidelines, Freedom of Information protocols, and cryptographic evidence preservation.
            </p>
            <a
              href="https://transparency.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-sage font-bold mt-2 hover:underline"
            >
              Transparency International Guidelines <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
