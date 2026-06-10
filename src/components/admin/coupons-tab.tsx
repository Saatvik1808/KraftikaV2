"use client";

import * as React from "react";
import { TicketPercent, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { getCoupons, createCoupon, updateCoupon, deleteCoupon, type Coupon } from "@/services/commerce-api";

export function CouponsTab() {
  const { toast } = useToast();
  const [coupons, setCoupons] = React.useState<Coupon[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [form, setForm] = React.useState({
    code: "", type: "PERCENT" as "PERCENT" | "FIXED", value: "", minOrderAmount: "", maxUses: "", expiresAt: "",
  });

  const reload = React.useCallback(() => {
    getCoupons().then(setCoupons).catch((e) =>
      toast({ title: "Failed to load coupons", description: e.message, variant: "destructive" }),
    ).finally(() => setLoading(false));
  }, [toast]);
  React.useEffect(reload, [reload]);

  const save = async () => {
    if (!form.code.trim() || !Number(form.value)) {
      toast({ title: "Code and value are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      await createCoupon({
        code: form.code,
        type: form.type,
        value: Number(form.value),
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      });
      setDialogOpen(false);
      setForm({ code: "", type: "PERCENT", value: "", minOrderAmount: "", maxUses: "", expiresAt: "" });
      reload();
      toast({ title: "Coupon created" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (c: Coupon) => {
    try {
      await updateCoupon(c.id, { isActive: !c.isActive });
      reload();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const remove = async (c: Coupon) => {
    try {
      await deleteCoupon(c.id);
      reload();
      toast({ title: "Coupon deleted" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Card className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <CardHeader className="border-b border-gray-200 dark:border-gray-800 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <TicketPercent className="h-5 w-5" /> Coupons
          </CardTitle>
          <CardDescription>Discount codes for checkout</CardDescription>
        </div>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" /> New coupon
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="py-12 flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>
        ) : coupons.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No coupons yet. Create one to boost conversions.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Min order</TableHead>
                  <TableHead>Used</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono font-semibold">{c.code}</TableCell>
                    <TableCell>{c.type === "PERCENT" ? `${c.value}%` : `₹${c.value}`}</TableCell>
                    <TableCell>{c.minOrderAmount != null ? `₹${c.minOrderAmount}` : "—"}</TableCell>
                    <TableCell>
                      {c.usedCount}{c.maxUses != null ? ` / ${c.maxUses}` : ""}
                    </TableCell>
                    <TableCell>
                      {c.expiresAt
                        ? new Date(c.expiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                        : "Never"}
                    </TableCell>
                    <TableCell>
                      <Switch checked={c.isActive} onCheckedChange={() => toggle(c)} />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => remove(c)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>New coupon</DialogTitle></DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Code *</Label>
                <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="WELCOME10" />
              </div>
              <div className="space-y-1.5">
                <Label>Type</Label>
                <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as "PERCENT" | "FIXED" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENT">Percent (%)</SelectItem>
                    <SelectItem value="FIXED">Fixed (₹)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>{form.type === "PERCENT" ? "Percent off *" : "Amount off (₹) *"}</Label>
                <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder={form.type === "PERCENT" ? "10" : "100"} />
              </div>
              <div className="space-y-1.5">
                <Label>Min order (₹)</Label>
                <Input type="number" value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder="499" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Max uses</Label>
                <Input type="number" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} placeholder="∞" />
              </div>
              <div className="space-y-1.5">
                <Label>Expires</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
