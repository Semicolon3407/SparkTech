"use client";

import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title: string;
  description?: string;
}

export function AdminHeader({ title, description }: AdminHeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
      {/* Page Title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground hidden sm:block">
            {description}
          </p>
        )}
      </div>

      {/* Search */}
      <div className="hidden md:flex relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." className="pl-10 w-64" />
      </div>

      {/* Notifications */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              3
            </Badge>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>Notifications</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
            <p className="font-medium text-sm">New order received</p>
            <p className="text-xs text-muted-foreground">Order #ORD-2024-089 - Rs. 45,000</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
            <p className="font-medium text-sm">Low stock alert</p>
            <p className="text-xs text-muted-foreground">iPhone 15 Pro - Only 3 left</p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex flex-col items-start gap-1 cursor-pointer">
            <p className="font-medium text-sm">New customer registered</p>
            <p className="text-xs text-muted-foreground">john@example.com joined</p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-primary justify-center">
            View all notifications
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium">
              {user?.name?.charAt(0) || "A"}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">{user?.name || "Admin"}</p>
                {user?.role && (
                  <Badge variant="outline" className={cn(
                    "text-[10px] px-1 py-0 h-4 uppercase",
                    user.role === 'superadmin' ? "border-primary text-primary" : "text-muted-foreground"
                  )}>
                    {user.role}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {user?.email || "admin@example.com"}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/">View Store</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive">
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
