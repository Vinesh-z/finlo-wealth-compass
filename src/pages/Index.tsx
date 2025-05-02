
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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background overflow-hidden relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M-100,0 Q150,200 400,0 T900,0"
            className="fill-none stroke-primary/10 stroke-[100px]"
          />
          <path
            d="M-100,200 Q150,400 400,200 T900,200"
            className="fill-none stroke-primary/10 stroke-[100px]"
          />
          <path
            d="M-100,400 Q150,600 400,400 T900,400"
            className="fill-none stroke-primary/10 stroke-[100px]"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="w-full max-w-3xl text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Welcome to Zynfi
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Take control of your financial future with our comprehensive personal finance management platform.
        </p>
        
        <Button 
          size="lg" 
          className="text-lg px-8 py-6 rounded-full hover:scale-105 transition-transform"
          onClick={() => navigate("/auth")}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Index;
