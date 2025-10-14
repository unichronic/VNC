import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import useInventory from "@/hooks/useInventory";
import { toast } from "sonner";

export default function OnboardingWizard({ open: openProp, onOpenChange }: { open?: boolean; onOpenChange?: (o: boolean) => void }) {
  const { add } = useInventory();
  const [open, setOpen] = React.useState(Boolean(openProp));
  const [step, setStep] = React.useState(1);
  const [alias, setAlias] = React.useState("");
  const [host, setHost] = React.useState("");
  const [port, setPort] = React.useState(5900);
  const [type, setType] = React.useState("tigervnc");
  const [tls, setTls] = React.useState(true);
  const [auth, setAuth] = React.useState("password");
  const [clipboard, setClipboard] = React.useState(true);
  const [fileTransfer, setFileTransfer] = React.useState(true);
  const [env, setEnv] = React.useState("test");

  React.useEffect(() => setOpen(Boolean(openProp)), [openProp]);

  function next() {
    setStep((s) => Math.min(8, s + 1));
  }
  function prev() {
    setStep((s) => Math.max(1, s - 1));
  }

  function finish() {
    const e = add({ alias, host, port, type: type as any, tls, auth: auth as any, features: { clipboard, fileTransfer }, env: env as any });
    toast.success("Inventory entry added: " + e.alias);
    setOpen(false);
    onOpenChange?.(false);
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); onOpenChange?.(o); }}>
      <DialogTrigger asChild>
        <Button>Create target</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Onboarding Wizard</DialogTitle>
          <div className="text-sm text-muted-foreground">Add a VNC target to inventory — guided steps.</div>
        </DialogHeader>

        <div className="mt-4">
          {step === 1 && (
            <div>
              <Label>Alias</Label>
              <Input value={alias} onChange={(e) => setAlias(e.target.value)} placeholder="Friendly name" />
              <Label className="mt-2">Host / IP</Label>
              <Input value={host} onChange={(e) => setHost(e.target.value)} placeholder="10.0.0.21" />
              <Label className="mt-2">Port</Label>
              <Input value={String(port)} onChange={(e) => setPort(Number(e.target.value || 5900))} />
            </div>
          )}

          {step === 2 && (
            <div>
              <Label>VNC Type</Label>
              <Select onValueChange={(v) => setType(v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tigervnc">TigerVNC</SelectItem>
                  <SelectItem value="realvnc">RealVNC</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 3 && (
            <div>
              <Label>Auth method</Label>
              <Select onValueChange={(v) => setAuth(v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select auth" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="password">Password</SelectItem>
                  <SelectItem value="cert">Client Cert</SelectItem>
                  <SelectItem value="ldap">LDAP/AD</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 4 && (
            <div>
              <Label>TLS / mTLS</Label>
              <div className="flex gap-2 mt-1">
                <Checkbox checked={tls} onCheckedChange={(v) => setTls(Boolean(v))} /> Enable TLS
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <Label>Features</Label>
              <div className="flex gap-2 mt-1 items-center">
                <Checkbox checked={clipboard} onCheckedChange={(v) => setClipboard(Boolean(v))} /> Clipboard
                <Checkbox checked={fileTransfer} onCheckedChange={(v) => setFileTransfer(Boolean(v))} /> File-transfer
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <Label>Environment</Label>
              <Select onValueChange={(v) => setEnv(v)}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="env" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="test">Test</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="prod">Prod</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {step === 7 && (
            <div>
              <Label>Snapshot / baseline (optional)</Label>
              <Input placeholder="snapshot-id" />
            </div>
          )}

          {step === 8 && (
            <div>
              <Label>Test connectivity</Label>
              <div className="mt-2 text-sm text-muted-foreground">Click test to attempt TLS handshake and auth (simulated).</div>
              <div className="mt-2">
                <Button onClick={async () => {
                  await new Promise((r) => setTimeout(r, 700));
                  toast.success("Connectivity ok (simulated)");
                }}>Test connection</Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Step {step} / 8</div>
          <div className="flex gap-2">
            {step > 1 && <Button variant="ghost" onClick={() => prev()}>Back</Button>}
            {step < 8 && <Button onClick={() => next()}>Next</Button>}
            {step === 8 && <Button onClick={finish}>Finish</Button>}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
