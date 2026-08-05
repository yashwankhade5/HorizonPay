import { AnimatedReveal } from "./shared/AnimatedReveal";
import { ArrowRight, Terminal } from "lucide-react";

export function FooterCTA() {
  return (
    <section className="py-32 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-primary/5 [mask-image:radial-gradient(ellipse_at_center,white,transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto max-w-4xl px-6 relative z-10 text-center">
        <AnimatedReveal>
          <h2 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 tracking-tight">
            Ready to integrate?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get your API keys and process your first transaction on Devnet in under 5 minutes.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="h-14 px-8 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 transition-all hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(0,229,255,0.4)] w-full sm:w-auto text-lg">
              Start Building Now
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="h-14 px-8 rounded-lg border border-white/10 bg-white/5 text-white font-medium flex items-center justify-center gap-2 transition-colors hover:bg-white/10 w-full sm:w-auto text-lg">
              <Terminal className="w-5 h-5" />
              Read the Docs
            </button>
          </div>
        </AnimatedReveal>
      </div>
    </section>
  );
}
