"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AccountSidebar } from "@/components/account/account-sidebar";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login?redirect=/account");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "My Account", href: "/account" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      <div className="flex flex-col lg:flex-row gap-8">
        <AccountSidebar />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
