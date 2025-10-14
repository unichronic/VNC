import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { InventoryEntry } from "@/hooks/useInventory";
import { toast } from "sonner";

export default function RunModal({
  scenario,
  inventory,
  open: openProp,
  onOpenChange,
  onStart,
}: {
  scenario: { id: string; name: string } | null;
  inventory: InventoryEntry[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onStart?: (cfg: any) => void;
}) {
  const [open, setOpen] = React.useState(Boolean(openProp));
  const [selected, setSelected] = React.useState<string[]>([]);
  const [ephemeral, setEphemeral] = React.useState<{
    alias: string;
    host: string;
    port: number;
  } | null>(null);
  const [overrides, setOverrides] = React.useState<
    Record<string, Partial<InventoryEntry>>
  >({});

  React.useEffect(() => setOpen(Boolean(openProp)), [openProp]);

  function toggleSelect(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [id, ...s],
    );
  }

  function start() {
    if (!scenario) return toast.error("No scenario selected");
    const targets = [] as any[];
    for (const id of selected) {
      const inv = inventory.find((e) => e.id === id);
      if (!inv) continue;
      targets.push({ entry: inv, override: overrides[id] ?? null });
    }
    if (ephemeral) {
      targets.push({ entry: ephemeral, override: null, ephemeral: true });
    }
    if (!targets.length) return toast.error("Select at least one target");
    toast.success("Starting run (simulated)");
    onStart?.({
      scenarioId: scenario.id,
      scenarioName: scenario.name,
      targets,
    });
    onOpenChange?.(false);
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        onOpenChange?.(o);
      }}
    >
      <DialogTrigger asChild>
        {/* hidden trigger - use programmatic open */}
        <Button className="hidden">Run</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Run: {scenario?.name}</DialogTitle>
          <div className="text-sm text-muted-foreground">
            Select targets, overrides and start execution.
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mt-4">
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold mb-2">Select Targets</h4>
            <div className="max-h-64 overflow-auto border rounded p-2">
              {inventory.map((e) => (
                <label
                  key={e.id}
                  className="flex items-center justify-between gap-2 p-2 hover:bg-muted/50 rounded"
                  style={{ display: "flex" }}
                >
                  <div>
                    <div className="font-medium">
                      {e.alias}{" "}
                      <span className="text-xs text-muted-foreground ml-2">
                        {e.host}:{e.port}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {e.env} • {e.type} • {e.tags.join(", ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(e.id)}
                      onChange={() => toggleSelect(e.id)}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        /* open per-target override UI below */
                      }}
                    >
                      Overrides
                    </Button>
                  </div>
                </label>
              ))}
              <div className="mt-2 p-2 border-t">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setEphemeral({
                      alias:
                        "ephemeral-" + Math.random().toString(36).slice(2, 6),
                      host: "",
                      port: 5900,
                    })
                  }
                >
                  Add ephemeral target
                </Button>
              </div>
            </div>

            {ephemeral && (
              <Card className="mt-2">
                <CardHeader>
                  <CardTitle className="text-sm">Ephemeral target</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                    <div>
                      <Label>Alias</Label>
                      <Input
                        value={ephemeral.alias}
                        onChange={(e) =>
                          setEphemeral({ ...ephemeral, alias: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Host / IP</Label>
                      <Input
                        value={ephemeral.host}
                        onChange={(e) =>
                          setEphemeral({ ...ephemeral, host: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Port</Label>
                      <Input
                        type="number"
                        value={String(ephemeral.port)}
                        onChange={(e) =>
                          setEphemeral({
                            ...ephemeral,
                            port: Number(e.target.value || 5900),
                          })
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Per-target overrides</h4>
            <div className="space-y-2">
              {selected.map((id) => {
                const inv = inventory.find((x) => x.id === id);
                const ov = overrides[id] || {};
                if (!inv) return null;
                return (
                  <Card key={id} className="p-2">
                    <CardHeader>
                      <CardTitle className="text-sm">{inv.alias}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <Label>Port override</Label>
                          <Input
                            type="number"
                            value={String(ov.port ?? inv.port)}
                            onChange={(e) =>
                              setOverrides((s) => ({
                                ...s,
                                [id]: {
                                  ...(s[id] || {}),
                                  port: Number(e.target.value),
                                },
                              }))
                            }
                          />
                        </div>
                        <div>
                          <Label>TLS</Label>
                          <div className="mt-1">
                            <Checkbox
                              checked={ov.tls ?? inv.tls}
                              onCheckedChange={(v) =>
                                setOverrides((s) => ({
                                  ...s,
                                  [id]: { ...(s[id] || {}), tls: Boolean(v) },
                                }))
                              }
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Notes / Owner</Label>
                          <Input
                            placeholder="Run purpose / owner"
                            onChange={(e) =>
                              setOverrides((s) => ({
                                ...s,
                                [id]: {
                                  ...(s[id] || {}),
                                  note: e.target.value,
                                },
                              }))
                            }
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Selected: {selected.length + (ephemeral ? 1 : 0)} targets
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setOpen(false);
                onOpenChange?.(false);
              }}
            >
              Cancel
            </Button>
            <Button onClick={start}>Start Simulation</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
