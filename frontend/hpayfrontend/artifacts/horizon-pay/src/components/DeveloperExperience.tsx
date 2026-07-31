import { AnimatedReveal } from "./shared/AnimatedReveal";
import { Webhook, TerminalSquare, Key, Bug } from "lucide-react";

export function DeveloperExperience() {
  const features = [
    {
      icon: <Webhook className="w-6 h-6" />,
      title: "HMAC-Signed Webhooks",
      desc: "Every payload is cryptographically signed. Verify events locally without trusting the network.",
      code: `app.post('/webhook', (req, res) => {
  const sig = req.headers['x-horizon-signature'];
  const event = horizon.webhooks.construct(
    req.body, sig, endpointSecret
  );
  // Process event
});`
    },
    {
      icon: <TerminalSquare className="w-6 h-6" />,
      title: "Native SDKs",
      desc: "TypeScript, Rust, Python, and Go. Typed end-to-end so you never guess payload structures.",
      code: `import { HorizonPay } from '@horizonpay/node';
const client = new HorizonPay('sk_live_...');
const vault = await client.vaults.retrieve();`
    }
  ];

  return (
    <section className="py-24 bg-background relative">
      <div className="container mx-auto max-w-7xl px-6">
        <AnimatedReveal>
          <div className="max-w-2xl mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-6">
              The Stripe mental model,<br/>on Solana rails.
            </h2>
            <p className="text-lg text-muted-foreground">
              If you've integrated traditional payment processors, you already know how to use HorizonPay. Publishable keys for the frontend, secret keys for the backend.
            </p>
          </div>
        </AnimatedReveal>

        <div className="grid lg:grid-cols-2 gap-8">
          {features.map((f, i) => (
            <AnimatedReveal key={i} delay={i * 0.1}>
              <div className="bg-[#0A0E17] border border-white/5 rounded-2xl overflow-hidden flex flex-col h-full">
                <div className="p-8 pb-6 border-b border-white/5 flex-1">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{f.title}</h3>
                  <p className="text-muted-foreground">{f.desc}</p>
                </div>
                <div className="bg-[#05080f] p-6 text-sm font-mono text-blue-200/80 overflow-x-auto">
                  <pre><code>{f.code}</code></pre>
                </div>
              </div>
            </AnimatedReveal>
          ))}
        </div>

        <div className="mt-8 grid md:grid-cols-2 gap-8">
          <AnimatedReveal delay={0.2}>
             <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                 <Key className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-white">Granular API Keys</h4>
                 <p className="text-sm text-muted-foreground">Scope keys to specific sub-vaults or read-only access.</p>
               </div>
             </div>
          </AnimatedReveal>
          
          <AnimatedReveal delay={0.3}>
             <div className="p-6 rounded-xl border border-white/5 bg-white/[0.01] flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                 <Bug className="w-5 h-5" />
               </div>
               <div>
                 <h4 className="font-bold text-white">Devnet Sandbox</h4>
                 <p className="text-sm text-muted-foreground">Test end-to-end flows with fake USDC before going live.</p>
               </div>
             </div>
          </AnimatedReveal>
        </div>
      </div>
    </section>
  );
}
