import { AnimatedReveal } from "./shared/AnimatedReveal";
import { ShieldAlert, KeyRound, Lock, EyeOff } from "lucide-react";

export function NonCustodial() {
  const points = [
    {
      icon: <Lock className="w-6 h-6 text-primary" />,
      title: "Backend Never Holds Funds",
      desc: "Our servers only broker the state transition. They have zero capability to initiate a transfer out of your vault."
    },
    {
      icon: <EyeOff className="w-6 h-6 text-primary" />,
      title: "Contract is the Only Mover",
      desc: "Smart contracts dictate routing logic. Settlement happens directly between the customer wallet and your merchant vault."
    },
    {
      icon: <KeyRound className="w-6 h-6 text-primary" />,
      title: "Compromised Key = $0 Stolen",
      desc: "Your API secret key can only create payment requests. It cannot withdraw funds, meaning a leaked key doesn't cost you your treasury."
    }
  ];

  return (
    <section className="py-24 bg-card border-y border-white/5 relative overflow-hidden">
      {/* Noise overlay */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJhIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjY1IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI2EpIi8+PC9zdmc+')]"></div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <AnimatedReveal>
          <div className="flex items-center gap-3 mb-4">
            <ShieldAlert className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-mono font-semibold text-primary uppercase tracking-wider">The Non-Custodial Advantage</h2>
          </div>
          <h3 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
            We don't want your money.<br/>
            <span className="text-muted-foreground">We literally can't take it.</span>
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mb-16">
            Traditional payment processors hold your funds hostage. HorizonPay uses Solana's program-derived addresses (PDAs) to ensure funds settle directly into a vault only you control.
          </p>
        </AnimatedReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {points.map((pt, i) => (
            <AnimatedReveal key={i} delay={0.1 * i}>
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {pt.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{pt.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {pt.desc}
                </p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
