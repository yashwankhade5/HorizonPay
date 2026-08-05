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
  UserPlus,
  Pencil,
  Trash2,
  Building2,
  Users,
  CreditCard,
  BellRing,
} from "lucide-react";
import { motion } from "framer-motion";

/* ─── types ─── */
type SectionId = "org" | "team" | "billing" | "notifications";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Developer" | "Viewer";
  avatar: string;
}

/* ─── mock data ─── */
const mockTeam: TeamMember[] = [
  { id: "1", name: "Jane Doe",  email: "jane@horizonpay.io",  role: "Admin",     avatar: "JD" },
  { id: "2", name: "Alex Smith", email: "alex@horizonpay.io", role: "Developer", avatar: "AS" },
];

const roleStyles: Record<TeamMember["role"], string> = {
  Admin:     "bg-primary/10 text-primary border-primary/20",
  Developer: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  Viewer:    "bg-white/5 text-muted-foreground border-white/10",
};

const sections: { id: SectionId; label: string; icon: React.ElementType }[] = [
  { id: "org",           label: "Organization Profile", icon: Building2  },
  { id: "team",          label: "Team Management",       icon: Users      },
  { id: "billing",       label: "Billing & Plan",        icon: CreditCard },
  { id: "notifications", label: "Notifications",         icon: BellRing   },
];

/* ─── helpers ─── */
function SidebarLink({
  href, icon: Icon, label, active,
}: { href: string; icon: React.ElementType; label: string; active?: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all font-medium text-sm ${
        active
          ? "bg-primary/10 text-primary border border-primary/20"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />{label}
    </Link>
  );
}

function Toggle({ enabled, onToggle, label }: { enabled: boolean; onToggle: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={onToggle}
      className={`relative rounded-full transition-colors shrink-0 ${
        enabled ? "bg-primary" : "bg-white/15"
      }`}
      style={{ height: "22px", width: "40px" }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow ${
          enabled ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

/* ─── main component ─── */
export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SectionId>("org");

  // Org profile
  const [orgName, setOrgName]     = useState("HorizonPay Inc.");
  const [industry, setIndustry]   = useState("Financial Services");
  const [orgSaved, setOrgSaved]   = useState(false);

  // Team
  const [team, setTeam]           = useState<TeamMember[]>(mockTeam);

  // Notifications
  const [failedTx, setFailedTx]   = useState(true);
  const [webhookErr, setWebhookErr] = useState(true);

  function handleSaveOrg() {
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 2000);
  }

  function removeTeamMember(id: string) {
    setTeam(prev => prev.filter(m => m.id !== id));
  }

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden">

      {/* ── App Sidebar ── */}
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
          <SidebarLink href="/dashboard"    icon={LayoutDashboard} label="Overview" />
          <SidebarLink href="/transactions" icon={ArrowLeftRight}  label="Transactions" />
          <SidebarLink href="/withdraw"     icon={Banknote}        label="Withdraw" />
          <SidebarLink href="/api-keys"     icon={Key}             label="API Keys" />
          <SidebarLink href="/webhooks"     icon={Webhook}         label="Webhooks" />
          <SidebarLink href="#"             icon={RefreshCw}       label="Subscriptions" />
          <SidebarLink href="/settings"     icon={Settings}        label="Settings" active />
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

      {/* ── Main ── */}
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
            <button aria-label="Notifications" className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><Bell className="w-4 h-4" /></button>
            <button aria-label="Help" className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><HelpCircle className="w-4 h-4" /></button>
            <button aria-label="Quick settings" className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"><Settings2 className="w-4 h-4" /></button>
            <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-xs font-bold shrink-0 ml-1 cursor-pointer">M</div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-[900px] mx-auto">

            {/* Page header */}
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
              <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground mt-1">Manage your organization's configuration and preferences.</p>
            </motion.div>

            <div className="flex gap-6">

              {/* ── Settings internal nav ── */}
              <motion.nav
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="w-[188px] shrink-0 bg-card border border-white/8 rounded-xl p-2 h-fit sticky top-[80px]"
              >
                {sections.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveSection(id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left ${
                      activeSection === id
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </motion.nav>

              {/* ── Section panels ── */}
              <div className="flex-1 space-y-4 min-w-0">

                {/* Organization Profile */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                  id="org"
                  className="bg-card border border-white/8 rounded-xl p-6"
                >
                  <h2 className="font-display text-base font-semibold text-foreground mb-5">Organization Profile</h2>

                  <div className="flex items-start gap-4 mb-5">
                    {/* Avatar / logo placeholder */}
                    <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <label htmlFor="org-name" className="block text-xs text-muted-foreground mb-1.5 font-medium">Organization Name</label>
                        <input
                          id="org-name"
                          value={orgName}
                          onChange={e => setOrgName(e.target.value)}
                          className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                        />
                      </div>
                      <div>
                        <label htmlFor="org-industry" className="block text-xs text-muted-foreground mb-1.5 font-medium">Industry</label>
                        <select
                          id="org-industry"
                          value={industry}
                          onChange={e => setIndustry(e.target.value)}
                          className="w-full bg-background border border-white/10 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all appearance-none"
                        >
                          {["Financial Services", "E-Commerce", "SaaS", "Healthcare", "Gaming", "Other"].map(opt => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSaveOrg}
                      className={`h-9 px-5 rounded-lg text-sm font-semibold transition-all ${
                        orgSaved
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-primary text-background hover:bg-primary/90 shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                      }`}
                    >
                      {orgSaved ? "Saved ✓" : "Save Changes"}
                    </button>
                  </div>
                </motion.div>

                {/* Team Management */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  id="team"
                  className="bg-card border border-white/8 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-display text-base font-semibold text-foreground">Team Management</h2>
                    <button className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
                      <UserPlus className="w-3.5 h-3.5" />Invite User
                    </button>
                  </div>

                  {/* Table header */}
                  <div className="grid grid-cols-[1fr_100px_64px] gap-3 px-3 pb-2 border-b border-white/5">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">User</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Role</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-wide font-medium text-right">Actions</span>
                  </div>

                  {/* Rows */}
                  <div className="divide-y divide-white/5">
                    {team.map(member => (
                      <div key={member.id} className="grid grid-cols-[1fr_100px_64px] gap-3 items-center px-3 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/25 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {member.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{member.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border w-fit ${roleStyles[member.role]}`}>
                          {member.role}
                        </span>
                        <div className="flex items-center justify-end gap-1">
                          <button aria-label={`Edit ${member.name}`} className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            aria-label={`Remove ${member.name}`}
                            onClick={() => removeTeamMember(member.id)}
                            className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {team.length === 0 && (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        No team members yet. Invite someone to get started.
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Billing & Plan */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                  id="billing"
                  className="bg-card border border-white/8 rounded-xl p-6"
                >
                  <h2 className="font-display text-base font-semibold text-foreground mb-5">Billing & Plan</h2>

                  <div className="bg-background border border-white/8 rounded-xl p-5">
                    {/* Plan badge */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Current Plan</p>
                        <h3 className="font-display text-2xl font-bold text-foreground">Enterprise</h3>
                        <p className="text-xs text-muted-foreground mt-1">8M tx/s, 10% discount</p>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">Active</span>
                    </div>

                    {/* Usage bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                        <span>Usage this cycle</span>
                        <span className="text-foreground font-medium">5 / 9 Calls</span>
                      </div>
                      <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full shadow-[0_0_8px_rgba(0,229,255,0.5)]" style={{ width: "55%" }} />
                      </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5">
                        <p className="text-xs text-muted-foreground mb-0.5">Amount</p>
                        <p className="text-sm font-semibold text-foreground">$2,500 <span className="text-xs font-normal text-muted-foreground">USD</span></p>
                      </div>
                      <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2.5">
                        <p className="text-xs text-muted-foreground mb-0.5">Next Renewal</p>
                        <p className="text-sm font-semibold text-foreground">Renews in <span className="text-primary">15 days</span></p>
                      </div>
                    </div>

                    <button className="h-9 px-5 rounded-lg bg-white/8 border border-white/10 text-sm font-medium text-foreground hover:bg-white/12 hover:border-white/20 transition-all">
                      Manage Subscription
                    </button>
                  </div>
                </motion.div>

                {/* Notifications */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.20 }}
                  id="notifications"
                  className="bg-card border border-white/8 rounded-xl p-6"
                >
                  <h2 className="font-display text-base font-semibold text-foreground mb-5">Notifications</h2>

                  <div className="space-y-4">
                    {[
                      {
                        label: "Failed Transactions",
                        description: "Receive alerts when a transaction fails or is declined.",
                        value: failedTx,
                        onToggle: () => setFailedTx(v => !v),
                      },
                      {
                        label: "Webhook Errors",
                        description: "Get notified if webhook endpoints fail to respond.",
                        value: webhookErr,
                        onToggle: () => setWebhookErr(v => !v),
                      },
                    ].map(({ label, description, value, onToggle }) => (
                      <div key={label} className="flex items-center justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-sm font-medium text-foreground">{label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                        </div>
                        <Toggle enabled={value} onToggle={onToggle} label={label} />
                      </div>
                    ))}
                  </div>
                </motion.div>

              </div>
            </div>

            {/* Footer */}
            <div className="text-center pb-4 mt-8">
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
