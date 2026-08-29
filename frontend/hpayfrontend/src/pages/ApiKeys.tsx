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
import { Header } from "@/components/shared/Header";
import { Sidebar } from "@/components/shared/Sidebar";
import { useMerchantProfile } from "@/hooks/useMerchantProfile";

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

function maskKey(key: string) {
  if (!key) return "";
  return `${key.slice(0, 8)}${"•".repeat(Math.max(key.length - 8, 0))}`;
}

export default function ApiKeys() {
  const [mode, setMode] = useState<"test" | "live">("test");
  const [showSecret, setShowSecret] = useState(false);
  const [showWebhook, setShowWebhook] = useState(false);
  const { data, isLoading, isError, error } = useMerchantProfile();

  const secretKey = data?.data.merchantsecretkeyhash ?? "";
  const webhookSecret = data?.data.merchantwebhooksecret ?? "";
  const publishableKey = data?.data.merchantpublishablehash ?? "";

  if (isLoading) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
        <span className="text-sm text-muted-foreground">Loading API keys...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
        <span className="text-sm text-red-400">
          Failed to load API keys{error instanceof Error ? `: ${error.message}` : ""}
        </span>
      </div>
    );
  }

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main */}
      <div className="flex-1 flex flex-col ml-[220px] min-w-0">
        {/* Header */}
        <Header />

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
                  <span className="flex-1 font-mono text-sm text-foreground truncate">{publishableKey}</span>
                  <CopyButton text={publishableKey} />
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5 mb-6" />

              {/* Secret Key */}
              <div className="mb-6">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-semibold text-foreground">Secret Key Hash</span>
                  <Info className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Use this key to authenticate requests on your server. Keep it confidential.
                </p>
                <div className="flex items-center gap-2 bg-background border border-white/8 rounded-lg px-4 py-3">
                  <span className="flex-1 font-mono text-sm text-foreground truncate">
                    {showSecret ? secretKey : maskKey(secretKey)}
                  </span>
                  <button
                    onClick={() => setShowSecret((s) => !s)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title={showSecret ? "Hide" : "Reveal"}
                  >
                    {showSecret ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <CopyButton text={secretKey} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Last used: 2 hours ago from 192.168.1.1
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-white/5 mb-6" />

              {/* Webhook Signing Secret */}
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Webhook className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Webhook Signing Secret Encrypted</span>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Use this to verify that incoming webhook events actually came from HorizonPay.
                </p>
                <div className="flex items-center gap-2 bg-background border border-white/8 rounded-lg px-4 py-3">
                  <span className="flex-1 font-mono text-sm text-foreground truncate">
                    {showWebhook ? webhookSecret : maskKey(webhookSecret)}
                  </span>
                  <button
                    onClick={() => setShowWebhook((s) => !s)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                    title={showWebhook ? "Hide" : "Reveal"}
                  >
                    {showWebhook ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <CopyButton text={webhookSecret} />
                </div>
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