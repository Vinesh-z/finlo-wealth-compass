import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Transaction, TransactionType } from "@/types";
import { CategorySelector } from "./transaction-form/category-selector";

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: Date;
    is_custom_category: boolean;
  }) => void;
  editingTransaction?: Transaction | null;
  onEditTransaction?: (transaction: Transaction) => void;
  onCancelEdit?: () => void;
}

export function TransactionForm({ 
  onAddTransaction, 
  editingTransaction = null, 
  onEditTransaction, 
  onCancelEdit 
}: TransactionFormProps) {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [category, setCategory] = useState<string>("food");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description || "");
      setDate(new Date(editingTransaction.date).toISOString().slice(0, 10));
    }
  }, [editingTransaction]);

  const resetForm = () => {
    setAmount("");
    setType("expense");
    setCategory("food");
    setDescription("");
    setDate(new Date().toISOString().slice(0, 10));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount",
        variant: "destructive"
      });
      return;
    }

    if (editingTransaction && onEditTransaction) {
      onEditTransaction({
        ...editingTransaction,
        amount: parseFloat(amount),
        type,
        category,
        description,
        date: new Date(date)
      });
    } else {
      onAddTransaction({
        amount: parseFloat(amount),
        type,
        category,
        description,
        date: new Date(date),
        is_custom_category: false
      });
    }

    resetForm();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingTransaction ? "Edit Transaction" : "Add Transaction"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  ₹
                </span>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as TransactionType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income" className="text-income">Income</SelectItem>
                  <SelectItem value="expense" className="text-expense">Expense</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <CategorySelector
              value={category}
              onChange={setCategory}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" className="flex-1">
              {editingTransaction ? "Update" : "Add"} Transaction
            </Button>
            
            {editingTransaction && onCancelEdit && (
              <Button type="button" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
