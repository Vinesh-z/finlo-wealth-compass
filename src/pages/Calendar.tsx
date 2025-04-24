
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, FileText, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useCalendarData } from "@/hooks/use-calendar-data";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { ReminderList } from "@/components/reminders/reminder-list";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Reminder } from "@/types";

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const { transactions, reminders, isLoading } = useCalendarData(selectedDate);

  const handleToggleComplete = async (id: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .update({ is_completed: completed })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: completed ? "Reminder completed" : "Reminder uncompleted",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error updating reminder",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleAddReminder = async (reminder: Omit<Reminder, "id" | "isCompleted">) => {
    try {
      const { error } = await supabase
        .from('reminders')
        .insert({
          title: reminder.title,
          description: reminder.description,
          reminder_date: reminder.reminderDate.toISOString(),
          is_completed: false,
        });

      if (error) throw error;

      toast({
        title: "Reminder added successfully",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error adding reminder",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Group events by date for the selected date
  const selectedDateEvents = {
    transactions: transactions.filter(t => 
      new Date(t.date).toDateString() === selectedDate?.toDateString()
    ),
    reminders: reminders.filter(r => 
      r.reminderDate.toDateString() === selectedDate?.toDateString()
    ),
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-32 bg-muted animate-pulse rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-[600px] bg-muted animate-pulse rounded"></div>
          <div className="h-[600px] bg-muted animate-pulse rounded"></div>
          <div className="h-[600px] bg-muted animate-pulse rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View your transactions and reminders by date
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Add Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <ReminderForm onAddReminder={handleAddReminder} />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              components={{
                DayContent: ({ date }) => {
                  const hasTransactions = transactions.some(
                    t => new Date(t.date).toDateString() === date.toDateString()
                  );
                  const hasReminders = reminders.some(
                    r => r.reminderDate.toDateString() === date.toDateString()
                  );
                  
                  return (
                    <div className="relative">
                      <div>{date.getDate()}</div>
                      {(hasTransactions || hasReminders) && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {hasTransactions && (
                            <div className="h-1 w-1 rounded-full bg-primary" />
                          )}
                          {hasReminders && (
                            <div className="h-1 w-1 rounded-full bg-orange-500" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {selectedDateEvents.transactions.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Transactions
                    </h3>
                    <div className="space-y-2">
                      {selectedDateEvents.transactions.map((transaction) => (
                        <div
                          key={transaction.id}
                          className="p-3 rounded-lg border bg-card text-card-foreground"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">{transaction.description || '-'}</p>
                              <p className="text-sm text-muted-foreground capitalize">
                                {transaction.category}
                              </p>
                            </div>
                            <Badge variant={transaction.type === 'expense' ? 'destructive' : 'default'}>
                              ₹{transaction.amount}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedDate && (
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Reminders
                    </h3>
                    <ReminderList
                      reminders={selectedDateEvents.reminders}
                      onToggleComplete={handleToggleComplete}
                    />
                  </div>
                )}

                {selectedDateEvents.transactions.length === 0 && 
                 selectedDateEvents.reminders.length === 0 && (
                  <div className="text-center text-muted-foreground py-8">
                    No events for this date
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
