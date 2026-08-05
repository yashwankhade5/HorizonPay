import { useState } from "react";
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

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("30D");
  const { data, isLoading, isError } = useMerchantProfile();

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
      <aside className="fixed inset-y-0 left-0 w-[220px] bg-card border-r border-white/5 flex flex-col z-20">
        <div className="p-6">
          <Link href="/" className="flex flex-col gap-1 w-max">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.4)] shrink-0">
                <div className="w-2 h-2 rounded-full bg-background" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                HorizonPay
              </span>
            </div>
            <div className="ml-8.5">
              <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                Enterprise Tier
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all font-medium text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <Link
            href="/transactions"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Transactions
          </Link>
          <Link
            href="/withdraw"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <Banknote className="w-4 h-4" />
            Withdraw
          </Link>
          <Link
            href="/api-keys"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <Key className="w-4 h-4" />
            API Keys
          </Link>
          <Link
            href="/webhooks"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <Webhook className="w-4 h-4" />
            Webhooks
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Subscriptions
          </a>
          <Link
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium rounded-lg py-2 transition-all hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Zap className="w-4 h-4" />
            Upgrade Plan
          </button>
          <div className="flex flex-col gap-2 pt-2">
            <a
              href="#"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Docs
            </a>
            <Link
              href="/signin"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col ml-[220px] min-w-0">
        {/* Top Header */}
        <header className="h-14 bg-card border-b border-white/5 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <div className="flex items-center gap-6">
            <nav className="flex gap-4">
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Docs</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Changelog</a>
            </nav>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5">
            <span className="text-xs text-muted-foreground">Merchant Status:</span>
            {isLoading ? (
              <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
            ) : (
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"}`} />
                <span className={`text-xs font-medium ${isActive ? "text-emerald-400" : "text-red-400"}`}>
                  {isActive ? "Active" : "Frozen"}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-mono text-muted-foreground">
              {wallet ? shortWallet(wallet) : "—"}
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <HelpCircle className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
              <Settings2 className="w-4 h-4" />
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0 ml-1 cursor-pointer">
              M
            </div>
          </div>
        </header>

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
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                        activeTab === tab
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
                        const status = (tx.status as string) ?? "Unknown";
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
                            ? toUsdc(parseHexAmount(tx.amount))
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
                              {tx.customerWallet ? shortWallet(String(tx.customerWallet)) : "—"}
                            </td>
                            <td className="py-4 px-2 text-muted-foreground text-xs">
                              {tx.date ?? "—"}
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
