import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, Shield, KeyRound } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>();

  const fillDemo = (email: string) => {
    setValue("email", email);
    setValue("password", "Password123!");
  };

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setServerError("");
    try {
      await login(data.email, data.password);
      const stored = localStorage.getItem("access_token");
      if (stored) {
        const { authApi } = await import("../api");
        const me = await authApi.me();
        navigate(me.role === "admin" ? "/admin" : "/portal");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Login failed. Please try again.";
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Decorative ambient glass glowing spheres */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-sage/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Glass Card */}
        <div className="card p-8 sm:p-10 border border-white/80 shadow-glass">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <Logo />
            <h1 className="text-2xl font-extrabold text-charcoal mt-5 mb-1 tracking-tight">Welcome back</h1>
            <p className="text-xs text-muted font-medium text-center">
              Enter your credentials to access your secure portal
            </p>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="mb-6 p-3 rounded-xl bg-white/45 border border-white/60 shadow-glass-sm space-y-2">
            <div className="text-[11px] font-bold text-charcoal/70 uppercase tracking-wider flex items-center gap-1.5">
              <KeyRound size={12} className="text-sage" /> Quick Demo Fill
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillDemo("citizen@example.com")}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white/60 hover:bg-white text-[11px] font-medium text-charcoal transition-all border border-white/80"
              >
                👤 Citizen User
              </button>
              <button
                type="button"
                onClick={() => fillDemo("admin@civicledger.org")}
                className="text-left px-2.5 py-1.5 rounded-lg bg-white/60 hover:bg-white text-[11px] font-medium text-charcoal transition-all border border-white/80"
              >
                🛡️ Admin / Officer
              </button>
            </div>
          </div>

          {/* Error */}
          {serverError && (
            <div className="flex items-center gap-2.5 bg-rose-500/10 border border-rose-300/40 text-rose-800 rounded-xl px-4 py-3 mb-5 text-xs font-medium">
              <AlertCircle size={16} className="shrink-0" />
              {serverError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className={`input ${errors.email ? "border-red-400 focus:border-red-400" : ""}`}
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input pr-10 ${errors.password ? "border-red-400 focus:border-red-400" : ""}`}
                  placeholder="••••••••"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 justify-center text-sm font-semibold shadow-glass mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-white/60 text-center">
            <p className="text-xs text-muted font-medium">
              Don't have an account?{" "}
              <Link to="/register" className="text-sage font-bold hover:underline">
                Create one now
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-muted/80 mt-4 flex items-center justify-center gap-1.5">
          <Shield size={13} className="text-sage" /> End-to-end encrypted session
        </p>
      </div>
    </div>
  );
}
