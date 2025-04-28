
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Calendar, 
  CheckSquare, 
  ChevronRight, 
  Layers, 
  Menu, 
  MessageSquare, 
  Settings, 
  Users, 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside 
      className={cn(
        "bg-sidebar h-screen transition-all duration-300 overflow-hidden border-r",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4">
        {!collapsed && (
          <div className="text-xl font-bold text-primary flex items-center gap-2 animate-fade-in">
            <Layers className="h-6 w-6" />
            <span>Orbit Flow</span>
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar}
          className="ml-auto"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      <Separator />
      
      <div className="px-3 py-4">
        <nav className="space-y-1">
          <NavItem 
            to="/" 
            icon={<BarChart3 className="h-5 w-5" />} 
            label="Dashboard" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/projects" 
            icon={<Layers className="h-5 w-5" />} 
            label="Projects" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/tasks" 
            icon={<CheckSquare className="h-5 w-5" />} 
            label="Tasks" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/calendar" 
            icon={<Calendar className="h-5 w-5" />} 
            label="Calendar" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/messages" 
            icon={<MessageSquare className="h-5 w-5" />} 
            label="Messages" 
            collapsed={collapsed} 
          />
          <NavItem 
            to="/team" 
            icon={<Users className="h-5 w-5" />} 
            label="Team" 
            collapsed={collapsed} 
          />
        </nav>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 px-3">
        <NavItem 
          to="/settings" 
          icon={<Settings className="h-5 w-5" />} 
          label="Settings" 
          collapsed={collapsed} 
        />
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
}

const NavItem = ({ to, icon, label, collapsed }: NavItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-all group",
        isActive 
          ? "bg-sidebar-accent text-sidebar-accent-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent/50"
      )}
    >
      {icon}
      {!collapsed && (
        <span className="animate-fade-in">{label}</span>
      )}
      {collapsed && (
        <span className="absolute left-12 rounded-md px-2 py-1 bg-popover text-popover-foreground text-sm opacity-0 -translate-x-3 transition-all group-hover:opacity-100 group-hover:translate-x-0 whitespace-nowrap">
          {label}
        </span>
      )}
    </NavLink>
  );
};
