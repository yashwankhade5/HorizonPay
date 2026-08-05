import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Mail, Lock, Eye, EyeOff, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { saveSession } from "@/lib/auth";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFocused, setIsFocused] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/merchant/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // bypass loca.lt tunnel interstitial
          "bypass-tunnel-reminder": "true",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.token && data.user) {
        saveSession(data.token, data.user);
        setLocation("/activate");
        return;
      }

      if (data.message === "User already exists") {
        setError("An account with this email already exists. Sign in instead.");
        return;
      }

      setError(data.error ?? data.message ?? "Something went wrong. Please try again.");
    } catch {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[100dvh] w-full">
      {/* Left Panel */}
      <div className="hidden lg:flex w-[40%] flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-b from-[#040d14] via-[#071523] to-[#061018]">
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
            Built for the stablecoin economy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-white/70 leading-relaxed"
          >
            Modern payment infrastructure enabling seamless USDC transactions and non-custodial merchant vaults.
          </motion.p>
        </div>

        <div className="relative z-10 flex items-center gap-2.5 text-sm font-medium text-white/50">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
          System Status: All systems operational
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-[60%] flex items-center justify-center p-6 bg-background relative py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[440px] p-8 md:p-10 rounded-xl bg-card border border-white/10 shadow-2xl relative z-10"
        >
          <div className="mb-8">
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Create your account
            </h2>
            <p className="text-muted-foreground text-sm">
              Start accepting USDC payments in minutes.
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
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User
                    className={`w-5 h-5 transition-colors ${
                      isFocused === "name"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Jane Smith"
                  className="w-full h-11 pl-11 pr-4 bg-[hsl(217_33%_11%)] border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onFocus={() => setIsFocused("name")}
                  onBlur={() => setIsFocused(null)}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
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
              <label className="text-sm font-medium text-white/90">
                Password
              </label>
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
              <p className="text-xs text-muted-foreground pt-1">Min 8 characters</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="space-y-2.5"
            >
              <label className="text-sm font-medium text-white/90">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock
                    className={`w-5 h-5 transition-colors ${
                      isFocused === "confirmPassword"
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full h-11 pl-11 pr-11 bg-[hsl(217_33%_11%)] border border-white/10 rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setIsFocused("confirmPassword")}
                  onBlur={() => setIsFocused(null)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-white transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </motion.div>

            {/* Error banner */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3"
                >
                  <span className="text-red-400 text-xs leading-relaxed">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-2"
            >
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.01 }}
                whileTap={{ scale: isLoading ? 1 : 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full h-11 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-background font-semibold rounded-lg shadow-[0_0_24px_rgba(0,229,255,0.25)] transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  "Create Account"
                )}
              </motion.button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-center text-sm text-muted-foreground"
          >
            Already have an account?{" "}
            <Link
              href="/signin"
              className="text-white hover:text-primary transition-colors font-medium"
            >
              Sign in
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-muted-foreground/60"
          >
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
