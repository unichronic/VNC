import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Target,
  Shield,
  Clock,
  Zap,
  FileText,
  Lock,
  Network,
  Settings,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

export default function CustomScenario() {
  // Basic scenario info
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  // Attack Side Configuration
  const [vncVectors, setVncVectors] = useState({
    clipboardTheft: false,
    screenScrape: false,
    fileTransfer: false,
    covertTunneling: false,
  });
  const [attackTiming, setAttackTiming] = useState({
    startTime: "",
    stopTime: "",
    exfilRate: "5",
  });
  const [payloadSpec, setPayloadSpec] = useState({
    mockPiiSize: "10",
    useEncryption: false,
  });
  const [covertPort, setCovertPort] = useState("443");
  
  // Defense Side Configuration
  const [idsRules, setIdsRules] = useState({
    dpiSignatures: true,
    anomalyThresholds: "200",
    protocolPortCheck: true,
  });
  const [perimeterControls, setPerimeterControls] = useState({
    egressFilterPolicy: "block",
    allowedPorts: "80,443",
    blockedPorts: "5900",
  });
  const [hostCorrelation, setHostCorrelation] = useState({
    auditd: true,
    sysmon: true,
  });
  const [hardeningPolicy, setHardeningPolicy] = useState({
    enforceTls: false,
    clipboardDisabled: false,
  });

  function validate() {
    if (!name) return toast.error("Name is required");
    toast.success("Scenario saved (simulated)");
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Create Custom Scenario</h1>
          <p className="text-sm text-muted-foreground">
            Attack and Defense editor with guided forms and advanced JSON view.
          </p>
        </div>
      </div>

      <Card>
        <CardContent>
          <Tabs defaultValue="attack">
            <TabsList>
              <TabsTrigger value="attack">Attack</TabsTrigger>
              <TabsTrigger value="defense">Defense</TabsTrigger>
            </TabsList>

            <TabsContent value="attack" className="space-y-6">
              {/* Basic Scenario Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Scenario Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                      <Label htmlFor="scenario-name">Scenario Name</Label>
                  <Input
                        id="scenario-name"
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., VNC PII Exfiltration Test"
                  />
                </div>
                <div>
                      <Label htmlFor="scenario-desc">Description</Label>
                      <Input
                        id="scenario-desc"
                    className="mt-1"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                        placeholder="Brief description of the test scenario"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* VNC Vector Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-primary" />
                    VNC Vector Selection
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Choose specific VNC exfiltration methods to test
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="clipboard-theft"
                        checked={vncVectors.clipboardTheft}
                        onCheckedChange={(checked) =>
                          setVncVectors(prev => ({ ...prev, clipboardTheft: checked as boolean }))
                        }
                      />
                      <Label htmlFor="clipboard-theft" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Clipboard Theft (PII)
                        <Badge variant="secondary" className="text-xs">Inject and transfer simulated sensitive data</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="screen-scrape"
                        checked={vncVectors.screenScrape}
                        onCheckedChange={(checked) =>
                          setVncVectors(prev => ({ ...prev, screenScrape: checked as boolean }))
                        }
                      />
                      <Label htmlFor="screen-scrape" className="flex items-center gap-2">
                        <Zap className="h-4 w-4" />
                        Screen Scrape
                        <Badge variant="secondary" className="text-xs">Rapid, continuous screen captures</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="file-transfer"
                        checked={vncVectors.fileTransfer}
                        onCheckedChange={(checked) =>
                          setVncVectors(prev => ({ ...prev, fileTransfer: checked as boolean }))
                        }
                      />
                      <Label htmlFor="file-transfer" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        File Transfer
                        <Badge variant="secondary" className="text-xs">Built-in VNC file transfer feature</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="covert-tunneling"
                        checked={vncVectors.covertTunneling}
                        onCheckedChange={(checked) =>
                          setVncVectors(prev => ({ ...prev, covertTunneling: checked as boolean }))
                        }
                      />
                      <Label htmlFor="covert-tunneling" className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        Covert Tunneling
                        <Badge variant="secondary" className="text-xs">Force VNC over non-standard ports</Badge>
                      </Label>
                    </div>
                  </div>
                  {vncVectors.covertTunneling && (
                    <div className="ml-6">
                      <Label htmlFor="covert-port">Custom Port (default: 443)</Label>
                      <Input
                        id="covert-port"
                        className="mt-1 w-32"
                        value={covertPort}
                        onChange={(e) => setCovertPort(e.target.value)}
                        placeholder="443"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Timing & Frequency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Timing & Frequency
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Define the attack characteristics and timing
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div>
                      <Label htmlFor="start-time">Start Time</Label>
                      <Input
                        id="start-time"
                        type="time"
                        className="mt-1"
                        value={attackTiming.startTime}
                        onChange={(e) => setAttackTiming(prev => ({ ...prev, startTime: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stop-time">Stop Time</Label>
                      <Input
                        id="stop-time"
                        type="time"
                        className="mt-1"
                        value={attackTiming.stopTime}
                        onChange={(e) => setAttackTiming(prev => ({ ...prev, stopTime: e.target.value }))}
                  />
                </div>
                    <div>
                      <Label htmlFor="exfil-rate">Rate of Exfil (MB/sec)</Label>
                      <Input
                        id="exfil-rate"
                    className="mt-1"
                        value={attackTiming.exfilRate}
                        onChange={(e) => setAttackTiming(prev => ({ ...prev, exfilRate: e.target.value }))}
                        placeholder="5"
                  />
                </div>
              </div>
                </CardContent>
              </Card>

              {/* Payload Specification */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Payload Specification
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Define the content being stolen and encryption settings
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label htmlFor="mock-pii-size">Mock PII/Data File Size (MB)</Label>
                      <Input
                        id="mock-pii-size"
                        className="mt-1"
                        value={payloadSpec.mockPiiSize}
                        onChange={(e) => setPayloadSpec(prev => ({ ...prev, mockPiiSize: e.target.value }))}
                        placeholder="10"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="encryption-test"
                        checked={payloadSpec.useEncryption}
                        onCheckedChange={(checked) =>
                          setPayloadSpec(prev => ({ ...prev, useEncryption: checked as boolean }))
                        }
                      />
                      <Label htmlFor="encryption-test" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Encryption Test
                        <Badge variant="secondary" className="text-xs">Use encrypted VNC connection</Badge>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={() => toast.success("Attack configuration preview generated")}>
                  Preview Attack
                </Button>
                <Button variant="outline" onClick={validate}>
                  Save Attack Config
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="defense" className="space-y-6">
              {/* Intrusion Detection Rules (Suricata) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Intrusion Detection Rules (Suricata)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Define the rules the IDS will use to spot the attack
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dpi-signatures"
                        checked={idsRules.dpiSignatures}
                        onCheckedChange={(checked) =>
                          setIdsRules(prev => ({ ...prev, dpiSignatures: checked as boolean }))
                        }
                      />
                      <Label htmlFor="dpi-signatures" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        DPI Signatures
                        <Badge variant="secondary" className="text-xs">Enable VNC protocol command detection</Badge>
                      </Label>
                    </div>
                    <div>
                      <Label htmlFor="anomaly-thresholds">Anomaly Thresholds (kb/s)</Label>
                      <Input
                        id="anomaly-thresholds"
                        className="mt-1"
                        value={idsRules.anomalyThresholds}
                        onChange={(e) => setIdsRules(prev => ({ ...prev, anomalyThresholds: e.target.value }))}
                        placeholder="200"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Alert if VNC traffic exceeds this rate
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="protocol-port-check"
                        checked={idsRules.protocolPortCheck}
                        onCheckedChange={(checked) =>
                          setIdsRules(prev => ({ ...prev, protocolPortCheck: checked as boolean }))
                        }
                      />
                      <Label htmlFor="protocol-port-check" className="flex items-center gap-2">
                        <Network className="h-4 w-4" />
                        Protocol Port Check
                        <Badge variant="secondary" className="text-xs">Monitor expected VNC ports (5900-5902)</Badge>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Perimeter Controls (IPTables) */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-5 w-5 text-primary" />
                    Perimeter Controls (IPTables)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Configure the network boundary and egress filtering
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                      <Label htmlFor="egress-filter-policy">Egress Filter Policy</Label>
                      <Select
                        value={perimeterControls.egressFilterPolicy}
                        onValueChange={(value) =>
                          setPerimeterControls(prev => ({ ...prev, egressFilterPolicy: value }))
                        }
                      >
                    <SelectTrigger className="mt-1">
                          <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                          <SelectItem value="block">Block (Default)</SelectItem>
                          <SelectItem value="allow">Allow</SelectItem>
                          <SelectItem value="monitor">Monitor Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                      <Label htmlFor="allowed-ports">Allowed Ports</Label>
                      <Input
                        id="allowed-ports"
                        className="mt-1"
                        value={perimeterControls.allowedPorts}
                        onChange={(e) => setPerimeterControls(prev => ({ ...prev, allowedPorts: e.target.value }))}
                        placeholder="80,443"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Comma-separated list (e.g., 80,443)
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="blocked-ports">Blocked Ports</Label>
                      <Input
                        id="blocked-ports"
                        className="mt-1"
                        value={perimeterControls.blockedPorts}
                        onChange={(e) => setPerimeterControls(prev => ({ ...prev, blockedPorts: e.target.value }))}
                        placeholder="5900"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        VNC ports to block (e.g., 5900)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Host Correlation */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings className="h-5 w-5 text-primary" />
                    Host Correlation
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Define the logging sources for verification
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="auditd"
                        checked={hostCorrelation.auditd}
                        onCheckedChange={(checked) =>
                          setHostCorrelation(prev => ({ ...prev, auditd: checked as boolean }))
                        }
                      />
                      <Label htmlFor="auditd" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Auditd/Sysmon
                        <Badge variant="secondary" className="text-xs">Host activity logging for correlation</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="sysmon"
                        checked={hostCorrelation.sysmon}
                        onCheckedChange={(checked) =>
                          setHostCorrelation(prev => ({ ...prev, sysmon: checked as boolean }))
                        }
                      />
                      <Label htmlFor="sysmon" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        Process Monitoring
                        <Badge variant="secondary" className="text-xs">File reads and process creation tracking</Badge>
                      </Label>
                    </div>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Note:</strong> Host activity (file reads/process creation) will be correlated with network alerts 
                      to verify the attack timeline and provide comprehensive forensics data.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Hardening Policy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Lock className="h-5 w-5 text-primary" />
                    Hardening Policy
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Specify VNC settings to be enforced on the Target VM during the test
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="enforce-tls"
                        checked={hardeningPolicy.enforceTls}
                        onCheckedChange={(checked) =>
                          setHardeningPolicy(prev => ({ ...prev, enforceTls: checked as boolean }))
                        }
                      />
                      <Label htmlFor="enforce-tls" className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        Enforce TLS
                        <Badge variant="secondary" className="text-xs">Test with TLS forced on</Badge>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="clipboard-disabled"
                        checked={hardeningPolicy.clipboardDisabled}
                        onCheckedChange={(checked) =>
                          setHardeningPolicy(prev => ({ ...prev, clipboardDisabled: checked as boolean }))
                        }
                      />
                      <Label htmlFor="clipboard-disabled" className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Clipboard Disabled
                        <Badge variant="secondary" className="text-xs">VNC clipboard feature explicitly disabled</Badge>
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Advanced JSON Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-primary" />
                    Advanced JSON Configuration
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Manual JSON configuration for advanced users
                  </p>
                </CardHeader>
                <CardContent>
                  <Textarea
                    className="font-mono text-sm"
                    rows={8}
                    placeholder={`{
  "suricata": {
    "rules": ["vnc_exfil_detection", "anomaly_threshold"],
    "thresholds": { "vnc_traffic": "200kb/s" }
  },
  "iptables": {
    "egress_block": ["5900"],
    "allow": ["80", "443"]
  },
  "host_monitoring": {
    "auditd": true,
    "sysmon": true
  },
  "vnc_hardening": {
    "enforce_tls": false,
    "disable_clipboard": false
  }
}`}
                  />
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button onClick={() => toast.success("Defense configuration preview generated")}>
                  Preview Defense
                </Button>
                <Button variant="outline" onClick={() => toast.success("Defense configuration saved")}>
                  Save Defense Config
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
