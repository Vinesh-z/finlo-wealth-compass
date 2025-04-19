
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Insurance } from "@/types";
import { formatCurrency, formatDate } from "@/utils/format";
import { FileText } from "lucide-react";

interface InsuranceListProps {
  insurances: Insurance[];
}

export function InsuranceList({ insurances }: InsuranceListProps) {
  // Calculate days until expiry
  const daysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Format premium frequency
  const formatFrequency = (frequency?: string) => {
    if (!frequency) return "-";
    return frequency.charAt(0).toUpperCase() + frequency.slice(1);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Insurance Policies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Policy Name</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Expiry</TableHead>
                <TableHead className="text-right">Premium</TableHead>
                <TableHead>Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {insurances.length > 0 ? (
                insurances.map((insurance) => {
                  const days = daysUntilExpiry(insurance.expiryDate);
                  let expiryStatus;
                  
                  if (days === null) {
                    expiryStatus = <span className="text-muted-foreground">No expiry</span>;
                  } else if (days < 0) {
                    expiryStatus = (
                      <Badge variant="destructive">Expired</Badge>
                    );
                  } else if (days < 30) {
                    expiryStatus = (
                      <Badge variant="destructive">
                        {days} days left
                      </Badge>
                    );
                  } else if (days < 90) {
                    expiryStatus = (
                      <Badge variant="warning">
                        {days} days left
                      </Badge>
                    );
                  } else {
                    expiryStatus = (
                      <span className="text-muted-foreground">
                        {insurance.expiryDate ? formatDate(insurance.expiryDate) : "-"}
                      </span>
                    );
                  }
                  
                  return (
                    <TableRow key={insurance.id}>
                      <TableCell className="font-medium">{insurance.name}</TableCell>
                      <TableCell>{insurance.provider}</TableCell>
                      <TableCell>{insurance.type}</TableCell>
                      <TableCell>{formatDate(insurance.startDate)}</TableCell>
                      <TableCell>{expiryStatus}</TableCell>
                      <TableCell className="text-right">
                        {insurance.premiumAmount 
                          ? `${formatCurrency(insurance.premiumAmount)} ${formatFrequency(insurance.premiumFrequency)}` 
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled>
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">View document</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No insurance policies found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 text-sm text-muted-foreground">
          <p className="italic">
            * Document upload functionality coming soon. You will be able to upload and store your insurance cards and policy documents securely.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
