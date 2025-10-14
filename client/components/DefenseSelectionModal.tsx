import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

type Preset = "off" | "minimal" | "standard" | "hardened";

const PRESETS: Record<Preset, { label: string; desc: string; recommended?: boolean; toggles: Record<string, boolean> }> = {
  off: { label: "Off", desc: "No defenses applied.", toggles: { firewall: false, suricata: false, dlp: false, mtls: false, disableClipboard: false, autort: false }, },
  minimal: { label: "Minimal", desc: "Basic egress firewall rule.", toggles: { firewall: true, suricata: false, dlp: false, mtls: false, disableClipboard: false, autort: false }, },
  standard: { label: "Standard", desc: "Firewall + Suricata + Host DLP.", recommended: true, toggles: { firewall: true, suricata: true, dlp: true, mtls: false, disableClipboard: false, autort: false }, },
  hardened: { label: "Hardened", desc: "mTLS, disable clipboard, full DLP, auto-terminate.", toggles: { firewall: true, suricata: true, dlp: true, mtls: true, disableClipboard: true, autort: true }, },
};

export default function DefenseSelectionModal({ scenario, openProp, onRun }: { scenario: { id: string; name: string; description?: string }; openProp?: boolean; onRun?: (config: any) => void }) {
  const [open, setOpen] = React.useState(!!openProp);
  const [preset, setPreset] = React.useState<Preset>("standard");
  const [toggles, setToggles] = React.useState<Record<string, boolean>>(PRESETS.standard.toggles);
  const [advancedOpen, setAdvancedOpen] = React.useState(false);
  const [comboName, setComboName] = React.useState("");

  React.useEffect(() => {
    setOpen(Boolean(openProp));
  }, [openProp]);

  React.useEffect(() => {
    // apply preset toggles
    setToggles(PRESETS[preset].toggles);
  }, [preset]);

  function toggleKey(k: string) {
    setToggles((t) => ({ ...t, [k]: !t[k] }));
  }

  function validate(): { ok: boolean; warnings?: string[] } {
    const warnings: string[] = [];
    if (toggles.mtls && !toggles.firewall) warnings.push("mTLS without firewall may still allow egress.");
    if (toggles.disableClipboard && scenario.name.toLowerCase().includes("clipboard")) warnings.push("Disabling clipboard will likely block this clipboard-based attack.");
    return { ok: true, warnings };
  }

  function handleRun(mode: "run" | "compare") {
    const v = validate();
    if (v.warnings && v.warnings.length) {
      toast.warning(v.warnings.join(" "));
    }
    const cfg = { preset, toggles, comboName: comboName || preset, scenarioId: scenario.id };
    toast.success("Starting run (simulated)");
    setOpen(false);
    onRun?.(cfg);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Details</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{scenario.name}</DialogTitle>
          <div className="text-sm text-muted-foreground">{scenario.description ?? "Run this predefined scenario with chosen defenses."} <span className="ml-2 font-mono text-xs">Estimated time: 30s</span></div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Quick Presets</h4>
            <RadioGroup value={preset} onValueChange={(v) => setPreset(v as Preset)} className="space-y-2">
              {Object.entries(PRESETS).map(([k, p]) => (
                <label key={k} className="flex items-center gap-2 rounded-md border p-3">
                  <input type="radio" name="preset" checked={preset === k} onChange={() => setPreset(k as Preset)} />
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="font-medium">{p.label}</div>
                      {p.recommended && <Badge variant="secondary">Recommended</Badge>}
                    </div>
                    <div className="text-xs text-muted-foreground">{p.desc}</div>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>

          <div className="md:col-span-1 md:col-start-2">
            <h4 className="text-sm font-semibold mb-2">Selected Defense Summary</h4>
            <div className="space-y-2">
              {Object.entries(toggles).map(([k, v]) => (
                <Card key={k} className="p-2">
                  <CardHeader>
                    <CardTitle className="text-sm capitalize">{k.replace(/([A-Z])/g, " $1")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">{v ? "Enabled" : "Disabled"}</div>
                      <div className="text-xs text-muted-foreground">{v ? "Ops: Medium" : "Ops: Low"}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Advanced / Customize</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-sm">Disable Clipboard</div>
                <Switch checked={toggles.disableClipboard} onCheckedChange={() => toggleKey("disableClipboard")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Apply Suricata Clipboard Rule</div>
                <Switch checked={toggles.suricata} onCheckedChange={() => toggleKey("suricata")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Enable Host DLP</div>
                <Switch checked={toggles.dlp} onCheckedChange={() => toggleKey("dlp")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Enforce mTLS</div>
                <Switch checked={toggles.mtls} onCheckedChange={() => toggleKey("mtls")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="text-sm">Auto-terminate on alert</div>
                <Switch checked={toggles.autort} onCheckedChange={() => toggleKey("autort")} />
              </div>
              <div>
                <Separator />
                <div className="text-xs text-muted-foreground mt-2">Each toggle shows backend action (e.g., apply firewall rule, enable Suricata rule, enforce TLS config).</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input className="border px-2 py-1" placeholder="Save combo as..." value={comboName} onChange={(e) => setComboName(e.target.value)} />
            <Button variant="outline" size="sm" onClick={() => toast.success("Combo saved (simulated)")}>Save Combo</Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => handleRun("compare")} variant="outline">Run & Compare</Button>
            <Button onClick={() => handleRun("run")} disabled={false}>Run Now</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
