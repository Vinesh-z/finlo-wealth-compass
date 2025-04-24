
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Transaction, Reminder } from "@/types";

export function useCalendarData(selectedDate: Date | undefined) {
  const startOfMonth = selectedDate 
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  
  const endOfMonth = selectedDate
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0)
    : new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

  // Fetch transactions for the selected month
  const { data: transactions = [], isLoading: isLoadingTransactions } = useQuery({
    queryKey: ['transactions', startOfMonth, endOfMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .gte('date', startOfMonth.toISOString())
        .lte('date', endOfMonth.toISOString());

      if (error) throw error;
      
      // Convert date strings to Date objects to match Transaction type
      return (data || []).map(transaction => ({
        ...transaction,
        date: new Date(transaction.date),
      })) as Transaction[];
    },
  });

  // Fetch reminders for the selected month
  const { data: reminders = [], isLoading: isLoadingReminders } = useQuery({
    queryKey: ['reminders', startOfMonth, endOfMonth],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .gte('reminder_date', startOfMonth.toISOString())
        .lte('reminder_date', endOfMonth.toISOString());

      if (error) throw error;
      return (data || []).map(reminder => ({
        ...reminder,
        reminderDate: new Date(reminder.reminder_date),
        isCompleted: reminder.is_completed || false,
      })) as Reminder[];
    },
  });

  return {
    transactions,
    reminders,
    isLoading: isLoadingTransactions || isLoadingReminders
  };
}
