import { AnimatePresence, motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Check, Loader2, Lock, Mail, Phone, User } from "lucide-react";
import { useAuth } from "../auth/AuthContext";
import { useToast } from "../feedback/ToastContext";
import { AuthBackground } from "../components/auth/AuthBackground";
import { AuthHeroPanel } from "../components/auth/AuthHeroPanel";
import { AppLogo } from "../components/brand/AppLogo";
import { AuthInput } from "../components/auth/AuthInput";
import { cn } from "../lib/cn";

const REMEMBER_KEY = "hqms_remember_email";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const toast = useToast();
  const nav = useNavigate();
  const loc = useLocation();

  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        setEmail(saved);
        setRememberMe(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setErr("");
    setInfo("");
  }, [mode]);

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await signup(name, email, password, phone || undefined);

      try {
        if (rememberMe) localStorage.setItem(REMEMBER_KEY, email.trim());
        else localStorage.removeItem(REMEMBER_KEY);
      } catch {
        /* ignore */
      }

      nav(loc.state?.from || "/", { replace: true });
    } catch (error) {
      setErr(error.message || "Authentication failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-100">
      <AuthBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1200px] flex-col lg:mx-0 lg:max-w-none lg:grid lg:grid-cols-2">
        <AuthHeroPanel />

        <div className="relative flex flex-1 items-center justify-center px-4 pb-14 pt-2 sm:px-8 lg:px-12 lg:pb-16 lg:pt-6">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent lg:bg-gradient-to-l" />

          <Motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-[440px]"
          >
            <Motion.div
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className={cn(
                "rounded-[28px] border border-white/15 bg-white/[0.07] p-7 shadow-[0_28px_90px_-28px_rgba(0,0,0,0.75)] backdrop-blur-2xl",
                "sm:p-8"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-4 lg:hidden">
                    <AppLogo size="md" variant="light" showText={false} />
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-300/80">Secure access</div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-[26px]">
                    {mode === "login" ? "Welcome back" : "Create your account"}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">
                    {mode === "login"
                      ? "Sign in to orchestrate queues, appointments, and live operational signals."
                      : "Join as a patient to book visits and track your place in line."}
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-white/10 bg-black/20 p-1">
                <div className="grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className={cn(
                      "relative rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-300",
                      mode === "login" ? "text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {mode === "login" ? (
                      <Motion.span
                        layoutId="authTab"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/25 via-blue-600/25 to-indigo-500/25 shadow-inner shadow-sky-500/10"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative z-10">Sign in</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className={cn(
                      "relative rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-300",
                      mode === "signup" ? "text-white" : "text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {mode === "signup" ? (
                      <Motion.span
                        layoutId="authTab"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-sky-500/25 via-blue-600/25 to-indigo-500/25 shadow-inner shadow-sky-500/10"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    ) : null}
                    <span className="relative z-10">Create account</span>
                  </button>
                </div>
              </div>

              <form className="mt-7 space-y-4" onSubmit={onSubmit}>
                <AnimatePresence initial={false} mode="popLayout">
                  {mode === "signup" ? (
                    <Motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                      className="space-y-4 overflow-hidden"
                    >
                      <AuthInput
                        id="auth-name"
                        label="Full name"
                        icon={User}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoComplete="name"
                        placeholder="e.g. Jordan Lee"
                        disabled={busy}
                      />
                      <AuthInput
                        id="auth-phone"
                        label="Phone (optional)"
                        icon={Phone}
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        autoComplete="tel"
                        placeholder="+1 (555) 000-0000"
                        disabled={busy}
                      />
                    </Motion.div>
                  ) : null}
                </AnimatePresence>

                <AuthInput
                  id="auth-email"
                  label="Work email"
                  icon={Mail}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="you@hospital.org"
                  disabled={busy}
                />

                <AuthInput
                  id="auth-password"
                  label="Password"
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  placeholder="••••••••"
                  disabled={busy}
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                  <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="peer sr-only"
                      disabled={busy}
                    />
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-md border transition-all duration-300",
                        "border-white/15 bg-white/[0.04] peer-focus-visible:ring-2 peer-focus-visible:ring-sky-400/40",
                        "peer-checked:border-sky-400/50 peer-checked:bg-sky-500/20 peer-checked:text-sky-100"
                      )}
                      aria-hidden
                    >
                      <Check
                        className={cn("h-3.5 w-3.5 transition-opacity", rememberMe ? "opacity-100" : "opacity-0")}
                        strokeWidth={3}
                      />
                    </span>
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-sky-300/90 underline-offset-4 transition-colors hover:text-sky-200 hover:underline"
                    onClick={() => {
                      setErr("");
                      setInfo("");
                      toast.info("A secure reset link will be sent to your registered hospital email.", {
                        title: "Password reset",
                      });
                    }}
                  >
                    Forgot password?
                  </button>
                </div>

                <AnimatePresence>
                  {err ? (
                    <Motion.div
                      key="err"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-xl border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-sm text-rose-100"
                    >
                      {err}
                    </Motion.div>
                  ) : null}
                  {info ? (
                    <Motion.div
                      key="info"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="rounded-xl border border-sky-400/25 bg-sky-500/10 px-3 py-2 text-sm text-sky-50"
                    >
                      {info}
                    </Motion.div>
                  ) : null}
                </AnimatePresence>

                <Motion.button
                  type="submit"
                  disabled={busy}
                  whileHover={busy ? undefined : { y: -1 }}
                  whileTap={busy ? undefined : { scale: 0.985 }}
                  className={cn(
                    "group relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold text-white",
                    "bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600",
                    "shadow-[0_16px_40px_-18px_rgba(37,99,235,0.75)] ring-1 ring-white/10",
                    "transition-[filter,transform] duration-300 hover:brightness-110",
                    "disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:brightness-100"
                  )}
                >
                  <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-hover:duration-700" />
                  {busy ? <Loader2 className="relative h-4 w-4 animate-spin" aria-hidden /> : null}
                  <span className="relative">
                    {busy ? "Authenticating…" : mode === "login" ? "Sign in" : "Create account"}
                  </span>
                  {!busy ? <ArrowRight className="relative h-4 w-4 transition-transform group-hover:translate-x-0.5" /> : null}
                </Motion.button>
              </form>

              <p className="mt-6 text-center text-xs text-slate-500">
                By continuing you agree to internal access policies for this deployment.
              </p>
            </Motion.div>
          </Motion.div>
        </div>
      </div>
    </div>
  );
}
