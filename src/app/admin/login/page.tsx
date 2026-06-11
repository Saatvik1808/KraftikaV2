"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Loader2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { login, user, isAuthenticated } = useAuth();

  // If already logged in as admin, skip the form.
  React.useEffect(() => {
    if (isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin/dashboard");
    }
  }, [isAuthenticated, user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Uses the same backend email/password flow as the customer login.
      await login(email, password);
      // login() throws on failure; the role check happens via context.
      // We can't see the new role until the next render; redirect optimistically
      // and let /admin/dashboard middleware enforce.
      router.replace("/admin/dashboard");
    } catch (error) {
      toast({
        title: "Login failed",
        description: (error as Error).message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 bg-gradient-to-br from-background via-secondary/20 to-accent/15">
      <Card className="mx-auto max-w-sm w-full glassmorphism border-border/60 shadow-candle-card">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <Logo width={120} height={32} />
          </div>
          <div className="flex justify-center mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-secondary/50 rounded-full px-3 py-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Staff access
            </span>
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Sign in with your Kraftika admin account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@kraftika"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md"
              disabled={isLoading}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign in
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
