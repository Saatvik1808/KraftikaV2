"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User as UserIcon,
  Package,
  Heart,
  ShoppingBag,
  LogOut,
  Loader2,
  Pencil,
  Check,
  X,
  Truck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { getAllOrders } from "@/services/orders-api";
import { AddressBook } from "@/components/account/address-book";
import { PageLoader } from "@/components/ui/loader";
import type { Order, OrderStatus } from "@/types/order";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "/api/backend" : "http://localhost:9002/api/backend");

const statusBadge: Record<OrderStatus, { label: string; cls: string; icon: React.ReactNode }> = {
  PENDING: { label: "Pending", cls: "bg-yellow-100 text-yellow-800", icon: <Package className="h-3.5 w-3.5" /> },
  CONFIRMED: { label: "Confirmed", cls: "bg-blue-100 text-blue-800", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  SHIPPED: { label: "Shipped", cls: "bg-purple-100 text-purple-800", icon: <Truck className="h-3.5 w-3.5" /> },
  DELIVERED: { label: "Delivered", cls: "bg-green-100 text-green-800", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-800", icon: <XCircle className="h-3.5 w-3.5" /> },
};

export default function AccountPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [editing, setEditing] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [phone, setPhone] = React.useState("");

  React.useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push("/login?redirect=/account");
      return;
    }
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
    setPhone(user?.phone ?? "");

    getAllOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated, router, user]);

  const saveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ firstName, lastName, phone }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to update profile");
      }
      // Keep the locally cached user in sync.
      if (typeof window !== "undefined") {
        const cached = localStorage.getItem("kraftikaUser");
        if (cached) {
          const u = JSON.parse(cached);
          localStorage.setItem(
            "kraftikaUser",
            JSON.stringify({ ...u, firstName, lastName, phone }),
          );
        }
      }
      toast({ title: "Profile updated" });
      setEditing(false);
    } catch (e: any) {
      toast({ title: "Update failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) return <PageLoader text="Loading your account..." />;
  if (!isAuthenticated) return null;

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.email || "Kraftika Customer";
  const initials = (user?.firstName?.[0] ?? user?.email?.[0] ?? "K").toUpperCase();
  const recentOrders = orders.slice(0, 5);
  const activeCount = orders.filter((o) => ["PENDING", "CONFIRMED", "SHIPPED"].includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === "DELIVERED").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto max-w-5xl px-4 py-12"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-10">
        <Avatar className="h-16 w-16 border-2 border-primary shadow-candle-glow">
          {user?.profileImageUrl && <AvatarImage src={user.profileImageUrl} alt={displayName} />}
          <AvatarFallback className="bg-primary text-primary-foreground text-xl">{initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{displayName}</h1>
          <p className="text-muted-foreground">{user?.email ?? user?.phone}</p>
        </div>
        <Button variant="outline" onClick={() => { logout(); router.push("/"); }}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total orders", value: orders.length, icon: ShoppingBag },
          { label: "In progress", value: activeCount, icon: Truck },
          { label: "Delivered", value: deliveredCount, icon: CheckCircle2 },
        ].map((s) => (
          <Card key={s.label} className="glassmorphism candle-card">
            <CardContent className="pt-6 text-center">
              <s.icon className="h-5 w-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile card */}
        <Card className="glassmorphism md:col-span-1 h-fit">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <UserIcon className="h-5 w-5" /> Profile
            </CardTitle>
            {!editing ? (
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={saveProfile} disabled={saving}>
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 text-green-600" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)} disabled={saving}>
                  <X className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {editing ? (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="fn">First name</Label>
                  <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ln">Last name</Label>
                  <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ph">Phone</Label>
                  <Input id="ph" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91..." />
                </div>
              </>
            ) : (
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="text-muted-foreground">Name</dt>
                  <dd className="font-medium">{displayName}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Email</dt>
                  <dd className="font-medium">{user?.email ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Phone</dt>
                  <dd className="font-medium">{user?.phone ?? "—"}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Sign-in method</dt>
                  <dd className="font-medium capitalize">{user?.authProvider?.toLowerCase()}</dd>
                </div>
              </dl>
            )}

            <div className="pt-2 space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/wishlist"><Heart className="mr-2 h-4 w-4" /> Wishlist</Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/cart"><ShoppingBag className="mr-2 h-4 w-4" /> Cart</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent orders */}
        <Card className="glassmorphism md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package className="h-5 w-5" /> Recent Orders
              </CardTitle>
              <CardDescription>Your latest purchases and their delivery status</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/orders">View all</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <div className="text-center py-10">
                <Package className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No orders yet</p>
                <Button asChild>
                  <Link href="/products">Start shopping</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => {
                  const badge = statusBadge[order.status];
                  return (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card/60 p-4 hover:border-primary/50 hover:shadow-candle-card transition-all"
                    >
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          #{order.id.slice(0, 8)} ·{" "}
                          {order.orderItems.map((i) => i.productName).join(", ")}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}{" "}
                          · ₹{Number(order.totalAmount).toFixed(2)}
                        </p>
                        {order.trackingNumber && order.status === "SHIPPED" && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {order.courierName ? `${order.courierName} · ` : ""}
                            {order.trackingNumber}
                          </p>
                        )}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${badge.cls}`}
                      >
                        {badge.icon} {badge.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Address book */}
      <div className="mt-6">
        <AddressBook />
      </div>
    </motion.div>
  );
}
