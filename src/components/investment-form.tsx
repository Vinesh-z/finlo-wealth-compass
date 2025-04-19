
import { useState } from "react";
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
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { InvestmentType } from "@/types";

interface InvestmentFormProps {
  onAddInvestment: (investment: {
    name: string;
    type: InvestmentType;
    initialValue: number;
    currentValue: number;
    purchaseDate: Date;
    notes: string;
  }) => void;
}

export function InvestmentForm({ onAddInvestment }: InvestmentFormProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<InvestmentType>("stocks");
  const [initialValue, setInitialValue] = useState("");
  const [currentValue, setCurrentValue] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState("");

  const investmentTypes: InvestmentType[] = [
    "stocks", "mutual_funds", "real_estate", "crypto", "bonds", "etf", "other"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      alert("Please enter an asset name");
      return;
    }

    if (!initialValue || parseFloat(initialValue) <= 0) {
      alert("Please enter a valid initial value");
      return;
    }

    const parsedCurrentValue = currentValue 
      ? parseFloat(currentValue) 
      : parseFloat(initialValue);

    onAddInvestment({
      name,
      type,
      initialValue: parseFloat(initialValue),
      currentValue: parsedCurrentValue,
      purchaseDate: new Date(purchaseDate),
      notes,
    });

    // Reset form
    setName("");
    setType("stocks");
    setInitialValue("");
    setCurrentValue("");
    setPurchaseDate(new Date().toISOString().slice(0, 10));
    setNotes("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Investment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Asset Name</Label>
            <Input
              id="name"
              placeholder="e.g., Apple Inc., Real Estate Property"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Investment Type</Label>
              <Select 
                value={type} 
                onValueChange={(value) => setType(value as InvestmentType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {investmentTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="initialValue">Initial Value</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="initialValue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-7"
                  value={initialValue}
                  onChange={(e) => setInitialValue(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value (Optional)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="currentValue"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Same as initial value"
                  className="pl-7"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional details about this investment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full">
            Add Investment
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
