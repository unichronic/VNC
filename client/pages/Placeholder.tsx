import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight mb-4">{title}</h1>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Coming next</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            This module will include the full functionality per spec. If you
            want me to implement it now, say which part to build next.
          </p>
          <div className="flex gap-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/scenarios">Go to Scenario Library</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link to="/">Back to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
