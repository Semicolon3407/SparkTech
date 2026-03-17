"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

const accountLinks = [
  {
    href: "/account",
    label: "Profile",
    icon: User,
  },
  {
    href: "/account/orders",
    label: "My Orders",
    icon: Package,
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    icon: Heart,
  },
  {
    href: "/account/addresses",
    label: "Addresses",
    icon: MapPin,
  },
  {
    href: "/account/payments",
    label: "Payment Methods",
    icon: CreditCard,
  },
  {
    href: "/account/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/account/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="sticky top-24 space-y-4">
        {/* User Info Card */}
        <div className="p-4 rounded-lg border border-border bg-card">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-lg">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{user?.name || "User"}</p>
              <p className="text-sm text-muted-foreground truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {accountLinks.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/account" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="pt-4 border-t border-border">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={logout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
