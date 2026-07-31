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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type TxStatus = "Confirmed" | "Failed" | "Pending";

interface Transaction {
  id: string;
  txSignature: string;
  customerWallet: string;
  amount: number;
  fee: number;
  status: TxStatus;
  date: string;
  network: string;
  networkFee: string;
  confirmations: number;
  txHash: string;
  blockHash: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "1",
    txSignature: "0x7f8...8a9b",
    customerWallet: "0x12...4...",
    amount: 2500.0,
    fee: 0.50,
    status: "Confirmed",
    date: "Oct 24",
    network: "Polygon",
    networkFee: "0.0015 MATIC",
    confirmations: 128,
    txHash: "0x7f8e9b...",
    blockHash: "0xabc123...",
  },
  {
    id: "2",
    txSignature: "0x5e...1f2d",
    customerWallet: "0x98...7...",
    amount: 15880.0,
    fee: 1.59,
    status: "Failed",
    date: "Oct 24",
    network: "Ethereum",
    networkFee: "0.0024 ETH",
    confirmations: 0,
    txHash: "0x5e1f2d...",
    blockHash: "0xdef456...",
  },
  {
    id: "3",
    txSignature: "0x9b...4c5d",
    customerWallet: "0x34...0...",
    amount: 460.0,
    fee: 0.19,
    status: "Pending",
    date: "Oct 24",
    network: "Solana",
    networkFee: "0.000005 SOL",
    confirmations: 0,
    txHash: "0x9b4c5d...",
    blockHash: "0xghi789...",
  },
  {
    id: "4",
    txSignature: "0x1b...8d9e",
    customerWallet: "0x56...2...",
    amount: 1280.0,
    fee: 0.50,
    status: "Confirmed",
    date: "Oct 23",
    network: "Polygon",
    networkFee: "0.0012 MATIC",
    confirmations: 512,
    txHash: "0x1b8d9e...",
    blockHash: "0xjkl012...",
  },
];

const statusStyles: Record<TxStatus, string> = {
  Confirmed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Failed: "bg-red-500/10 text-red-400 border-red-500/20",
  Pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

const networkDot: Record<string, string> = {
  Polygon: "bg-[#8247E5]",
  Ethereum: "bg-[#627EEA]",
  Solana: "bg-gradient-to-tr from-[#14F195] to-[#9945FF]",
};

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
        <span className="text-sm font-mono text-foreground">{value}</span>
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

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Transaction | null>(null);

  const filtered = mockTransactions.filter(
    (t) =>
      search === "" ||
      t.txSignature.toLowerCase().includes(search.toLowerCase()) ||
      t.customerWallet.toLowerCase().includes(search.toLowerCase())
  );

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
            <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-mono text-muted-foreground">8x...1234</div>
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
            </motion.h1>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search 1xID or Wallet"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-56 bg-card border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                />
              </div>
              {/* Filter */}
              <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 bg-card text-muted-foreground hover:text-foreground hover:border-white/20 transition-all">
                <SlidersHorizontal className="w-4 h-4" />
              </button>
              {/* Export */}
              <button className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Table + Detail Panel */}
          <div className="flex gap-4 flex-1 min-h-0">
            {/* Table */}
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
                      <th className="px-5 py-3.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">Fee</th>
                      <th className="px-5 py-3.5 text-xs text-muted-foreground font-medium uppercase tracking-wide">Status</th>
                      <th className="px-5 py-3.5 text-xs text-muted-foreground font-medium uppercase tracking-wide"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((tx, i) => (
                      <motion.tr
                        key={tx.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: i * 0.05 }}
                        onClick={() => setSelected(selected?.id === tx.id ? null : tx)}
                        className={`border-b border-white/5 last:border-0 cursor-pointer transition-colors ${
                          selected?.id === tx.id ? "bg-primary/5" : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <td className="px-5 py-4 font-mono text-xs text-foreground">{tx.txSignature}</td>
                        <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{tx.customerWallet}</td>
                        <td className="px-5 py-4 font-medium text-foreground">{tx.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
                        <td className="px-5 py-4 text-muted-foreground">{tx.fee.toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[tx.status]}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs text-muted-foreground">{tx.date}</td>
                      </motion.tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-16 text-center text-sm text-muted-foreground">
                          No transactions match your search.
                        </td>
                      </tr>
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
                  {/* Detail Header */}
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
                    {/* Amount card */}
                    <div className="bg-background border border-white/8 rounded-xl p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Amount</p>
                      <p className="font-display text-3xl font-bold text-foreground">
                        {selected.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                        <span className="text-base font-semibold text-muted-foreground">USDC</span>
                      </p>
                      <div className="mt-3">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${statusStyles[selected.status]}`}>
                          {selected.status}
                        </span>
                      </div>
                    </div>

                    {/* Network Info */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Network Info</p>
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Network</span>
                          <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${networkDot[selected.network] ?? "bg-primary"}`} />
                            <span className="text-sm text-foreground">{selected.network}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Network Fee</span>
                          <span className="text-sm text-foreground font-mono">{selected.networkFee}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Confirmations</span>
                          <span className="text-sm text-foreground font-mono">{selected.confirmations}</span>
                        </div>
                      </div>
                    </div>

                    {/* Identifiers */}
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Identifiers</p>
                      <div className="space-y-3">
                        <CopyField label="Transaction Hash" value={selected.txHash} />
                        <CopyField label="Block Hash" value={selected.blockHash} />
                      </div>
                    </div>
                  </div>

                  {/* View on Explorer */}
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
