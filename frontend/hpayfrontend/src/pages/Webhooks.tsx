import { useState } from "react";
import { Link } from "wouter";
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
  Bell,
  HelpCircle,
  Settings2,
  Plus,
  MoreHorizontal,
  ChevronDown,
  ChevronUp,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type LogStatus = "200 OK" | "500 Error" | "201 Created";

interface EventLog {
  id: string;
  status: LogStatus;
  eventType: string;
  destination: string;
  timestamp: string;
  payload?: string;
}

const statusStyles: Record<LogStatus, string> = {
  "200 OK": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "201 Created": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "500 Error": "bg-red-500/10 text-red-400 border-red-500/20",
};

const PAYLOAD = `{
  "id": "evt_9v8y7rxa0bac8d0i9",
  "object": "event",
  "type": "payment.succeeded",
  "created": 1698765432,
  "data": {
    "object": {
      "id": "chg_abc1234ef456",
      "amount": 50000,
      "currency": "usd",
      "status": "succeeded"
    }
  }
}`;

const mockLogs: EventLog[] = [
  {
    id: "1",
    status: "200 OK",
    eventType: "payment.succeeded",
    destination: ".../webhooks/horizon",
    timestamp: "Today,  14:52:31",
    payload: PAYLOAD,
  },
  {
    id: "2",
    status: "500 Error",
    eventType: "customer.created",
    destination: ".../webhooks/horizon",
    timestamp: "Today,  14:15:22",
  },
  {
    id: "3",
    status: "200 OK",
    eventType: "payment.failed",
    destination: ".../ssl.sitecorp.com/webhooks",
    timestamp: "Today,  13:05:14",
  },
  {
    id: "4",
    status: "201 Created",
    eventType: "subscription.updated",
    destination: ".../webhooks/horizon",
    timestamp: "Today,  11:29:35",
  },
];

const endpoints = [
  {
    id: "1",
    name: "Production Main",
    url: "https://api.sitecorp.com/webhooks/horizon",
    active: true,
    events: ["payment.succeeded", "payment.failed"],
  },
  {
    id: "2",
    name: "Staging Environment",
    url: "https://staging-api.sitecorp.com/webhooks",
    active: true,
    events: ["customer.created", "subscription.updated"],
  },
];

function SidebarLink({ href, icon: Icon, label, active }: { href: string; icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-sm ${active
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
        }`}
    >
      <Icon className="w-4 h-4" />{label}
    </Link>
  );
}

export default function Webhooks() {
  const [logFilter, setLogFilter] = useState<"all" | "failed">("all");
  const [expandedLog, setExpandedLog] = useState<string | null>("1");

  const filteredLogs = logFilter === "failed"
    ? mockLogs.filter(l => l.status === "500 Error")
    : mockLogs;

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-[220px] bg-card border-r border-white/5 flex flex-col z-20">
        <div className="p-6">
          <Link href="/" className="flex flex-col gap-1 w-max">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-[0_0_10px_rgba(0,229,255,0.4)] shrink-0">
                <div className="w-2 h-2 rounded-full bg-background" />
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-white">HorizonPay</span>
            </div>
            <div className="ml-8.5">
              <span className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground border border-white/10 bg-white/5 px-2 py-0.5 rounded-full">
                Enterprise Tier
              </span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          <SidebarLink href="/dashboard" icon={LayoutDashboard} label="Overview" />
          <SidebarLink href="/transactions" icon={ArrowLeftRight} label="Transactions" />
          <SidebarLink href="/withdraw" icon={Banknote} label="Withdraw" />
          <SidebarLink href="/api-keys" icon={Key} label="API Keys" />
          <SidebarLink href="/webhooks" icon={Webhook} label="Webhooks" active />
          <SidebarLink href="#" icon={RefreshCw} label="Subscriptions" />
          <SidebarLink href="/settings" icon={Settings} label="Settings" />
        </nav>

        <div className="p-4 mt-auto border-t border-white/5 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 bg-primary/10 border border-primary/20 text-primary text-sm font-medium rounded-lg py-2 transition-all hover:bg-primary/20 hover:shadow-[0_0_15px_rgba(0,229,255,0.15)]">
            <Zap className="w-4 h-4" />Upgrade Plan
          </button>
          <div className="flex flex-col gap-2 pt-2">
            <a href="#" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2">
              <BookOpen className="w-3.5 h-3.5" />Docs
            </a>
            <Link href="/signin" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors px-2">
              <LogOut className="w-3.5 h-3.5" />Logout
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col ml-[220px] min-w-0">
        {/* Header */}
        <header className="h-14 bg-card border-b border-white/5 px-6 flex items-center justify-between shrink-0 sticky top-0 z-10">
          <nav className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Docs</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Changelog</a>
          </nav>
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 border border-white/10 rounded-full px-3 py-1 bg-white/5">
            <span className="text-xs text-muted-foreground">Merchant Status:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span className="text-xs font-medium text-emerald-400">Active</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs font-mono text-muted-foreground">8x...1234</div>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><Bell className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><HelpCircle className="w-4 h-4" /></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><Settings2 className="w-4 h-4" /></button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0 ml-1 cursor-pointer">M</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[900px] mx-auto">

            {/* Page header */}
            <div className="flex items-start justify-between mb-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-3xl font-bold text-foreground">Webhooks</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your webhook endpoints and monitor delivery events.</p>
              </motion.div>
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2 h-9 px-4 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 shadow-[0_0_20px_rgba(0,229,255,0.2)] transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Endpoint
              </motion.button>
            </div>

            {/* Configured Endpoints */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-card border border-white/8 rounded-xl p-6 mb-4"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-base font-semibold text-foreground">Configured Endpoints</h2>
                <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                  {endpoints.filter(e => e.active).length} Active
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {endpoints.map((ep) => (
                  <div key={ep.id} className="bg-background border border-white/8 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" />
                        <span className="text-sm font-semibold text-foreground">{ep.name}</span>
                      </div>
                      <button className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xs font-mono text-muted-foreground truncate mb-3">{ep.url}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ep.events.map(ev => (
                        <span key={ev} className="text-[10px] font-mono text-muted-foreground bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Event Logs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-white/8 rounded-xl overflow-hidden mb-8"
            >
              {/* Log header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                <h2 className="font-display text-base font-semibold text-foreground">Event Logs</h2>
                <div className="flex items-center gap-1 bg-white/5 border border-white/8 rounded-lg p-1">
                  {(["all", "failed"] as const).map((f) => (
                    <button
                      key={f}
                      onClick={() => setLogFilter(f)}
                      className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-all ${logFilter === f
                          ? "bg-white/10 text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                        }`}
                    >
                      {f === "all" ? "All" : "Failed"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table header */}
              <div className="grid grid-cols-[100px_1fr_1fr_120px] gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.01]">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Status</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Event Type</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Destination URL</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium text-right">Timestamp</span>
              </div>

              {/* Rows */}
              <div>
                {filteredLogs.map((log) => (
                  <div key={log.id} className="border-b border-white/5 last:border-0">
                    {/* Row */}
                    <div
                      onClick={() => log.payload && setExpandedLog(expandedLog === log.id ? null : log.id)}
                      className={`grid grid-cols-[100px_1fr_1fr_120px] gap-4 px-6 py-3.5 items-center transition-colors ${log.payload ? "cursor-pointer hover:bg-white/[0.02]" : ""
                        } ${expandedLog === log.id ? "bg-white/[0.02]" : ""}`}
                    >
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-mono font-medium border w-fit ${statusStyles[log.status]}`}>
                        {log.status}
                      </span>
                      <span className="text-sm text-foreground font-mono">{log.eventType}</span>
                      <span className="text-sm text-muted-foreground font-mono truncate">{log.destination}</span>
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground font-mono">{log.timestamp}</span>
                        {log.payload && (
                          expandedLog === log.id
                            ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Expanded payload */}
                    <AnimatePresence>
                      {expandedLog === log.id && log.payload && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="mx-6 mb-4 bg-background border border-white/8 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
                              <span className="text-xs font-medium text-muted-foreground">Request Payload</span>
                              <button
                                onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(log.payload!); }}
                                className="p-1 rounded text-muted-foreground hover:text-primary transition-colors"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <pre className="px-4 py-3 text-xs font-mono text-muted-foreground leading-relaxed overflow-x-auto">
                              {log.payload}
                            </pre>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                    No failed events found.
                  </div>
                )}
              </div>

              {/* Load More */}
              <div className="px-6 py-4 border-t border-white/5 text-center">
                <button className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">
                  Load More Events
                </button>
              </div>
            </motion.div>

            {/* Footer */}
            <div className="text-center pb-4">
              <p className="text-xs text-muted-foreground mb-2 font-semibold">HorizonPay</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                {["Privacy Policy", "Terms of Service", "Security", "Status"].map(item => (
                  <a key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{item}</a>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">© 2024 HorizonPay Inc. Built for the stablecoin economy.</p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
