import React from "react";
import useInventory from "@/hooks/useInventory";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OnboardingWizard from "@/components/OnboardingWizard";
import { toast } from "sonner";

export default function Inventory() {
  const { entries, testConnection, remove } = useInventory();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Inventory</h1>
          <p className="text-sm text-muted-foreground">Manage VNC targets and credentials (secrets stored in vault — simulated).</p>
        </div>
        <div className="flex gap-2">
          <OnboardingWizard />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Targets</CardTitle>
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
                  <TableCell>{e.host}:{e.port}</TableCell>
                  <TableCell>{e.type}</TableCell>
                  <TableCell>{e.env}</TableCell>
                  <TableCell>{e.features.clipboard ? <Badge>clipboard</Badge> : null} {e.features.fileTransfer ? <Badge>file</Badge> : null}</TableCell>
                  <TableCell className="font-mono text-xs">{e.lastValidated ? new Date(e.lastValidated).toLocaleString() : "-"}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button size="sm" variant="outline" onClick={async () => { const r = await testConnection(e.id); toast.success(r.log); }}>Test</Button>
                      <Button size="sm" variant="ghost" onClick={() => { remove(e.id); toast.success("Deleted"); }}>Delete</Button>
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
