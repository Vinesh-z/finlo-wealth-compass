
import * as React from "react";
import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout";
import { ThemeProvider } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Analytics from "./pages/Analytics";
import Investments from "./pages/Investments";
import Notes from "./pages/Notes";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = React.useState<any>(null);
  
  useEffect(() => {
    // Check for initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      return <Navigate to="/auth" />;
    }
    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={<Index />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Dashboard />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/transactions"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Transactions />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Analytics />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/investments"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Investments />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/notes"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Notes />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Layout>
                      <Settings />
                    </Layout>
                  </PrivateRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
            <Sonner />
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
