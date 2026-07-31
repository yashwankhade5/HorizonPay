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

const mockChartData = [
  { date: "Mar 1", value: 1200 },
  { date: "Mar 2", value: 1150 },
  { date: "Mar 3", value: 1100 },
  { date: "Mar 4", value: 1050 },
  { date: "Mar 5", value: 950 },
  { date: "Mar 6", value: 850 },
  { date: "Mar 7", value: 800 },
  { date: "Mar 8", value: 820 },
  { date: "Mar 9", value: 900 },
  { date: "Mar 10", value: 1100 },
  { date: "Mar 11", value: 1300 },
  { date: "Mar 12", value: 1600 },
  { date: "Mar 13", value: 1900 },
  { date: "Mar 14", value: 2300 },
  { date: "Mar 15", value: 2800 },
  { date: "Mar 16", value: 3400 },
  { date: "Mar 17", value: 4000 },
  { date: "Mar 18", value: 4600 },
  { date: "Mar 19", value: 5200 },
  { date: "Mar 20", value: 5800 },
  { date: "Mar 21", value: 6200 },
  { date: "Mar 22", value: 6600 },
  { date: "Mar 23", value: 6900 },
  { date: "Mar 24", value: 7100 },
  { date: "Mar 25", value: 7300 },
  { date: "Mar 26", value: 7500 },
  { date: "Mar 27", value: 7650 },
  { date: "Mar 28", value: 7750 },
  { date: "Mar 29", value: 7850 },
  { date: "Mar 30", value: 7950 },
  { date: "Mar 31", value: 8000 },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("30D");

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
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Docs
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Support
              </a>
              <a
                href="#"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Changelog
              </a>
            </nav>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5">
            <span className="text-xs text-muted-foreground">Merchant Status:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-xs font-medium text-emerald-400">
                Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-mono text-muted-foreground">
              8x...1234
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
                <h1 className="font-display text-3xl font-bold text-foreground">
                  Overview
                </h1>
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
                  $1,248,392.00
                </div>
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    +12.5%
                  </span>
                </div>
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
                  $342,105.50
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
                  $89,400.00
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
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={mockChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
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
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      ticks={['Mar 1', 'Mar 15', 'Mar 31']}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                      tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v}
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
                <a href="#" className="text-xs text-primary hover:underline font-medium">
                  View All →
                </a>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="text-xs text-muted-foreground uppercase tracking-wide border-b border-white/5">
                    <tr>
                      <th className="pb-3 font-medium px-2">Status</th>
                      <th className="pb-3 font-medium px-2">Amount</th>
                      <th className="pb-3 font-medium px-2">Network</th>
                      <th className="pb-3 font-medium px-2">Date</th>
                      <th className="pb-3 font-medium px-2 text-right">Reference</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-2">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Success
                        </div>
                      </td>
                      <td className="py-4 px-2 font-medium text-foreground">
                        $12,450.00
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#8247E5]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.065 14.542l-5.06-2.922v-5.845L6.945 8.697v5.844l5.06 2.922v5.845l5.06-2.922v-5.844zM12.005 5.775l5.06 2.922-5.06 2.922-5.06-2.922 5.06-2.922z" />
                          </svg>
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">USDC (Polygon)</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-muted-foreground">
                        Just now
                      </td>
                      <td className="py-4 px-2 text-right font-mono text-xs text-muted-foreground">
                        tx_980...f32
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-2">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Success
                        </div>
                      </td>
                      <td className="py-4 px-2 font-medium text-foreground">
                        $850.25
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-[#627EEA]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z" />
                          </svg>
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">USDT (Ethereum)</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-muted-foreground">
                        5 mins ago
                      </td>
                      <td className="py-4 px-2 text-right font-mono text-xs text-muted-foreground">
                        tx_428...e91
                      </td>
                    </tr>
                    <tr className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-2">
                        <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full px-3 py-1 text-xs font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Pending
                        </div>
                      </td>
                      <td className="py-4 px-2 font-medium text-foreground">
                        $5,000.00
                      </td>
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#14F195] to-[#9945FF]" />
                          <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">USDC (Solana)</span>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-muted-foreground">
                        12 mins ago
                      </td>
                      <td className="py-4 px-2 text-right font-mono text-xs text-muted-foreground">
                        tx_7c2...b14
                      </td>
                    </tr>
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
