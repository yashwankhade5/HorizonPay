import { ArrowRight, ChevronRight, Terminal } from "lucide-react";
import { DashboardMockup } from "./DashboardMockup";
import { AnimatedReveal } from "./shared/AnimatedReveal";
import { CodeSnippet } from "./CodeSnippet";
import { motion } from "framer-motion";

export function Hero() {
  return (
    <section className="relative min-h-[100dvh] pt-32 pb-20 flex items-center overflow-hidden">
      {/* Background Grid & Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/20 blur-[120px] rounded-full opacity-30" />
      </div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="flex flex-col gap-8">
            <AnimatedReveal>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm font-mono font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                v2.0 Mainnet Live
              </div>
            </AnimatedReveal>

            <AnimatedReveal delay={0.1}>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] text-white tracking-tight">
                Trustless settlement.<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Stripe-like DX.</span>
              </h1>
            </AnimatedReveal>

            <AnimatedReveal delay={0.2}>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
                The payment API layer for Solana stablecoins. Merchants add three lines to their checkout endpoint. Customers pay in USDC. Funds settle in milliseconds to your non-custodial on-chain vault.
              </p>
            </AnimatedReveal>

            <AnimatedReveal delay={0.3} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <button className="h-12 px-6 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center gap-2 transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)]">
                Start Building
                <ArrowRight className="w-4 h-4" />
              </button>
              <button className="h-12 px-6 rounded-lg border border-white/10 bg-white/5 text-white font-medium flex items-center gap-2 transition-colors hover:bg-white/10">
                <Terminal className="w-4 h-4" />
                Read the Docs
              </button>
            </AnimatedReveal>
            
            <AnimatedReveal delay={0.4} className="pt-4 flex items-center gap-6 text-sm font-mono text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                Zero chargebacks
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                Non-custodial
              </div>
            </AnimatedReveal>
          </div>

          <div className="relative">
            <AnimatedReveal direction="left" delay={0.3}>
              <div className="relative z-10 w-full max-w-[480px] mx-auto lg:ml-auto">
                <DashboardMockup />
                
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  className="absolute -bottom-12 -left-12 right-12 z-20"
                >
                  <CodeSnippet />
                </motion.div>
              </div>
            </AnimatedReveal>
          </div>

        </div>
      </div>
    </section>
  );
}
