import { AnimatedReveal } from "./shared/AnimatedReveal";
import { Zap, RefreshCw, Layers, WalletCards } from "lucide-react";

export function Primitives() {
  const primitives = [
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Instant USDC Payments",
      desc: "400ms settlement times. No more waiting 3-5 business days for ACH. Funds arrive before the user even sees the success page."
    },
    {
      icon: <RefreshCw className="w-5 h-5" />,
      title: "Recurring Billing",
      desc: "Delegate-and-pull architecture allows for automated subscriptions without taking custody of the user's wallet."
    },
    {
      icon: <Layers className="w-5 h-5" />,
      title: "Trustless Escrow",
      desc: "A built-in 7-day on-chain circular buffer for marketplaces. Funds release automatically unless disputed on-chain."
    },
    {
      icon: <WalletCards className="w-5 h-5" />,
      title: "Merchant Vaults",
      desc: "A fully non-custodial treasury with multi-sig support built in. Route different products to different sub-vaults."
    }
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <AnimatedReveal>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Engineering primitives for modern commerce.
            </h2>
            <p className="text-lg text-muted-foreground">
              Don't build blockchain infrastructure. Build your product. We provide the primitives that make Web3 feel like Web2.
            </p>
          </AnimatedReveal>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {primitives.map((prim, i) => (
            <AnimatedReveal key={i} delay={i * 0.1}>
              <div className="group relative p-8 rounded-2xl border border-white/10 bg-[#0A0E17] overflow-hidden hover:border-primary/50 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-colors" />
                
                <div className="relative z-10 flex items-start gap-6">
                  <div className="mt-1 w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-primary transition-colors shrink-0">
                    {prim.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{prim.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {prim.desc}
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
