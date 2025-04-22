
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
  SelectSeparator,
  SelectLabel,
  SelectGroup
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Transaction, 
  TransactionType, 
  DefaultTransactionCategory,
  CustomTransactionCategory
} from "@/types";

const DEFAULT_CATEGORIES: DefaultTransactionCategory[] = [
  'food', 'social_life', 'pets', 'transport', 'household', 
  'apparel', 'beauty', 'health', 'education', 'gift', 
  'investment', 'subscription', 'baby', 'other'
];

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
  const [customCategories, setCustomCategories] = useState<CustomTransactionCategory[]>([]);
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Fetch custom categories
  useEffect(() => {
    fetchCustomCategories();
  }, []);

  // Update form when editing transaction changes
  useEffect(() => {
    if (editingTransaction) {
      setAmount(editingTransaction.amount.toString());
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setDescription(editingTransaction.description || "");
      setDate(new Date(editingTransaction.date).toISOString().slice(0, 10));
    }
  }, [editingTransaction]);

  const fetchCustomCategories = async () => {
    const { data, error } = await supabase
      .from('custom_transaction_categories')
      .select('*');

    if (error) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setCustomCategories(data);
  };

  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Error",
        description: "You must be logged in to add custom categories",
        variant: "destructive"
      });
      return;
    }

    // Add user_id to the insert object
    const { data, error } = await supabase
      .from('custom_transaction_categories')
      .insert({ 
        name: newCategoryName.trim(),
        user_id: session.user.id
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error adding category",
        description: error.message,
        variant: "destructive"
      });
      return;
    }

    setCustomCategories([...customCategories, data]);
    setCategory(data.name);
    setIsNewCategoryDialogOpen(false);
    setNewCategoryName("");
    
    toast({
      title: "Success",
      description: "New category added successfully"
    });
  };

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

    const isCustomCategory = !DEFAULT_CATEGORIES.includes(category as DefaultTransactionCategory);

    if (editingTransaction && onEditTransaction) {
      onEditTransaction({
        ...editingTransaction,
        amount: parseFloat(amount),
        type,
        category,
        description,
        date: new Date(date),
        is_custom_category: isCustomCategory
      });
    } else {
      onAddTransaction({
        amount: parseFloat(amount),
        type,
        category,
        description,
        date: new Date(date),
        is_custom_category: isCustomCategory
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
                  $
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
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <div className="flex gap-2">
                <Select 
                  value={category} 
                  onValueChange={setCategory}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Default Categories</SelectLabel>
                      {DEFAULT_CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.split('_').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    
                    {customCategories.length > 0 && (
                      <>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Custom Categories</SelectLabel>
                          {customCategories.map(cat => (
                            <SelectItem key={cat.id} value={cat.name}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </>
                    )}
                  </SelectContent>
                </Select>
                
                <Dialog open={isNewCategoryDialogOpen} onOpenChange={setIsNewCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="newCategory">Category Name</Label>
                        <Input
                          id="newCategory"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Enter category name"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsNewCategoryDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleAddCustomCategory}
                      >
                        Add Category
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
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
