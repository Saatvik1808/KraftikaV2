
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
import { PageLoader } from "@/components/ui/loader";
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
        
        if (isMobile) {
            return (
                <Link 
                    href={href} 
                    className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-medium transition-colors",
                        isActive 
                            ? "bg-primary text-primary-foreground" 
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                    onClick={() => setIsSheetOpen(false)}
                >
                    {children}
                </Link>
            );
        }

        return (
            <Link href={href}>
                {children}
            </Link>
        );
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
            <div className="container flex h-16 max-w-screen-2xl items-center px-4 md:px-6">
                {/* Logo and Desktop Nav */}
                <div className="mr-8 hidden md:flex items-center gap-8">
                     <Link href="/" className="flex items-center space-x-2">
                        <Logo width={60} height={15} className="object-contain" />
                    </Link>
                    <nav className="flex items-center gap-1">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <NavLink key={item.href} href={item.href}>
                                    <div className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        isActive 
                                            ? "bg-primary text-primary-foreground shadow-sm" 
                                            : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                                    )}>
                                        <Icon className="h-4 w-4" />
                                        {item.label}
                                    </div>
                                </NavLink>
                            );
                        })}
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
                    <SheetContent side="left" className="pr-0 bg-white dark:bg-gray-950">
                         <Link href="/" className="flex items-center mb-6" onClick={() => setIsSheetOpen(false)}>
                            <Logo width={60} height={15} className="object-contain" />
                        </Link>
                        <div className="my-4 h-px w-full bg-gray-200 dark:bg-gray-800" />
                        <div className="flex flex-col h-full">
                           <nav className="flex flex-col gap-2">
                               {navItems.map(item => {
                                   const Icon = item.icon;
                                   return (
                                       <NavLink key={item.href} href={item.href} isMobile={true}>
                                           <Icon className="h-5 w-5" />
                                           {item.label}
                                       </NavLink>
                                   );
                               })}
                           </nav>
                           <div className="mt-auto flex flex-col gap-2 pt-4">
                               <div className="my-2 h-px w-full bg-gray-200 dark:bg-gray-800" />
                               <Button 
                                   onClick={handleLogout} 
                                   variant="ghost" 
                                   className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 w-full justify-start text-base font-medium"
                               >
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
                         <Logo width={60} height={15} className="object-contain" />
                    </Link>
                </div>
                
                {/* Right side actions */}
                <div className="flex flex-1 items-center justify-end">
                    <Button 
                        onClick={handleLogout} 
                        variant="ghost" 
                        size="sm"
                        className="hidden md:inline-flex text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
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
    return <PageLoader text="Loading admin panel..." />;
  }

  if (pathname === '/admin/login' || !user) {
    return <>{children}</>;
  }

  return (
      <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-950">
        <AdminNavbar />
        <main className="flex-1 p-6 md:p-8">
            <div className="container max-w-screen-2xl mx-auto">
                 {children}
            </div>
        </main>
      </div>
  );
}

// This is the layout for the /admin route
// Note: We don't include <html> and <body> tags here as they're provided by the root layout
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Add noindex meta tag for admin pages using useEffect to avoid hydration issues
  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      let meta = document.querySelector('meta[name="robots"]') as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'robots';
        document.head.appendChild(meta);
      }
      meta.content = 'noindex, nofollow';
    }
  }, []);

  return (
    <>
      <AdminRootLayout>{children}</AdminRootLayout>
      <Toaster />
    </>
  );
}
