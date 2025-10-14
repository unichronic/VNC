import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

export default function CustomScenario() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [attackType, setAttackType] = useState("clipboard");
  const [payload, setPayload] = useState("");
  const [preset, setPreset] = useState("");

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

            <TabsContent value="attack">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Label>Scenario name</Label>
                  <Input
                    className="mt-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Attack type</Label>
                  <Select onValueChange={(v) => setAttackType(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select attack" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clipboard">
                        Clipboard Exfiltration
                      </SelectItem>
                      <SelectItem value="file">File Transfer</SelectItem>
                      <SelectItem value="screenshot">Screenshot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    className="mt-1"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Payload / parameters</Label>
                  <Textarea
                    className="mt-1"
                    value={payload}
                    onChange={(e) => setPayload(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button onClick={() => toast.success("Preview (simulated)")}>
                  Preview
                </Button>
                <Button variant="outline" onClick={validate}>
                  Save
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="defense">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div>
                  <Label>Pick preset</Label>
                  <Select onValueChange={(v) => setPreset(v)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose preset" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="minimal">Minimal</SelectItem>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="hardened">Hardened</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Advanced JSON</Label>
                  <Textarea
                    className="mt-1"
                    rows={6}
                    placeholder='{ "firewall": true }'
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  onClick={() => toast.success("Defense saved (simulated)")}
                >
                  Save Defense
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
