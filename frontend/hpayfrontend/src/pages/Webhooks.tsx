import { useState, useEffect } from "react";
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
  Plus,
  Pencil,
  ChevronDown,
  ChevronUp,
  Copy,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/shared/Header";
import { apiFetch } from '@/lib/api';

type LogStatus = "200 OK" | "500 Error" | "201 Created";
type Environment = "production" | "staging";

interface EventLog {
  id: string;
  status: LogStatus;
  eventType: string;
  destination: string;
  timestamp: string;
  payload?: string;
}

interface WebhookEndpoint {
  name: string;
  url: string;
  events: string[];
}
interface EnpointResponse {
  success: boolean,
  error?: string,
  webhookurl?: string

}

// -----------------------------------------------------------------------------
// Webhook logs API types + mapping helpers
// -----------------------------------------------------------------------------
interface WebhookLogApiItem {
  id: string;
  merchantId: string;
  eventType: string;
  payload: Record<string, any>;
  delivered: boolean;
  attempts: number;
  lastAttempt: string | null;
  webhookUrl: string;
  nextAttemptAt: string;
  lastError: string | null;
  createdAt: string;
}

interface WebhookLogsResponse {
  success: boolean;
  data: WebhookLogApiItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

function formatLogTimestamp(iso: string) {
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  const isToday = d.toDateString() === new Date().toDateString();
  return isToday ? `Today, ${time}` : `${d.toLocaleDateString()}, ${time}`;
}

function mapWebhookLog(item: WebhookLogApiItem): EventLog {
  const status: LogStatus = item.delivered ? "200 OK" : "500 Error";
  return {
    id: item.id,
    status,
    eventType: item.eventType,
    destination: item.webhookUrl,
    timestamp: formatLogTimestamp(item.lastAttempt ?? item.createdAt),
    payload: JSON.stringify(item.payload, null, 2),
  };
}

type EndpointSlots = Record<Environment, WebhookEndpoint | null>;

const statusStyles: Record<LogStatus, string> = {
  "200 OK": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  "201 Created": "bg-sky-500/10 text-sky-400 border-sky-500/20",
  "500 Error": "bg-red-500/10 text-red-400 border-red-500/20",
};

const initialEndpoints: EndpointSlots = {
  production: {
    name: "Production Main",
    url: "https://api.sitecorp.com/webhooks/horizon",
    events: ["payment.succeeded", "payment.failed"],
  },
  staging: {
    name: "Staging Environment",
    url: "https://staging-api.sitecorp.com/webhooks",
    events: ["customer.created", "subscription.updated"],
  },
};

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

// -----------------------------------------------------------------------------
// Endpoint modal — always scoped to one fixed environment slot.
// Fields may be left blank; saving blank clears the slot back to "Not configured".
// -----------------------------------------------------------------------------
function EndpointModal({
  open,
  environment,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  environment: Environment | null;
  initial: WebhookEndpoint | null;
  onClose: () => void;
  onSave: (environment: Environment, data: WebhookEndpoint | null) => void;
}) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setUrl(initial?.url ?? "");
      setError(null);
    }
  }, [open, initial]);

  if (!open || !environment) return null;

  const env: Environment = environment;

  async function handleSave() {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    // Both blank -> clear the slot locally (no backend concept of "clear")
    if (!trimmedName && !trimmedUrl) {
      onSave(env, null);
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const data = await apiFetch<EnpointResponse>('/webhook/updtae-webhook-url', {
        method: 'POST',
        body: JSON.stringify({
          webhookURL: trimmedUrl
        }),
      });

      if (!data.success || !data.webhookurl) {
        setError(data.error as string || "Failed to update webhook URL");
        setIsSaving(false);
        return;
      }

      onSave(env, {
        name: trimmedName,
        url: data.webhookurl, // use the value the server confirmed
        events: initial?.events ?? [],
      });
    } catch (err) {
      setError("Network error — please try again");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-40 flex items-center justify-center px-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.15 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-[440px] bg-card border border-white/8 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-base font-semibold text-foreground">
                {initial ? "Edit Endpoint" : "Configure Endpoint"}
              </h3>
              <span className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground border border-white/10 bg-white/5 px-1.5 py-0.5 rounded-full inline-block mt-1.5">
                {env}
              </span>
            </div>
            <button
              onClick={onClose}
              disabled={isSaving}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors disabled:opacity-40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Endpoint Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Leave blank for none"
                disabled={isSaving}
                className="w-full h-10 rounded-lg bg-background border border-white/8 px-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 disabled:opacity-60"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">
                Endpoint URL
              </label>
              <input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Leave blank for none"
                disabled={isSaving}
                className="w-full h-10 rounded-lg bg-background border border-white/8 px-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 disabled:opacity-60"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 mt-6">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="flex-1 h-10 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 border border-white/8 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 h-10 rounded-lg text-sm font-semibold bg-primary text-background hover:bg-primary/90 transition-all disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
export default function Webhooks() {
  const [logFilter, setLogFilter] = useState<"all" | "failed">("all");
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const [logs, setLogs] = useState<EventLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [logsError, setLogsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchLogs() {
      setLogsLoading(true);
      setLogsError(null);
      try {
        const res = await apiFetch<WebhookLogsResponse>('/webhook/webhook-logs', {
          method: 'GET',
        });
        if (cancelled) return;
        if (res.success) {
          setLogs(res.data.map(mapWebhookLog));
        } else {
          setLogsError(res.error || "Failed to load webhook logs");
        }
      } catch (err) {
        if (!cancelled) setLogsError("Network error — please try again");
      } finally {
        if (!cancelled) setLogsLoading(false);
      }
    }

    fetchLogs();
    return () => { cancelled = true; };
  }, []);

  const [endpoints, setEndpoints] = useState<EndpointSlots>(initialEndpoints);
  const [modalEnv, setModalEnv] = useState<Environment | null>(null);

  const filteredLogs = logFilter === "failed"
    ? logs.filter(l => l.status === "500 Error")
    : logs;

  const activeCount = Object.values(endpoints).filter(Boolean).length;

  function handleSaveEndpoint(environment: Environment, data: WebhookEndpoint | null) {
    setEndpoints((prev) => ({ ...prev, [environment]: data }));
    setModalEnv(null);
  }

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
        <Header />

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[900px] mx-auto">

            <div className="flex items-start justify-between mb-6">
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-3xl font-bold text-foreground">Webhooks</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your webhook endpoints and monitor delivery events.</p>
              </motion.div>
            </div>

            {/* Configured Endpoints — fixed 2 slots: production + staging */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="bg-card border border-white/8 rounded-xl p-6 mb-4"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-base font-semibold text-foreground">Configured Endpoints</h2>
                <span className="text-xs font-medium text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                  {endpoints.staging ? "1 / 1" : "0 / 1"} Configured
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {(["staging"] as const).map((env) => {
                  const ep = endpoints[env];
                  return (
                    <div key={env} className="bg-background border border-white/8 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${ep ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]" : "bg-white/15"}`} />
                          <span className="text-sm font-semibold text-foreground">
                            {ep?.name || "Not configured"}
                          </span>
                          <span className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground border border-white/10 bg-white/5 px-1.5 py-0.5 rounded-full">
                            {env}
                          </span>
                        </div>
                        <button
                          onClick={() => setModalEnv(env)}
                          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
                          title={ep ? "Edit" : "Configure"}
                        >
                          {ep ? <Pencil className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground truncate mb-3">
                        {ep?.url || "No URL set"}
                      </p>
                      {ep && ep.events.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {ep.events.map(ev => (
                            <span key={ev} className="text-[10px] font-mono text-muted-foreground bg-white/5 border border-white/8 px-2 py-0.5 rounded-full">
                              {ev}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>

            {/* Event Logs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-card border border-white/8 rounded-xl overflow-hidden mb-8"
            >
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

              <div className="grid grid-cols-[100px_1fr_1fr_120px] gap-4 px-6 py-3 border-b border-white/5 bg-white/[0.01]">
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Status</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Event Type</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Destination URL</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium text-right">Timestamp</span>
              </div>

              <div>
                {logsLoading && (
                  <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                    Loading events…
                  </div>
                )}

                {!logsLoading && logsError && (
                  <div className="px-6 py-12 text-center text-sm text-red-400">
                    {logsError}
                  </div>
                )}

                {!logsLoading && !logsError && filteredLogs.length === 0 && (
                  <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                    {logFilter === "failed" ? "No failed events found." : "No events yet."}
                  </div>
                )}

                {!logsLoading && !logsError && filteredLogs.map((log) => (
                  <div key={log.id} className="border-b border-white/5 last:border-0">
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
              </div>

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

      <EndpointModal
        open={modalEnv !== null}
        environment={modalEnv}
        initial={modalEnv ? endpoints[modalEnv] : null}
        onClose={() => setModalEnv(null)}
        onSave={handleSaveEndpoint}
      />
    </div>
  );
}