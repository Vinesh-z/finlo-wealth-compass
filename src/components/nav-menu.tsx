
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function NavMenu() {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const routes = [
    {
      href: "/",
      label: "Home",
      active: location.pathname === "/",
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      active: location.pathname === "/dashboard",
    },
    {
      href: "/transactions",
      label: "Transactions",
      active: location.pathname === "/transactions",
    },
    {
      href: "/analytics",
      label: "Analytics",
      active: location.pathname === "/analytics",
    },
    {
      href: "/investments",
      label: "Investments",
      active: location.pathname === "/investments",
    },
    {
      href: "/notes",
      label: "Notes & Reminders",
      active: location.pathname === "/notes",
    },
    {
      href: "/settings",
      label: "Settings",
      active: location.pathname === "/settings",
    },
  ];

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed right-4 top-4 z-40 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pl-8 pr-0 pt-12">
            <div className="flex flex-col gap-4">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary-foreground rounded-lg transition",
                    route.active
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground"
                  )}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <div className="fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-border hidden md:block">
          <div className="h-20 flex items-center px-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="font-bold text-lg">FinTrackr</span>
            </Link>
          </div>
          <div className="space-y-1 px-4">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                className={cn(
                  "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-primary hover:bg-primary-foreground rounded-lg transition",
                  route.active
                    ? "text-sidebar-primary-foreground bg-sidebar-primary"
                    : "text-sidebar-foreground"
                )}
              >
                {route.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
