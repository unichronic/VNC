import React, { useMemo, useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import DefenseSelectionModal from "@/components/DefenseSelectionModal";
import RunModal from "@/components/RunModal";
import useInventory from "@/hooks/useInventory";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from "react-router-dom";
import {
  Play,
  Eye,
  Shield,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Cpu,
  Download,
  Clipboard,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
} from "recharts";

interface Scenario {
  id: string;
  name: string;
  type: "network" | "host";
  risk: "Low" | "Med" | "High";
  status: "available" | "running" | "completed";
}

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

export default function ScenarioLibrary() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [logs, setLogs] = useState<string[]>([]);
  const [packets, setPackets] = useState<
    { ts: string; summary: string; hex: string }[]
  >([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [runId, setRunId] = useState<string>("");
  const [metrics, setMetrics] = useState<Array<{
    t: string;
    bw: number;
    conn: number;
    ent: number;
    pps: number;
  }>>([]);

  const scenarios = useMemo<Scenario[]>(
    () => [
      {
        id: "S-001",
        name: "Clipboard Exfiltration",
        type: "host",
        risk: "High",
        status: "available",
      },
      {
        id: "S-014",
        name: "TLS Downgrade Probe",
        type: "network",
        risk: "Med",
        status: "available",
      },
      {
        id: "S-022",
        name: "VNC Brute-force",
        type: "network",
        risk: "High",
        status: "completed",
      },
      {
        id: "S-037",
        name: "DNS Tunneling",
        type: "network",
        risk: "Med",
        status: "available",
      },
    ],
    [],
  );

  const [runOpen, setRunOpen] = useState(false);
  const [runConfig, setRunConfig] = useState<any | null>(null);
  const [monitorOpen, setMonitorOpen] = useState(false);
  const { entries } = useInventory();

  // Simulate monitoring data when simulation is running
  useEffect(() => {
    if (!isRunning) return;

    const newRunId = `RUN-${Math.floor(Math.random() * 9000 + 1000)}`;
    setRunId(newRunId);
    setStartTime(Date.now());

    const alertPool = [
      { sev: "High", rule: "SURICATA TLS cert mismatch" },
      { sev: "Med", rule: "ZEEK clipboard exfil" },
      { sev: "Low", rule: "SURICATA DNS spike" },
      { sev: "High", rule: "SURICATA VNC clipboard" },
    ];

    const interval = setInterval(() => {
      // Generate alerts
      if (Math.random() > 0.4) {
        const pick = alertPool[Math.floor(Math.random() * alertPool.length)];
        const alert: Alert = {
          id: Math.random().toString(36).slice(2, 9),
          ts: new Date().toISOString(),
          sev: pick.sev as Alert["sev"],
          rule: pick.rule,
          src: `10.0.0.${Math.floor(2 + Math.random() * 200)}`,
          dst: `10.0.0.${Math.floor(2 + Math.random() * 200)}`,
          bytes: Math.floor(Math.random() * 5000 + 40),
          runId: newRunId,
        };
        setAlerts((s) => [alert, ...s].slice(0, 200));
      }

      // Generate logs
      if (Math.random() > 0.2) {
        const log = `${new Date().toISOString()} auditd: process_create pid=${Math.floor(1000 + Math.random() * 9000)} cmd="/usr/bin/evil"`;
        setLogs((s) => [log, ...s].slice(0, 500));
      }

      // Generate packets
      if (Math.random() > 0.3) {
        const packet = {
          ts: new Date().toISOString(),
          summary: `TCP ${Math.floor(Math.random() * 65535)} -> ${Math.floor(Math.random() * 65535)} len=${Math.floor(Math.random() * 1500)}`,
          hex: Math.random().toString(16).slice(2, 38),
        };
        setPackets((s) => [packet, ...s].slice(0, 50));
      }

      // Update metrics
      setMetrics((prev) => {
        const newMetrics = Array.from({ length: 30 }).map((_, i) => ({
          t: `${i}s`,
          bw: Math.round(50 + Math.random() * 80),
          conn: Math.round(10 + Math.random() * 40),
          ent: Math.round(10 + Math.random() * 80),
          pps: Math.round(100 + Math.random() * 900),
        }));
        return newMetrics;
      });

      setProgress((p) => Math.min(100, p + Math.random() * 6));
    }, 1100);

    return () => clearInterval(interval);
  }, [isRunning]);

  function startSimulation() {
    setIsRunning(true);
    setProgress(1);
    setAlerts([]);
    setLogs([]);
    setPackets([]);
    setMetrics([]);
    setMonitorOpen(true);
  }

  function stopSimulation() {
    setIsRunning(false);
    setProgress(0);
    setMonitorOpen(false);
    toast.success("Simulation stopped", {
      description: "Monitoring data preserved",
    });
  }

  function handleAction(action: string, payload?: any) {
    toast.success(`${action} sent`, { description: `Run ${runId}` });
    setLogs((s) =>
      [
        `${new Date().toISOString()} orchestration: ${action} ${JSON.stringify(payload ?? {})}`,
        ...s,
      ].slice(0, 500),
    );
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "High":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "Med":
        return <Shield className="h-4 w-4 text-yellow-500" />;
      case "Low":
        return <Info className="h-4 w-4 text-blue-500" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "running":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "completed":
        return <Zap className="h-4 w-4 text-primary" />;
      default:
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Scenario Library
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a scenario to view details and run a simulation.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/scenarios/create">Create Custom Scenario</Link>
          </Button>
        </div>
      </div>

      {/* Scenario Cards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((s) => (
          <Card key={s.id} className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold">{s.name}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono">{s.id}</span>
                    <Badge variant="outline" className="text-xs">
                      {s.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getRiskIcon(s.risk)}
                  {getStatusIcon(s.status)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      s.risk === "High"
                        ? "destructive"
                        : s.risk === "Med"
                          ? "secondary"
                          : "outline"
                    }
                    className="text-xs"
                  >
                    {s.risk} Risk
                  </Badge>
                  {entries.length > 0 && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                      {entries.length} target{entries.length !== 1 ? 's' : ''} available
                    </Badge>
                  )}
                </div>
                <Badge
                  variant={
                    s.status === "available"
                      ? "secondary"
                      : s.status === "running"
                        ? "outline"
                        : "default"
                  }
                  className="text-xs"
                >
                  {s.status}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-2">
                {s.name === "Clipboard Exfiltration"
                  ? "Simulates clipboard data exfiltration over VNC clipboard sync."
                  : s.name === "TLS Downgrade Probe"
                  ? "Tests TLS downgrade attacks and certificate validation."
                  : s.name === "VNC Brute-force"
                  ? "Attempts brute-force attacks against VNC authentication."
                  : s.name === "DNS Tunneling"
                  ? "Demonstrates DNS tunneling techniques for data exfiltration."
                  : "Network/host scenario emulation with VNC and sensors."}
              </p>

              {/* Quick Inventory Target Selection */}
              {entries.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">Quick Target</div>
                  <Select onValueChange={(value) => {
                    const target = entries.find(e => e.id === value);
                    if (target) {
                      toast.success(`Selected ${target.alias} for ${s.name}`);
                    }
                  }}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Select inventory target..." />
                    </SelectTrigger>
                    <SelectContent>
                      {entries.map((entry) => (
                        <SelectItem key={entry.id} value={entry.id}>
                          <div className="flex items-center gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${
                              entry.env === 'prod' ? 'bg-red-500' : 
                              entry.env === 'staging' ? 'bg-yellow-500' : 'bg-green-500'
                            }`} />
                            <span className="font-medium">{entry.alias}</span>
                            <span className="text-muted-foreground">({entry.host}:{entry.port})</span>
                            {entry.tls && <Badge variant="secondary" className="text-xs ml-1">TLS</Badge>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <DefenseSelectionModal
                  scenario={{
                    id: s.id,
                    name: s.name,
                    description:
                      s.name === "Clipboard Exfiltration"
                        ? "Simulates clipboard data exfiltration over VNC clipboard sync."
                        : undefined,
                  }}
                  onRun={(cfg) => {
                    setRunConfig(cfg);
                    setRunOpen(true);
                  }}
                />

                <Dialog
                  open={openId === s.id}
                  onOpenChange={(o) => setOpenId(o ? s.id : null)}
                >
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="h-3 w-3 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{s.name}</DialogTitle>
                      <div className="text-sm text-muted-foreground">
                        Involved tools: TigerVNC, RealVNC, Wireshark, Suricata, Zeek
                      </div>
                    </DialogHeader>

                    <div className="space-y-6">
                      {/* Configuration Section */}
                      <div className="grid gap-6 md:grid-cols-3">
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <Label>Description</Label>
                            <Textarea
                              className="mt-1"
                              rows={3}
                              readOnly
                              value={
                                s.name === "Clipboard Exfiltration"
                                  ? "Simulates clipboard data exfiltration over VNC clipboard sync. Detect with host telemetry and network signatures."
                                  : "Network/host scenario emulation with VNC and sensors."
                              }
                            />
                          </div>
                          {/* Inventory Target Selection */}
                          <div className="space-y-4">
                            <div>
                              <Label className="text-sm font-medium">Select Target from Inventory</Label>
                              <div className="mt-2">
                                {entries.length > 0 ? (
                                  <Select onValueChange={(value) => {
                                    const selectedTarget = entries.find(e => e.id === value);
                                    if (selectedTarget) {
                                      toast.success(`Selected ${selectedTarget.alias} as target`);
                                    }
                                  }}>
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Choose a VNC target from inventory..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {entries.map((entry) => (
                                        <SelectItem key={entry.id} value={entry.id}>
                                          <div className="flex items-center gap-3 w-full">
                                            <div className={`w-2 h-2 rounded-full ${
                                              entry.env === 'prod' ? 'bg-red-500' : 
                                              entry.env === 'staging' ? 'bg-yellow-500' : 'bg-green-500'
                                            }`} />
                                            <div className="flex-1">
                                              <div className="font-medium">{entry.alias}</div>
                                              <div className="text-xs text-muted-foreground">
                                                {entry.host}:{entry.port} • {entry.type} • {entry.env}
                                              </div>
                                            </div>
                                            <div className="flex gap-1">
                                              {entry.tls && (
                                                <Badge variant="secondary" className="text-xs">TLS</Badge>
                                              )}
                                              {entry.features.clipboard && (
                                                <Badge variant="outline" className="text-xs">
                                                  <Clipboard className="h-3 w-3 mr-1" />
                                                  Clipboard
                                                </Badge>
                                              )}
                                            </div>
                                          </div>
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="text-center py-6 border-2 border-dashed rounded-lg bg-muted/20">
                                    <div className="text-sm text-muted-foreground mb-2">
                                      No VNC targets in inventory
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-3">
                                      Add VNC targets to your inventory to use them in scenarios
                                    </div>
                                    <Button size="sm" asChild>
                                      <Link to="/inventory">Go to Inventory</Link>
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Configuration Options */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <Label>Payload size (KB)</Label>
                                <Input
                                  className="mt-1"
                                  type="number"
                                  placeholder="256"
                                />
                              </div>
                              <div>
                                <Label>Duration (seconds)</Label>
                                <Input
                                  className="mt-1"
                                  type="number"
                                  placeholder="300"
                                />
                              </div>
                              <div>
                                <Label>Attack Intensity</Label>
                                <Select defaultValue="medium">
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select intensity" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Detection Mode</Label>
                                <Select defaultValue="enabled">
                                  <SelectTrigger className="mt-1">
                                    <SelectValue placeholder="Select mode" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="enabled">Detection Enabled</SelectItem>
                                    <SelectItem value="disabled">Detection Disabled</SelectItem>
                                    <SelectItem value="stealth">Stealth Mode</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="mb-1 block">
                              Defensive modules
                            </Label>
                            <div className="grid grid-cols-2 gap-3">
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox defaultChecked /> Firewall
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox defaultChecked /> IDS (Suricata)
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox /> DLP
                              </label>
                              <label className="flex items-center gap-2 text-sm">
                                <Checkbox /> EDR
                              </label>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>VNC Variant</Label>
                            <Select defaultValue="tigervnc">
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select variant" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="tigervnc">
                                  TigerVNC
                                </SelectItem>
                                <SelectItem value="realvnc">
                                  RealVNC
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Progress</Label>
                            <Progress value={progress} className="mt-2" />
                            <div className="mt-1 text-xs text-muted-foreground">
                              {progress < 100
                                ? "Awaiting start"
                                : "Completed"}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              className="flex-1"
                              onClick={startSimulation}
                              disabled={isRunning}
                            >
                              {isRunning ? "Running..." : "Run"}
                            </Button>
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => {
                                setProgress(0);
                                setIsRunning(false);
                              }}
                            >
                              Reset
                            </Button>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Start Simulation triggers backend orchestration
                            (e.g., Ansible) and streams logs.
                          </div>
                        </div>
                      </div>

                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <RunModal
        scenario={
          runConfig
            ? {
                id: runConfig.scenarioId,
                name: runConfig.comboName || runConfig.scenarioId,
              }
            : null
        }
        inventory={entries}
        open={runOpen}
        onOpenChange={setRunOpen}
        onStart={(cfg) => {
          console.log("Started run", cfg);
          startSimulation();
          setRunOpen(false);
        }}
      />

      {/* Live Monitor Popup */}
      <Dialog open={monitorOpen} onOpenChange={setMonitorOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Live Monitor - {scenarios.find(s => s.id === openId)?.name || "Simulation"}</span>
              {isRunning && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2">
                    <Clipboard className="h-4 w-4" />
                    <span className="text-sm font-mono">{runId}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={stopSimulation}
                  >
                    Stop
                  </Button>
                </div>
              )}
            </DialogTitle>
            <div className="text-sm text-muted-foreground">
              Real-time monitoring and telemetry data
            </div>
          </DialogHeader>

          {isRunning && (
            <div className="space-y-6">
              {/* Run Status */}
              <Card>
                <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pt-6">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-xs text-muted-foreground">Run ID</div>
                      <div className="font-mono font-semibold">{runId}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Scenario</div>
                      <div className="font-semibold">{scenarios.find(s => s.id === openId)?.name || "Unknown"}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Status</div>
                      <div className="font-semibold text-emerald-500">Running</div>
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
                      Elapsed: {startTime ? Math.max(0, Math.floor((Date.now() - startTime) / 1000)) : 0}s
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Live Alerts and Metrics */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="md:col-span-2">
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
              </div>

              {/* Packet Preview and Host Telemetry */}
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

              {/* Artifacts Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Download className="h-4 w-4" /> Artifacts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">PCAP</div>
                        <div className="text-xs text-muted-foreground">
                          Size: {Math.round(Math.random() * 40)} MB
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          toast.success("Downloading PCAP (simulated)")
                        }
                      >
                        Download
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Suricata JSON</div>
                        <div className="text-xs text-muted-foreground">
                          Entries: {alerts.length}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          toast.success("Downloading Suricata JSON (simulated)")
                        }
                      >
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {!isRunning && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="text-muted-foreground">
                  No simulation running
                </div>
                <div className="text-sm text-muted-foreground">
                  Start a simulation from the scenario details to see live monitoring data
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
