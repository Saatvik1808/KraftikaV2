"use client";

import * as React from "react";
import { MapPin, Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  getAddresses, createAddress, updateAddress, deleteAddress,
  type SavedAddress,
} from "@/services/commerce-api";

const empty = { label: "", fullName: "", phone: "", street: "", city: "", state: "", zipCode: "", country: "India" };

export function AddressBook() {
  const { toast } = useToast();
  const [addresses, setAddresses] = React.useState<SavedAddress[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<SavedAddress | null>(null);
  const [form, setForm] = React.useState(empty);
  const [saving, setSaving] = React.useState(false);

  const reload = React.useCallback(() => {
    getAddresses().then(setAddresses).catch(() => {}).finally(() => setLoading(false));
  }, []);
  React.useEffect(reload, [reload]);

  const openNew = () => { setEditing(null); setForm(empty); setDialogOpen(true); };
  const openEdit = (a: SavedAddress) => {
    setEditing(a);
    setForm({
      label: a.label ?? "", fullName: a.fullName ?? "", phone: a.phone ?? "",
      street: a.street, city: a.city, state: a.state, zipCode: a.zipCode, country: a.country,
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.street || !form.city || !form.state || !form.zipCode) {
      toast({ title: "Missing fields", description: "Street, city, state and PIN code are required.", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing) await updateAddress(editing.id, form);
      else await createAddress(form);
      setDialogOpen(false);
      reload();
      toast({ title: editing ? "Address updated" : "Address added" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (a: SavedAddress) => {
    try {
      await deleteAddress(a.id);
      reload();
      toast({ title: "Address deleted" });
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  const makeDefault = async (a: SavedAddress) => {
    try {
      await updateAddress(a.id, { isDefault: true });
      reload();
    } catch (e: any) {
      toast({ title: "Failed", description: e.message, variant: "destructive" });
    }
  };

  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" /> Saved Addresses
          </CardTitle>
          <CardDescription>Used at checkout so you never retype them</CardDescription>
        </div>
        <Button size="sm" onClick={openNew}>
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
        ) : addresses.length === 0 ? (
          <p className="text-muted-foreground text-sm py-4 text-center">No saved addresses yet.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {addresses.map((a) => (
              <div key={a.id} className="rounded-lg border border-border bg-card/60 p-4 relative">
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium text-sm">
                    {a.label || "Address"}{" "}
                    {a.isDefault && (
                      <span className="inline-flex items-center gap-0.5 text-xs text-primary-foreground bg-primary rounded-full px-2 py-0.5 ml-1">
                        <Star className="h-3 w-3" /> Default
                      </span>
                    )}
                  </p>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEdit(a)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => remove(a)}>
                      <Trash2 className="h-3.5 w-3.5 text-red-500" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {a.fullName && <>{a.fullName}<br /></>}
                  {a.street}<br />
                  {a.city}, {a.state} {a.zipCode}<br />
                  {a.country}
                  {a.phone && <><br />{a.phone}</>}
                </p>
                {!a.isDefault && (
                  <Button variant="link" size="sm" className="px-0 h-6 text-xs" onClick={() => makeDefault(a)}>
                    Set as default
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit address" : "Add address"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Label</Label>
                <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="Home / Work" />
              </div>
              <div className="space-y-1.5">
                <Label>Full name</Label>
                <Input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Street *</Label>
              <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>City *</Label>
                <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>State *</Label>
                <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>PIN code *</Label>
                <Input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label>Phone</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91..." />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>Cancel</Button>
            <Button onClick={save} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editing ? "Save changes" : "Add address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
