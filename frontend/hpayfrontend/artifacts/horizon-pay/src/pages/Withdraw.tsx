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
  AlertTriangle,
  CheckCircle2,
  Lock,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";

const escrowBatches = [
  {
    label: "Releasing Tomorrow",
    timeLabel: "1d",
    amount: "$120,089.00",
    progress: 92,
  },
  {
    label: "Batch #4892",
    timeLabel: "3d",
    amount: "$85,560.00",
    progress: 57,
  },
  {
    label: "Batch #4895",
    timeLabel: "7d",
    amount: "$244,760.50",
    progress: 14,
  },
];

const walletOptions = [
  { label: "0x7F... 9A2b", value: "0x7F9A2b" },
  { label: "0x3A... C4f1", value: "0x3AC4f1" },
];

export default function Withdraw() {
  const [selectedWallet, setSelectedWallet] = useState(walletOptions[0]);
  const [walletOpen, setWalletOpen] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  async function handleWithdraw() {
    setIsWithdrawing(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL ?? "https://horizonpay-api.loca.lt"}/merchant/build-activate-tx`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "bypass-tunnel-reminder": "true" },
          body: JSON.stringify({ wallet: selectedWallet.value }),
        }
      );
      await res.json();
    } catch (_) {
      // handle silently
    } finally {
      setIsWithdrawing(false);
    }
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
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
            Overview
          </Link>
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <ArrowLeftRight className="w-4 h-4" />
            Transactions
          </a>
          <Link
            href="/withdraw"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all font-medium text-sm"
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
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-xs font-medium text-emerald-400">Active</span>
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

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[1200px] mx-auto">
            {/* Page Header */}
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-display text-3xl font-bold text-foreground mb-6"
            >
              Treasury Withdrawal
            </motion.h1>

            {/* Security Notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className="flex items-start gap-3 bg-amber-500/5 border border-amber-500/20 rounded-xl px-5 py-4 mb-6"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-sm font-semibold text-amber-400">Security Notice</span>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Always double-check your withdrawal address before confirming. Transactions on the blockchain are irreversible.
                </p>
              </div>
            </motion.div>

            {/* Balance Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.1 }}
                className="bg-card border border-white/8 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Available Balance
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground tracking-tight">
                  $2,450,000.00{" "}
                  <span className="text-lg font-semibold text-muted-foreground">USDC</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-xs text-primary font-medium">↗ Ready for immediate withdrawal</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="bg-card border border-white/8 rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                    Escrow Balance
                  </span>
                  <Lock className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="font-display text-3xl font-bold text-foreground tracking-tight">
                  $450,200.50{" "}
                  <span className="text-lg font-semibold text-muted-foreground">USDC</span>
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">⏱ Subject to rolling 7-day lock</span>
                </div>
              </motion.div>
            </div>

            {/* Bottom Row: Escrow Timeline + Withdraw Panel */}
            <div className="grid grid-cols-[1fr_300px] gap-4">
              {/* Escrow Release Timeline */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                className="bg-card border border-white/8 rounded-xl p-6"
              >
                <h2 className="font-display text-lg font-semibold text-foreground mb-1">
                  Escrow Release Timeline
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Funds pending clearance from recent merchant batches.
                </p>

                <div className="space-y-5">
                  {escrowBatches.map((batch) => (
                    <div key={batch.label}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-mono text-muted-foreground">{batch.timeLabel}</span>
                          </div>
                          <span className="text-sm font-medium text-foreground">{batch.label}</span>
                        </div>
                        <span className="text-sm font-medium text-foreground font-mono">{batch.amount}</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${batch.progress}%` }}
                          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                          className="h-full rounded-full bg-gradient-to-r from-primary/60 to-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Withdraw Funds Panel */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.25 }}
                className="bg-card border border-white/8 rounded-xl p-6 flex flex-col"
              >
                <h2 className="font-display text-base font-semibold text-foreground mb-1">
                  Withdraw Funds
                </h2>
                <p className="text-xs text-muted-foreground mb-5">
                  Select destination and amount to initiate transfer.
                </p>

                {/* Destination Wallet */}
                <div className="mb-4">
                  <label className="block text-xs text-muted-foreground uppercase tracking-wider mb-2">
                    Destination Wallet
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setWalletOpen((o) => !o)}
                      className="w-full flex items-center justify-between bg-background border border-white/10 rounded-lg px-3 py-2.5 text-sm font-mono text-foreground hover:border-white/20 transition-all"
                    >
                      <span>{selectedWallet.label}</span>
                      <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${walletOpen ? "rotate-180" : ""}`} />
                    </button>
                    {walletOpen && (
                      <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-white/10 rounded-lg overflow-hidden shadow-xl z-10">
                        {walletOptions.map((w) => (
                          <button
                            key={w.value}
                            onClick={() => { setSelectedWallet(w); setWalletOpen(false); }}
                            className={`w-full text-left px-3 py-2.5 text-sm font-mono hover:bg-white/5 transition-colors ${
                              selectedWallet.value === w.value ? "text-primary" : "text-foreground"
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Withdraw Button */}
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-background font-semibold text-sm rounded-lg py-3 hover:bg-primary/90 shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isWithdrawing ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full border-2 border-background/30 border-t-background animate-spin" />
                      Processing…
                    </span>
                  ) : (
                    <>
                      Withdraw to Wallet
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-3">
                  Estimated network fee: <span className="text-foreground">~$6.50 USDC</span>
                </p>
              </motion.div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
