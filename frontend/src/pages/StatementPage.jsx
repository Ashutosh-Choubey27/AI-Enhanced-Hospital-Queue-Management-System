import { motion as Motion } from "framer-motion";
import clsx from "clsx";
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ChevronRight,
  FlaskConical,
  IndianRupee,
  ListOrdered,
  Pill,
  Receipt,
  Stethoscope,
  Wallet,
  CircleDollarSign,
} from "lucide-react";
import { Modal } from "../feedback/Modal";
import { useToast } from "../feedback/ToastContext";
import { useAuth } from "../auth/AuthContext";
import { PageShell } from "../components/PageShell";
import { PaymentCheckoutModal } from "../components/payment/PaymentCheckoutModal";
import { GlassCard, GlassCardBody, GlassCardHeader } from "../components/dashboard/GlassCard";
import { StatusBadge } from "../components/dashboard/StatusBadge";
import { TrendBadge } from "../components/dashboard/TrendBadge";
import { AnalyticsChip } from "../components/statement/AnalyticsChip";
import { MiniBillingChart } from "../components/statement/MiniBillingChart";
import { PayNowButton } from "../components/statement/PayNowButton";
import { SectionTitle } from "../components/statement/SectionTitle";
import { SettlementRate } from "../components/statement/SettlementRate";
import { formatINR as formatINRUtil } from "../lib/paymentSimulation";

const CARD_SURFACE =
  "shadow-soft ring-1 ring-slate-200/40 dark:ring-slate-800/50 backdrop-blur-xl bg-white/70 dark:bg-slate-900/60";

const INITIAL_ITEMS = [
  { id: 1, label: "Consultation fee", amount: 500, status: "PAID", date: "Mar 25, 2026", type: "consultation" },
  { id: 2, label: "Lab tests", amount: 1200, status: "DUE", date: "Mar 27, 2026", type: "lab" },
  { id: 3, label: "Pharmacy — prescriptions", amount: 340, status: "PAID", date: "Mar 22, 2026", type: "pharmacy" },
];

const TYPE_META = {
  consultation: {
    icon: Stethoscope,
    tone: "bg-brand-50 text-brand-700 ring-brand-100 dark:bg-brand-950/40 dark:text-brand-200 dark:ring-brand-900/50",
  },
  lab: {
    icon: FlaskConical,
    tone: "bg-violet-50 text-violet-700 ring-violet-100 dark:bg-violet-950/40 dark:text-violet-200 dark:ring-violet-900/50",
  },
  pharmacy: {
    icon: Pill,
    tone: "bg-teal-50 text-teal-700 ring-teal-100 dark:bg-teal-950/40 dark:text-teal-200 dark:ring-teal-900/50",
  },
  payment: {
    icon: CircleDollarSign,
    tone: "bg-emerald-50 text-emerald-700 ring-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-200 dark:ring-emerald-900/50",
  },
};

function formatINR(n) {
  return formatINRUtil(n);
}

function todayLabel() {
  return new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
}

function TransactionRow({ item, index, onOpen, highlight }) {
  const meta = TYPE_META[item.type] || TYPE_META.consultation;
  const Icon = meta.icon;

  return (
    <Motion.button
      type="button"
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.38, delay: 0.05 * index, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ x: 3 }}
      onClick={() => onOpen(item)}
      className={clsx(
        "group flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl border px-4 py-3.5 text-left shadow-sm ring-1 backdrop-blur-sm transition-[border-color,background-color,box-shadow,ring-color] duration-300",
        highlight
          ? "border-emerald-300/70 bg-emerald-50/80 ring-emerald-200/60 dark:border-emerald-800/50 dark:bg-emerald-950/30"
          : "border-slate-200/70 bg-white/55 ring-transparent hover:border-brand-200/70 hover:bg-white/90 hover:shadow-md hover:ring-brand-100/80 dark:border-slate-800/70 dark:bg-slate-900/35 dark:hover:border-brand-800/50 dark:hover:bg-slate-900/65 dark:hover:ring-brand-900/40"
      )}
    >
      <div className="flex min-w-0 items-center gap-3.5">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 ${meta.tone}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Receipt className="h-3 w-3 shrink-0 opacity-60" />
            {item.date}
            {item.transactionRef ? (
              <span className="font-mono text-[10px] text-emerald-700 dark:text-emerald-400">{item.transactionRef}</span>
            ) : null}
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2.5 sm:gap-3">
        <span className="text-sm font-bold tabular-nums text-slate-900 dark:text-slate-100">{formatINR(item.amount)}</span>
        <StatusBadge status={item.status} />
        <ChevronRight className="hidden h-4 w-4 text-slate-300 opacity-0 transition-all group-hover:opacity-100 sm:block dark:text-slate-600" />
      </div>
    </Motion.button>
  );
}

export default function StatementPage() {
  const toast = useToast();
  const { user } = useAuth();
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [payOpen, setPayOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [justPaidId, setJustPaidId] = useState(null);

  const dueItems = useMemo(() => items.filter((i) => i.status === "DUE"), [items]);
  const total = items.reduce((s, i) => s + i.amount, 0);
  const paid = items.filter((i) => i.status === "PAID").reduce((s, i) => s + i.amount, 0);
  const due = dueItems.reduce((s, i) => s + i.amount, 0);
  const paidCount = items.filter((i) => i.status === "PAID").length;
  const settlementPct = total > 0 ? Math.round((paid / total) * 100) : 0;

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => (a.id > b.id ? -1 : 1)),
    [items]
  );

  function handlePay() {
    if (due <= 0) {
      toast.info("You have no outstanding balance this cycle.");
      return;
    }
    setPayOpen(true);
  }

  function handlePaymentComplete(result) {
    const paidAt = todayLabel();
    const paymentId = Date.now();
    setItems((prev) => {
      const settled = prev.map((item) =>
        item.status === "DUE" ? { ...item, status: "PAID", date: paidAt } : item
      );
      const paymentRow = {
        id: paymentId,
        label: "Online payment — outstanding dues",
        amount: result.amount,
        status: "PAID",
        date: paidAt,
        type: "payment",
        transactionRef: result.transactionId,
        highlight: true,
      };
      return [paymentRow, ...settled];
    });
    setJustPaidId(paymentId);
    window.setTimeout(() => setJustPaidId(null), 4000);
    toast.success(`Payment successful · ${result.transactionId}`, {
      title: formatINR(result.amount),
    });
  }

  return (
    <PageShell
      title="Statement"
      subtitle="Payments, dues, and billing summary."
      maxWidth="max-w-6xl"
      actions={<PayNowButton onClick={handlePay} disabled={payOpen} />}
    >
      <div className="relative">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-6 top-0 h-48 w-48 rounded-full bg-brand-400/8 blur-3xl dark:bg-brand-500/10"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 bottom-0 h-56 w-56 rounded-full bg-slate-300/20 blur-3xl dark:bg-slate-700/15"
        />

        <div className="relative rounded-2xl border border-slate-200/40 bg-gradient-to-br from-slate-100/80 via-slate-50/50 to-brand-50/25 p-4 sm:p-5 dark:border-slate-800/40 dark:from-slate-900/60 dark:via-slate-950/40 dark:to-brand-950/15">
          <div className="grid gap-5 lg:gap-6 xl:grid-cols-12">
            <GlassCard className={`xl:col-span-4 ${CARD_SURFACE}`} delay={0}>
              <GlassCardHeader>
                <SectionTitle
                  icon={Wallet}
                  title="Payment summary"
                  subtitle="March 2026 · billing cycle"
                  badge={
                    <TrendBadge
                      trend={{ dir: due > 0 ? "down" : "up", pct: due > 0 ? 8 : 12 }}
                      positiveText={(p) => `↑ ${p.toFixed(0)}% settled`}
                      negativeText={(p) => `↓ ${p.toFixed(0)}% outstanding`}
                    />
                  }
                />
              </GlassCardHeader>
              <GlassCardBody className="space-y-5">
                <Motion.div
                  key={`total-${paid}-${due}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Total billed
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <IndianRupee className="h-6 w-6 text-brand-600 dark:text-brand-400" />
                    <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
                      {total.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                    {paidCount} of {items.length} line items settled · updated {todayLabel()}
                  </p>
                </Motion.div>

                <div className="section-divider pt-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Motion.div
                      key={`paid-${paid}`}
                      layout
                      whileHover={{ y: -2 }}
                      className="rounded-xl border border-emerald-200/60 bg-emerald-50/60 px-3 py-3 shadow-sm dark:border-emerald-900/50 dark:bg-emerald-950/25"
                    >
                      <div className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300">
                        Paid
                      </div>
                      <Motion.div
                        key={paid}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        className="mt-1 text-lg font-bold tabular-nums text-emerald-800 dark:text-emerald-100"
                      >
                        {formatINR(paid)}
                      </Motion.div>
                    </Motion.div>
                    <Motion.div
                      key={`due-${due}`}
                      layout
                      whileHover={{ y: -2 }}
                      className={clsx(
                        "rounded-xl border px-3 py-3 shadow-sm transition-colors",
                        due > 0
                          ? "border-amber-200/60 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/25"
                          : "border-emerald-200/60 bg-emerald-50/40 dark:border-emerald-900/50 dark:bg-emerald-950/20"
                      )}
                    >
                      <div
                        className={clsx(
                          "text-[11px] font-semibold uppercase tracking-wide",
                          due > 0 ? "text-amber-800 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"
                        )}
                      >
                        Outstanding
                      </div>
                      <Motion.div
                        key={due}
                        initial={{ scale: 1.05 }}
                        animate={{ scale: 1 }}
                        className={clsx(
                          "mt-1 text-lg font-bold tabular-nums",
                          due > 0 ? "text-amber-900 dark:text-amber-100" : "text-emerald-800 dark:text-emerald-100"
                        )}
                      >
                        {formatINR(due)}
                      </Motion.div>
                    </Motion.div>
                  </div>
                </div>

                <MiniBillingChart paid={paid} due={due} delay={0.18} />

                <SettlementRate percent={settlementPct} monthTrendPct={12} hasOutstanding={due > 0} />
              </GlassCardBody>
            </GlassCard>

            <GlassCard className={`xl:col-span-8 ${CARD_SURFACE}`} delay={0.06}>
              <GlassCardHeader>
                <SectionTitle
                  icon={ListOrdered}
                  title="Transactions"
                  subtitle="Recent hospital charges & payments"
                  badge={
                    <AnalyticsChip
                      icon={ArrowDownRight}
                      label={`${items.length} items`}
                      tone="slate"
                      className="rounded-full px-3 py-1.5"
                    />
                  }
                />
              </GlassCardHeader>
              <GlassCardBody className="space-y-2.5 sm:space-y-3">
                {sortedItems.map((item, index) => (
                  <TransactionRow
                    key={item.id}
                    item={item}
                    index={index}
                    onOpen={setDetail}
                    highlight={item.id === justPaidId || Boolean(item.highlight)}
                  />
                ))}
              </GlassCardBody>
            </GlassCard>
          </div>
        </div>
      </div>

      <PaymentCheckoutModal
        open={payOpen}
        onClose={() => setPayOpen(false)}
        amount={due}
        dueItems={dueItems}
        userEmail={user?.email}
        userPhone={user?.phone}
        onPaymentComplete={handlePaymentComplete}
      />

      <Modal
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={detail?.label}
        description={detail ? `${detail.date} · ${detail.status}` : ""}
        footer={
          detail?.status === "DUE" ? (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setDetail(null);
                handlePay();
              }}
            >
              Pay this charge
            </button>
          ) : (
            <button type="button" className="btn btn-ghost" onClick={() => setDetail(null)}>
              Close
            </button>
          )
        }
      >
        {detail ? (
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="font-bold tabular-nums">{formatINR(detail.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Category</span>
              <span className="font-semibold capitalize">{detail.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Reference</span>
              <span className="font-mono text-xs">
                {detail.transactionRef || `INV-${String(detail.id).padStart(5, "0")}`}
              </span>
            </div>
          </div>
        ) : null}
      </Modal>
    </PageShell>
  );
}
