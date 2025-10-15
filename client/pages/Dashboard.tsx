import { useMemo } from "react";
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
import { Link } from "react-router-dom";
import {
  Activity,
  Cpu,
  Database,
  Play,
  File,
  Monitor,
  BarChart3,
  Server,
  Trash2,
  TestTube,
} from "lucide-react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import useInventory from "@/hooks/useInventory";
import OnboardingWizard from "@/components/OnboardingWizard";
import { toast } from "sonner";

function StatusPill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span
        className={
          ok
            ? "size-2.5 rounded-full bg-emerald-500"
            : "size-2.5 rounded-full bg-destructive"
        }
      />
      <span className="text-muted-foreground">{label}</span>
      <Badge variant={ok ? "secondary" : "destructive"}>
        {ok ? "Online" : "Down"}
      </Badge>
    </div>
  );
}

export default function Dashboard() {
  const { entries, testConnection, remove } = useInventory();
  
  const traffic = useMemo(
    () =>
      Array.from({ length: 24 }).map((_, i) => ({
        hour: `${i}:00`,
        bw: Math.round(50 + Math.sin(i / 3) * 30 + Math.random() * 20),
      })),
    [],
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Dashboard & Inventory</h1>
          <p className="text-sm text-muted-foreground">
            Monitor system status, manage VNC targets, and review detections and artifacts.
          </p>
        </div>
        <div className="flex gap-2">
          <OnboardingWizard />
          <Button asChild size="sm" className="gap-1">
            <Link to="/scenarios">
              <Play className="h-4 w-4" /> Run New Test
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-4 w-4 text-primary" /> System Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <StatusPill ok label="VMs" />
            <StatusPill ok label="Sensors (Suricata, Zeek)" />
            <StatusPill ok label="Last test" />
            <div className="text-xs text-muted-foreground">
              Last run: today 14:22 UTC
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4 text-primary" /> Bandwidth (last 24h)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={traffic} margin={{ left: 8, right: 8 }}>
                <defs>
                  <linearGradient id="bw" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="hsl(var(--primary))"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <XAxis dataKey="hour" hide tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bw"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#bw)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-base">
              <span>Quick links</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/reports">
                <File className="mr-2 h-4 w-4" /> Reports
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/monitor">
                <Monitor className="mr-2 h-4 w-4" /> Live Monitor
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/forensics">
                <Database className="mr-2 h-4 w-4" /> Artifacts
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/logs">
                <BarChart3 className="mr-2 h-4 w-4" /> Logs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Server className="h-4 w-4 text-primary" /> VNC Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alias</TableHead>
                <TableHead>Host</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Env</TableHead>
                <TableHead>Features</TableHead>
                <TableHead>Last validated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">{e.alias}</TableCell>
                  <TableCell>
                    {e.host}:{e.port}
                  </TableCell>
                  <TableCell>{e.type}</TableCell>
                  <TableCell>{e.env}</TableCell>
                  <TableCell>
                    {e.features.clipboard ? <Badge variant="outline" className="mr-1">clipboard</Badge> : null}
                    {e.features.fileTransfer ? <Badge variant="outline">file</Badge> : null}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {e.lastValidated
                      ? new Date(e.lastValidated).toLocaleString()
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={async () => {
                          const r = await testConnection(e.id);
                          toast.success(r.log);
                        }}
                      >
                        <TestTube className="h-3 w-3 mr-1" />
                        Test
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          remove(e.id);
                          toast.success("Deleted");
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
