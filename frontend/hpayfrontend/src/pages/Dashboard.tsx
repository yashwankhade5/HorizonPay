import { useState,useEffect } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Banknote,
  Key,
  Webhook,
  RefreshCw,
  Settings,
  Zap,
  BookOpen,
  LogOut,
  Bell,
  HelpCircle,
  Settings2,
  Download,
  Plus,
  TrendingUp,
  ArrowUpRight,
  Building2,
  Lock,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useMerchantProfile } from "@/hooks/useMerchantProfile";
import { parseHexAmount, toUsdc, shortWallet } from "@/lib/api";
import {Header} from "../components/shared/Header"
import { Sidebar } from "@/components/shared/Sidebar";
import { useLocation } from "wouter";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("30D");
  const { data, isLoading, isError,error } = useMerchantProfile();
  const [, navigate] = useLocation();

useEffect(() => {
  if (!isLoading && isError && error?.message === "Merchant not found") {
    navigate("/keys");
  }
}, [isLoading, isError, error]);

  const state = data?.MerchantState;
  const txs = data?.Transactions ?? [];
  const wallet = data?.data?.merchantwallet ?? "";

  // Derive balances from on-chain hex amounts (USDC = 6 decimals)
  const totalVolume = state ? toUsdc(parseHexAmount(state.totalAmount)) : null;
  const withdrawable = state ? toUsdc(parseHexAmount(state.withdrawableAmount)) : null;
  const escrowed = state ? toUsdc(parseHexAmount(state.withheldAmount)) : null;

  // Determine merchant status
  const isActive = state ? (state.transferFlag && !state.freezeFlag) : true;

  // Build chart data from withheld buckets (7-day rolling window)
  // Each bucket represents one day; currentIndex is today's bucket
  const chartData = state
    ? state.withheldBuckets.map((bucket, i) => {
      const bucketValue = toUsdc(parseHexAmount(bucket));
      const dayOffset = i - state.currentIndex;
      const d = new Date();
      d.setDate(d.getDate() + dayOffset);
      return {
        date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        value: bucketValue,
      };
    })
    : [];

  function fmt(n: number | null) {
    if (n === null) return "—";
    return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden">
      {/* Left Sidebar */}
     <Sidebar/>
      {/* Main Container */}
      <div className="flex-1 flex flex-col ml-[220px] min-w-0">
        {/* Top Header */}
       <Header/>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative">
          <div className="max-w-[1200px] mx-auto">
            {/* Page Header */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="font-display text-3xl font-bold text-foreground">Overview</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Your business performance across all networks.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 h-9 px-4 rounded-lg border border-white/10 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-white/20 transition-all bg-card">
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all">
                  <Plus className="w-4 h-4" />
                  Create Payment
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-card border border-white/8 rounded-xl p-5"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Total Volume
                  </span>
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
                <div className="font-display text-2xl font-bold text-foreground">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : isError ? (
                    <span className="text-red-400 text-base">Error</span>
                  ) : (
                    `$${fmt(totalVolume)}`
                  )}
                </div>
                {!isLoading && !isError && txs.length > 0 && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                      <ArrowUpRight className="w-3 h-3" />
                      {txs.length} tx{txs.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-card border border-white/8 rounded-xl p-5"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Withdrawable Balance
                  </span>
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="font-display text-2xl font-bold text-foreground">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : isError ? (
                    <span className="text-red-400 text-base">Error</span>
                  ) : (
                    `$${fmt(withdrawable)}`
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="bg-card border border-white/8 rounded-xl p-5"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                    Escrowed Funds
                  </span>
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="font-display text-2xl font-bold text-foreground">
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  ) : isError ? (
                    <span className="text-red-400 text-base">Error</span>
                  ) : (
                    `$${fmt(escrowed)}`
                  )}
                </div>
              </motion.div>
            </div>

            {/* Chart Area */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="mt-6 bg-card border border-white/8 rounded-xl p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Volume over time
                </h2>
                <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5">
                  {["7D", "30D", "1Y"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${activeTab === tab
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                          : "text-muted-foreground hover:text-foreground border border-transparent"
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-[220px] w-full">
                {isLoading ? (
                  <div className="h-full flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                  </div>
                ) : chartData.length === 0 || chartData.every((d) => d.value === 0) ? (
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <span className="text-sm text-muted-foreground">No volume data yet</span>
                    <span className="text-xs text-muted-foreground/60">Chart will populate as transactions come in</span>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="tealGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(186 100% 42%)" stopOpacity={0.15} />
                          <stop offset="95%" stopColor="hsl(186 100% 42%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.02)" />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                        tickFormatter={(v) => (v >= 1000 ? `${v / 1000}k` : String(v))}
                        dx={-10}
                        width={40}
                      />
                      <Tooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-[hsl(222_47%_10%)] border border-white/10 rounded-lg px-3 py-2 shadow-xl">
                                <p className="text-xs text-muted-foreground mb-1">{label}</p>
                                <p className="text-sm font-display font-bold text-foreground">
                                  ${(payload[0].value as number ?? 0).toLocaleString()}
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(186 100% 42%)"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#tealGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </motion.div>

            {/* Recent Activity Table */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-6 bg-card border border-white/8 rounded-xl p-6 mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Recent Activity
                </h2>
                <Link href="/transactions" className="text-xs text-primary hover:underline font-medium">
                  View All →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-muted-foreground uppercase tracking-wide border-b border-white/5">
                    <tr>
                      <th className="pb-3 font-medium px-2">Status</th>
                      <th className="pb-3 font-medium px-2">Amount (USDC)</th>
                      <th className="pb-3 font-medium px-2">Customer Wallet</th>
                      <th className="pb-3 font-medium px-2">Date</th>
                      <th className="pb-3 font-medium px-2 text-right">Tx Signature</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center">
                          <Loader2 className="w-5 h-5 animate-spin text-muted-foreground mx-auto" />
                        </td>
                      </tr>
                    ) : txs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-sm text-muted-foreground">
                          No transactions yet. Activity will appear here once payments are received.
                        </td>
                      </tr>
                    ) : (
                      txs.slice(0, 5).map((tx, i) => {
                        // const status = (tx.status as string) ?? "Unknown";
                        const status = "Confirmed";
                        const statusColor =
                          status === "Confirmed" || status === "Success"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : status === "Pending"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border border-red-500/20";
                        const dotColor =
                          status === "Confirmed" || status === "Success"
                            ? "bg-emerald-500"
                            : status === "Pending"
                              ? "bg-amber-500"
                              : "bg-red-500";
                        const rawAmt =
                          typeof tx.amount === "string"
                            ? toUsdc(Number(BigInt(tx.amount)))
                            : typeof tx.amount === "number"
                              ? tx.amount
                              : 0;
                        return (
                          <tr
                            key={i}
                            className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                          >
                            <td className="py-4 px-2">
                              <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                                {status}
                              </div>
                            </td>
                            <td className="py-4 px-2 font-medium text-foreground">
                              {rawAmt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="py-4 px-2 font-mono text-xs text-muted-foreground">
                              {tx.userPubkey ? shortWallet(String(tx.userPubkey)) : "—"}
                            </td>
                            <td className="py-4 px-2 text-muted-foreground text-xs">
                              {tx.createdAt
                                ? new Date(tx.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
                                : "—"}
                            </td>
                            <td className="py-4 px-2 text-right font-mono text-xs text-muted-foreground">
                              {tx.txSignature ? shortWallet(String(tx.txSignature)) : "—"}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
