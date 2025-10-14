import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Activity, BarChart3, BookOpen, File, Monitor, Play, Settings, Shield, Table } from "lucide-react";
import { ReactNode } from "react";

function Topbar() {
  const location = useLocation();
  return (
    <div className="sticky top-0 z-10 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-2 px-4 py-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Link to="/" className="font-semibold tracking-tight text-primary">Test-bed Control Panel</Link>
        <span className="ml-2 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">{location.pathname}</span>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild size="sm" className="gap-1">
            <Link to="/scenarios"><Play className="h-4 w-4" /> Run New Test</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <SidebarMenuItem>
      <NavLink to={to} className={({ isActive }) => cn("block", isActive && "[&_[data-sidebar=menu-button]]:data-[active=true]=true") }>
        {({ isActive }) => (
          <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
            <span className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </span>
          </SidebarMenuButton>
        )}
      </NavLink>
    </SidebarMenuItem>
  );
}

export default function AppLayout() {
  return (
    <SidebarProvider>
      <Sidebar variant="inset">
        <SidebarHeader>
          <div className="flex items-center justify-between px-2 py-1.5">
            <Link to="/" className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="font-semibold">VNC Test-bed</span>
            </Link>
            <Badge variant="secondary" className="text-[11px]">Audit-ready</Badge>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <NavItem to="/" icon={Activity} label="Dashboard" />
                <NavItem to="/scenarios" icon={Table} label="Scenario Library" />
                <NavItem to="/run" icon={Play} label="Run Simulation" />
                <NavItem to="/monitor" icon={Monitor} label="Live Monitor" />
                <NavItem to="/forensics" icon={BookOpen} label="Forensics" />
                <NavItem to="/inventory" icon={BarChart3} label="Inventory" />
                <SidebarSeparator />
                <NavItem to="/reports" icon={File} label="Reports" />
                <NavItem to="/settings" icon={Settings} label="Settings" />
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 text-xs text-muted-foreground">Ctrl/Cmd+B to toggle</div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Topbar />
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
