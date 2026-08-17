import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Info, X, HelpCircle, LogOut, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Transaction, PublicKey } from '@solana/web3.js';
import { Buffer } from 'buffer';
import { useSolanaWallet, type DetectedWallet } from '@/hooks/use-solana-wallet';
import { apiFetch } from '@/lib/api';
import { saveToken } from '@/lib/auth';

// ─── Types ────────────────────────────────────────────────────────────────────

type ActivationStep = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error';

interface BuildActivateTxResponse {
  unsignedtx: string;
  merchantPda: string;
  merchantVault: string;
}

// ─── Radar / concentric-rings visual ─────────────────────────────────────────

function WalletVisual({ connected, step }: { connected: boolean; step: ActivationStep }) {
  const isProcessing = ['building', 'signing', 'submitting'].includes(step);
  const isSuccess = step === 'success';

  return (
    <div className="relative flex flex-col items-center justify-center py-2">
      <div className="relative w-[220px] h-[220px] flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-primary/10" />
        <div className="absolute inset-[28px] rounded-full border border-primary/15" />
        <div className="absolute inset-[56px] rounded-full border border-primary/25" />
        <div className="absolute inset-[84px] rounded-full border border-primary/35" />

        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: isProcessing ? 1.5 : 4, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-[28px] rounded-full"
          style={{
            background: isProcessing
              ? 'conic-gradient(from 0deg, transparent 60%, hsl(186 100% 45% / 0.4) 100%)'
              : 'conic-gradient(from 0deg, transparent 75%, hsl(186 100% 45% / 0.15) 100%)',
          }}
        />

        <motion.div
          animate={connected ? { scale: [1, 1.06, 1] } : { scale: 1 }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10"
        >
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-700 ${
              isSuccess
                ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_28px_rgba(52,211,153,0.4)]'
                : connected
                ? 'bg-primary/20 border-primary/50 shadow-[0_0_28px_rgba(0,229,255,0.4)]'
                : 'bg-[hsl(220_40%_10%)] border-primary/30 shadow-[0_0_16px_rgba(0,229,255,0.15)]'
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            ) : isProcessing ? (
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
            ) : (
              <svg
                className={`w-6 h-6 transition-colors duration-700 ${connected ? 'text-primary' : 'text-primary/70'}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="2" y="7" width="20" height="14" rx="2" />
                <path d="M2 11h20" />
                <circle cx="17" cy="16" r="1.5" fill="currentColor" stroke="none" />
                <path d="M6 4h12" strokeLinecap="round" />
              </svg>
            )}
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-1.5 mt-1">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success-dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            />
          ) : connected ? (
            <motion.div
              key="connected-dot"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
            />
          ) : (
            <motion.div
              key="idle-dot"
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-primary/60"
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.span key="success-label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400 font-medium">
              Activated
            </motion.span>
          ) : step === 'building' ? (
            <motion.span key="building-label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary font-medium">
              Building Transaction…
            </motion.span>
          ) : step === 'signing' ? (
            <motion.span key="signing-label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary font-medium">
              Awaiting Signature…
            </motion.span>
          ) : step === 'submitting' ? (
            <motion.span key="submitting-label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[10px] font-mono tracking-[0.25em] uppercase text-primary font-medium">
              Submitting…
            </motion.span>
          ) : connected ? (
            <motion.span key="connected-label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[10px] font-mono tracking-[0.25em] uppercase text-emerald-400 font-medium">
              Wallet Connected
            </motion.span>
          ) : (
            <motion.span key="awaiting-label" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} className="text-[10px] font-mono tracking-[0.25em] uppercase text-muted-foreground/50">
              Awaiting Wallet
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Wallet selector modal ────────────────────────────────────────────────────

function WalletModal({
  open,
  wallets,
  onClose,
  onSelect,
}: {
  open: boolean;
  wallets: DetectedWallet[];
  onClose: () => void;
  onSelect: (w: DetectedWallet) => void;
}) {
  const hasProvider = wallets.some((w) => w.provider !== null);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            className="w-full max-w-[340px] bg-[hsl(220_40%_9%)] border border-white/10 rounded-xl p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-base font-semibold text-white">Connect Wallet</h3>
              <button
                onClick={onClose}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:text-white hover:bg-white/5 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {wallets.map((w) => (
                <button
                  key={w.name}
                  onClick={() => onSelect(w)}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-lg bg-white/[0.03] border border-white/[0.07] hover:bg-primary/5 hover:border-primary/25 transition-all group"
                >
                  <img src={w.icon} alt={w.name} className="w-8 h-8 rounded-lg flex-shrink-0" />
                  <span className="text-sm font-medium text-white/90 group-hover:text-white transition-colors">
                    {w.name}
                  </span>
                  {w.provider ? (
                    <span className="ml-auto text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full shrink-0">
                      Detected
                    </span>
                  ) : (
                    <span className="ml-auto text-[10px] text-muted-foreground/60 border border-white/10 bg-white/[0.03] px-2 py-0.5 rounded-full shrink-0">
                      Install
                    </span>
                  )}
                </button>
              ))}
            </div>

            {!hasProvider && (
              <p className="text-xs text-muted-foreground/50 text-center mt-3 leading-relaxed">
                No wallet detected. Install{' '}
                <a href="https://phantom.app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Phantom
                </a>{' '}
                or{' '}
                <a href="https://solflare.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  Solflare
                </a>{' '}
                to continue.
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Activate() {
  const [, setLocation] = useLocation();
  const { connected, publicKey, detectedWallets, connect, disconnect, signTransaction } = useSolanaWallet();
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<ActivationStep>('idle');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const truncated = publicKey
    ? `${publicKey.slice(0, 4)}...${publicKey.slice(-4)}`
    : null;

  const handleWalletSelect = async (w: DetectedWallet) => {
    setShowModal(false);
    await connect(w);
  };

  const handleActivate = async () => {
    if (!publicKey) return;
    setErrorMsg(null);

    try {
      // ── Step 1: Build the unsigned transaction ──────────────────────────────
      setStep('building');
      const buildRes = await apiFetch<BuildActivateTxResponse>(
        '/merchant/build-activate-tx',
        {
          method: 'POST',
          body: JSON.stringify({ walletPubkey: publicKey }),
        }
      );

      // ── Step 2: Deserialize, set fee payer, present to wallet ───────────────
      setStep('signing');

      const txBytes = Buffer.from(buildRes.unsignedtx, 'base64');
      const transaction = Transaction.from(txBytes);

      // Set the connected wallet as fee payer
      transaction.feePayer = new PublicKey(publicKey);

      // Pop up the wallet to sign
      const signedTransaction = await signTransaction(transaction);

      // ── Step 3: Serialize and submit ────────────────────────────────────────
      setStep('submitting');

      // Serialize exactly like the reference script: tx.serialize().toString('base64')
      // Phantom/Solflare return a fully-signed Transaction, so no options needed.
      const signedTxBase64 = Buffer.from(
        signedTransaction.serialize()
      ).toString('base64');

     const res= await apiFetch('/merchant/activate', {
        method: 'POST',
        body: JSON.stringify({
          signedTx: signedTxBase64,
          walletPubkey: publicKey,
        }),
      });
console.log(res,"response:")
      // ── Step 4: Create merchant record & refresh token ───────────────────────
      try {
        const createRes = await apiFetch<{ token?: string }>('/merchant/create-merchant', {
          method: 'POST',
          body: JSON.stringify({
            walletPubkey: publicKey,
            merchantPda: buildRes.merchantPda,
            merchantVault: buildRes.merchantVault,
          }),
        });
        if (createRes.token) {
          saveToken(createRes.token);
        }
      } catch {
        // Non-fatal: proceed even if token refresh fails
        
      }

      // ── Step 5: Done ────────────────────────────────────────────────────────
      setStep('success');

      // Navigate to dashboard after short delay so user sees success state
      setTimeout(() => setLocation('/dashboard'), 1800);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Activation failed. Please try again.';
      setErrorMsg(
        msg.toLowerCase().includes('rejected') || msg.toLowerCase().includes('cancel')
          ? 'Signature cancelled. Click Activate to try again.'
          : msg
      );
      setStep('error');
    }
  };

  const isProcessing = ['building', 'signing', 'submitting'].includes(step);
  const isSuccess = step === 'success';

  const ctaLabel = () => {
    if (step === 'building') return 'Building transaction…';
    if (step === 'signing') return 'Approve in wallet…';
    if (step === 'submitting') return 'Submitting on-chain…';
    if (step === 'success') return 'Activated! Redirecting…';
    if (step === 'error') return 'Retry Activation';
    return 'Activate Merchant Account';
  };

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-between px-4 py-8 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-primary/[0.03] blur-3xl pointer-events-none" />

      {/* Logo */}
      <div className="relative z-10 flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.4)]">
          <div className="w-2 h-2 rounded-full bg-background" />
        </div>
        <span className="font-display font-bold text-lg tracking-tight text-white">HorizonPay</span>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-[500px] flex flex-col items-center"
      >
        {/* Step indicator */}
        <div className="flex items-center justify-center mb-8">
          {/* Step 1 — done */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg className="w-3 h-3 text-emerald-400" viewBox="0 0 12 12" fill="none">
                <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xs font-medium text-emerald-400/80">Step 1: Identity</span>
          </div>

          <div className="w-10 mx-3 h-px bg-gradient-to-r from-emerald-500/40 to-primary/40" />

          {/* Step 2 — current */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            </div>
            <span className="text-xs font-medium text-primary">Step 2: Activation</span>
          </div>

          <div className="w-10 mx-3 h-px bg-white/10" />

          {/* Step 3 — upcoming */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
            <span className="text-xs font-medium text-muted-foreground/40">Connect</span>
          </div>
        </div>

        {/* Card */}
        <div className="w-full bg-card border border-white/8 rounded-2xl p-7 shadow-2xl flex flex-col items-center">
          <h1 className="font-display text-3xl font-bold text-white leading-tight mb-3 text-center">
            Activate your Merchant<br />Account
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-[340px] mb-2">
            To start accepting USDC payments, link your Solana wallet and initialize your merchant
            identity on the blockchain.
          </p>

          {/* Radar visual */}
          <WalletVisual connected={connected} step={step} />

          {/* Address row — shown when connected */}
          <AnimatePresence>
            {connected && truncated && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="w-full overflow-hidden"
              >
                <div className="flex items-center justify-between bg-[hsl(220_40%_7%)] border border-white/8 rounded-lg px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                    <span className="font-mono text-sm text-white/80">{truncated}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-medium">
                      Connected
                    </span>
                    {!isProcessing && !isSuccess && (
                      <button
                        onClick={disconnect}
                        className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                        title="Disconnect"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error banner */}
          <AnimatePresence>
            {step === 'error' && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="w-full mt-4 flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="text-xs text-red-400 leading-relaxed">{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="w-full mt-5">
            <AnimatePresence mode="wait">
              {connected ? (
                <motion.button
                  key="activate"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  whileHover={{ scale: isProcessing || isSuccess ? 1 : 1.01 }}
                  whileTap={{ scale: isProcessing || isSuccess ? 1 : 0.99 }}
                  onClick={handleActivate}
                  disabled={isProcessing || isSuccess}
                  className={`w-full h-13 flex items-center justify-center gap-2.5 font-semibold rounded-xl shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-all text-sm disabled:opacity-70 disabled:cursor-not-allowed ${
                    isSuccess
                      ? 'bg-emerald-500 text-white'
                      : 'bg-primary hover:bg-primary/90 text-background'
                  }`}
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Zap className="w-4 h-4" />
                  )}
                  {ctaLabel()}
                </motion.button>
              ) : (
                <motion.button
                  key="connect"
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => setShowModal(true)}
                  className="w-full h-13 flex items-center justify-center gap-2.5 bg-primary hover:bg-primary/90 text-background font-semibold rounded-xl shadow-[0_0_40px_rgba(0,229,255,0.3)] transition-all text-sm"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M18 7h-1V5a2 2 0 00-2-2H3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-2h1a1 1 0 001-1V8a1 1 0 00-1-1zm-3 7H3V5h12v2h-3a1 1 0 00-1 1v4a1 1 0 001 1h3v1zm2-2h-4V9h4v3zm-2-1.5a.75.75 0 110-1.5.75.75 0 010 1.5z" />
                  </svg>
                  Connect Wallet
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Progress steps shown while processing */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="w-full overflow-hidden"
              >
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  {[
                    { key: 'building', label: 'Build tx' },
                    { key: 'signing', label: 'Sign' },
                    { key: 'submitting', label: 'Submit' },
                  ].map(({ key, label }, i, arr) => {
                    const steps = ['building', 'signing', 'submitting'];
                    const currentIdx = steps.indexOf(step);
                    const thisIdx = steps.indexOf(key);
                    const isDone = thisIdx < currentIdx;
                    const isCurrent = thisIdx === currentIdx;

                    return (
                      <div key={key} className="flex items-center gap-1">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                            isDone
                              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                              : isCurrent
                              ? 'bg-primary/20 border-primary/40 text-primary'
                              : 'bg-white/5 border-white/10 text-muted-foreground/40'
                          }`}
                        >
                          {isDone ? '✓' : i + 1}
                        </div>
                        <span className={isCurrent ? 'text-primary font-medium' : isDone ? 'text-emerald-400' : ''}>{label}</span>
                        {i < arr.length - 1 && (
                          <div className={`w-6 h-px mx-1 ${isDone ? 'bg-emerald-500/40' : 'bg-white/10'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Info box */}
          <div className="w-full mt-4 flex items-start gap-3 bg-white/[0.03] border border-white/[0.07] rounded-xl p-4">
            <Info className="w-4 h-4 text-primary/60 mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-white/80">On-chain Initialization</span>
              {' — '}
              {connected
                ? 'Click Activate to build and sign the initialization transaction. A one-time network fee (~0.002 SOL) will be deducted from your wallet.'
                : 'This process creates your unique merchant vault on Solana. Connect a wallet to continue.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/[0.06] mt-4">
        <div className="max-w-[500px] mx-auto px-0 py-4 flex items-center justify-between">
          <a
            href="mailto:support@horizonpay.io"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Need Help?
          </a>
          <Link
            href="/signin"
            className="flex items-center gap-1.5 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </Link>
        </div>
      </footer>

      {/* Modal */}
      <WalletModal
        open={showModal}
        wallets={detectedWallets}
        onClose={() => setShowModal(false)}
        onSelect={handleWalletSelect}
      />
    </div>
  );
}
