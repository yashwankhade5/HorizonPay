import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Banknote,
  Key,
  Webhook,
  RefreshCw,
  Settings,
  Zap,
  BookOpen,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/transactions", label: "Transactions", icon: ArrowLeftRight },
  { href: "/withdraw", label: "Withdraw", icon: Banknote },
  { href: "/api-keys", label: "API Keys", icon: Key },
  { href: "/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 w-[220px] bg-card border-r border-white/5 flex flex-col z-20">
        <div className="p-6">
          <Link href="/" className="flex flex-col gap-1 w-max">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.4)] shrink-0">
                <div className="w-2 h-2 rounded-full bg-background" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">
                HorizonPay
              </span>
            </div>
            <div className="ml-8.5">
              <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                Enterprise Tier
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = location === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-sm ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
          
           <a href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all font-medium text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Subscriptions
          </a>
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium rounded-lg py-2 transition-all hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Zap className="w-4 h-4" />
            Upgrade Plan
          </button>
          <div className="flex flex-col gap-2 pt-2">
            
              <a href="#"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              <BookOpen className="w-3.5 h-3.5" />
              Docs
            </a>
            <Link
              href="/signin"
              className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}