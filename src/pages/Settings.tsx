
import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";
import { toast } from "@/components/ui/use-toast";
import { Sun, Moon, BadgeIndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

function Settings() {
  const { theme, setTheme } = useTheme();
  const [currency, setCurrency] = useState("INR");
  const [emailNotifications, setEmailNotifications] = useState(true);
  
  // Profile form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Set email from auth session
          setEmail(session.user.email || "");
          
          // Get user metadata if available
          const metadata = session.user.user_metadata;
          if (metadata) {
            setName(metadata.full_name || "");
            setBio(metadata.bio || "");
          }
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? "dark" : "light";
    setTheme(newTheme);
    toast({
      title: "Theme Updated",
      description: `Theme set to ${newTheme} mode.`,
      duration: 3000,
    });
  };

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency);
    toast({
      title: "Currency Updated",
      description: `Currency set to ${newCurrency}.`,
      duration: 3000,
    });
  };

  const handleSaveProfile = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: name,
          bio: bio
        }
      });

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved.",
        duration: 3000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportData = async (format: 'csv' | 'pdf') => {
    try {
      const { data: fixedDeposits } = await supabase.from('fixed_deposits').select('*');
      const { data: insurance } = await supabase.from('insurance').select('*');
      const { data: notes } = await supabase.from('notes').select('*');
      const { data: preciousMetals } = await supabase.from('precious_metals').select('*');
      const { data: providentFunds } = await supabase.from('provident_funds').select('*');
      const { data: reminders } = await supabase.from('reminders').select('*');

      const exportData = {
        fixedDeposits,
        insurance,
        notes,
        preciousMetals,
        providentFunds,
        reminders,
      };

      if (format === 'csv') {
        const csvContent = Object.entries(exportData).map(([category, items]) => {
          if (!items?.length) return '';
          const headers = Object.keys(items[0]).join(',');
          const rows = items.map(item => Object.values(item).join(',')).join('\n');
          return `${category}\n${headers}\n${rows}\n\n`;
        }).join('');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-data.csv';
        a.click();
      } else {
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'financial-data.json';
        a.click();
      }

      toast({
        title: "Success",
        description: `Data exported successfully as ${format.toUpperCase()}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to export data: " + error.message,
        variant: "destructive",
      });
    }
  };

  const isDarkTheme = theme === "dark";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and application preferences
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  placeholder="John Doe" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="john@example.com" 
                  value={email}
                  readOnly
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">About</Label>
              <Input 
                id="bio" 
                placeholder="Tell us about yourself" 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
            
            <Button 
              onClick={handleSaveProfile}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Settings</CardTitle>
            <CardDescription>
              Customize your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-full bg-secondary">
                  {isDarkTheme ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </div>
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    Toggle dark mode on or off
                  </p>
                </div>
              </div>
              <Switch 
                checked={isDarkTheme} 
                onCheckedChange={handleThemeChange} 
              />
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 rounded-full bg-secondary">
                  <BadgeIndianRupee className="h-5 w-5" />
                </div>
                <Label htmlFor="currency">Currency</Label>
              </div>
              <Select value={currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INR">Indian Rupee (₹)</SelectItem>
                  <SelectItem value="USD">US Dollar ($)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="GBP">British Pound (£)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">
                  Receive reports and alerts via email
                </p>
              </div>
              <Switch 
                checked={emailNotifications} 
                onCheckedChange={setEmailNotifications} 
              />
            </div>
            
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>
              Export or delete your data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleExportData('csv')}
              >
                Export Data (CSV)
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleExportData('pdf')}
              >
                Export Data (PDF)
              </Button>
            </div>
            
            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Delete all your financial data from the application. This action cannot be undone.
              </p>
              <Button variant="destructive">Delete All Data</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Settings;
