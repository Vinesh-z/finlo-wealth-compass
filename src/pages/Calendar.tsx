
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CalendarIcon, FileText, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Transaction } from "@/types";
import { Badge } from "@/components/ui/badge";

interface CalendarDayDetails {
  transactions?: Transaction[];
  reminders?: {
    id: string;
    title: string;
    description?: string;
    isCompleted: boolean;
  }[];
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [monthData, setMonthData] = useState<Record<string, CalendarDayDetails>>({});

  // Mock data for demonstration - replace with actual data fetching
  const mockData: Record<string, CalendarDayDetails> = {
    [format(new Date(), 'yyyy-MM-dd')]: {
      transactions: [{
        id: '1',
        amount: 500,
        type: 'expense',
        category: 'food',
        description: 'Lunch',
        date: new Date(),
      }],
      reminders: [{
        id: '1',
        title: 'Pay rent',
        description: 'Monthly rent payment',
        isCompleted: false,
      }],
    },
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">
          View your transactions and reminders by date
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
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
                  const formattedDate = format(date, 'yyyy-MM-dd');
                  const hasData = mockData[formattedDate];
                  return (
                    <div className="relative">
                      <div>{date.getDate()}</div>
                      {hasData && (
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {hasData.transactions && (
                            <div className="h-1 w-1 rounded-full bg-primary" />
                          )}
                          {hasData.reminders && (
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
              {selectedDate && mockData[format(selectedDate, 'yyyy-MM-dd')] ? (
                <div className="space-y-6">
                  {mockData[format(selectedDate, 'yyyy-MM-dd')].transactions && (
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Transactions
                      </h3>
                      <div className="space-y-2">
                        {mockData[format(selectedDate, 'yyyy-MM-dd')].transactions?.map((transaction) => (
                          <div
                            key={transaction.id}
                            className="p-3 rounded-lg border bg-card text-card-foreground"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium">{transaction.description}</p>
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

                  {mockData[format(selectedDate, 'yyyy-MM-dd')].reminders && (
                    <div className="space-y-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Reminders
                      </h3>
                      <div className="space-y-2">
                        {mockData[format(selectedDate, 'yyyy-MM-dd')].reminders?.map((reminder) => (
                          <div
                            key={reminder.id}
                            className="p-3 rounded-lg border bg-card text-card-foreground"
                          >
                            <p className="font-medium">{reminder.title}</p>
                            {reminder.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {reminder.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No events for this date
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
