
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Box, 
  Home, 
  Package, 
  ArrowLeftRight, 
  Clock, 
  LayoutDashboard, 
  Store,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isCollapsed: boolean;
  isActive?: boolean;
}

const SidebarLink = ({ to, icon: Icon, label, isCollapsed, isActive }: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "text-sidebar-foreground hover:bg-sidebar-accent"
      )}
    >
      <Icon size={20} className={cn(
        "flex-shrink-0",
        !isActive && "text-muted-foreground group-hover:text-sidebar-accent-foreground"
      )} />
      {!isCollapsed && (
        <span className="animate-fade-in">{label}</span>
      )}
    </Link>
  );
};

interface SidebarSectionProps {
  title: string;
  isCollapsed: boolean;
  children: React.ReactNode;
}

const SidebarSection = ({ title, isCollapsed, children }: SidebarSectionProps) => {
  return (
    <div className="mb-6">
      {!isCollapsed && (
        <h3 className="px-4 mb-2 text-xs uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      )}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Reset mobile sidebar state when resizing
  useEffect(() => {
    if (!isMobile) {
      setIsMobileOpen(false);
    }
  }, [isMobile]);
  
  // Close sidebar on location change on mobile
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false);
    }
  }, [location, isMobile]);
  
  // Handle collapse toggle
  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
    toast.success(isCollapsed ? "Sidebar expanded" : "Sidebar collapsed");
  };
  
  // Handle mobile toggle
  const toggleMobile = () => {
    setIsMobileOpen(prev => !prev);
  };
  
  // Generate sidebar content
  const renderSidebarContent = () => (
    <>
      <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          {!isCollapsed && (
            <span className="font-semibold text-xl animate-fade-in">RetailStock</span>
          )}
          {isCollapsed && (
            <span className="font-bold text-xl animate-fade-in">RS</span>
          )}
        </div>
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleCollapse}
            className="rounded-full"
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        )}
      </div>
      
      <div className="p-4 space-y-6 overflow-y-auto">
        <SidebarSection title="Overview" isCollapsed={isCollapsed}>
          <SidebarLink 
            to="/" 
            icon={LayoutDashboard} 
            label="Dashboard" 
            isCollapsed={isCollapsed}
            isActive={location.pathname === '/'} 
          />
        </SidebarSection>
        
        <SidebarSection title="Inventory" isCollapsed={isCollapsed}>
          <SidebarLink 
            to="/products" 
            icon={Box} 
            label="Products" 
            isCollapsed={isCollapsed}
            isActive={location.pathname === '/products'} 
          />
          <SidebarLink 
            to="/inventory" 
            icon={Package} 
            label="Stock" 
            isCollapsed={isCollapsed}
            isActive={location.pathname === '/inventory'} 
          />
          <SidebarLink 
            to="/locations" 
            icon={Store} 
            label="Locations" 
            isCollapsed={isCollapsed}
            isActive={location.pathname === '/locations'} 
          />
        </SidebarSection>
        
        <SidebarSection title="Operations" isCollapsed={isCollapsed}>
          <SidebarLink 
            to="/transfers" 
            icon={ArrowLeftRight} 
            label="Transfers" 
            isCollapsed={isCollapsed}
            isActive={location.pathname === '/transfers'} 
          />
          <SidebarLink 
            to="/history" 
            icon={Clock} 
            label="History" 
            isCollapsed={isCollapsed}
            isActive={location.pathname === '/history'} 
          />
        </SidebarSection>
      </div>
      
      <div className="mt-auto p-4 border-t border-sidebar-border">
        <SidebarLink 
          to="/settings" 
          icon={Settings} 
          label="Settings" 
          isCollapsed={isCollapsed}
          isActive={location.pathname === '/settings'} 
        />
        <SidebarLink 
          to="/users" 
          icon={Users} 
          label="Users" 
          isCollapsed={isCollapsed}
          isActive={location.pathname === '/users'} 
        />
        <button 
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-red-500 hover:bg-red-50 hover:text-red-600 mt-2",
            isCollapsed && "justify-center"
          )}
          onClick={() => toast.info("Logout clicked")}
        >
          <LogOut size={20} />
          {!isCollapsed && <span className="animate-fade-in">Logout</span>}
        </button>
      </div>
    </>
  );
  
  // Mobile Sidebar Toggle Button (visible on mobile)
  const MobileToggle = () => (
    <Button 
      variant="outline" 
      size="icon" 
      className={cn(
        "fixed top-4 left-4 z-40 md:hidden rounded-full",
        isMobileOpen && "bg-primary text-primary-foreground"
      )}
      onClick={toggleMobile}
    >
      {isMobileOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
    </Button>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-fade-in"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      {/* Mobile Toggle Button */}
      <MobileToggle />
      
      {/* Sidebar for Desktop */}
      {!isMobile && (
        <aside className={cn(
          "h-screen sticky top-0 border-r border-sidebar-border bg-sidebar",
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "w-[70px]" : "w-[240px]"
        )}>
          {renderSidebarContent()}
        </aside>
      )}
      
      {/* Sidebar for Mobile */}
      {isMobile && (
        <aside className={cn(
          "fixed top-0 left-0 h-screen z-40 bg-sidebar shadow-xl",
          "transition-all duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0 w-[240px]" : "-translate-x-full w-0"
        )}>
          {renderSidebarContent()}
        </aside>
      )}
    </>
  );
}
