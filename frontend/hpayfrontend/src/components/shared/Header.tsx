import { useEffect, useState } from "react";
import {
    Bell,
    HelpCircle,
    Settings2,
    Loader2,
} from "lucide-react";
import {  shortWallet } from "@/lib/api";
import { useMerchantProfile } from "@/hooks/useMerchantProfile";
import { useWallet } from "@solana/wallet-adapter-react";

export function Header() {
      const { data, isLoading, isError } = useMerchantProfile();
        const state = data?.MerchantState;
          const isActive = state ? (state.transferFlag && !state.freezeFlag) : true;
          const {publicKey}=useWallet()


    return (
        <>

            <header className="h-14 bg-card border-b border-white/5 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
                <div className="flex items-center gap-6">
                    <nav className="flex gap-4">
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Docs</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</a>
                        <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Changelog</a>
                    </nav>
                </div>

                <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5">
                    <span className="text-xs text-muted-foreground">Merchant Status:</span>
                    {isLoading ? (
                        <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />
                    ) : (
                        <div className="flex items-center gap-1.5">
                            <div className={`w-2 h-2 rounded-full ${isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"}`} />
                            <span className={`text-xs font-medium ${isActive ? "text-emerald-400" : "text-red-400"}`}>
                                {isActive ? "Active" : "Frozen"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-mono text-muted-foreground">
                        {publicKey ? shortWallet(publicKey.toString()) : "—"}
                    </div>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <Bell className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <HelpCircle className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <Settings2 className="w-4 h-4" />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0 ml-1 cursor-pointer">
                        M
                    </div>
                </div>
            </header>

        </>
    );
}
