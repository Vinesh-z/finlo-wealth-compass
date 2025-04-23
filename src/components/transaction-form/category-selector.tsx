
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomCategories } from "@/hooks/use-custom-categories";
import { DefaultTransactionCategory } from "@/types";

const DEFAULT_CATEGORIES: DefaultTransactionCategory[] = [
  'food', 'social_life', 'pets', 'transport', 'household', 
  'apparel', 'beauty', 'health', 'education', 'gift', 
  'investment', 'subscription', 'baby', 'other'
];

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  const [isNewCategoryDialogOpen, setIsNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const { customCategories, addCustomCategory } = useCustomCategories();

  const handleAddCustomCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name cannot be empty",
        variant: "destructive"
      });
      return;
    }

    const newCategory = await addCustomCategory(newCategoryName);
    if (newCategory) {
      onChange(newCategory.name);
      setIsNewCategoryDialogOpen(false);
      setNewCategoryName("");
      toast({
        title: "Success",
        description: "New category added successfully"
      });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="category">Category</Label>
      <div className="flex gap-2">
        <Select value={value} onValueChange={onChange}>
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
  );
}
