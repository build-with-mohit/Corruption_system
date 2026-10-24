import { Shield } from "lucide-react";

export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          dark ? "bg-white" : "bg-charcoal"
        }`}
      >
        <Shield
          size={16}
          className={dark ? "text-charcoal" : "text-white"}
          strokeWidth={2.5}
        />
      </div>
      <span
        className={`font-semibold text-base tracking-tight ${
          dark ? "text-white" : "text-charcoal"
        }`}
      >
        CivicLedger
      </span>
    </div>
  );
}
