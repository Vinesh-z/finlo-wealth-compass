
import { useState } from 'react';
import { Investment } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

export function useInvestmentActions() {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = async (
    id: string,
    updates: Partial<Omit<Investment, 'id'>>
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('investments')
        .update({
          name: updates.name,
          type: updates.type,
          initial_value: updates.initialValue,
          current_value: updates.currentValue,
          purchase_date: updates.purchaseDate?.toISOString().split('T')[0],
          notes: updates.notes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'Investment Updated',
        description: 'Your investment has been updated successfully.',
      });

      return data;
    } catch (error) {
      console.error('Error updating investment:', error);
      toast({
        title: 'Error',
        description: 'Failed to update investment. Please try again.',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Investment Deleted',
        description: 'Your investment has been deleted successfully.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting investment:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete investment. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleEdit,
    handleDelete
  };
}
