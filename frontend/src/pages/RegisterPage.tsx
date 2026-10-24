import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import Logo from "../components/Logo";

interface RegisterForm {
  full_name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: authRegister } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch("password");

  const passwordChecks = {
    length: (password || "").length >= 8,
    upper: /[A-Z]/.test(password || ""),
    number: /[0-9]/.test(password || ""),
  };

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setServerError("");
    try {
      await authRegister({
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        phone: data.phone,
      });
      navigate("/portal");
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Registration failed. Please try again.";
      setServerError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-sage/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="card p-8 sm:p-10 border border-white/80 shadow-glass">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <Logo />
            <h1 className="text-2xl font-extrabold text-charcoal mt-5 mb-1 tracking-tight">Create your account</h1>
            <p className="text-xs text-muted font-medium text-center">
              Join CivicLedger to report and track complaints securely
            </p>
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
              <label className="label">Full Name</label>
              <input
                type="text"
                className={`input ${errors.full_name ? "border-red-400" : ""}`}
                placeholder="Aarav Sharma"
                {...register("full_name", { required: "Full name is required" })}
              />
              {errors.full_name && (
                <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>
              )}
            </div>

            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className={`input ${errors.email ? "border-red-400" : ""}`}
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
              <label className="label">Phone <span className="text-muted normal-case font-normal">(optional)</span></label>
              <input
                type="tel"
                className="input"
                placeholder="+91 98765 43210"
                {...register("phone")}
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input pr-10 ${errors.password ? "border-red-400" : ""}`}
                  placeholder="Min. 8 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "At least 8 characters required" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-charcoal p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength indicators */}
              {password && (
                <div className="mt-2.5 p-3 rounded-xl bg-white/40 border border-white/60 space-y-1.5 text-[11px]">
                  <div className={`flex items-center gap-1.5 font-medium ${passwordChecks.length ? "text-emerald-700" : "text-muted"}`}>
                    <CheckCircle size={13} className={passwordChecks.length ? "text-emerald-600" : "text-muted/40"} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center gap-1.5 font-medium ${passwordChecks.upper ? "text-emerald-700" : "text-muted"}`}>
                    <CheckCircle size={13} className={passwordChecks.upper ? "text-emerald-600" : "text-muted/40"} />
                    At least one uppercase letter
                  </div>
                  <div className={`flex items-center gap-1.5 font-medium ${passwordChecks.number ? "text-emerald-700" : "text-muted"}`}>
                    <CheckCircle size={13} className={passwordChecks.number ? "text-emerald-600" : "text-muted/40"} />
                    At least one number
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="label">Confirm Password</label>
              <input
                type="password"
                className={`input ${errors.confirmPassword ? "border-red-400" : ""}`}
                placeholder="Repeat password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (val) => val === password || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 justify-center text-sm font-semibold shadow-glass mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 pt-6 border-t border-white/60 text-center">
            <p className="text-xs text-muted font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-sage font-bold hover:underline">
                Sign in here
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
