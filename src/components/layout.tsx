
import { ReactNode, useEffect } from "react";
import { NavMenu } from "@/components/nav-menu";
import { motion } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Add custom scrollbar styling to the body
  useEffect(() => {
    document.body.classList.add('custom-scrollbar');
    
    return () => {
      document.body.classList.remove('custom-scrollbar');
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex w-full">
      <NavMenu />
      <main className="md:pl-64 min-h-screen w-full flex flex-col">
        <motion.div 
          className="container mx-auto p-4 sm:p-6 flex-grow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
        <footer className="text-center text-sm text-muted-foreground py-4 border-t border-border">
          <p>© {new Date().getFullYear()} Zynfi. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}
