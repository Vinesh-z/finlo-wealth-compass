
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Investment } from "@/types";
import { formatCurrency, formatDate, formatPercent } from "@/utils/format";
import { calculateROI } from "@/utils/calculations";
import { Edit, Trash2 } from "lucide-react";
import { useInvestmentActions } from "@/hooks/useInvestmentActions";
import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface InvestmentListProps {
  investments: Investment[];
  onInvestmentDeleted: (id: string) => void;
  onInvestmentUpdated: (investment: Investment) => void;
}

export function InvestmentList({ investments, onInvestmentDeleted, onInvestmentUpdated }: InvestmentListProps) {
  const { handleDelete, handleEdit, isLoading } = useInvestmentActions();
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Sort by current value (highest first)
  const sortedInvestments = [...investments].sort(
    (a, b) => b.currentValue - a.currentValue
  );

  const onDelete = async (id: string) => {
    const success = await handleDelete(id);
    if (success) {
      onInvestmentDeleted(id);
    }
  };

  const openEditDialog = (investment: Investment) => {
    setSelectedInvestment({...investment});
    setIsEditDialogOpen(true);
  };

  const saveChanges = async () => {
    if (!selectedInvestment) return;

    const result = await handleEdit(selectedInvestment.id, {
      name: selectedInvestment.name,
      type: selectedInvestment.type,
      initialValue: selectedInvestment.initialValue,
      currentValue: selectedInvestment.currentValue,
      purchaseDate: selectedInvestment.purchaseDate,
      notes: selectedInvestment.notes
    });

    if (result) {
      onInvestmentUpdated(selectedInvestment);
      setIsEditDialogOpen(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Investments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead className="text-right">Initial Value</TableHead>
                <TableHead className="text-right">Current Value</TableHead>
                <TableHead className="text-right">Gain/Loss</TableHead>
                <TableHead className="text-right">ROI</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedInvestments.length > 0 ? (
                sortedInvestments.map((investment) => {
                  const roi = calculateROI(investment);
                  const gainLoss = investment.currentValue - investment.initialValue;
                  const isProfit = gainLoss >= 0;

                  return (
                    <TableRow key={investment.id}>
                      <TableCell className="font-medium">{investment.name}</TableCell>
                      <TableCell className="capitalize">
                        {investment.type.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </TableCell>
                      <TableCell>{formatDate(new Date(investment.purchaseDate))}</TableCell>
                      <TableCell className="text-right">{formatCurrency(investment.initialValue)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(investment.currentValue)}</TableCell>
                      <TableCell 
                        className={`text-right font-medium ${
                          isProfit ? "text-income" : "text-expense"
                        }`}
                      >
                        {isProfit ? "+" : ""}
                        {formatCurrency(gainLoss)}
                      </TableCell>
                      <TableCell 
                        className={`text-right font-medium ${
                          isProfit ? "text-income" : "text-expense"
                        }`}
                      >
                        {formatPercent(roi)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(investment)}
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Investment</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete this investment? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => onDelete(investment.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No investments found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Investment</DialogTitle>
              <DialogDescription>
                Make changes to your investment details below.
              </DialogDescription>
            </DialogHeader>
            {selectedInvestment && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={selectedInvestment.name}
                    onChange={(e) => setSelectedInvestment({
                      ...selectedInvestment,
                      name: e.target.value
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={selectedInvestment.type}
                    onValueChange={(value) => setSelectedInvestment({
                      ...selectedInvestment,
                      type: value as Investment['type']
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stocks">Stocks</SelectItem>
                      <SelectItem value="mutual_funds">Mutual Funds</SelectItem>
                      <SelectItem value="real_estate">Real Estate</SelectItem>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="bonds">Bonds</SelectItem>
                      <SelectItem value="etf">ETF</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="initialValue">Initial Value</Label>
                  <Input
                    id="initialValue"
                    type="number"
                    value={selectedInvestment.initialValue}
                    onChange={(e) => setSelectedInvestment({
                      ...selectedInvestment,
                      initialValue: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current Value</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    value={selectedInvestment.currentValue}
                    onChange={(e) => setSelectedInvestment({
                      ...selectedInvestment,
                      currentValue: parseFloat(e.target.value)
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedInvestment.purchaseDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedInvestment.purchaseDate ? (
                          format(new Date(selectedInvestment.purchaseDate), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={new Date(selectedInvestment.purchaseDate)}
                        onSelect={(date) => date && setSelectedInvestment({
                          ...selectedInvestment,
                          purchaseDate: date
                        })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={selectedInvestment.notes || ''}
                    onChange={(e) => setSelectedInvestment({
                      ...selectedInvestment,
                      notes: e.target.value
                    })}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveChanges} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
