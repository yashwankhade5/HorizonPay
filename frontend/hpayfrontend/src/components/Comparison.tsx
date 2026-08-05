import { AnimatedReveal } from "./shared/AnimatedReveal";
import { Check, X } from "lucide-react";

export function Comparison() {
  return (
    <section className="py-24 bg-[#0A0E17] border-y border-white/5">
      <div className="container mx-auto max-w-7xl px-6">
        <AnimatedReveal>
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              The old rails are bleeding you dry.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Traditional credit card networks tax every transaction and punish merchants for fraud. We bypassed them entirely.
            </p>
          </div>
        </AnimatedReveal>

        <AnimatedReveal delay={0.2}>
          <div className="w-full overflow-x-auto pb-4">
            <table className="w-full min-w-[600px] text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-4 px-6 text-sm font-mono text-muted-foreground font-medium w-1/3">Feature</th>
                  <th className="py-4 px-6 text-sm font-mono text-muted-foreground font-medium w-1/3">Traditional Rails (Stripe/PayPal)</th>
                  <th className="py-4 px-6 text-sm font-mono text-primary font-bold w-1/3 border-b-2 border-primary">HorizonPay</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm md:text-base">
                {[
                  { feature: "Base Fee", trad: "2.9% + 30¢", horizon: "2.0% Flat" },
                  { feature: "Interchange Fees", trad: "Hidden, variable, opaque", horizon: "Zero" },
                  { feature: "Chargebacks", trad: "$15 penalty + lost funds", horizon: "Cryptographically impossible" },
                  { feature: "Settlement Time", trad: "2-7 business days", horizon: "400 milliseconds" },
                  { feature: "Custody", trad: "They hold your money", horizon: "Self-custodial vault" },
                  { feature: "Account Freezes", trad: "Arbitrary, infinite duration", horizon: "Permissionless" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-5 px-6 font-medium text-white">{row.feature}</td>
                    <td className="py-5 px-6 text-muted-foreground">{row.trad}</td>
                    <td className="py-5 px-6 font-semibold text-primary flex items-center gap-2">
                      <Check className="w-4 h-4" />
                      {row.horizon}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
