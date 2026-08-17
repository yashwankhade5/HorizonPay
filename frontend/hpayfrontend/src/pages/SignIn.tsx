import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import { saveToken } from "@/lib/auth";
const API_BASE = "http://localhost:3000"

export default function SignIn() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
      e.preventDefault();


        const res = await fetch(`${API_BASE}/merchant/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // bypass loca.lt tunnel interstitial
            "bypass-tunnel-reminder": "true",
          },
          body: JSON.stringify({ email, password }),
        });
  
        const data = await res.json();
        console.log("token received")
  
        if (data.token) {
          saveToken(data.token);
          setLocation("/dashboard");
           console.log("token saved ")
          return;
        }
  
      
  
    }
  

  return (
    <div className="flex min-h-[100dvh] w-full">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[40%] flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-b from-[#061018] via-[#071523] to-[#040d14]">
        {/* Subtle background texture */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 w-max">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <div className="w-3 h-3 rounded-full bg-background" />
            </div>
            <span className="font-display font-bold text-2xl tracking-tight text-white">
              HorizonPay
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl lg:text-5xl font-display font-bold text-white leading-[1.1] mb-6"
          >
            Welcome back to the stablecoin economy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-white/70 leading-relaxed"
          >
            Access your merchant vault, manage payments, and monitor your on-chain activity.
          </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 text-sm font-medium text-white/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          System Status: All systems operational
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 bg-background relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] p-8 md:p-10 rounded-xl bg-card border border-white/10 shadow-2xl relative z-10"
        >
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Welcome back
            </h2>
            <p className="text-muted-foreground text-sm">
              Sign in to your HorizonPay account.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-2.5"
            >
              <label className="text-sm font-medium text-white/90">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail
                    className={`w-5 h-5 transition-colors ${
                      isFocused === "email"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full h-11 pl-11 pr-4 bg-[hsl(217_33%_11%)] border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setIsFocused("email")}
                  onBlur={() => setIsFocused(null)}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white/90">
                  Password
                </label>
                <a
                  href="#"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock
                    className={`w-5 h-5 transition-colors ${
                      isFocused === "password"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-11 pl-11 pr-11 bg-[hsl(217_33%_11%)] border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsFocused("password")}
                  onBlur={() => setIsFocused(null)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
              
                className="w-full h-11 bg-primary hover:bg-primary/90 text-background font-semibold rounded-lg shadow-[0_0_24px_rgba(0,229,255,0.25)] transition-all"
              >
                Sign In
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-white hover:text-primary transition-colors font-medium"
            >
              Sign up
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
