import { Wallet } from "lucide-react";
import { Link } from "wouter";

import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

export function Navbar() {
  const {publicKey} =useWallet()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-background" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-foreground">
              HorizonPay
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#docs" className="hover:text-primary transition-colors">Docs</a>
            <a href="#support" className="hover:text-primary transition-colors">Support</a>
            <a href="#changelog" className="hover:text-primary transition-colors">Changelog</a>
            <a href="#status" className="hover:text-primary transition-colors flex items-center gap-2">
              Merchant Status
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <Link href="/signin" className="hidden md:block text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            Sign In
          </Link>
          {/* <button className="relative group overflow-hidden rounded-md bg-primary/10 border border-primary/20 px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.3)]">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              <span>Connect Wallet</span>
            </div>
          </button> */}
         
<WalletMultiButton>
  {!publicKey ? (
    <>
      <Wallet className="w-4 h-4" />
      <span className="mx-3">Connect Wallet</span>
    </>
  ) : (
    ""
  )}
</WalletMultiButton>
          
        </div>
      </div>
    </nav>
  );
}
