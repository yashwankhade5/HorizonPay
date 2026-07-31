import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";
import { AnimatedReveal } from "./shared/AnimatedReveal";

function Counter({ from, to, duration, format }: { from: number, to: number, duration: number, format: (val: number) => string }) {
  const [count, setCount] = useState(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      
      // Easing out
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(from + (to - from) * easeOutQuart);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{format(count)}</span>;
}

export function StatsSection() {
  return (
    <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:250%_250%] animate-[shimmer_8s_linear_infinite]" />
      
      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20 text-center">
          
          <AnimatedReveal>
            <div className="flex flex-col items-center py-6">
              <span className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-2">
                <Counter from={0} to={400} duration={2} format={(v) => Math.floor(v).toString() + "ms"} />
              </span>
              <span className="text-primary-foreground/80 font-mono text-sm uppercase tracking-widest">Average Settlement</span>
            </div>
          </AnimatedReveal>

          <AnimatedReveal delay={0.2}>
            <div className="flex flex-col items-center py-6">
              <span className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-2">
                <Counter from={0} to={0} duration={2} format={(v) => "$" + Math.floor(v).toString()} />
              </span>
              <span className="text-primary-foreground/80 font-mono text-sm uppercase tracking-widest">Lost to Chargebacks</span>
            </div>
          </AnimatedReveal>

          <AnimatedReveal delay={0.4}>
            <div className="flex flex-col items-center py-6">
              <span className="text-5xl md:text-7xl font-display font-bold tracking-tighter mb-2">
                <Counter from={0} to={124.5} duration={2.5} format={(v) => "$" + v.toFixed(1) + "M+"} />
              </span>
              <span className="text-primary-foreground/80 font-mono text-sm uppercase tracking-widest">Total Volume Processed</span>
            </div>
          </AnimatedReveal>

        </div>
      </div>
    </section>
  );
}
