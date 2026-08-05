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
  Copy,
  Eye,
  EyeOff,
  Info,
  RotateCw,
} from "lucide-react";
import { motion } from "framer-motion";

const PUBLISHABLE_KEY = "pk_test_51kuXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
const SECRET_KEY_MASKED = "sk_test_••••••••••••••••••••••••••••••••••••••••";
const SECRET_KEY_REAL   = "sk_test_51kSecretKeyHiddenForSecurity1234567890";

const NODE_EXAMPLE = `const horizon = require('horizonpay')('sk_test_...');

const paymentIntent = await horizon.paymentIntents
  .create({
    amount: 2000,
    currency: 'usd',
  });`;

const CURL_EXAMPLE = `curl https://api.horizonpay.com/v1/charges \\
  -u sk_test_...: \\
  -d amount=2000 \\
  -d currency=usd \\
  -d source=tok_mastercard`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={copy}
      className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
      title="Copy"
    >
      {copied
        ? <span className="text-[10px] font-medium text-primary px-1">Copied</span>
        : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function ApiKeys() {
  const [mode, setMode] = useState<"test" | "live">("test");
  const [showSecret, setShowSecret] = useState(false);

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
          <Link href="/transactions" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <ArrowLeftRight className="w-4 h-4" />Transactions
          </Link>
          <Link href="/withdraw" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <Banknote className="w-4 h-4" />Withdraw
          </Link>
          <Link href="/api-keys" className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 transition-all font-medium text-sm">
            <Key className="w-4 h-4" />API Keys
          </Link>
          <a href="#" className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm">
            <Webhook className="w-4 h-4" />Webhooks
          </a>
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
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[900px] mx-auto">

            {/* Page header */}
            <div className="flex items-start justify-between mb-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-3xl font-bold text-foreground">API Keys</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your cryptographic keys for API authentication.</p>
              </motion.div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 h-9 px-4 rounded-lg border border-white/10 bg-card text-sm font-medium text-foreground hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <RotateCw className="w-4 h-4 text-primary" />
                Rotate Keys
              </motion.button>
            </div>

            {/* Security notice */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-xl px-5 py-4 mb-6"
            >
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">Secret keys are shown only once.</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Store them securely in a password manager or environment variables. Do not commit them to version control.
                </p>
              </div>
            </motion.div>

            {/* Mode toggle + keys card */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card border border-white/8 rounded-xl p-6 mb-4"
            >
              {/* Test / Live tabs */}
              <div className="inline-flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg p-1 mb-6">
                {(["test", "live"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all capitalize ${
                      mode === m
                        ? "bg-white/10 text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {m === "test" ? "Test Mode" : "Live Mode"}
                  </button>
                ))}
              </div>

              {/* Publishable Key */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-foreground">Publishable Key</span>
                  <span className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Use this key in your client-side code (e.g., frontend web or mobile apps).
                </p>
                <div className="flex items-center gap-2 bg-background border border-white/8 rounded-lg px-4 py-3">
                  <span className="flex-1 font-mono text-sm text-foreground truncate">{PUBLISHABLE_KEY}</span>
                  <CopyButton text={PUBLISHABLE_KEY} />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5 mb-6" />

              {/* Secret Key */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-semibold text-foreground">Secret Key</span>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Use this key to authenticate requests on your server. Keep it confidential.
                </p>
                <div className="flex items-center gap-2 bg-background border border-white/8 rounded-lg px-4 py-3">
                  <span className="flex-1 font-mono text-sm text-foreground truncate">
                    {showSecret ? SECRET_KEY_REAL : SECRET_KEY_MASKED}
                  </span>
                  <button
                    onClick={() => setShowSecret((s) => !s)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title={showSecret ? "Hide" : "Reveal"}
                  >
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <CopyButton text={SECRET_KEY_REAL} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Last used: 2 hours ago from 192.168.1.1
                </p>
              </div>
            </motion.div>

            {/* Code examples */}
            <div className="grid grid-cols-2 gap-4">
              {/* Node.js */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="bg-card border border-white/8 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-primary">{"<>"}</span>
                    <span className="text-sm font-medium text-foreground">Node.js Example</span>
                  </div>
                  <CopyButton text={NODE_EXAMPLE} />
                </div>
                <pre className="p-5 text-xs font-mono text-muted-foreground leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-muted-foreground">{"const "}</span>
                    <span className="text-foreground">{"horizon"}</span>
                    <span className="text-muted-foreground">{" = "}</span>
                    <span className="text-primary">{"require"}</span>
                    <span className="text-muted-foreground">{"('horizonpay')("}</span>
                    <span className="text-amber-400">{"'sk_test_...'"}</span>
                    <span className="text-muted-foreground">{");"}</span>
                    {"\n\n"}
                    <span className="text-muted-foreground">{"const "}</span>
                    <span className="text-foreground">{"paymentIntent"}</span>
                    <span className="text-muted-foreground">{" = await horizon.paymentIntents"}</span>
                    {"\n"}
                    <span className="text-muted-foreground">{"  ."}</span>
                    <span className="text-primary">{"create"}</span>
                    <span className="text-muted-foreground">{"({"}</span>
                    {"\n"}
                    <span className="text-muted-foreground">{"    amount: "}</span>
                    <span className="text-amber-400">{"2000"}</span>
                    <span className="text-muted-foreground">{","}</span>
                    {"\n"}
                    <span className="text-muted-foreground">{"    currency: "}</span>
                    <span className="text-amber-400">{"'usd'"}</span>
                    <span className="text-muted-foreground">{","}</span>
                    {"\n"}
                    <span className="text-muted-foreground">{"  });"}</span>
                  </code>
                </pre>
              </motion.div>

              {/* cURL */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
                className="bg-card border border-white/8 rounded-xl overflow-hidden"
              >
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-emerald-400">{"$_"}</span>
                    <span className="text-sm font-medium text-foreground">cURL Example</span>
                  </div>
                  <CopyButton text={CURL_EXAMPLE} />
                </div>
                <pre className="p-5 text-xs font-mono text-muted-foreground leading-relaxed overflow-x-auto">
                  <code>
                    <span className="text-primary">{"curl"}</span>
                    <span className="text-foreground">{" https://api.horizonpay.com/v1/charges \\"}</span>
                    {"\n"}
                    <span className="text-muted-foreground">{"  -u "}</span>
                    <span className="text-amber-400">{"sk_test_..."}</span>
                    <span className="text-muted-foreground">{": \\"}</span>
                    {"\n"}
                    <span className="text-muted-foreground">{"  -d amount="}</span>
                    <span className="text-amber-400">{"2000"}</span>
                    <span className="text-muted-foreground">{" \\"}</span>
                    {"\n"}
                    <span className="text-muted-foreground">{"  -d currency="}</span>
                    <span className="text-amber-400">{"usd"}</span>
                    <span className="text-muted-foreground">{" \\"}</span>
                    {"\n"}
                    <span className="text-muted-foreground">{"  -d source="}</span>
                    <span className="text-amber-400">{"tok_mastercard"}</span>
                  </code>
                </pre>
              </motion.div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
