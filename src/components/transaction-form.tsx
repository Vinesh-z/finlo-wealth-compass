
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
import { PlusCircle, Save, ArrowDown, ArrowUp, X } from "lucide-react";

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

  const isEditing = !!editingTransaction;
  const formTitle = isEditing ? "Edit Transaction" : "Add Transaction";
  const formIcon = isEditing ? Save : PlusCircle;
  const buttonText = isEditing ? "Update" : "Add";

  return (
    <Card className="shadow-card card-gradient overflow-hidden border border-neutral-100 dark:border-neutral-800">
      <CardHeader className="bg-gradient-to-r from-secondary/30 to-secondary/10 dark:from-secondary/10 dark:to-transparent border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <CardTitle className="text-xl font-heading flex items-center gap-2">
          {formTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">Amount</Label>
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
                  className="pl-7 h-11 rounded-md border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary dark:border-neutral-700"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="h-11 rounded-md border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary dark:border-neutral-700"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <Label htmlFor="type" className="text-sm font-medium">Type</Label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as TransactionType)}
              >
                <SelectTrigger className="h-11 rounded-md border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary dark:border-neutral-700">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income" className="flex items-center gap-2 text-income">
                    <ArrowUp className="h-3.5 w-3.5" />
                    <span>Income</span>
                  </SelectItem>
                  <SelectItem value="expense" className="flex items-center gap-2 text-expense">
                    <ArrowDown className="h-3.5 w-3.5" />
                    <span>Expense</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <CategorySelector
              value={category}
              onChange={setCategory}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter transaction details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[80px] rounded-md border-neutral-200 focus:border-primary focus:ring-1 focus:ring-primary resize-none dark:border-neutral-700"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button 
              type="submit" 
              className="flex-1 h-11 gap-2 bg-primary hover:bg-primary/90"
            >
              <formIcon className="h-4 w-4" />
              {buttonText} Transaction
            </Button>
            
            {isEditing && onCancelEdit && (
              <Button type="button" variant="outline" className="h-11 gap-2" onClick={onCancelEdit}>
                <X className="h-4 w-4" />
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
