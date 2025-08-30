
"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { LogOut, ShoppingBag, LayoutDashboard, Tags, PanelLeft } from "lucide-react";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import "../globals.css"; // Import globals.css for admin pages
import { Toaster } from "@/components/ui/toaster"; // Import Toaster for admin pages
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils";


function AdminNavbar() {
    const pathname = usePathname();
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = React.useState(false);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/admin/login");
    };

    const navItems = [
        { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: ShoppingBag },
        { href: "/admin/categories", label: "Categories", icon: Tags },
    ];

    const NavLink = ({ href, children, isMobile = false }: { href: string, children: React.ReactNode, isMobile?: boolean }) => {
        const isActive = pathname.startsWith(href);
        const linkClass = cn(
            "transition-colors hover:text-primary",
            isActive ? "text-primary font-semibold" : "text-muted-foreground",
            isMobile ? "text-lg w-full justify-start" : "text-sm"
        );

        return (
            <Link href={href} className={linkClass} onClick={() => isMobile && setIsSheetOpen(false)}>
                {children}
            </Link>
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                {/* Logo and Desktop Nav */}
                <div className="mr-4 hidden md:flex">
                     <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Logo width={120} height={30} />
                    </Link>
                    <nav className="flex items-center gap-6 text-sm">
                        {navItems.map(item => (
                            <NavLink key={item.href} href={item.href}>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Mobile Nav */}
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                            aria-label="Toggle Menu"
                        >
                            <PanelLeft className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="pr-0">
                         <Link href="/" className="flex items-center" onClick={() => setIsSheetOpen(false)}>
                            <Logo width={120} height={30} />
                        </Link>
                        <div className="my-4 h-px w-full bg-border" />
                        <div className="flex flex-col h-full">
                           <nav className="flex flex-col gap-4">
                               {navItems.map(item => (
                                   <NavLink key={item.href} href={item.href} isMobile={true}>
                                       <item.icon className="mr-2 h-5 w-5" />
                                       {item.label}
                                   </NavLink>
                               ))}
                           </nav>
                           <div className="mt-auto flex flex-col gap-2">
                               <div className="my-2 h-px w-full bg-border" />
                               <Button onClick={handleLogout} variant="ghost" className="text-muted-foreground w-full justify-start text-lg">
                                   <LogOut className="mr-2 h-5 w-5" />
                                   Logout
                               </Button>
                           </div>
                        </div>
                    </SheetContent>
                </Sheet>

                {/* Mobile Logo (center) */}
                 <div className="flex flex-1 items-center justify-center md:hidden">
                    <Link href="/" className="flex items-center">
                         <Logo width={120} height={30} />
                    </Link>
                </div>
                
                {/* Right side actions */}
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <Button onClick={handleLogout} variant="ghost" className="hidden md:inline-flex">
                        <LogOut className="mr-2 h-4 w-4"/>
                        Logout
                    </Button>
                </div>
            </div>
        </header>
    );
}

function AdminRootLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        if (pathname === '/admin/login') {
          router.push("/admin/dashboard");
        }
      } else {
        if (pathname !== '/admin/login') {
          router.push("/admin/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login' || !user) {
    return <>{children}</>;
  }

  return (
      <div className="flex min-h-screen flex-col bg-background">
        <AdminNavbar />
        <main className="flex-1 p-6 md:p-8">
            <div className="container max-w-screen-2xl mx-auto">
                 {children}
            </div>
        </main>
      </div>
  );
}

// This is the new root layout for the /admin route
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AdminRootLayout>{children}</AdminRootLayout>
        <Toaster />
      </body>
    </html>
  );
}
