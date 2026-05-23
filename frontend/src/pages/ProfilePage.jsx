import { motion as Motion } from "framer-motion";
import { useState } from "react";
import {
  Bell,
  Calendar,
  CheckCircle2,
  Loader2,
  Mail,
  Phone,
  Shield,
  User,
} from "lucide-react";
import clsx from "clsx";
import { PageShell } from "../components/PageShell";
import { GlassCard, GlassCardBody, GlassCardHeader } from "../components/dashboard/GlassCard";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import { Modal } from "../feedback/Modal";
import { useToast } from "../feedback/ToastContext";
import { useAuth } from "../auth/AuthContext";

function initials(name) {
  const parts = String(name || "U")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (!parts.length) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function roleLabel(role) {
  const r = String(role || "PATIENT").toUpperCase();
  return r.charAt(0) + r.slice(1).toLowerCase();
}

function ProfileStat({ stat, index }) {
  const Icon = stat.icon;
  return (
    <Motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.05 * index }}
      className="rounded-xl border border-slate-200/70 bg-white/50 px-3 py-2.5 dark:border-slate-800/70 dark:bg-slate-900/40"
    >
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        <Icon className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
        {stat.label}
      </div>
      <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{stat.value}</div>
    </Motion.div>
  );
}

function FormField({ label, icon: Icon, value, className, onChange, readOnly }) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      <div className="relative mt-2">
        {Icon ? (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        ) : null}
        <input
          className={clsx("input-modern", Icon && "pl-9")}
          value={value}
          readOnly={readOnly}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const isActive = Boolean(user?.isActive);
  const displayName = user?.name || "User";

  const [name, setName] = useState(displayName);
  const [phone, setPhone] = useState(user?.phone || "");
  const [emailReminders, setEmailReminders] = useState(true);
  const [queueAlerts, setQueueAlerts] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);

  const profileStats = [
    { label: "Appointments", value: "4", icon: Calendar },
    { label: "Last visit", value: "Mar 20", icon: CheckCircle2 },
    { label: "Alerts", value: queueAlerts ? "On" : "Off", icon: Bell },
  ];

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast.success("Profile preferences saved successfully.");
  }

  async function handlePasswordReset() {
    setPasswordBusy(true);
    await new Promise((r) => setTimeout(r, 1100));
    setPasswordBusy(false);
    setPasswordOpen(false);
    toast.success("Password reset link sent to your registered email.");
  }

  return (
    <PageShell title="Profile" subtitle="Personal details, preferences, and security.">
      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-1" delay={0}>
          <GlassCardBody className="space-y-5">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
              <div className="relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-xl font-bold text-white shadow-lg shadow-brand-600/25 ring-4 ring-white dark:ring-slate-900">
                  {initials(displayName)}
                </div>
                <span
                  className={clsx(
                    "absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-white dark:border-slate-900",
                    isActive ? "bg-emerald-500" : "bg-amber-400"
                  )}
                  title={isActive ? "Active" : "Pending verification"}
                />
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-1">
                <div className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-50">{displayName}</div>
                <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span className="badge badge-blue">{roleLabel(user?.role)}</span>
                  <StatusBadge status={isActive ? "ACTIVE" : "PENDING"} />
                </div>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Member since 2026 · Care portal</p>
              </div>
            </div>

            <div className="section-divider pt-4">
              <div className="grid grid-cols-3 gap-2">
                {profileStats.map((stat, i) => (
                  <ProfileStat key={stat.label} stat={stat} index={i} />
                ))}
              </div>
            </div>

            <div className="section-divider space-y-3 pt-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Account info</div>
              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/50 px-3 py-2.5 dark:border-slate-800/70 dark:bg-slate-800/30">
                  <Phone className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Phone</div>
                    <div className="truncate font-semibold text-slate-900 dark:text-slate-100">{user?.phone || "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-slate-50/50 px-3 py-2.5 dark:border-slate-800/70 dark:bg-slate-800/30">
                  <Mail className="h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
                  <div className="min-w-0">
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">Email</div>
                    <div className="truncate font-semibold text-slate-900 dark:text-slate-100">{user?.email || "—"}</div>
                  </div>
                </div>
              </div>
            </div>
          </GlassCardBody>
        </GlassCard>

        <GlassCard className="lg:col-span-2" delay={0.06}>
          <GlassCardHeader>
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                <Shield className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                Settings
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">Update personal information & security</div>
            </div>
          </GlassCardHeader>
          <GlassCardBody className="space-y-6">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Personal details</div>
              <div className="grid gap-4 lg:grid-cols-2">
                <FormField label="Full name" icon={User} value={name} onChange={(e) => setName(e.target.value)} />
                <FormField label="Phone" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} />
                <FormField label="Email" icon={Mail} value={user?.email || ""} readOnly className="lg:col-span-2" />
              </div>
            </div>

            <div className="section-divider pt-2">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Preferences</div>
              <div className="flex flex-wrap gap-3">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2.5 text-sm transition hover:border-brand-200 dark:border-slate-800 dark:bg-slate-900/50">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-brand-600"
                    checked={emailReminders}
                    onChange={(e) => setEmailReminders(e.target.checked)}
                  />
                  <span className="text-slate-700 dark:text-slate-300">Email appointment reminders</span>
                </label>
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2.5 text-sm transition hover:border-brand-200 dark:border-slate-800 dark:bg-slate-900/50">
                  <input
                    type="checkbox"
                    className="rounded border-slate-300 text-brand-600"
                    checked={queueAlerts}
                    onChange={(e) => setQueueAlerts(e.target.checked)}
                  />
                  <span className="text-slate-700 dark:text-slate-300">Queue status notifications</span>
                </label>
              </div>
            </div>

            <div className="section-divider flex flex-wrap gap-3 pt-4">
              <button type="button" className="btn btn-primary" disabled={saving} onClick={handleSave}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {saving ? "Saving…" : "Save changes"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setPasswordOpen(true)}>
                Change password
              </button>
            </div>
          </GlassCardBody>
        </GlassCard>
      </div>

      <Modal
        open={passwordOpen}
        onClose={() => !passwordBusy && setPasswordOpen(false)}
        title="Change password"
        description="We'll send a secure reset link to your registered email."
        footer={
          <>
            <button type="button" className="btn btn-ghost" disabled={passwordBusy} onClick={() => setPasswordOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary" disabled={passwordBusy} onClick={handlePasswordReset}>
              {passwordBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {passwordBusy ? "Sending…" : "Send reset link"}
            </button>
          </>
        }
      >
        <p className="text-sm text-slate-600 dark:text-slate-300">
          For your security, password changes are verified through your hospital identity provider. The link expires in 30
          minutes.
        </p>
      </Modal>
    </PageShell>
  );
}
