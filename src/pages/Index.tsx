
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in, if so redirect to dashboard
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/dashboard");
      }
    });
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to Zinfy</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your personal finance management platform
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/dashboard")}>
            Go to Dashboard
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            Sign In / Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
