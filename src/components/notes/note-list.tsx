
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Note } from "@/types";
import { formatDate } from "@/utils/format";

interface NoteListProps {
  notes: Note[];
}

export function NoteList({ notes }: NoteListProps) {
  const [filter, setFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Filter notes based on category and search query
  const filteredNotes = notes.filter((note) => {
    const matchesCategory = filter === "all" || note.category === filter;
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.content?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    
    return matchesCategory && matchesSearch;
  });

  // Get badge color based on category
  const getBadgeVariant = (category?: string) => {
    switch (category) {
      case "investment":
        return "default";
      case "expense":
        return "destructive";
      case "income":
        return "secondary";
      case "idea":
        return "secondary";
      case "todo":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Your Notes</CardTitle>
          <div className="flex items-center gap-2">
            <Select
              value={filter}
              onValueChange={setFilter}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="todo">To-do</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="mt-2">
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <Card key={note.id} className="overflow-hidden">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold">{note.title}</h3>
                    {note.category && (
                      <Badge variant={getBadgeVariant(note.category)}>
                        {note.category.charAt(0).toUpperCase() + note.category.slice(1)}
                      </Badge>
                    )}
                  </div>
                  {note.content && (
                    <p className="text-sm text-muted-foreground mb-3 whitespace-pre-wrap">
                      {note.content}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Created: {formatDate(note.createdAt)}</span>
                    {note.updatedAt && note.updatedAt.getTime() !== note.createdAt.getTime() && (
                      <span>Updated: {formatDate(note.updatedAt)}</span>
                    )}
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {searchQuery || filter !== "all" 
                ? "No notes match your filter criteria" 
                : "No notes found. Create your first note!"}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
