"use client";

import * as React from "react";
import { Undo2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getReturns, updateReturnStatus, type ReturnRequest } from "@/services/commerce-api";

const badgeCls: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  REFUNDED: "bg-green-100 text-green-800",
};

export function ReturnsTab() {
  const { toast } = useToast();
  const [returns, setReturns] = React.useState<ReturnRequest[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [updatingId, setUpdatingId] = React.useState<string | null>(null);

  const reload = React.useCallback(() => {
    getReturns().then(setReturns).catch((e) =>
      toast({ title: "Failed to load returns", description: e.message, variant: "destructive" }),
    ).finally(() => setLoading(false));
  }, [toast]);
  React.useEffect(reload, [reload]);

  const setStatus = async (r: ReturnRequest, status: string) => {
    if (status === r.status) return;
    setUpdatingId(r.id);
    try {
      await updateReturnStatus(r.id, { status });
      reload();
      toast({
        title: `Return ${status.toLowerCase()}`,
        description: status === "REFUNDED" ? "Items restocked; remember to process the refund in Razorpay/bank." : undefined,
      });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800">
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Undo2 className="h-5 w-5" /> Return Requests
        </CardTitle>
        <CardDescription>Approve, reject, or refund customer returns (refund restocks items)</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : returns.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No return requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Order total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {returns.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-mono text-xs">{r.orderId.slice(0, 8)}…</TableCell>
                    <TableCell>
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </TableCell>
                    <TableCell className="max-w-[280px]"><span className="line-clamp-2 text-sm">{r.reason}</span></TableCell>
                    <TableCell>{r.orderTotal != null ? `₹${r.orderTotal.toFixed(2)}` : "—"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge className={badgeCls[r.status] ?? ""} variant="outline">{r.status}</Badge>
                        <Select value={r.status} onValueChange={(v) => setStatus(r, v)} disabled={updatingId === r.id}>
                          <SelectTrigger className="w-[130px] h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="APPROVED">Approve</SelectItem>
                            <SelectItem value="REJECTED">Reject</SelectItem>
                            <SelectItem value="REFUNDED">Refund + restock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
