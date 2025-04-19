
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  CircleDollarSign, 
  BarChart3, 
  TrendingUp, 
  Settings,
  Menu,
  X
} from "lucide-react";

export function NavMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  
  const menuItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Transactions",
      href: "/transactions",
      icon: <CircleDollarSign className="h-5 w-5" />,
    },
    {
      name: "Analytics",
      href: "/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Investments",
      href: "/investments",
      icon: <TrendingUp className="h-5 w-5" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <div className="block md:hidden fixed top-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 h-screen bg-card fixed left-0 top-0 border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold">Finlo</h1>
          <p className="text-muted-foreground text-sm">Wealth Compass</p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link to={item.href}>
                  <Button
                    variant={isActiveLink(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActiveLink(item.href) ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Finlo
          </p>
        </div>
      </aside>

      {/* Mobile overlay menu */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-200 ${
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-card shadow-xl z-50 md:hidden transform transition-transform duration-200 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Finlo</h1>
          <p className="text-muted-foreground text-sm">Wealth Compass</p>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link to={item.href} onClick={() => setMenuOpen(false)}>
                  <Button
                    variant={isActiveLink(item.href) ? "default" : "ghost"}
                    className={`w-full justify-start ${
                      isActiveLink(item.href) ? "bg-primary text-primary-foreground" : ""
                    }`}
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
