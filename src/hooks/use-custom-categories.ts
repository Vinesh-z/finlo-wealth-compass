
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { CustomTransactionCategory } from "@/types";

export function useCustomCategories() {
  const [customCategories, setCustomCategories] = useState<CustomTransactionCategory[]>([]);

  const fetchCustomCategories = async () => {
    const { data, error } = await supabase
      .from('custom_transaction_categories')
      .select('*');

    if (error) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setCustomCategories(data);
  };

  const addCustomCategory = async (newCategoryName: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to add custom categories",
        variant: "destructive"
      });
      return;
    }

    const { data, error } = await supabase
      .from('custom_transaction_categories')
      .insert({ 
        name: newCategoryName.trim(),
        user_id: session.user.id
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive"
      });
      return null;
    }

    setCustomCategories([...customCategories, data]);
    return data;
  };

  useEffect(() => {
    fetchCustomCategories();
  }, []);

  return {
    customCategories,
    addCustomCategory
  };
}
