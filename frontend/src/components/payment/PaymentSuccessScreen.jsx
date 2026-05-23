import { motion as Motion } from "framer-motion";
import { Check, Mail, MessageSquare, ShieldCheck } from "lucide-react";
import { formatINR, formatPaymentTimestamp } from "../../lib/paymentSimulation";

function NotifyRow({ icon: Icon, title, detail, delay }) {
  return (
    <Motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-white/80 px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900/50"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">{title}</div>
        <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{detail}</div>
      </div>
      <Motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: delay + 0.2, type: "spring", stiffness: 400 }}
        className="ml-auto shrink-0 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400"
      >
        Sent
      </Motion.span>
    </Motion.div>
  );
}

export function PaymentSuccessScreen({ result, email, phone, onDone }) {
  const { transactionId, amount, method, paidAt } = result;

  return (
    <div className="text-center">
      <Motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
        className="relative mx-auto flex h-20 w-20 items-center justify-center"
      >
        <span className="absolute inset-0 rounded-full bg-emerald-400/20 animate-ping" />
        <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/30">
          <Motion.div initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}>
            <Check className="h-10 w-10 text-white" strokeWidth={2.5} />
          </Motion.div>
        </span>
      </Motion.div>

      <Motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mt-5 text-xl font-bold text-slate-900 dark:text-slate-50"
      >
        Payment successful
      </Motion.h3>
      <Motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.22 }}
        className="mt-1 text-sm text-slate-500 dark:text-slate-400"
      >
        {formatINR(amount)} paid via {method}
      </Motion.p>

      <Motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="mt-6 space-y-2 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 text-left dark:border-slate-800 dark:bg-slate-900/40"
      >
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-500">Transaction ID</span>
          <span className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100">{transactionId}</span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-500">Status</span>
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            Payment successful
          </span>
        </div>
        <div className="flex justify-between gap-4 text-sm">
          <span className="text-slate-500">Paid at</span>
          <span className="text-right text-xs font-medium text-slate-800 dark:text-slate-200">
            {formatPaymentTimestamp(paidAt)}
          </span>
        </div>
      </Motion.div>

      <div className="mt-4 space-y-2 text-left">
        <NotifyRow
          icon={Mail}
          title="Receipt emailed"
          detail={`Receipt sent to ${email}`}
          delay={0.38}
        />
        <NotifyRow
          icon={MessageSquare}
          title="SMS confirmation"
          detail={`SMS confirmation sent to ${phone}`}
          delay={0.48}
        />
      </div>

      <Motion.button
        type="button"
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        onClick={onDone}
        className="btn btn-primary mt-6 w-full"
      >
        Done
      </Motion.button>
    </div>
  );
}
