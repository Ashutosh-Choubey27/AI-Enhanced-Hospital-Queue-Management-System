import { AnimatePresence, motion as Motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useMemo, useState } from "react";
import {
  Building2,
  CreditCard,
  Loader2,
  QrCode,
  Shield,
  Smartphone,
  X,
} from "lucide-react";
import clsx from "clsx";
import {
  HOSPITAL_UPI_ID,
  buildUpiPayload,
  formatINR,
  generateTransactionId,
  maskEmail,
  maskPhone,
} from "../../lib/paymentSimulation";
import { PaymentSuccessScreen } from "./PaymentSuccessScreen";

const METHODS = [
  { id: "upi", label: "UPI / QR", icon: QrCode },
  { id: "card", label: "Card", icon: CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Building2 },
];

const BANKS = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra"];

const slide = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
};

function VerifyingOverlay({ message }) {
  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl bg-white/90 backdrop-blur-md dark:bg-slate-950/90"
    >
      <Loader2 className="h-10 w-10 animate-spin text-brand-600" />
      <p className="mt-4 text-sm font-semibold text-slate-800 dark:text-slate-200">{message}</p>
      <p className="mt-1 text-xs text-slate-500">Secured by Hospital Queue Pay · simulation</p>
    </Motion.div>
  );
}

function UpiPanel({ amount, qrValue, secondsLeft, waiting }) {
  return (
    <Motion.div key="upi" {...slide} className="space-y-4">
      <div className="relative mx-auto w-fit rounded-2xl border-2 border-slate-200 bg-white p-4 shadow-lg dark:border-slate-700 dark:bg-white">
        <QRCodeSVG value={qrValue} size={168} level="M" includeMargin />
        {waiting ? (
          <>
            <Motion.div
              className="pointer-events-none absolute inset-4 overflow-hidden rounded-lg"
              initial={false}
            >
              <Motion.div
                className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-500 to-transparent shadow-[0_0_12px_rgba(74,103,255,0.8)]"
                animate={{ top: ["8%", "92%", "8%"] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </Motion.div>
            <span className="absolute -right-1 -top-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-70" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-500" />
            </span>
          </>
        ) : null}
      </div>

      <div className="text-center">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">UPI ID</div>
        <div className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-slate-100">{HOSPITAL_UPI_ID}</div>
        <div className="mt-2 text-lg font-bold text-brand-700 dark:text-brand-300">{formatINR(amount)}</div>
      </div>

      {waiting ? (
        <div className="flex items-center justify-center gap-2 rounded-xl border border-brand-200/60 bg-brand-50/50 px-3 py-2.5 text-sm font-medium text-brand-800 dark:border-brand-900/50 dark:bg-brand-950/30 dark:text-brand-200">
          <Loader2 className="h-4 w-4 animate-spin" />
          Waiting for payment… {secondsLeft}s
        </div>
      ) : (
        <p className="text-center text-xs text-slate-500">Scan with any UPI app · PhonePe, GPay, Paytm</p>
      )}
    </Motion.div>
  );
}

function CardPanel() {
  return (
    <Motion.div key="card" {...slide} className="space-y-3">
      <input className="input-modern font-mono text-sm" placeholder="Card number" defaultValue="4111 1111 1111 1111" readOnly />
      <div className="grid grid-cols-2 gap-3">
        <input className="input-modern text-sm" placeholder="MM / YY" defaultValue="12 / 28" readOnly />
        <input className="input-modern text-sm" placeholder="CVV" defaultValue="•••" readOnly />
      </div>
      <input className="input-modern text-sm" placeholder="Name on card" defaultValue="Demo Patient" readOnly />
      <p className="text-[11px] text-slate-500">Simulation only — no real card will be charged.</p>
    </Motion.div>
  );
}

function NetBankingPanel({ bank, onBank }) {
  return (
    <Motion.div key="netbanking" {...slide} className="space-y-3">
      <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Select your bank</label>
      <select className="select" value={bank} onChange={(e) => onBank(e.target.value)}>
        {BANKS.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>
      <p className="text-[11px] text-slate-500">You will be redirected to your bank’s secure page (simulated).</p>
    </Motion.div>
  );
}

export function PaymentCheckoutModal({ open, onClose, amount, dueItems = [], userEmail, userPhone, onPaymentComplete }) {
  const [method, setMethod] = useState("upi");
  const [step, setStep] = useState("checkout");
  const [verifying, setVerifying] = useState(false);
  const [qrWaiting, setQrWaiting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(45);
  const [bank, setBank] = useState(BANKS[0]);
  const [result, setResult] = useState(null);

  const qrValue = useMemo(
    () => buildUpiPayload({ amount, note: `Hospital dues · ${dueItems.map((i) => i.label).join(", ") || "billing"}` }),
    [amount, dueItems]
  );

  const maskedEmail = maskEmail(userEmail);
  const maskedPhone = maskPhone(userPhone);

  useEffect(() => {
    if (!open) {
      setStep("checkout");
      setMethod("upi");
      setVerifying(false);
      setQrWaiting(false);
      setSecondsLeft(45);
      setResult(null);
    }
  }, [open]);

  useEffect(() => {
    if (!open || method !== "upi" || step !== "checkout") return undefined;
    setQrWaiting(true);
    setSecondsLeft(45);
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [open, method, step]);

  async function runVerification(paymentMethod) {
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 1800 + Math.random() * 800));
    setVerifying(false);
    const paymentResult = {
      transactionId: generateTransactionId(),
      amount,
      method: paymentMethod,
      paidAt: new Date(),
    };
    setResult(paymentResult);
    setStep("success");
  }

  function handleSimulatePay() {
    if (verifying) return;
    const labels = { upi: "UPI", card: "Card", netbanking: `Net Banking · ${bank}` };
    runVerification(labels[method] || "UPI");
  }

  function handleDone() {
    if (result) onPaymentComplete?.(result);
    onClose();
  }

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[95] flex items-end justify-center p-0 sm:items-center sm:p-4">
        <Motion.button
          type="button"
          aria-label="Close payment"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/55 backdrop-blur-md"
          onClick={() => !verifying && step !== "success" && onClose()}
        />

        <Motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20 dark:border-slate-800 dark:bg-slate-950 sm:max-w-lg sm:rounded-3xl"
        >
          {verifying ? <VerifyingOverlay message="Verifying payment with your bank…" /> : null}

          {/* Header gradient strip */}
          <div className="relative border-b border-slate-100 bg-gradient-to-r from-brand-600 via-brand-700 to-violet-700 px-5 py-4 text-white dark:border-slate-800">
            <button
              type="button"
              disabled={verifying}
              onClick={() => (step === "success" ? handleDone() : onClose())}
              className="absolute right-4 top-4 rounded-lg bg-white/15 p-1.5 transition hover:bg-white/25 disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-white/80">
              <Shield className="h-3.5 w-3.5" />
              Secure checkout · simulation
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums">{formatINR(amount)}</div>
            <div className="mt-0.5 text-xs text-white/75">AI Hospital Queue · March 2026 billing</div>
          </div>

          <div className="overflow-y-auto px-5 py-5">
            {step === "success" && result ? (
              <PaymentSuccessScreen
                result={result}
                email={maskedEmail}
                phone={maskedPhone}
                onDone={handleDone}
              />
            ) : (
              <>
                <div className="mb-4 flex gap-1 rounded-xl bg-slate-100 p-1 dark:bg-slate-900">
                  {METHODS.map((m) => {
                    const Icon = m.icon;
                    const active = method === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMethod(m.id)}
                        className={clsx(
                          "relative flex flex-1 flex-col items-center gap-1 rounded-lg py-2.5 text-[11px] font-semibold transition",
                          active ? "text-brand-800 dark:text-brand-200" : "text-slate-500 hover:text-slate-700"
                        )}
                      >
                        {active ? (
                          <Motion.span
                            layoutId="payTab"
                            className="absolute inset-0 rounded-lg bg-white shadow-sm dark:bg-slate-800"
                            transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          />
                        ) : null}
                        <span className="relative flex items-center gap-1">
                          <Icon className="h-3.5 w-3.5" />
                          {m.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <AnimatePresence mode="wait">
                  {method === "upi" ? (
                    <UpiPanel amount={amount} qrValue={qrValue} secondsLeft={secondsLeft} waiting={qrWaiting} />
                  ) : method === "card" ? (
                    <CardPanel />
                  ) : (
                    <NetBankingPanel bank={bank} onBank={setBank} />
                  )}
                </AnimatePresence>

                {dueItems.length > 0 ? (
                  <ul className="mt-4 space-y-1.5 rounded-xl border border-slate-200/70 bg-slate-50/50 px-3 py-2.5 text-xs dark:border-slate-800 dark:bg-slate-900/30">
                    {dueItems.map((item) => (
                      <li key={item.id} className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>{item.label}</span>
                        <span className="font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                          {formatINR(item.amount)}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </>
            )}
          </div>

          {step === "checkout" ? (
            <div className="border-t border-slate-100 bg-slate-50/80 px-5 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <Motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                disabled={verifying}
                onClick={handleSimulatePay}
                className="btn btn-primary w-full py-3 text-base shadow-lg shadow-brand-600/25"
              >
                <Smartphone className="h-4 w-4" />
                Simulate payment · {formatINR(amount)}
              </Motion.button>
              <p className="mt-2 text-center text-[10px] text-slate-400">
                Demo only — no real money will be transferred
              </p>
            </div>
          ) : null}
        </Motion.div>
      </div>
    </AnimatePresence>
  );
}
