import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, BarChart2, CreditCard, PieChart, Briefcase, Bookmark, Settings, LogOut } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
export function NavMenu() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const routes = [{
    href: "/dashboard",
    label: "Dashboard",
    icon: Home,
    active: location.pathname === "/dashboard"
  }, {
    href: "/transactions",
    label: "Transactions",
    icon: CreditCard,
    active: location.pathname === "/transactions"
  }, {
    href: "/analytics",
    label: "Analytics",
    icon: BarChart2,
    active: location.pathname === "/analytics"
  }, {
    href: "/investments",
    label: "Investments",
    icon: Briefcase,
    active: location.pathname === "/investments"
  }, {
    href: "/notes",
    label: "Notes & Reminders",
    icon: Bookmark,
    active: location.pathname === "/notes"
  }, {
    href: "/settings",
    label: "Settings",
    icon: Settings,
    active: location.pathname === "/settings"
  }];
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed out successfully",
        duration: 3000
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Error signing out",
        variant: "destructive",
        duration: 3000
      });
    }
  };
  return <>
      {isMobile ? <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed right-4 top-4 z-40 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pl-8 pr-0 pt-12">
            <div className="flex flex-col gap-4">
              {routes.map(route => <Link key={route.href} to={route.href} onClick={() => setOpen(false)} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary-foreground rounded-lg transition", route.active ? "text-primary bg-primary/10" : "text-muted-foreground")}>
                  <route.icon className="h-5 w-5 mr-3" />
                  {route.label}
                </Link>)}
              <Button variant="ghost" className="justify-start mt-4 text-red-500" onClick={() => {
            handleSignOut();
            setOpen(false);
          }}>
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </SheetContent>
        </Sheet> : <div className="fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border hidden md:block">
          <div className="h-20 flex items-center px-8">
            <Link to="/dashboard" className="flex items-center gap-2">
              <span className="font-bold text-lg">Zenfi</span>
            </Link>
          </div>
          <div className="space-y-1 px-4">
            {routes.map(route => <Link key={route.href} to={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary-foreground rounded-lg transition", route.active ? "text-sidebar-primary-foreground bg-sidebar-primary" : "text-sidebar-foreground")}>
                <route.icon className="h-5 w-5 mr-3" />
                {route.label}
              </Link>)}
            <Button variant="ghost" className="justify-start w-full mt-4 text-red-500" onClick={handleSignOut}>
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>}
    </>;
}