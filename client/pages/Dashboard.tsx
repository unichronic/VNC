import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Activity, CheckCircle2, Clock3, Cpu, Database, Play, ShieldCheck, Siren, File, Monitor, BarChart3 } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className={ok ? "size-2.5 rounded-full bg-emerald-500" : "size-2.5 rounded-full bg-destructive"} />
      <span className="text-muted-foreground">{label}</span>
      <Badge variant={ok ? "secondary" : "destructive"}>{ok ? "Online" : "Down"}</Badge>
    </div>
  );
}

export default function Dashboard() {
  const traffic = useMemo(() =>
    Array.from({ length: 24 }).map((_, i) => ({ hour: `${i}:00`, bw: Math.round(50 + Math.sin(i / 3) * 30 + Math.random() * 20) })),
  []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Configure scenarios, run simulations, and review detections and artifacts.</p>
        </div>
        <Button asChild size="sm" className="gap-1">
          <Link to="/scenarios"><Play className="h-4 w-4" /> Run New Test</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Cpu className="h-4 w-4 text-primary" /> System Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <StatusPill ok label="VMs" />
            <StatusPill ok label="Sensors (Suricata, Zeek)" />
            <StatusPill ok label="Last test" />
            <div className="text-xs text-muted-foreground">Last run: today 14:22 UTC</div>
          </CardContent>
        </Card>

        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-primary" /> Bandwidth (last 24h)</CardTitle>
          </CardHeader>
          <CardContent className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="bw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" hide tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))" }} />
                <Area type="monotone" dataKey="bw" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#bw)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base"><span>Detection rate</span><ShieldCheck className="h-4 w-4 text-emerald-500" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Progress value={92} className="h-2" />
              <span className="text-sm font-medium">92%</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base"><span>Blocked attempts</span><Siren className="h-4 w-4 text-destructive" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">134</div>
            <div className="text-xs text-muted-foreground">Last 7 days</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base"><span>Mean time to detect</span><Clock3 className="h-4 w-4 text-primary" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">3.8s</div>
            <div className="text-xs text-muted-foreground">Median 2.9s</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base"><span>Total scenarios executed</span><Database className="h-4 w-4 text-primary" /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tabular-nums">482</div>
            <div className="text-xs text-muted-foreground">Since inception</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base"><span>Recent alerts</span><CheckCircle2 className="h-4 w-4 text-muted-foreground" /></CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Rule</TableHead>
                  <TableHead className="hidden md:table-cell">Src → Dst</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[
                  { t: "14:22:31", sev: "High", rule: "SURICATA TLS cert mismatch", flow: "10.0.0.7 → 10.0.0.21" },
                  { t: "14:20:10", sev: "Med", rule: "ZEEK clipboard exfil", flow: "10.0.0.7 → 10.0.0.30" },
                  { t: "14:18:03", sev: "Low", rule: "SURICATA DNS spike", flow: "10.0.0.8 → 1.1.1.1" },
                ].map((a, i) => (
                  <TableRow key={i}>
                    <TableCell className="tabular-nums">{a.t}</TableCell>
                    <TableCell>
                      <Badge variant={a.sev === "High" ? "destructive" : a.sev === "Med" ? "secondary" : "outline"}>{a.sev}</Badge>
                    </TableCell>
                    <TableCell className="truncate max-w-[180px] md:max-w-none">{a.rule}</TableCell>
                    <TableCell className="hidden md:table-cell">{a.flow}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-3 text-xs text-muted-foreground">Live Monitor provides full details.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base"><span>Quick links</span></CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm"><Link to="/reports"><File className="mr-2 h-4 w-4" /> Reports</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/monitor"><Monitor className="mr-2 h-4 w-4" /> Live Monitor</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/forensics"><Database className="mr-2 h-4 w-4" /> Artifacts</Link></Button>
            <Button asChild variant="outline" size="sm"><Link to="/logs"><BarChart3 className="mr-2 h-4 w-4" /> Logs</Link></Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
