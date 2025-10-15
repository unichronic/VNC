import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/useTheme";
import NotFound from "./pages/NotFound";
import AppLayout from "@/components/layout/AppLayout";
import Dashboard from "@/pages/Dashboard";
import ScenarioLibrary from "@/pages/ScenarioLibrary";
import CustomScenario from "@/pages/CustomScenario";
import Forensics from "@/pages/Forensics";
import Placeholder from "@/pages/Placeholder";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vnc-ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/scenarios" element={<ScenarioLibrary />} />
              <Route path="/scenarios/create" element={<CustomScenario />} />
              <Route
                path="/forensics"
                element={<Forensics />}
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
    </ThemeProvider>
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
