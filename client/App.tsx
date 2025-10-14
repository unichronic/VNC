import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ScenarioLibrary from "@/pages/ScenarioLibrary";
import Monitor from "@/pages/Monitor";
import CustomScenario from "@/pages/CustomScenario";
import Inventory from "@/pages/Inventory";
import Placeholder from "@/pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/scenarios" element={<ScenarioLibrary />} />
            <Route path="/scenarios/create" element={<CustomScenario />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/monitor" element={<Monitor />} />
            <Route
              path="/forensics"
              element={<Placeholder title="Forensics / Artifacts" />}
            />
            <Route path="/reports" element={<Placeholder title="Reports" />} />
            <Route
              path="/settings"
              element={<Placeholder title="Settings" />}
            />
            <Route
              path="/run"
              element={<Placeholder title="Run Simulation" />}
            />
            <Route path="/logs" element={<Placeholder title="Logs" />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const container = document.getElementById("root")!;
// Prevent double createRoot during HMR / multiple loads
if ((window as any).__root) {
  (window as any).__root.render(<App />);
} else {
  const root = createRoot(container);
  (window as any).__root = root;
  root.render(<App />);
}
