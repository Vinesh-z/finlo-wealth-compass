
import { ReactNode } from "react";
import { NavMenu } from "@/components/nav-menu";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <NavMenu />
      <main className="md:pl-64 min-h-screen">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
