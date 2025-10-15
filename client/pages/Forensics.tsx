import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Download,
  AlertTriangle,
  Clock,
  Shield,
  FileText,
  Network,
  Monitor,
  CheckCircle,
  XCircle,
  Activity,
  Database,
  Eye,
  Copy,
  ExternalLink,
} from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface EventLog {
  timestamp: string;
  source: string;
  description: string;
  severity: "CRITICAL" | "HIGH" | "WARNING" | "INFO";
  category: "network" | "host" | "vnc" | "ids";
}

interface NetworkFlow {
  srcIp: string;
  dstIp: string;
  srcPort: number;
  dstPort: number;
  protocol: string;
  bytes: number;
  packets: number;
  duration: string;
}

export default function Forensics() {
  const [selectedRunId] = useState("RUN-8472");
  const [selectedScenario] = useState("Clipboard Exfiltration");

  // Mock data for the forensics analysis
  const scenarioData = useMemo(() => ({
    id: selectedRunId,
    attackVector: "Clipboard Theft over Unencrypted VNC",
    defensePolicy: "Suricata Rule Set 3 + Egress Port 5900 Blocked + DLP Module",
    detectionOutcome: "SUCCESSFUL DETECTION",
    timeToDetect: 0.87,
    falsePositives: 0,
    falseNegatives: 1,
    startTime: "2024-01-15T14:22:31Z",
    endTime: "2024-01-15T14:25:47Z",
    totalDuration: "3m 16s",
    vncConfig: {
      encryption: false,
      clipboard: true,
      fileTransfer: true,
      port: 5900,
      version: "TigerVNC 1.12.0",
    },
  }), [selectedRunId]);

  const eventLogs: EventLog[] = useMemo(() => [
    {
      timestamp: "14:22:31.123",
      source: "VNC Server",
      description: "VNC session established - Client connected from 10.0.0.7",
      severity: "INFO",
      category: "vnc",
    },
    {
      timestamp: "14:22:35.456",
      source: "Auditd",
      description: "Process spawn: /usr/bin/vncviewer (PID: 2847) - User: attacker",
      severity: "WARNING",
      category: "host",
    },
    {
      timestamp: "14:23:12.789",
      source: "Auditd",
      description: "File access: /home/victim/secret_data.txt - Read operation",
      severity: "HIGH",
      category: "host",
    },
    {
      timestamp: "14:23:15.234",
      source: "Suricata",
      description: "VNC_CLIPBOARD_PII_TRANSFER - Excessive clipboard data transfer detected",
      severity: "CRITICAL",
      category: "ids",
    },
    {
      timestamp: "14:23:15.567",
      source: "WireShark",
      description: "TCP flow anomaly - 15.7KB transferred in 2 seconds (Port 5900)",
      severity: "HIGH",
      category: "network",
    },
    {
      timestamp: "14:23:16.890",
      source: "Suricata",
      description: "VNC_EXFIL_DETECTED - Pattern matching: SSN format detected",
      severity: "CRITICAL",
      category: "ids",
    },
    {
      timestamp: "14:23:18.123",
      source: "DLP Module",
      description: "Data Loss Prevention trigger - Sensitive data pattern detected",
      severity: "CRITICAL",
      category: "ids",
    },
    {
      timestamp: "14:23:45.456",
      source: "Firewall",
      description: "Egress rule triggered - Blocked connection to external IP 203.0.113.45",
      severity: "HIGH",
      category: "network",
    },
    {
      timestamp: "14:24:01.789",
      source: "VNC Server",
      description: "Session terminated - Client disconnected",
      severity: "INFO",
      category: "vnc",
    },
  ], []);

  const networkFlows: NetworkFlow[] = useMemo(() => [
    {
      srcIp: "10.0.0.7",
      dstIp: "10.0.0.21",
      srcPort: 45231,
      dstPort: 5900,
      protocol: "TCP",
      bytes: 15743,
      packets: 89,
      duration: "2m 34s",
    },
    {
      srcIp: "10.0.0.21",
      dstIp: "203.0.113.45",
      srcPort: 5900,
      dstPort: 8080,
      protocol: "TCP",
      bytes: 8432,
      packets: 23,
      duration: "45s",
    },
  ], []);

  const timelineData = useMemo(() => {
    return Array.from({ length: 60 }).map((_, i) => ({
      time: `${14}:${22 + Math.floor(i / 60)}:${(i % 60).toString().padStart(2, '0')}`,
      activity: Math.random() * 100,
      alerts: Math.random() > 0.7 ? Math.random() * 50 : 0,
      network: Math.random() * 80 + 20,
    }));
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "destructive";
      case "HIGH":
        return "destructive";
      case "WARNING":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "network":
        return <Network className="h-4 w-4" />;
      case "host":
        return <Monitor className="h-4 w-4" />;
      case "vnc":
        return <Eye className="h-4 w-4" />;
      case "ids":
        return <Shield className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const suricataRule = `alert tcp any any -> any any (
    msg: "VNC Exfil: Excessive Bandwidth";
    content: "RFB";
    flow: to_server,established;
    threshold: type both, track by_src, count 5, seconds 10;
    sid: 1000001;
    rev: 1;
)`;

  const ttpDescription = `The attacker successfully exploited unencrypted VNC clipboard synchronization to exfiltrate sensitive data. The attack vector involved:
1. Establishing VNC connection to target host (10.0.0.21:5900)
2. Accessing sensitive file (/home/victim/secret_data.txt) 
3. Copying data to clipboard (15.7KB of PII data)
4. Leveraging VNC's automatic clipboard sync to transfer data
5. Attempting external exfiltration to 203.0.113.45:8080`;

  const defenseRecommendation = `Based on this test, implement the following hardening measures:
1. Enable VNC encryption (TLS/SSL) to prevent clipboard interception
2. Implement egress firewall rule: DROP TCP ANY/ANY → 5900
3. Deploy DLP solution to monitor clipboard operations
4. Configure Suricata rule 1000001 for VNC bandwidth monitoring
5. Enable audit logging for file access and process execution`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Forensics / Artifacts</h1>
          <p className="text-sm text-muted-foreground">
            Detailed analysis of simulation runs, detection outcomes, and forensic evidence.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate PDF
          </Button>
        </div>
      </div>

      {/* Scenario Summary & Efficacy Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Scenario Summary & Efficacy Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Scenario ID</div>
                <div className="font-mono font-semibold">{scenarioData.id}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Attack Vector</div>
                <div className="text-sm">{scenarioData.attackVector}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Defense Policy</div>
                <div className="text-sm">{scenarioData.defensePolicy}</div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Detection Outcome</div>
                <Badge variant={scenarioData.detectionOutcome === "SUCCESSFUL DETECTION" ? "default" : "destructive"}>
                  {scenarioData.detectionOutcome}
                </Badge>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Time-to-Detect (TTD)</div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold">{scenarioData.timeToDetect}s</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">False Positives</div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>{scenarioData.falsePositives}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">False Negatives</div>
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  <span>{scenarioData.falseNegatives}</span>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Duration</div>
                <div className="text-sm">{scenarioData.totalDuration}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">VNC Configuration</div>
                <div className="text-sm">
                  {scenarioData.vncConfig.version} - 
                  {scenarioData.vncConfig.encryption ? " Encrypted" : " Unencrypted"}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Detection Efficiency</div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Accuracy</span>
                    <span>95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Response Time</div>
                <div className="text-sm text-emerald-500">Excellent</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline of Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Timeline of Events (Correlated Logs)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Timeline Visualization */}
            <div className="h-48">
              <div className="text-sm font-medium mb-2">Activity Timeline</div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <defs>
                    <linearGradient id="activity" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" hide />
                  <YAxis hide />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--popover))",
                      border: "1px solid hsl(var(--border))",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activity"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#activity)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Event Log Table */}
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Category</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {eventLogs.map((event, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono text-xs tabular-nums">
                        {event.timestamp}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(event.category)}
                          <span className="font-medium">{event.source}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-md">
                        <div className="truncate">{event.description}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(event.severity) as any}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{event.category}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Artifacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            Network Artifacts (The Wire Evidence)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* PCAP Download */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">Full Packet Capture (PCAP)</div>
                  <div className="text-sm text-muted-foreground">
                    Complete network traffic capture - 2.3 MB
                  </div>
                </div>
              </div>
              <Button onClick={() => toast.success("Downloading PCAP file...")}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Suricata Rule Match */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                <div className="font-medium">Suricata Rule Match</div>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium">Rule ID: 1000001</div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      navigator.clipboard?.writeText(suricataRule);
                      toast.success("Rule copied to clipboard");
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <pre className="text-xs font-mono overflow-x-auto">
                  {suricataRule}
                </pre>
              </div>
            </div>

            {/* Flow Data */}
            <div className="space-y-3">
              <div className="font-medium">Network Flow Summary</div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Source</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Ports</TableHead>
                    <TableHead>Protocol</TableHead>
                    <TableHead>Bytes</TableHead>
                    <TableHead>Packets</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {networkFlows.map((flow, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{flow.srcIp}:{flow.srcPort}</TableCell>
                      <TableCell className="font-mono">{flow.dstIp}:{flow.dstPort}</TableCell>
                      <TableCell className="font-mono">{flow.srcPort} → {flow.dstPort}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{flow.protocol}</Badge>
                      </TableCell>
                      <TableCell className="tabular-nums">{flow.bytes.toLocaleString()}</TableCell>
                      <TableCell className="tabular-nums">{flow.packets}</TableCell>
                      <TableCell>{flow.duration}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Host Artifacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5 text-primary" />
            Host Artifacts (The Local Evidence)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Victim Host Logs */}
            <div className="space-y-4">
              <div className="font-medium">Victim Host Logs (Auditd/Sysmon)</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="text-sm font-medium">File Access Logs</div>
                  <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                    <div>14:23:12.789 auditd: type=SYSCALL msg=audit(1705332192.789:1234)</div>
                    <div>  arch=x86_64 syscall=openat success=yes exit=3</div>
                    <div>  a0=3 a1=0x7ffc12345678 a2=O_RDONLY a3=0</div>
                    <div>  items=1 ppid=1234 pid=2847 auid=1000 uid=1000</div>
                    <div>  comm="vncviewer" exe="/usr/bin/vncviewer"</div>
                    <div>  file="/home/victim/secret_data.txt"</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="text-sm font-medium">Process Spawn Logs</div>
                  <div className="bg-muted p-3 rounded-lg font-mono text-xs space-y-1">
                    <div>14:22:35.456 auditd: type=EXECVE msg=audit(1705332155.456:1233)</div>
                    <div>  argc=3 a0="vncviewer" a1="10.0.0.21:5900" a2="-encodings"</div>
                    <div>  items=2 ppid=1234 pid=2847 auid=1000 uid=1000</div>
                    <div>  comm="vncviewer" exe="/usr/bin/vncviewer"</div>
                    <div>  subj=unconfined_u:unconfined_r:unconfined_t:s0</div>
                  </div>
                </div>
              </div>
            </div>

            {/* VNC Server Configuration */}
            <div className="space-y-3">
              <div className="font-medium">VNC Server Configuration Snapshot</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">Connection Settings</div>
                  <div className="space-y-1 text-xs">
                    <div>Version: {scenarioData.vncConfig.version}</div>
                    <div>Port: {scenarioData.vncConfig.port}</div>
                    <div>Encryption: {scenarioData.vncConfig.encryption ? "Enabled" : "Disabled"}</div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">Clipboard Settings</div>
                  <div className="space-y-1 text-xs">
                    <div>Clipboard Sync: {scenarioData.vncConfig.clipboard ? "Enabled" : "Disabled"}</div>
                    <div>File Transfer: {scenarioData.vncConfig.fileTransfer ? "Enabled" : "Disabled"}</div>
                  </div>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <div className="text-sm font-medium mb-2">Security Status</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span>No Authentication</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3 text-destructive" />
                      <span>No Encryption</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actionable Outcomes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Actionable Outcomes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* TTP Documented */}
            <div className="space-y-3">
              <div className="font-medium">TTP Documented (Tactics, Techniques, and Procedures)</div>
              <div className="bg-muted p-4 rounded-lg">
                <div className="text-sm whitespace-pre-line">{ttpDescription}</div>
              </div>
            </div>

            {/* Defense Recommendation */}
            <div className="space-y-3">
              <div className="font-medium">Defense Recommendation</div>
              <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
                  <div className="text-sm whitespace-pre-line">{defenseRecommendation}</div>
                </div>
              </div>
            </div>

            {/* Implementation Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                <div className="text-sm font-medium text-destructive mb-2">High Priority</div>
                <ul className="text-xs space-y-1">
                  <li>• Enable VNC encryption</li>
                  <li>• Implement egress firewall rules</li>
                  <li>• Deploy DLP solution</li>
                </ul>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-lg">
                <div className="text-sm font-medium text-yellow-600 mb-2">Medium Priority</div>
                <ul className="text-xs space-y-1">
                  <li>• Configure Suricata rules</li>
                  <li>• Enable comprehensive audit logging</li>
                  <li>• Implement VNC authentication</li>
                </ul>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-lg">
                <div className="text-sm font-medium text-blue-600 mb-2">Low Priority</div>
                <ul className="text-xs space-y-1">
                  <li>• Regular security assessments</li>
                  <li>• Staff training on VNC security</li>
                  <li>• Monitoring and alerting setup</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
