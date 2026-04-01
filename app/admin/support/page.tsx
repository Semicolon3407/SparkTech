"use client";

import { AdminHeader } from "@/components/admin/admin-header";
import { ChatInterface } from "@/components/support/chat-interface";
import { MessageSquare, Users, History, AlertCircle, ShieldCheck, Zap, Clock, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function AdminSupportPage() {
  const { data: statsData, isLoading: statsLoading } = useSWR("/api/admin/support/stats", fetcher, {
    refreshInterval: 10000 // Poll every 10 seconds for real-time feel
  });

  const stats = statsData?.data || {
    activeCustomers: 0,
    dailyQueries: 0,
    newNow: 0,
    resolutionRate: 0
  };

  return (
    <div className="flex flex-col h-full bg-muted/5 animate-in fade-in duration-700">
      <AdminHeader
        title="Customer Support"
        description="Unified helpdesk for real-time customer assistance."
      />

      <div className="p-6 space-y-6">
        {/* Top Summary Stats */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center transition-colors group-hover:bg-emerald-500 group-hover:text-white">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Active Customers</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tight text-foreground">
                    {statsLoading ? "..." : stats.activeCustomers}
                  </p>
                  <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded-md">
                    +{stats.newNow} now
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white overflow-hidden group">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center transition-colors group-hover:bg-blue-500 group-hover:text-white">
                <History className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mb-0.5">Daily Queries</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black tracking-tight text-foreground">
                    {statsLoading ? "..." : stats.dailyQueries}
                  </p>
                  <span className="text-[10px] text-blue-500 font-bold bg-blue-500/10 px-1.5 py-0.5 rounded-md">
                    {stats.resolutionRate}% resolved
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Quick Support Tips Summary */}
          <Card className="lg:col-span-2 border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10 rotate-12">
               <AlertCircle className="h-24 w-24" />
            </div>
            <CardContent className="p-5 relative z-10 flex flex-col justify-center h-full">
              <h4 className="font-black text-sm uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Helpdesk Active
              </h4>
              <p className="text-xs text-primary-foreground/80 font-medium max-w-[280px]">
                Always maintain a professional tone and ensure customers receive clear, accurate tracking information.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Workspace Area */}
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left: Enhanced Guidelines */}
          <div className="lg:col-span-4 h-full">
            <Card className="h-full border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b pb-4 bg-muted/20">
                <CardTitle className="text-sm font-black flex items-center gap-2 uppercase tracking-tighter">
                  <Zap className="h-4 w-4 text-primary" />
                  Performance Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                 <div className="space-y-4">
                   <div className="flex gap-4">
                     <span className="h-8 w-8 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-xs shrink-0">01</span>
                     <div>
                       <p className="font-bold text-sm">Active Listening</p>
                       <p className="text-xs text-muted-foreground leading-relaxed">Prioritize unread messages and resolve issues before they escalate.</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <span className="h-8 w-8 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-xs shrink-0">02</span>
                     <div>
                       <p className="font-bold text-sm">Order Context</p>
                       <p className="text-xs text-muted-foreground leading-relaxed">Reference the Order ID provided by users for faster resolutions.</p>
                     </div>
                   </div>
                   <div className="flex gap-4">
                     <span className="h-8 w-8 rounded-full bg-primary/10 text-primary font-black flex items-center justify-center text-xs shrink-0">03</span>
                     <div>
                       <p className="font-bold text-sm">Team Collaboration</p>
                       <p className="text-xs text-muted-foreground leading-relaxed">Consult with superadmins if complex technical issues arise.</p>
                     </div>
                   </div>
                 </div>
                 
                 <div className="pt-6 border-t">
                    <div className="bg-muted p-4 rounded-xl flex items-center justify-between">
                       <div>
                          <p className="text-[10px] uppercase font-black text-muted-foreground">Response Goal</p>
                          <p className="font-bold text-xs">&lt; 5 Minutes</p>
                       </div>
                       <div className="h-8 w-8 bg-white rounded-full flex items-center justify-center shadow-sm">
                          <Clock className="h-4 w-4 text-emerald-500" />
                       </div>
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Main Chat Interface */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-border/40">
              <ChatInterface isAdmin={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
