
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Users, Building2, FileText, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  className?: string;
}

export function DashboardSidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, user } = useAuth();
  
  if (!user) return null;

  return (
    <div 
      className={cn(
        "relative flex flex-col h-full bg-primary text-primary-foreground px-4 py-6 transition-all duration-300 ease-in-out", 
        collapsed ? "w-16" : "w-64", 
        className
      )}
    >
      <div className="flex items-center justify-between mb-8">
        {!collapsed && <h2 className="text-xl font-bold">SurveyApp</h2>}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-primary-foreground hover:bg-primary/80 absolute -right-3 top-6 h-6 w-6 rounded-full border border-border bg-background"
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>
      
      <nav className="space-y-2 flex-1">
        {user.role === 'admin' && (
          <>
            <NavLink 
              to="/admins" 
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary/80",
                collapsed && "justify-center px-2"
              )}
            >
              <Users className="h-4 w-4" />
              {!collapsed && <span>Admins</span>}
            </NavLink>
            <NavLink 
              to="/companies" 
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary/80",
                collapsed && "justify-center px-2"
              )}
            >
              <Building2 className="h-4 w-4" />
              {!collapsed && <span>Companies & Clients</span>}
            </NavLink>
            <NavLink 
              to="/survey-builder" 
              className={({ isActive }) => cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary/80",
                collapsed && "justify-center px-2"
              )}
            >
              <FileText className="h-4 w-4" />
              {!collapsed && <span>Survey Builder</span>}
            </NavLink>
          </>
        )}
        
        {user.role === 'company' && (
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
              isActive ? "bg-primary-foreground text-primary" : "hover:bg-primary/80",
              collapsed && "justify-center px-2"
            )}
          >
            <Building2 className="h-4 w-4" />
            {!collapsed && <span>Company Dashboard</span>}
          </NavLink>
        )}
      </nav>
      
      <div className="mt-auto">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-primary-foreground hover:bg-primary/80", 
            collapsed && "justify-center px-2"
          )} 
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {!collapsed && "Logout"}
        </Button>
      </div>
    </div>
  );
}
