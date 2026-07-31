import { AnimatedReveal } from "./shared/AnimatedReveal";
import { FileSearch, ShieldCheck, Users } from "lucide-react";

export function SecuritySection() {
  return (
    <section className="py-24 bg-card border-t border-white/5">
      <div className="container mx-auto max-w-7xl px-6">
        <AnimatedReveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              Trust math, not promises.
            </h2>
            <p className="text-lg text-muted-foreground">
              Our smart contracts are fully open source, heavily audited, and designed with paranoid safeguards to protect merchant funds.
            </p>
          </div>
        </AnimatedReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FileSearch className="w-6 h-6" />,
              title: "On-Chain Audit Trail",
              desc: "Every configuration change, admin action, and settlement is written to an immutable ledger."
            },
            {
              icon: <ShieldCheck className="w-6 h-6" />,
              title: "Max 30-Day Freezes",
              desc: "Emergency pauses auto-expire in 30 days. No entity can permanently lock your vault."
            },
            {
              icon: <Users className="w-6 h-6" />,
              title: "Multi-Sig Enforcement",
              desc: "Critical program upgrades require N-of-M signatures enforced directly on-chain."
            }
          ].map((item, i) => (
            <AnimatedReveal key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            </AnimatedReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
