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
  Search,
  SlidersHorizontal,
  Download,
  X,
  Copy,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMerchantProfile, MerchantTransaction } from "@/hooks/useMerchantProfile";
import { parseHexAmount, toUsdc, shortWallet } from "@/lib/api";

type TxStatus = "Confirmed" | "Failed" | "Pending" | "Success" | string;

const statusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Failed: "bg-red-500/10 text-red-400 border-red-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

function getStatusStyle(status: string) {
  return statusStyles[status] ?? "bg-white/5 text-muted-foreground border-white/10";
}

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div>
      <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
      <div className="flex items-center justify-between bg-background border border-white/8 rounded-lg px-3 py-2.5">
        <span className="text-sm font-mono text-foreground truncate pr-2">{value}</span>
        <button onClick={copy} className="ml-2 text-muted-foreground hover:text-primary transition-colors shrink-0">
          {copied ? (
            <span className="text-[10px] text-primary font-medium">Copied</span>
          ) : (
            <Copy className="w-3.5 h-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}

function txAmount(tx: MerchantTransaction): number {
  if (typeof tx.amount === "number") return tx.amount;
  if (typeof tx.amount === "string") return toUsdc(parseHexAmount(tx.amount));
  return 0;
}

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<MerchantTransaction | null>(null);

  const { data, isLoading, isError } = useMerchantProfile();
  const txs = data?.Transactions ?? [];

  const filtered = txs.filter((t) => {
    if (search === "") return true;
    const q = search.toLowerCase();
    return (
      String(t.txSignature ?? "").toLowerCase().includes(q) ||
      String(t.customerWallet ?? "").toLowerCase().includes(q) ||
      String(t.txHash ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[220px] bg-card border-r border-white/5 flex flex-col z-20">
        <div className="p-6">
          <Link href="/" className="flex flex-col gap-1 w-max">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.4)] shrink-0">
                <div className="w-2 h-2 rounded-full bg-background" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">HorizonPay</span>
            </div>
            <div className="ml-8.5">
              <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                Enterprise Tier
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <LayoutDashboard className="w-4 h-4" />Overview
          </Link>
          <Link href="/transactions" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all font-medium text-sm">
            <ArrowLeftRight className="w-4 h-4" />Transactions
          </Link>
          <Link href="/withdraw" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <Banknote className="w-4 h-4" />Withdraw
          </Link>
          <Link href="/api-keys" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <Key className="w-4 h-4" />API Keys
          </Link>
          <Link href="/webhooks" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <Webhook className="w-4 h-4" />Webhooks
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <RefreshCw className="w-4 h-4" />Subscriptions
          </a>
          <Link href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <Settings className="w-4 h-4" />Settings
          </Link>
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium rounded-lg py-2 transition-all hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Zap className="w-4 h-4" />Upgrade Plan
          </button>
          <div className="flex flex-col gap-2 pt-2">
            <a href="#" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2">
              <BookOpen className="w-3.5 h-3.5" />Docs
            </a>
            <Link href="/signin" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2">
              <LogOut className="w-3.5 h-3.5" />Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col ml-[220px] min-w-0">
        {/* Header */}
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
              {data?.data?.merchantwallet ? shortWallet(data.data.merchantwallet) : "—"}
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><Bell className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><HelpCircle className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><Settings2 className="w-4 h-4" /></button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0 ml-1 cursor-pointer">M</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-hidden flex flex-col p-8">
          {/* Page title + toolbar */}
          <div className="flex items-center justify-between mb-6">
            <motion.h1
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-3xl font-bold text-foreground"
            >
              Transactions
              {!isLoading && txs.length > 0 && (
                <span className="ml-3 text-base font-normal text-muted-foreground">
                  ({txs.length})
                </span>
              )}
            </motion.h1>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search signature or wallet"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-56 bg-card border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-card text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table + Detail Panel */}
          <div className="flex gap-4 flex-1 min-h-0">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 bg-card border border-white/8 rounded-xl overflow-hidden flex flex-col min-w-0"
            >
              <div className="overflow-y-auto custom-scrollbar flex-1">
                <table className="w-full text-sm text-left">
                  <thead className="sticky top-0 bg-card border-b border-white/5 z-10">
                    <tr>
                      <th className="px-5 py-3.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">Tx Signature</th>
                      <th className="px-5 py-3.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">Customer Wallet</th>
                      <th className="px-5 py-3.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">Amount (USDC)</th>
                      <th className="px-5 py-3.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">Status</th>
                      <th className="px-5 py-3.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-16 text-center">
                          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground mx-auto" />
                        </td>
                      </tr>
                    ) : isError ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-16 text-center text-sm text-red-400">
                          Failed to load transactions. Check your connection and try again.
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-5 py-16 text-center text-sm text-muted-foreground">
                          {search ? "No transactions match your search." : "No transactions yet. They'll appear here once payments are received."}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((tx, i) => {
                        const status = String(tx.status ?? "Unknown");
                        const amt = txAmount(tx);
                        return (
                          <motion.tr
                            key={i}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.25, delay: i * 0.04 }}
                            onClick={() => setSelected(selected === tx ? null : tx)}
                            className={`border-b border-white/5 last:border-0 cursor-pointer transition-colors ${
                              selected === tx ? "bg-primary/5" : "hover:bg-white/[0.02]"
                            }`}
                          >
                            <td className="px-5 py-4 font-mono text-xs text-foreground">
                              {tx.txSignature ? shortWallet(String(tx.txSignature)) : "—"}
                            </td>
                            <td className="px-5 py-4 font-mono text-xs text-muted-foreground">
                              {tx.customerWallet ? shortWallet(String(tx.customerWallet)) : "—"}
                            </td>
                            <td className="px-5 py-4 font-medium text-foreground">
                              {amt.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusStyle(status)}`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-xs text-muted-foreground">
                              {tx.date ?? "—"}
                            </td>
                          </motion.tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Tx Detail Panel */}
            <AnimatePresence>
              {selected && (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="w-[280px] shrink-0 bg-card border border-white/8 rounded-xl flex flex-col overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                    <span className="font-display font-semibold text-foreground">Tx Details</span>
                    <button
                      onClick={() => setSelected(null)}
                      className="w-7 h-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-5">
                    <div className="bg-background border border-white/8 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Amount</p>
                      <p className="font-display text-3xl font-bold text-foreground">
                        {txAmount(selected).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{" "}
                        <span className="text-base font-semibold text-muted-foreground">USDC</span>
                      </p>
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(String(selected.status ?? "Unknown"))}`}>
                          {String(selected.status ?? "Unknown")}
                        </span>
                      </div>
                    </div>

                    {selected.network && (
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Network Info</p>
                        <div className="space-y-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Network</span>
                            <span className="text-sm text-foreground">{String(selected.network)}</span>
                          </div>
                          {selected.networkFee && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Network Fee</span>
                              <span className="text-sm text-foreground font-mono">{String(selected.networkFee)}</span>
                            </div>
                          )}
                          {selected.confirmations !== undefined && (
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">Confirmations</span>
                              <span className="text-sm text-foreground font-mono">{selected.confirmations}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Identifiers</p>
                      <div className="space-y-3">
                        {selected.txSignature && (
                          <CopyField label="Tx Signature" value={String(selected.txSignature)} />
                        )}
                        {selected.customerWallet && (
                          <CopyField label="Customer Wallet" value={String(selected.customerWallet)} />
                        )}
                        {selected.txHash && (
                          <CopyField label="Transaction Hash" value={String(selected.txHash)} />
                        )}
                        {selected.blockHash && (
                          <CopyField label="Block Hash" value={String(selected.blockHash)} />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border-t border-white/5">
                    <button className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-white/10 bg-white/5 text-sm font-medium text-foreground hover:bg-white/10 hover:border-white/20 transition-all">
                      <ExternalLink className="w-4 h-4" />
                      View on Explorer
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}
