"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  FolderOpen,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { APP_NAME } from "@/lib/constants";

const adminLinks = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/products",
    label: "Products",
    icon: Package,
  },
  {
    href: "/admin/categories",
    label: "Categories",
    icon: FolderOpen,
  },
  {
    href: "/admin/orders",
    label: "Orders",
    icon: ShoppingCart,
  },
  {
    href: "/admin/customers",
    label: "Customers",
    icon: Users,
  },
  {
    href: "/admin/analytics",
    label: "Analytics",
    icon: BarChart3,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setCollapsed(!collapsed)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-card border-r border-border transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          "max-lg:translate-x-0 max-lg:shadow-xl",
          collapsed && "max-lg:-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-border">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt={APP_NAME}
              width={32}
              height={32}
              className="h-8 w-8"
            />
            {!collapsed && (
              <span className="font-bold text-lg">{APP_NAME}</span>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft
              className={cn(
                "h-4 w-4 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {adminLinks.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/admin" && pathname.startsWith(link.href));

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted",
                      collapsed && "justify-center px-2"
                    )}
                    title={collapsed ? link.label : undefined}
                  >
                    <link.icon className="h-5 w-5 shrink-0" />
                    {!collapsed && <span>{link.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Actions */}
        <div className="border-t border-border p-4">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              collapsed && "justify-center px-2"
            )}
            title={collapsed ? "Back to Store" : undefined}
          >
            <LogOut className="h-5 w-5 shrink-0" />
            {!collapsed && <span>Back to Store</span>}
          </Link>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}
    </>
  );
}
