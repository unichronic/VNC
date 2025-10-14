import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Clipboard, Cpu, AlertTriangle, Zap, Download } from "lucide-react";

type Alert = {
  id: string;
  ts: string;
  sev: "High" | "Med" | "Low";
  rule: string;
  src: string;
  dst: string;
  bytes: number;
  runId?: string;
};

export default function Monitor() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [packets, setPackets] = useState<
    { ts: string; summary: string; hex: string }[]
  >([]);
  const [startTime] = useState(() => Date.now());
  const [progress, setProgress] = useState(0);
  const [runId] = useState(
    () => `RUN-${Math.floor(Math.random() * 9000 + 1000)}`,
  );
  const [scenario] = useState("Clipboard Exfiltration");
  const [defenseCombo] = useState(["Firewall", "IDS", "DLP"].join(" + "));

  const timelineRef = useRef<HTMLDivElement | null>(null);

  // Simulate incoming alerts, logs, packets, metrics
  useEffect(() => {
    const alertPool = [
      { sev: "High", rule: "SURICATA TLS cert mismatch" },
      { sev: "Med", rule: "ZEEK clipboard exfil" },
      { sev: "Low", rule: "SURICATA DNS spike" },
      { sev: "High", rule: "SURICATA VNC clipboard" },
    ];

    const ai = setInterval(() => {
      // new alert sometimes
      if (Math.random() > 0.4) {
        const pick = alertPool[Math.floor(Math.random() * alertPool.length)];
        const a: Alert = {
          id: Math.random().toString(36).slice(2, 9),
          ts: new Date().toISOString(),
          sev: pick.sev as Alert["sev"],
          rule: pick.rule,
          src: `10.0.0.${Math.floor(2 + Math.random() * 200)}`,
          dst: `10.0.0.${Math.floor(2 + Math.random() * 200)}`,
          bytes: Math.floor(Math.random() * 5000 + 40),
          runId,
        };
        setAlerts((s) => [a, ...s].slice(0, 200));
      }

      // logs
      if (Math.random() > 0.2) {
        const l = `${new Date().toISOString()} auditd: process_create pid=${Math.floor(1000 + Math.random() * 9000)} cmd=\"/usr/bin/evil\"`;
        setLogs((s) => [l, ...s].slice(0, 500));
      }

      // packets
      if (Math.random() > 0.3) {
        const p = {
          ts: new Date().toISOString(),
          summary: `TCP ${Math.floor(Math.random() * 65535)} -> ${Math.floor(Math.random() * 65535)} len=${Math.floor(Math.random() * 1500)}`,
          hex: Math.random().toString(16).slice(2, 38),
        };
        setPackets((s) => [p, ...s].slice(0, 50));
      }

      setProgress((p) => Math.min(100, p + Math.random() * 6));
    }, 1100);

    return () => clearInterval(ai);
  }, [runId]);

  // Simulated metrics time-series
  const metrics = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      t: `${i}s`,
      bw: Math.round(50 + Math.random() * 80),
      conn: Math.round(10 + Math.random() * 40),
      ent: Math.round(10 + Math.random() * 80),
      pps: Math.round(100 + Math.random() * 900),
    }));
  }, []);

  function handleAction(action: string, payload?: any) {
    // Call orchestration API in real app. Here, simulate and show toast
    toast.success(`${action} sent`, { description: `Run ${runId}` });
    // For certain actions append a log entry
    setLogs((s) =>
      [
        `${new Date().toISOString()} orchestration: ${action} ${JSON.stringify(payload ?? {})}`,
        ...s,
      ].slice(0, 500),
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Live Monitor</h1>
          <p className="text-sm text-muted-foreground">
            Real-time alerts, metrics, packet preview and host telemetry for
            active runs.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigator.clipboard?.writeText(runId)}
          >
            <Clipboard className="h-4 w-4" /> Copy Run ID
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction("Terminate run", { runId })}
            className="gap-2"
          >
            <Zap className="h-4 w-4" /> Terminate
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-xs text-muted-foreground">Run ID</div>
              <div className="font-mono font-semibold">{runId}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Scenario</div>
              <div className="font-semibold">{scenario}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Defenses</div>
              <div className="font-semibold">{defenseCombo}</div>
            </div>
          </div>
          <div className="flex-1 md:ml-6">
            <div className="flex items-center gap-3">
              <Progress value={progress} className="h-3 flex-1" />
              <div className="w-28 text-right font-medium">
                {Math.round(progress)}%
              </div>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Elapsed:{" "}
              {Math.max(0, Math.floor((Date.now() - startTime) / 1000))}s
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-destructive" /> Live Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-72 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Rule</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Src → Dst
                    </TableHead>
                    <TableHead className="text-right">Bytes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-mono text-xs tabular-nums">
                        {new Date(a.ts).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            a.sev === "High"
                              ? "destructive"
                              : a.sev === "Med"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {a.sev}
                        </Badge>
                      </TableCell>
                      <TableCell className="truncate max-w-[140px] md:max-w-none">
                        {a.rule}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {a.src} → {a.dst}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {a.bytes}
                      </TableCell>
                      <TableCell className="sr-only">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Alert {a.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-2">
                              <div className="text-sm">Rule: {a.rule}</div>
                              <div className="text-sm">Severity: {a.sev}</div>
                              <div className="text-sm">Src: {a.src}</div>
                              <div className="text-sm">Dst: {a.dst}</div>
                              <div className="text-sm">Bytes: {a.bytes}</div>
                              <div className="flex gap-2 pt-2">
                                <Button
                                  onClick={() =>
                                    handleAction("Acknowledge alert", {
                                      id: a.id,
                                    })
                                  }
                                >
                                  Acknowledge
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() =>
                                    handleAction("Terminate session", {
                                      src: a.src,
                                      dst: a.dst,
                                    })
                                  }
                                >
                                  Terminate session
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() =>
                                    handleAction("Apply firewall rule", {
                                      src: a.src,
                                    })
                                  }
                                >
                                  <Zap className="h-4 w-4 mr-1" /> Apply
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-4 w-4 text-primary" /> Live Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="h-24">
                <div className="text-xs text-muted-foreground">
                  Bandwidth (kbps)
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={metrics}>
                    <Line
                      dataKey="bw"
                      stroke="hsl(var(--primary))"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-24">
                <div className="text-xs text-muted-foreground">Connections</div>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={metrics}>
                    <Line
                      dataKey="conn"
                      stroke="#06b6d4"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-24">
                <div className="text-xs text-muted-foreground">
                  Entropy score
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={metrics}>
                    <Line
                      dataKey="ent"
                      stroke="#f59e0b"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-24">
                <div className="text-xs text-muted-foreground">Packets / s</div>
                <ResponsiveContainer width="100%" height={60}>
                  <LineChart data={metrics}>
                    <Line
                      dataKey="pps"
                      stroke="#ef4444"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Download className="h-4 w-4" /> Artifacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">PCAP</div>
                  <div className="text-xs text-muted-foreground">
                    Size: {Math.round(Math.random() * 40)} MB
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.success("Downloading PCAP (simulated)")
                    }
                  >
                    Download
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Suricata JSON</div>
                  <div className="text-xs text-muted-foreground">
                    Entries: {alerts.length}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      toast.success("Downloading Suricata JSON (simulated) ")
                    }
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Packet preview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-auto font-mono text-xs">
              {packets.map((p, i) => (
                <div key={i} className="mb-2 border-b pb-2">
                  <div className="text-xs text-muted-foreground">
                    {new Date(p.ts).toLocaleTimeString()}
                  </div>
                  <div>{p.summary}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">
                    {p.hex}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Host telemetry</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-64 overflow-auto font-mono text-xs">
              {logs.map((l, i) => (
                <div key={i} className="mb-2">
                  {l}
                </div>
              ))}
            </div>
            <div className="mt-3 text-xs text-muted-foreground">
              Streamed from auditd / osquery
            </div>
          </CardContent>
        </Card>
      </div>

      <div ref={timelineRef} className="mt-2">
        <div className="text-sm font-medium mb-2">Event timeline</div>
        <div className="relative h-12 w-full rounded bg-muted/40">
          {/* Simple markers for attack start, first alert, block, terminate */}
          <div
            className="absolute left-2 top-1 h-10 w-2 rounded bg-emerald-500 animate-pulse"
            style={{ left: "4%" }}
            title="Attack start"
          />
          <div
            className="absolute left-1/3 top-1 h-10 w-2 rounded bg-yellow-400 animate-pulse"
            title="First alert"
          />
          <div
            className="absolute left-2/3 top-1 h-10 w-2 rounded bg-red-500 animate-pulse"
            title="Block action"
          />
          <div
            className="absolute right-4 top-1 h-10 w-2 rounded bg-gray-600 animate-pulse"
            title="Session terminate"
          />
        </div>
      </div>
    </div>
  );
}
