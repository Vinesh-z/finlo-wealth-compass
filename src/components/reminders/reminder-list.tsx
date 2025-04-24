
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Reminder } from "@/types";
import { formatDate } from "@/utils/format";
import { Bell } from "lucide-react";

interface ReminderListProps {
  reminders: Reminder[];
  onToggleComplete?: (id: string, completed: boolean) => void;
}

export function ReminderList({
  reminders,
  onToggleComplete
}: ReminderListProps) {
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // Sort reminders by date (most recent first) and filter by completion status
  const sortedAndFilteredReminders = [...reminders].sort((a, b) => a.reminderDate.getTime() - b.reminderDate.getTime()).filter(reminder => {
    if (filter === "all") return true;
    if (filter === "active") return !reminder.isCompleted;
    if (filter === "completed") return reminder.isCompleted;
    return true;
  });

  // Group reminders by date
  const groupedReminders = sortedAndFilteredReminders.reduce((groups, reminder) => {
    const dateKey = reminder.reminderDate.toDateString();
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(reminder);
    return groups;
  }, {} as Record<string, Reminder[]>);

  // Determine if a reminder is overdue
  const isOverdue = (date: Date) => {
    return date < new Date() && new Date().toDateString() !== date.toDateString();
  };

  // Format time part of the date
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handleToggleComplete = (id: string, checked: boolean) => {
    if (onToggleComplete) {
      onToggleComplete(id, checked);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "active" ? "default" : "outline"} size="sm" onClick={() => setFilter("active")}>
              Active
            </Button>
            <Button variant={filter === "completed" ? "default" : "outline"} size="sm" onClick={() => setFilter("completed")}>
              Completed
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {Object.keys(groupedReminders).length > 0 ? Object.entries(groupedReminders).map(([dateKey, dayReminders]) => (
            <div key={dateKey}>
              <div className="flex items-center gap-2 mb-2">
                <div className="h-1 w-1 rounded-full bg-primary"></div>
                <h3 className="text-sm font-semibold">
                  {new Date(dateKey).toDateString() === new Date().toDateString() 
                    ? "Today" 
                    : new Date(dateKey).toDateString() === new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() 
                      ? "Tomorrow" 
                      : formatDate(new Date(dateKey))}
                </h3>
                <div className="h-px flex-1 bg-border"></div>
              </div>
              
              <div className="space-y-2">
                {dayReminders.map(reminder => {
                  const overdueReminder = isOverdue(reminder.reminderDate) && !reminder.isCompleted;
                  return (
                    <Card key={reminder.id} className={cn("overflow-hidden border", overdueReminder ? "border-red-500" : reminder.isCompleted ? "bg-muted" : "")}>
                      <div className="p-4">
                        <div className="flex items-start gap-2">
                          <Checkbox 
                            checked={reminder.isCompleted} 
                            onCheckedChange={checked => handleToggleComplete(reminder.id, checked as boolean)} 
                            className="mt-1" 
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className={cn("font-medium", reminder.isCompleted ? "line-through text-muted-foreground" : "")}>
                                {reminder.title}
                              </h4>
                              <div className="flex items-center gap-2">
                                <Bell className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(reminder.reminderDate)}
                                </span>
                                {overdueReminder && <Badge variant="destructive" className="text-[0.625rem] py-0 px-1.5">Overdue</Badge>}
                              </div>
                            </div>
                            
                            {reminder.description && <p className={cn("text-sm text-muted-foreground mt-1", reminder.isCompleted ? "line-through" : "")}>
                              {reminder.description}
                            </p>}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )) : (
            <div className="text-center py-8 text-muted-foreground">
              {filter !== "all" ? `No ${filter} reminders found` : "No reminders found. Add a new reminder to get started!"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function
const cn = (...classes: any[]) => {
  return classes.filter(Boolean).join(" ");
};
