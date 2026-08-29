// ApiKeysPage.tsx
// -----------------------------------------------------------------------------
// Visual-only: blocks the keys reveal UI until wallet is connected.
// Assumes @solana/wallet-adapter-react is already set up in your app
// (ConnectionProvider / WalletProvider / WalletModalProvider mounted higher up).
// -----------------------------------------------------------------------------
import { useEffect, useState,useRef} from "react";
import { apiFetch } from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useLocation } from "wouter";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { motion } from "framer-motion";
import {
  Copy,
  Check,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  KeyRound,
  ArrowRight,
  Wallet,
} from "lucide-react";



function KeyRow({
  label,
  helper,
  value,
  masked,
  copied,
  onCopy,
  revealable,
  revealed,
  onToggleReveal,
}: {
  label: string;
  helper: string;
  value: string;
  masked?: string;
  copied: boolean;
  onCopy: () => void;
  revealable?: boolean;
  revealed?: boolean;
  onToggleReveal?: () => void;
}) {
  const display = revealable ? (revealed ? value : masked) : value;

  return (
    <div className="mb-6 last:mb-0">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        {copied && (
          <span className="text-[11px] font-medium text-emerald-400 flex items-center gap-1">
            <Check className="w-3 h-3" /> Copied
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-3">{helper}</p>
      <div className="flex items-center gap-2 bg-background border border-white/8 rounded-lg px-4 py-3">
        <span className="flex-1 font-mono text-sm text-foreground truncate">
          {display}
        </span>
        {revealable && (
          <button
            onClick={onToggleReveal}
            className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
            title={revealed ? "Hide" : "Reveal"}
          >
            {revealed ? (
              <EyeOff className="w-3.5 h-3.5" />
            ) : (
              <Eye className="w-3.5 h-3.5" />
            )}
          </button>
        )}
        <button
          onClick={onCopy}
          className="p-1.5 rounded-md text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
          title="Copy"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}


interface CreateMerchantRes {
  message: {
    walletPubkey: string;
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
  };
  
  success: boolean;
}

const handleCreateMerchant = async (walletPubkey: string) => {
  const createRes = await apiFetch<CreateMerchantRes>(
    "/merchant/create-merchant",
    {
      method: "POST",
      body: JSON.stringify({
        walletPubkey,
      }),
    }
  );

  return createRes;
};

export default function ApiKeysPage() {
  const { connected, connecting, publicKey } = useWallet();

  const [, navigate] = useLocation();
  const [showSecret, setShowSecret] = useState(false);
  const [copiedPub, setCopiedPub] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  


  const [publishableKey, setPublishableKey] = useState("");
const [secretKey, setSecretKey] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

  const bothCopied = copiedPub && copiedSecret;
  const secretMasked = "sk_test_" + "•".repeat(40);

  function copy(text: string, which: "pub" | "secret") {
    navigator.clipboard.writeText(text);
    if (which === "pub") {
      setCopiedPub(true);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setShowSecret(false), 1200);
    }
  }

  function handleContinue() {
    if (!bothCopied) return;
    navigate("/dashboard");
  }

const hasFiredRef = useRef(false);

useEffect(() => {
  if (!connected || !publicKey) return;
  if (hasFiredRef.current) return;
  hasFiredRef.current = true;

  const createMerchant = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await handleCreateMerchant(publicKey.toString());
      console.log("API response:", response);

      setPublishableKey(response.message.publishableKey);
      setSecretKey(response.message.secretKey);

      
    }  catch (err) {
  const msg = err instanceof Error ? err.message : "";
  if (msg === "Merchant already exists") {
    navigate("/dashboard");
    return;
  }
  console.error("Create merchant failed:", err);
  setError("Failed to create merchant");
  hasFiredRef.current = false;
} finally {
      setLoading(false);
    }
  };

  createMerchant();
}, [connected, publicKey]);

if (loading) {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
      <p className="text-muted-foreground">
        Creating API Keys...
      </p>
    </div>
  );
}

if (error) {
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-background">
      <p className="text-red-400">{error}</p>
    </div>
  );
}

  // ---------------------------------------------------------------------------
  // Gate view — shown until a wallet is connected
  // ---------------------------------------------------------------------------
  if (!connected || !publicKey) {
    return (
      <div className="flex h-[100dvh] w-full items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-[420px] flex flex-col items-center text-center"
        >
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <Wallet className="w-5 h-5 text-primary" />
          </div>

          <h1 className="font-display text-2xl font-bold text-foreground">
            Connect your wallet
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 mb-6 max-w-[340px]">
            You need to connect your wallet before you can view your API
            keys.
          </p>

          <WalletMultiButton
            style={{ height: 44, borderRadius: 8, fontSize: 14, fontWeight: 500 }}
          />

          {connecting && (
            <p className="text-[11px] text-muted-foreground mt-3">
              Connecting…
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Reveal view — shown once connected
  // ---------------------------------------------------------------------------
  return (
    <div className="flex h-[100dvh] w-full items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="w-full max-w-[560px]"
      >
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
            <KeyRound className="w-5 h-5 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Your account is ready
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-[380px]">
            Here are your API keys. Save them now — for your security, the
            secret key will not be shown again.
          </p>
        </div>

        <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/20 rounded-xl px-5 py-4 mb-4">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-400">
              This is the only time you'll see your secret key.
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              We store only a hash of it. If you lose it, you'll need to
              rotate your keys from the dashboard.
            </p>
          </div>
        </div>

        <div className="bg-card border border-white/8 rounded-xl p-6 mb-4">
          <KeyRow
            label="Publishable Key"
            helper="Safe to use in client-side code."
            value={publishableKey}
            copied={copiedPub}
            onCopy={() => copy(publishableKey, "pub")}
          />
          <div className="border-t border-white/5 mb-6" />
          <KeyRow
            label="Secret Key"
            helper="Use only on your server. Keep it confidential."
            value={secretKey}
            masked={secretMasked}
            copied={copiedSecret}
            onCopy={() => copy(secretKey, "secret")}
            revealable
            revealed={showSecret}
            onToggleReveal={() => setShowSecret((s) => !s)}
          />
        </div>

        <label className="flex items-start gap-2.5 mb-5 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 rounded border-white/20 bg-background accent-primary"
          />
          <span className="text-xs text-muted-foreground">
            I've saved my secret key somewhere secure. I understand it won't
            be shown again.
          </span>
        </label>

        <button
          onClick={handleContinue}
          disabled={!bothCopied || !confirmed}
          className={`w-full h-11 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
            bothCopied && confirmed
              ? "bg-primary text-primary-foreground hover:opacity-90"
              : "bg-white/5 text-muted-foreground cursor-not-allowed"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Continue to Dashboard
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {!bothCopied && (
          <p className="text-[11px] text-center text-muted-foreground mt-2.5">
            Copy both keys to continue
          </p>
        )}
      </motion.div>
    </div>
  );
}