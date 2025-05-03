
import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionActionsProps {
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  filter: string;
  sortBy: string;
  searchQuery: string;
}

export function TransactionActions({ 
  onFilterChange,
  onSortChange,
  onSearchChange,
  filter,
  sortBy,
  searchQuery
}: TransactionActionsProps) {
  return (
    <div className="flex flex-col md:flex-row items-center gap-4">
      <div className="w-full md:w-1/3">
        <Input
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="w-full md:w-1/3">
        <Select value={filter} onValueChange={onFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All transactions</SelectItem>
            <SelectItem value="income">Income only</SelectItem>
            <SelectItem value="expense">Expenses only</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="w-full md:w-1/3">
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Sort by date</SelectItem>
            <SelectItem value="amount">Sort by amount</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
