import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import * as XLSX from "xlsx";

// shadcn/ui
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

// lucide icons
import {
  Mail,
  MessageSquare,
  Users,
  Upload,
  FileSpreadsheet,
  Phone,
  Send,
  Plus,
  Filter,
  TrendingUp,
  Activity,
  Bell,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ShieldCheck,
  Workflow,
  Waypoints,
  ArrowRight,
  CalendarClock,
  Smartphone,
  LayoutGrid,
  Download,
  Wand2,
} from "lucide-react";

/**
 * Techno Messaging Platform – Single-file React app
 * - Dashboard (Email, WhatsApp/SMS, Gate Pass campaigns)
 * - Contact management (Clients & Manpower)
 * - Messaging with templates
 * - Excel upload (XLSX/CSV) with local persistence (localStorage)
 * - Shutdown availability tracking & notifications
 * - Gate Pass step-by-step workflow + WhatsApp outreach generator
 * - Real-time dashboard analytics (mock + totals from data)
 * - Mobile-responsive, gradient UI, clean cards, smooth animations
 */

const SECTION_CARD_VARIANTS = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.05 * i } }),
};

// Types
type Contact = {
  id: string;
  type: "client" | "manpower";
  name: string;
  email?: string;
  phone?: string; // WhatsApp/SMS
  company?: string; // for clients
  skill?: string; // for manpower
  availability?: "Available" | "Unavailable" | "Unknown";
};

type GatePassStatus = "Not Started" | "In Progress" | "Approved" | "Rejected" | "On Hold";

type GatePass = {
  id: string;
  personId: string; // reference to contact (manpower or visitor)
  personName: string;
  phone?: string;
  site?: string;
  steps: {
    requestSubmitted: boolean;
    idProofReceived: boolean;
    securityClearance: boolean;
    gateIssued: boolean;
  };
  status: GatePassStatus;
  updatedAt: string; // ISO
};

const STORAGE_KEYS = {
  contacts: "techno_contacts_v1",
  templates: "techno_templates_v1",
  gatepasses: "techno_gatepasses_v1",
  settings: "techno_settings_v1",
  campaigns: "techno_campaigns_v1",
};

// Seed default templates
const DEFAULT_TEMPLATES = {
  email: [
    {
      id: "tmpl_email_1",
      name: "Client Update – Shutdown Window",
      body:
        "Dear {{name}},\n\nThis is a reminder about the upcoming shutdown window from {{start_date}} to {{end_date}}. Please review the attached plan and confirm availability.\n\nRegards,\nTechno Ops",
    },
    {
      id: "tmpl_email_2",
      name: "Thank You – Gate Pass Approved",
      body:
        "Hello {{name}},\n\nYour gate pass for {{site}} has been approved. Please carry your ID and show the QR at entry.\n\nThanks,\nSecurity Desk",
    },
  ],
  whatsapp: [
    {
      id: "tmpl_wa_1",
      name: "Manpower Availability Check",
      body:
        "Hi {{name}}, can you confirm your availability for shutdown on {{date}}? Reply YES/NO.",
    },
    {
      id: "tmpl_wa_2",
      name: "Gate Pass Step – ID Proof",
      body:
        "Hi {{name}}, please WhatsApp a clear photo of your ID proof to complete gate pass processing for {{site}}.",
    },
  ],
};

// Helpers
const uid = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();

const gradientBg =
  "bg-[radial-gradient(1200px_600px_at_-10%_-10%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(1200px_600px_at_110%_10%,rgba(168,85,247,0.25),transparent_60%)]";

const SectionHeader: React.FC<{ title: string; icon?: React.ReactNode; right?: React.ReactNode }> = ({
  title,
  icon,
  right,
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-white/10 backdrop-blur border border-white/10">
        {icon}
      </div>
      <h2 className="text-xl md:text-2xl font-semibold tracking-tight">{title}</h2>
    </div>
    {right}
  </div>
);

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string | number;
  footer?: string;
  i?: number;
}> = ({ icon, label, value, footer, i = 0 }) => (
  <motion.div
    custom={i}
    variants={SECTION_CARD_VARIANTS}
    initial="hidden"
    animate="visible"
    className="w-full"
  >
    <Card className="border-white/10 bg-white/5 backdrop-blur hover:bg-white/10 transition-colors">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-white/80">{label}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl md:text-3xl font-bold">{value}</div>
      </CardContent>
      {footer && (
        <CardFooter>
          <p className="text-xs text-white/70 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> {footer}
          </p>
        </CardFooter>
      )}
    </Card>
  </motion.div>
);

const EmptyState: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex flex-col items-center justify-center text-center p-8 border border-white/10 rounded-2xl bg-white/5 backdrop-blur">
    <div className="p-3 rounded-xl bg-white/10 mb-3">{icon}</div>
    <h4 className="text-lg font-semibold mb-1">{title}</h4>
    <p className="text-sm text-white/70 max-w-md">{description}</p>
  </div>
);

function useLocalStorage<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

function parseExcel(file: File): Promise<Contact[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const wb = XLSX.read(data, { type: "array" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(sheet, { defval: "" }) as any[];
        const contacts: Contact[] = json.map((row) => ({
          id: uid(),
          type: (row.type?.toString().toLowerCase().includes("manpower") ? "manpower" : (row.type?.toString().toLowerCase().includes("client") ? "client" : "client")) as Contact["type"],
          name: String(row.name || row.Name || row.fullname || "Unnamed"),
          email: String(row.email || row.Email || ""),
          phone: String(row.phone || row.whatsapp || row.Phone || ""),
          company: String(row.company || row.Company || ""),
          skill: String(row.skill || row.Skill || ""),
          availability: (row.availability || row.Availability || "Unknown") as Contact["availability"],
        }));
        resolve(contacts);
      } catch (e) {
        reject(e);
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

const uploadHint = (
  <div className="text-xs text-white/60">
    Columns detected automatically. Recommended headers:
    <code className="ml-1">type, name, email, phone, company, skill, availability</code>
  </div>
);

const whatsappHref = (phone?: string, text?: string) => {
  if (!phone) return undefined;
  const msg = encodeURIComponent(text || "");
  const digits = phone.replace(/\D/g, "");
  return `https://wa.me/${digits}${msg ? `?text=${msg}` : ""}`;
};

const substituteVars = (body: string, vars: Record<string, string>) =>
  body.replace(/{{\s*([\w_]+)\s*}}/g, (_, k) => vars[k] ?? "");

const Pill: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="px-2 py-1 rounded-full text-xs bg-white/10 border border-white/10">{children}</span>
);

export default function TechnoMessagingDashboard() {
  const [contacts, setContacts] = useLocalStorage<Contact[]>(STORAGE_KEYS.contacts, []);
  const [gatepasses, setGatepasses] = useLocalStorage<GatePass[]>(STORAGE_KEYS.gatepasses, []);
  const [templates, setTemplates] = useLocalStorage(STORAGE_KEYS.templates, DEFAULT_TEMPLATES);
  const [settings, setSettings] = useLocalStorage(STORAGE_KEYS.settings, {
    notifications: true,
    orgName: "Techno Ops",
  });

  const [campaignName, setCampaignName] = useState("");
  const [campaignAudience, setCampaignAudience] = useState<"clients" | "manpower" | "all">("all");
  const [campaignChannel, setCampaignChannel] = useState<"email" | "whatsapp" | "sms">("whatsapp");
  const [campaignTemplate, setCampaignTemplate] = useState<string>(templates.whatsapp[0].id);

  // Derived analytics
  const totalClients = contacts.filter((c) => c.type === "client").length;
  const totalManpower = contacts.filter((c) => c.type === "manpower").length;
  const availabilitySummary = useMemo(() => {
    const counts = { Available: 0, Unavailable: 0, Unknown: 0 } as Record<string, number>;
    contacts
      .filter((c) => c.type === "manpower")
      .forEach((c) => (counts[c.availability || "Unknown"] = (counts[c.availability || "Unknown"] || 0) + 1));
    return counts;
  }, [contacts]);

  const gateStats = useMemo(() => {
    const stats = { Approved: 0, "In Progress": 0, "Not Started": 0, Rejected: 0, "On Hold": 0 } as Record<GatePassStatus, number>;
    gatepasses.forEach((g) => (stats[g.status] = (stats[g.status] || 0) + 1));
    return stats;
  }, [gatepasses]);

  const chartData = useMemo(
    () => [
      { name: "Avail", value: availabilitySummary["Available"] || 0 },
      { name: "Unavail", value: availabilitySummary["Unavailable"] || 0 },
      { name: "Unknown", value: availabilitySummary["Unknown"] || 0 },
    ],
    [availabilitySummary]
  );

  const gateChartData = useMemo(
    () => (
      [
        { name: "Approved", value: gateStats["Approved"] || 0 },
        { name: "In Prog", value: gateStats["In Progress"] || 0 },
        { name: "Not Start", value: gateStats["Not Started"] || 0 },
        { name: "On Hold", value: gateStats["On Hold"] || 0 },
        { name: "Rejected", value: gateStats["Rejected"] || 0 },
      ]
    ),
    [gateStats]
  );

  const fileRef = useRef<HTMLInputElement>(null);

  const addContactsFromFile = async (file: File) => {
    const parsed = await parseExcel(file);
    setContacts((prev) => {
      // Merge by name + phone to avoid duplicates
      const key = (c: Contact) => `${c.name}|${c.phone}`;
      const map = new Map(prev.map((c) => [key(c), c] as const));
      parsed.forEach((c) => map.set(key(c), { ...c, id: map.get(key(c))?.id || uid() }));
      return Array.from(map.values());
    });
  };

  const exportCSV = () => {
    const ws = XLSX.utils.json_to_sheet(contacts);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "contacts");
    XLSX.writeFile(wb, `techno_contacts_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const createGatePassFor = (c: Contact) => {
    const newGp: GatePass = {
      id: uid(),
      personId: c.id,
      personName: c.name,
      phone: c.phone,
      site: "Main Plant",
      steps: { requestSubmitted: true, idProofReceived: false, securityClearance: false, gateIssued: false },
      status: "In Progress",
      updatedAt: nowISO(),
    };
    setGatepasses((prev) => [newGp, ...prev]);
  };

  const toggleStep = (g: GatePass, step: keyof GatePass["steps"]) => {
    setGatepasses((prev) =>
      prev.map((x) =>
        x.id === g.id
          ? {
              ...x,
              steps: { ...x.steps, [step]: !x.steps[step] },
              status: computeStatus({ ...x.steps, [step]: !x.steps[step] }),
              updatedAt: nowISO(),
            }
          : x
      )
    );
  };

  const computeStatus = (steps: GatePass["steps"]): GatePassStatus => {
    if (steps.gateIssued) return "Approved";
    if (steps.securityClearance) return "In Progress";
    if (steps.idProofReceived) return "In Progress";
    if (steps.requestSubmitted) return "In Progress";
    return "Not Started";
  };

  const outreachText = (c: Contact) =>
    substituteVars(templates.whatsapp[0].body, { name: c.name, date: new Date().toLocaleDateString() });

  const [search, setSearch] = useState("");
  const filteredContacts = contacts.filter((c) =>
    [c.name, c.email, c.phone, c.company, c.skill].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className={`min-h-screen text-white ${gradientBg}`}>
      {/* App chrome */}
      <header className="sticky top-0 z-40 backdrop-blur border-b border-white/10 bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-fuchsia-600/30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white/10 border border-white/10"><LayoutGrid className="w-5 h-5"/></div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold leading-tight">Techno Messaging Platform</h1>
              <p className="text-xs md:text-sm text-white/70 -mt-0.5">Client Emails • WhatsApp/SMS • Gate Pass Workflow</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="bg-white/20 border-white/20 hover:bg-white/30">
              <Bell className="w-4 h-4 mr-1"/> Alerts
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20">
                  <Wand2 className="w-4 h-4 mr-2"/> Quick Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-900/95 border-white/20 text-white">
                <DropdownMenuLabel>Utilities</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={exportCSV}><Download className="w-4 h-4 mr-2"/>Export Contacts (XLSX)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => fileRef.current?.click()}><Upload className="w-4 h-4 mr-2"/>Import Contacts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard i={0} icon={<Users className="w-5 h-5"/>} label="Clients" value={totalClients} footer="Growing audience"/>
          <StatCard i={1} icon={<Smartphone className="w-5 h-5"/>} label="Manpower" value={totalManpower} footer="WhatsApp ready"/>
          <StatCard i={2} icon={<ShieldCheck className="w-5 h-5"/>} label="Gate Pass – Approved" value={gateStats["Approved"] || 0} footer="Security cleared"/>
          <StatCard i={3} icon={<Activity className="w-5 h-5"/>} label="Active Campaigns" value={3} footer="Realtime updates"/>
        </div>

        {/* Dashboard Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-4 gap-2 bg-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-white/20">Dashboard</TabsTrigger>
            <TabsTrigger value="contacts" className="data-[state=active]:bg-white/20">Contacts</TabsTrigger>
            <TabsTrigger value="compose" className="data-[state=active]:bg-white/20">Compose</TabsTrigger>
            <TabsTrigger value="gate" className="data-[state=active]:bg-white/20">Gate Pass</TabsTrigger>
          </TabsList>

          {/* === DASHBOARD === */}
          <TabsContent value="dashboard" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                  <SectionHeader title="Campaigns Overview" icon={<Workflow className="w-5 h-5"/>} right={<Pill>Realtime</Pill>} />
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">Email engagement</span>
                      <Pill><Mail className="w-3 h-3 inline -mt-0.5 mr-1"/>Open rate</Pill>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <LineChart data={[{n:1,a:22},{n:2,a:35},{n:3,a:31},{n:4,a:44},{n:5,a:52}]}> 
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="n"/>
                        <YAxis/>
                        <RechartsTooltip/>
                        <Legend/>
                        <Line type="monotone" dataKey="a" name="Open %" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/80">WhatsApp responses</span>
                      <Pill><MessageSquare className="w-3 h-3 inline -mt-0.5 mr-1"/>Reply rate</Pill>
                    </div>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={[{name:"Mon",v:12},{name:"Tue",v:18},{name:"Wed",v:8},{name:"Thu",v:21},{name:"Fri",v:16}]}> 
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <RechartsTooltip/>
                        <Legend/>
                        <Bar dataKey="v" name="Replies" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-white/70">Auto-refreshing insight cards with smooth transitions.</CardFooter>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                  <SectionHeader title="Manpower Availability" icon={<CalendarClock className="w-5 h-5"/>} />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm"><span>Available</span><Pill>{availabilitySummary["Available"] || 0}</Pill></div>
                    <Progress value={((availabilitySummary["Available"] || 0) / Math.max(1, totalManpower)) * 100} className="h-2 bg-white/10" />
                    <div className="flex items-center justify-between text-sm"><span>Unavailable</span><Pill>{availabilitySummary["Unavailable"] || 0}</Pill></div>
                    <Progress value={((availabilitySummary["Unavailable"] || 0) / Math.max(1, totalManpower)) * 100} className="h-2 bg-white/10" />
                    <div className="flex items-center justify-between text-sm"><span>Unknown</span><Pill>{availabilitySummary["Unknown"] || 0}</Pill></div>
                    <Progress value={((availabilitySummary["Unknown"] || 0) / Math.max(1, totalManpower)) * 100} className="h-2 bg-white/10" />
                  </div>
                  <div className="mt-4">
                    <ResponsiveContainer width="100%" height={160}>
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name"/>
                        <YAxis/>
                        <RechartsTooltip/>
                        <Bar dataKey="value" name="Count" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Campaign Builder */}
            <Card className="border-white/10 bg-white/5 backdrop-blur">
              <CardHeader>
                <SectionHeader title="Quick Campaign" icon={<Send className="w-5 h-5"/>} right={<Pill>Draft</Pill>} />
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-3 md:gap-4 items-end">
                <div className="md:col-span-2">
                  <Label className="text-xs">Name</Label>
                  <Input value={campaignName} onChange={(e)=>setCampaignName(e.target.value)} placeholder="e.g., Shutdown Follow-up Week 34" className="bg-white/10 border-white/20"/>
                </div>
                <div>
                  <Label className="text-xs">Audience</Label>
                  <div className="flex gap-2">
                    {(["clients","manpower","all"] as const).map((a)=> (
                      <Button key={a} variant={campaignAudience===a?"default":"outline"} className="bg-white/10 border-white/20 data-[state=on]:bg-white/30" onClick={()=>setCampaignAudience(a)}>{a}</Button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs">Channel</Label>
                  <div className="flex gap-2">
                    {(["email","whatsapp","sms"] as const).map((ch)=> (
                      <Button key={ch} variant={campaignChannel===ch?"default":"outline"} className="bg-white/10 border-white/20" onClick={()=>setCampaignChannel(ch)}>{ch}</Button>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-1">
                  <Label className="text-xs">Template</Label>
                  <select value={campaignTemplate} onChange={(e)=>setCampaignTemplate(e.target.value)} className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                    {(campaignChannel==="email"?templates.email:templates.whatsapp).map((t:any)=> (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
              </CardContent>
              <CardFooter className="flex items-center justify-between">
                <div className="text-xs text-white/70">Use templates with variables like <code>{"{{name}}"}</code>, <code>{"{{date}}"}</code>, <code>{"{{site}}"}</code>.</div>
                <Button className="bg-gradient-to-r from-indigo-500 to-fuchsia-600"><Send className="w-4 h-4 mr-2"/>Launch Draft</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* === CONTACTS === */}
          <TabsContent value="contacts" className="space-y-6 mt-4">
            <Card className="border-white/10 bg-white/5 backdrop-blur">
              <CardHeader>
                <SectionHeader title="Contact Management" icon={<Users className="w-5 h-5"/>} right={<div className="flex items-center gap-3">
                  <Button variant="outline" className="bg-white/10 border-white/20" onClick={()=>fileRef.current?.click()}><Upload className="w-4 h-4 mr-2"/>Upload Excel</Button>
                  <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" hidden onChange={async (e)=>{
                    const f = e.target.files?.[0];
                    if (f) await addContactsFromFile(f);
                    e.currentTarget.value = "";
                  }}/>
                  <Button variant="outline" className="bg-white/10 border-white/20" onClick={exportCSV}><FileSpreadsheet className="w-4 h-4 mr-2"/>Export</Button>
                </div>} />
              </CardHeader>
              <CardContent>
                {uploadHint}
                <div className="flex flex-col md:flex-row md:items-center gap-3 mt-3">
                  <div className="flex-1">
                    <Input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Search by name, email, phone, company, skill" className="bg-white/10 border-white/20"/>
                  </div>
                  <div className="flex items-center gap-3">
                    <Label className="flex items-center gap-2 text-white/80"><Switch checked={settings.notifications} onCheckedChange={(v)=>setSettings((s:any)=>({...s, notifications:v}))}/> Notifications</Label>
                    <Button variant="outline" className="bg-white/10 border-white/20"><Filter className="w-4 h-4 mr-2"/>Filters</Button>
                  </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Company/Skill</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContacts.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6}>
                            <EmptyState icon={<Users className="w-5 h-5"/>} title="No contacts yet" description="Upload an Excel/CSV file to populate clients and manpower. You can also add availability later." />
                          </TableCell>
                        </TableRow>
                      )}
                      {filteredContacts.map((c) => (
                        <TableRow key={c.id} className="hover:bg-white/5">
                          <TableCell>
                            <Badge variant="outline" className="bg-white/10 border-white/20 capitalize">{c.type}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell className="text-white/80">{c.type==="client" ? (c.company||"—") : (c.skill||"—")}</TableCell>
                          <TableCell className="text-white/70">{c.email || "—"}</TableCell>
                          <TableCell className="text-white/80">{c.phone || "—"}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              {c.phone && (
                                <a href={whatsappHref(c.phone, outreachText(c))} target="_blank" rel="noreferrer">
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700"><Phone className="w-4 h-4 mr-1"/>WhatsApp</Button>
                                </a>
                              )}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button size="sm" variant="secondary" className="bg-white/20 border-white/20"><Plus className="w-4 h-4 mr-1"/>Gate Pass</Button>
                                </DialogTrigger>
                                <DialogContent className="bg-slate-900/95 text-white border-white/20">
                                  <DialogHeader>
                                    <DialogTitle>Create Gate Pass</DialogTitle>
                                    <DialogDescription>Start gate pass workflow for {c.name}.</DialogDescription>
                                  </DialogHeader>
                                  <div className="flex items-center gap-3">
                                    <Button onClick={()=>createGatePassFor(c)} className="bg-gradient-to-r from-indigo-500 to-fuchsia-600"><ShieldCheck className="w-4 h-4 mr-2"/>Create</Button>
                                    {c.phone && (
                                      <a href={whatsappHref(c.phone, substituteVars(templates.whatsapp[1].body,{name:c.name, site:"Main Plant"}))} target="_blank" rel="noreferrer">
                                        <Button variant="outline" className="bg-white/10 border-white/20"><MessageSquare className="w-4 h-4 mr-2"/>Request ID Proof</Button>
                                      </a>
                                    )}
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* === COMPOSE === */}
          <TabsContent value="compose" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                  <SectionHeader title="Message Composer" icon={<Mail className="w-5 h-5"/>} />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">Channel</Label>
                      <div className="flex gap-2 mt-1">
                        <Badge className="bg-indigo-600/80"><Mail className="w-3 h-3 -mt-0.5 mr-1"/>Email</Badge>
                        <Badge className="bg-emerald-600/80"><MessageSquare className="w-3 h-3 -mt-0.5 mr-1"/>WhatsApp/SMS</Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs">Choose Template</Label>
                      <select className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2">
                        {templates.email.concat(templates.whatsapp).map((t:any)=> (
                          <option key={t.id}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs">To (email or phone)</Label>
                      <Input placeholder="example@company.com or 9198XXXXXXX" className="bg-white/10 border-white/20"/>
                    </div>
                    <div>
                      <Label className="text-xs">Subject (for email)</Label>
                      <Input placeholder="Subject line" className="bg-white/10 border-white/20"/>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs">Message Body</Label>
                    <Textarea rows={8} placeholder="Use variables like {{name}}, {{date}}, {{site}}" className="bg-white/10 border-white/20"/>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button className="bg-gradient-to-r from-indigo-500 to-fuchsia-600"><Send className="w-4 h-4 mr-2"/>Send</Button>
                    <Button variant="outline" className="bg-white/10 border-white/20"><Phone className="w-4 h-4 mr-2"/>Send via WhatsApp</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                  <SectionHeader title="Template Library" icon={<FileSpreadsheet className="w-5 h-5"/>} right={<Button variant="outline" className="bg-white/10 border-white/20"><Plus className="w-4 h-4 mr-2"/>New</Button>} />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {templates.email.map((t:any)=> (
                      <div key={t.id} className="p-3 rounded-xl border border-white/10 bg-white/5">
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-white/70 mt-1 whitespace-pre-wrap">{t.body}</div>
                      </div>
                    ))}
                  </div>
                  <Separator className="bg-white/10"/>
                  <div className="space-y-2">
                    {templates.whatsapp.map((t:any)=> (
                      <div key={t.id} className="p-3 rounded-xl border border-white/10 bg-white/5">
                        <div className="text-sm font-medium">{t.name}</div>
                        <div className="text-xs text-white/70 mt-1 whitespace-pre-wrap">{t.body}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* === GATE PASS === */}
          <TabsContent value="gate" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                  <SectionHeader title="Gate Pass Workflow" icon={<Waypoints className="w-5 h-5"/>} right={<Pill>Step-by-step</Pill>} />
                </CardHeader>
                <CardContent>
                  {gatepasses.length===0 ? (
                    <EmptyState icon={<ShieldCheck className="w-5 h-5"/>} title="No gate passes yet" description="Create a new gate pass from Contacts or add here. Track each step and ping via WhatsApp." />
                  ) : (
                    <div className="space-y-4">
                      {gatepasses.map((g)=> (
                        <div key={g.id} className="p-4 rounded-2xl border border-white/10 bg-white/5">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <ShieldCheck className="w-5 h-5"/>
                              <div>
                                <div className="font-medium">{g.personName} <span className="text-xs text-white/60">• {g.site}</span></div>
                                <div className="text-xs text-white/70">Updated {new Date(g.updatedAt).toLocaleString()}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="bg-white/10 border-white/20">{g.status}</Badge>
                              {g.phone && (
                                <a href={whatsappHref(g.phone, substituteVars("Hello {{name}}, your gate pass is now '{{status}}'.", {name:g.personName, status:g.status}))} target="_blank" rel="noreferrer">
                                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700"><MessageSquare className="w-4 h-4 mr-1"/>Notify</Button>
                                </a>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                            {([
                              { key: "requestSubmitted", label: "Request" },
                              { key: "idProofReceived", label: "ID Proof" },
                              { key: "securityClearance", label: "Security" },
                              { key: "gateIssued", label: "Gate Issued" },
                            ] as const).map((step) => (
                              <label key={step.key} className="flex items-center gap-2 p-3 rounded-xl border border-white/10 bg-white/5 cursor-pointer">
                                <Checkbox checked={g.steps[step.key]} onCheckedChange={() => toggleStep(g, step.key)} />
                                <span className="text-sm">{step.label}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/5 backdrop-blur">
                <CardHeader>
                  <SectionHeader title="Gate Pass Analytics" icon={<Activity className="w-5 h-5"/>} />
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={gateChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name"/>
                      <YAxis/>
                      <RechartsTooltip/>
                      <Bar dataKey="value" name="Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Mobile footer tip */}
        <div className="md:hidden text-center text-xs text-white/70">
          Optimized for mobile — sticky headers, large tap targets, and responsive cards.
        </div>
      </main>

      <footer className="border-t border-white/10 py-6 text-center text-xs text-white/60">
        © {new Date().getFullYear()} Techno Messaging Suite • Modern gradients • Clean UI • Smooth animations
      </footer>
    </div>
  );
}
