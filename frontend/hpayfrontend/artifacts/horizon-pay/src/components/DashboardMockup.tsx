import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export function DashboardMockup() {
  const [balance, setBalance] = useState(124500);

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance((prev) => prev + (Math.random() * 10 - 2));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto aspect-[4/3]">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-600/30 rounded-2xl blur-2xl opacity-50" />
      
      <div className="relative h-full w-full rounded-xl border border-white/10 bg-[#0A0E17]/90 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-black/50 border border-white/5 flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.42857 24.5806H11.0286L26.6 9.41935H21L5.42857 24.5806Z" fill="#14F195"/>
                <path d="M5.42857 7.41935H11.0286L26.6 22.5806H21L5.42857 7.41935Z" fill="#9945FF"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground font-medium">Merchant Vault</span>
              <span className="text-sm font-semibold text-white">Production</span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            Live
          </div>
        </div>

        {/* Balance */}
        <div className="p-6">
          <span className="text-sm font-medium text-muted-foreground">Available Balance</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display text-4xl font-bold text-white tracking-tight">
              {balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xl font-medium text-primary">USDC</span>
          </div>
          
          {/* Sparkline */}
          <div className="h-12 mt-4 relative w-full overflow-hidden">
            <svg viewBox="0 0 400 48" preserveAspectRatio="none" className="w-full h-full">
              <motion.path 
                d="M0 40 C 20 35, 40 45, 60 30 C 80 15, 100 25, 120 10 C 140 -5, 160 20, 180 15 C 200 10, 220 30, 240 25 C 260 20, 280 10, 300 15 C 320 20, 340 5, 360 10 C 370 13, 385 7, 400 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                className="text-primary"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <path 
                d="M0 40 C 20 35, 40 45, 60 30 C 80 15, 100 25, 120 10 C 140 -5, 160 20, 180 15 C 200 10, 220 30, 240 25 C 260 20, 280 10, 300 15 C 320 20, 340 5, 360 10 C 370 13, 385 7, 400 5 L 400 48 L 0 48 Z"
                fill="url(#gradient)"
                className="opacity-20"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Transactions */}
        <div className="px-6 flex-1 flex flex-col gap-3 pb-6">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent Settlement</span>
          
          {[
            { id: "8F4a...9k2m", amount: "+$1,240.00", time: "Just now", status: "Settled" },
            { id: "3B1x...5p0q", amount: "+$45.50", time: "2m ago", status: "Settled" },
            { id: "9M2c...1v7n", amount: "+$890.00", time: "15m ago", status: "Settled" },
          ].map((tx, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 + (i * 0.2) }}
              className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-white/80">{tx.id}</span>
                <span className="text-[10px] text-muted-foreground">{tx.time}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-sm font-semibold text-emerald-400">{tx.amount}</span>
                <span className="text-[10px] text-muted-foreground">{tx.status}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
