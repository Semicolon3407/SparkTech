"use client";

import { Breadcrumb } from "@/components/shared/breadcrumb";
import { ChatInterface } from "@/components/support/chat-interface";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Loader2, MessageSquare, ShieldCheck, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function SupportPageContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Customer Support", href: "/support" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl animate-in fade-in duration-700">
      <Breadcrumb items={breadcrumbItems} />
      
      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* Left Side: Info */}
        <div className="lg:w-1/3 space-y-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground mb-2">Live Support</h1>
            <p className="text-muted-foreground font-medium leading-relaxed">
              Connect directly with our specialist team for any questions about products, orders, or technical help.
            </p>
          </div>

          <div className="grid gap-4">
            <Card className="border-none bg-primary/5 shadow-none overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:rotate-12 transition-transform">
                <Zap className="h-12 w-12 text-primary" />
              </div>
              <CardContent className="p-4 relative z-10 flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-lg text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">Verified Agents</h4>
                  <p className="text-xs text-muted-foreground">Expert assistance from SparkTech specialists.</p>
                </div>
              </CardContent>
            </Card>

            {orderId && (
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/10 flex flex-col gap-2 shadow-sm shadow-primary/5">
                <span className="text-[10px] font-black uppercase tracking-wider text-primary">Contextual Support</span>
                <p className="text-sm font-bold text-foreground truncate">Ref: {orderId}</p>
                <p className="text-[11px] text-muted-foreground leading-none">Agents will see your order context automatically.</p>
              </div>
            )}

            <div className="p-4 border border-dashed rounded-xl space-y-2">
                <p className="text-xs font-bold text-muted-foreground flex items-center justify-between">
                    Average Response Time
                    <span className="text-emerald-500 font-black tracking-widest uppercase text-[10px]">Fast</span>
                </p>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-emerald-500 rounded-full animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground text-center">Typically under 5 minutes</p>
            </div>
          </div>
        </div>

        {/* Right Side: Chat */}
        <div className="lg:w-2/3">
          <ChatInterface orderId={orderId || undefined} />
        </div>
      </div>
    </div>
  );
}

export default function SupportPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SupportPageContent />
    </Suspense>
  );
}
