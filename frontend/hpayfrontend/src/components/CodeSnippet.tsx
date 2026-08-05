import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function CodeSnippet() {
  const code = `import { HorizonPay } from '@horizonpay/node';

const horizon = new HorizonPay(process.env.HORIZON_SECRET_KEY);

// Create a checkout session in 3 lines
const session = await horizon.checkout.sessions.create({
  amount: 4500, // $45.00 USDC
  success_url: 'https://example.com/success',
  cancel_url: 'https://example.com/cancel',
});

// Send session.url to your frontend`;

  const [displayedCode, setDisplayedCode] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedCode(code.substring(0, i));
      i++;
      if (i > code.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [code, started]);

  return (
    <motion.div 
      onViewportEnter={() => setStarted(true)}
      className="relative rounded-xl border border-white/10 bg-[#0A0E17]/80 backdrop-blur-md overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/5 bg-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs font-mono text-muted-foreground ml-2">create-checkout.ts</span>
      </div>
      <div className="p-4 sm:p-6 overflow-x-auto">
        <pre className="font-mono text-sm text-blue-200/80">
          <code>{displayedCode}</code>
          <motion.span 
            animate={{ opacity: [1, 0] }} 
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-primary align-middle ml-1"
          />
        </pre>
      </div>
    </motion.div>
  );
}
