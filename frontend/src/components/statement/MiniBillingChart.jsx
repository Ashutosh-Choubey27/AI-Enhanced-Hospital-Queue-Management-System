import { motion as Motion } from "framer-motion";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function formatINR(n) {
  return `₹${Number(n).toLocaleString("en-IN")}`;
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const row = payload[0];
  return (
    <div className="rounded-lg border border-slate-200/80 bg-white/95 px-2.5 py-1.5 text-xs shadow-md backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <span className="font-medium text-slate-600 dark:text-slate-400">{row.payload.name}</span>
      <span className="ml-2 font-bold tabular-nums text-slate-900 dark:text-slate-100">{formatINR(row.value)}</span>
    </div>
  );
};

export function MiniBillingChart({ paid, due, delay = 0.2 }) {
  const data = [
    { name: "Paid", value: paid, fill: "var(--chart-paid)" },
    { name: "Due", value: due, fill: "var(--chart-due)" },
  ];

  return (
    <Motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-slate-200/50 bg-white/50 p-3 dark:border-slate-800/50 dark:bg-slate-900/30"
      style={{
        "--chart-paid": "#10b981",
        "--chart-due": "#f59e0b",
      }}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Billing split
        </span>
        <span className="text-[10px] text-slate-400 dark:text-slate-500">This cycle</span>
      </div>
      <div className="h-[88px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }} barCategoryGap="28%">
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10, fill: "rgb(100 116 139)" }}
            />
            <YAxis hide domain={[0, "auto"]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(148, 163, 184, 0.08)", radius: 6 }} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={36}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Motion.div>
  );
}
