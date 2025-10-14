import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import DefenseSelectionModal from "@/components/DefenseSelectionModal";
import RunModal from "@/components/RunModal";
import useInventory from "@/hooks/useInventory";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "react-router-dom";

interface Scenario {
  id: string;
  name: string;
  type: "network" | "host";
  risk: "Low" | "Med" | "High";
  status: "available" | "running" | "completed";
}

export default function ScenarioLibrary() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const scenarios = useMemo<Scenario[]>(
    () => [
      { id: "S-001", name: "Clipboard Exfiltration", type: "host", risk: "High", status: "available" },
      { id: "S-014", name: "TLS Downgrade Probe", type: "network", risk: "Med", status: "available" },
      { id: "S-022", name: "VNC Brute-force", type: "network", risk: "High", status: "completed" },
      { id: "S-037", name: "DNS Tunneling", type: "network", risk: "Med", status: "available" },
    ],
    [],
  );

  const [runOpen, setRunOpen] = useState(false);
  const [runConfig, setRunConfig] = useState<any | null>(null);

  function startSimulation() {
    setProgress(1);
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(100, p + Math.random() * 18 + 5);
        if (next >= 100) {
          clearInterval(id);
          toast.success("Simulation completed", { description: "Artifacts available in Forensics" });
        }
        return next;
      });
    }, 600);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Scenario Library</h1>
          <p className="text-sm text-muted-foreground">Select a scenario to view details and run a simulation.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/scenarios/create">Create Custom Scenario</Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Available Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scenarios.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium tabular-nums">{s.id}</TableCell>
                  <TableCell>{s.name}</TableCell>
                  <TableCell><Badge variant="outline">{s.type}</Badge></TableCell>
                  <TableCell>
                    <Badge variant={s.risk === "High" ? "destructive" : s.risk === "Med" ? "secondary" : "outline"}>{s.risk}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.status === "available" ? "secondary" : s.status === "running" ? "outline" : "default"}>{s.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right flex items-center justify-end gap-2">
                    <DefenseSelectionModal scenario={{ id: s.id, name: s.name, description: s.name === "Clipboard Exfiltration" ? "Simulates clipboard data exfiltration over VNC clipboard sync." : undefined }} onRun={(cfg) => { setRunConfig(cfg); setRunOpen(true); }} />

                    {/* Details dialog (non-blocking) */}
                    <Dialog open={openId === s.id} onOpenChange={(o) => setOpenId(o ? s.id : null)}>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="ghost">Details</Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{s.name}</DialogTitle>
                          <div className="text-sm text-muted-foreground">Involved tools: TigerVNC, RealVNC, Wireshark, Suricata, Zeek</div>
                        </DialogHeader>
                        <div className="grid gap-6 md:grid-cols-3">
                          <div className="md:col-span-2 space-y-4">
                            <div>
                              <Label>Description</Label>
                              <Textarea className="mt-1" rows={3} readOnly value={
                                s.name === "Clipboard Exfiltration"
                                  ? "Simulates clipboard data exfiltration over VNC clipboard sync. Detect with host telemetry and network signatures."
                                  : "Network/host scenario emulation with VNC and sensors."
                              } />
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                              <div>
                                <Label>Server IP</Label>
                                <Input className="mt-1" placeholder="10.0.0.21" />
                              </div>
                              <div>
                                <Label>Client IP</Label>
                                <Input className="mt-1" placeholder="10.0.0.7" />
                              </div>
                              <div>
                                <Label>Payload size (KB)</Label>
                                <Input className="mt-1" type="number" placeholder="256" />
                              </div>
                              <div>
                                <Label>TLS</Label>
                                <Select defaultValue="enabled">
                                  <SelectTrigger className="mt-1"><SelectValue placeholder="Select" /></SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="enabled">Enabled</SelectItem>
                                    <SelectItem value="disabled">Disabled</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div>
                              <Label className="mb-1 block">Defensive modules</Label>
                              <div className="grid grid-cols-2 gap-3">
                                <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> Firewall</label>
                                <label className="flex items-center gap-2 text-sm"><Checkbox defaultChecked /> IDS (Suricata)</label>
                                <label className="flex items-center gap-2 text-sm"><Checkbox /> DLP</label>
                                <label className="flex items-center gap-2 text-sm"><Checkbox /> EDR</label>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                              <div>
                                <Label>Packet capture (s)</Label>
                                <Input className="mt-1" type="number" placeholder="60" />
                              </div>
                              <div>
                                <Label>File type</Label>
                                <Input className="mt-1" placeholder="txt" />
                              </div>
                              <div>
                                <Label>Destination host</Label>
                                <Input className="mt-1" placeholder="exfil.test" />
                              </div>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <Label>VNC Variant</Label>
                              <Select defaultValue="tigervnc">
                                <SelectTrigger className="mt-1"><SelectValue placeholder="Select variant" /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="tigervnc">TigerVNC</SelectItem>
                                  <SelectItem value="realvnc">RealVNC</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label>Progress</Label>
                              <Progress value={progress} className="mt-2" />
                              <div className="mt-1 text-xs text-muted-foreground">{progress < 100 ? "Awaiting start" : "Completed"}</div>
                            </div>
                            <div className="flex gap-2">
                              <Button className="flex-1" onClick={startSimulation}>Run</Button>
                              <Button variant="outline" className="flex-1" onClick={() => setProgress(0)}>Reset</Button>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Start Simulation triggers backend orchestration (e.g., Ansible) and streams logs.
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <RunModal scenario={runConfig ? { id: runConfig.scenarioId, name: runConfig.comboName || runConfig.scenarioId } : null} inventory={[]} open={runOpen} onOpenChange={setRunOpen} onStart={(cfg) => { console.log("Started run", cfg); startSimulation(); setRunOpen(false); }} />
    </div>
  );
}
