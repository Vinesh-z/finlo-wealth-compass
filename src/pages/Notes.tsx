
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Note, Reminder } from "@/types";
import { NoteForm } from "@/components/notes/note-form";
import { NoteList } from "@/components/notes/note-list";
import { ReminderForm } from "@/components/reminders/reminder-form";
import { ReminderList } from "@/components/reminders/reminder-list";
import { toast } from "@/components/ui/use-toast";

function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);

  const handleAddNote = (note: Omit<Note, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date();
    const newNote: Note = {
      id: Math.random().toString(36).substring(2, 11),
      createdAt: now,
      updatedAt: now,
      ...note,
    };
    setNotes([newNote, ...notes]);
  };

  const handleAddReminder = (reminder: Omit<Reminder, "id" | "isCompleted">) => {
    const newReminder: Reminder = {
      id: Math.random().toString(36).substring(2, 11),
      isCompleted: false,
      ...reminder,
    };
    setReminders([newReminder, ...reminders]);
  };

  const handleToggleReminder = (id: string, completed: boolean) => {
    setReminders(
      reminders.map((reminder) =>
        reminder.id === id ? { ...reminder, isCompleted: completed } : reminder
      )
    );

    toast({
      title: completed ? "Reminder Completed" : "Reminder Reopened",
      description: "Reminder status has been updated.",
      duration: 3000,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notes & Reminders</h1>
        <p className="text-muted-foreground">
          Keep track of important information and set reminders
        </p>
      </div>

      <Tabs defaultValue="notes" className="space-y-6">
        <TabsList>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="reminders">Reminders</TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <NoteForm onAddNote={handleAddNote} />
            </div>
            <div className="lg:col-span-2">
              <NoteList notes={notes} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reminders" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <ReminderForm onAddReminder={handleAddReminder} />
            </div>
            <div className="lg:col-span-2">
              <ReminderList 
                reminders={reminders} 
                onToggleComplete={handleToggleReminder}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Notes;
