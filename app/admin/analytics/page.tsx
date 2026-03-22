"use client";

import { useState } from "react";
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils/format";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from "recharts";

const MONTHS = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

// Seeded mock data generator for month-based logic
const getMonthData = (monthIndex: number) => {
  const seed = monthIndex + 1;
  return [
    { day: "Mon", revenue: 40000 + (seed * 1000), orders: 12 + seed },
    { day: "Tue", revenue: 48000 + (seed * 800), orders: 15 + seed },
    { day: "Wed", revenue: 35000 + (seed * 1200), orders: 10 + seed },
    { day: "Thu", revenue: 62000 + (seed * 500), orders: 22 + seed },
    { day: "Fri", revenue: 55000 + (seed * 1500), orders: 18 + seed },
    { day: "Sat", revenue: 78000 + (seed * 2000), orders: 30 + seed },
    { day: "Sun", revenue: 70000 + (seed * 1800), orders: 25 + seed },
  ];
};

export default function AdminAnalyticsPage() {
  const currentMonthIdx = new Date().getMonth();
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[currentMonthIdx]);
  const [isLoading, setIsLoading] = useState(false);

  const performanceData = getMonthData(MONTHS.indexOf(selectedMonth));
  
  const totalMonthlyRevenue = performanceData.reduce((acc, curr) => acc + curr.revenue, 0) * 4; // Mock estimate for full month
  const totalMonthlyOrders = performanceData.reduce((acc, curr) => acc + curr.orders, 0) * 4;

  const handleMonthChange = async (val: string) => {
    setIsLoading(true);
    setSelectedMonth(val);
    await new Promise(r => setTimeout(r, 600)); // Simulated loading
    setIsLoading(false);
  };

  const trafficSource = [
    { name: "Direct", value: 400, color: "#0088FE" },
    { name: "Social", value: 300, color: "#00C49F" },
    { name: "Search", value: 300, color: "#FFBB28" },
    { name: "Email", value: 200, color: "#FF8042" },
  ];

  return (
    <>
      <AdminHeader
        title="Analytics & Reports"
        description="Deep dive into your store's sales and traffic data"
      />

      <div className="p-6 max-w-[1400px] mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Sales Performance
           </h2>
           <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground hidden md:block">Filter by:</span>
              <Select value={selectedMonth} onValueChange={handleMonthChange}>
                 <SelectTrigger className="w-[180px] bg-card">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder="Select Month" />
                 </SelectTrigger>
                 <SelectContent>
                    {MONTHS.map(m => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                 </SelectContent>
              </Select>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                 <Download className="h-4 w-4 mr-2" /> Export
              </Button>
           </div>
        </div>

        {isLoading ? (
          <div className="h-[600px] flex items-center justify-center">
             <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="bg-primary border-0 text-primary-foreground shadow-xl">
                 <CardHeader className="pb-2">
                    <CardDescription className="text-primary-foreground/70">Estimated Revenue ({selectedMonth})</CardDescription>
                    <CardTitle className="text-3xl font-bold">{formatPrice(totalMonthlyRevenue)}</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-center gap-1.5 text-sm font-medium">
                       <TrendingUp className="h-4 w-4" />
                       +12.5% from previous month
                    </div>
                 </CardContent>
              </Card>

              <Card className="border border-border">
                 <CardHeader className="pb-2">
                    <CardDescription>Average Order Value</CardDescription>
                    <CardTitle className="text-3xl font-bold">{formatPrice(Math.round(totalMonthlyRevenue / totalMonthlyOrders))}</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-500">
                       <TrendingUp className="h-4 w-4" />
                       +4.2% stable
                    </div>
                 </CardContent>
              </Card>

              <Card className="border border-border">
                 <CardHeader className="pb-2">
                    <CardDescription>Total Orders ({selectedMonth})</CardDescription>
                    <CardTitle className="text-3xl font-bold">{totalMonthlyOrders.toLocaleString()}</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                       <TrendingDown className="h-4 w-4" />
                       -2.1% slightly lower
                    </div>
                 </CardContent>
              </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="lg:col-span-2 shadow-sm border-border">
                 <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                       <CardTitle>Daily Revenue Forecast</CardTitle>
                       <CardDescription>Visualizing revenue trends for a sample week in {selectedMonth}</CardDescription>
                    </div>
                 </CardHeader>
                 <CardContent>
                    <div className="h-[350px] w-full">
                       <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={performanceData}>
                            <defs>
                              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted)/0.5)" />
                            <XAxis 
                              dataKey="day" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                              tickFormatter={(v) => `Rs. ${v/1000}k`} 
                            />
                            <Tooltip 
                              formatter={(value: number) => [`Rs. ${value.toLocaleString()}`, "Revenue"]}
                              contentStyle={{ borderRadius: '12px', border: '1px solid hsl(var(--border))' }}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="revenue" 
                              stroke="hsl(var(--primary))" 
                              strokeWidth={3}
                              fillOpacity={1} 
                              fill="url(#colorRev)" 
                            />
                          </AreaChart>
                       </ResponsiveContainer>
                    </div>
                 </CardContent>
              </Card>

              <Card className="shadow-sm border-border">
                 <CardHeader>
                    <CardTitle>Traffic Distribution</CardTitle>
                    <CardDescription>Visitor sources for {selectedMonth}</CardDescription>
                 </CardHeader>
                 <CardContent>
                    <div className="h-[350px] w-full flex flex-col items-center justify-center">
                       <ResponsiveContainer width="100%" height="80%">
                          <PieChart>
                             <Pie
                               data={trafficSource}
                               cx="50%"
                               cy="50%"
                               innerRadius={70}
                               outerRadius={90}
                               paddingAngle={8}
                               dataKey="value"
                             >
                                {trafficSource.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                             </Pie>
                             <Tooltip />
                          </PieChart>
                       </ResponsiveContainer>
                       <div className="grid grid-cols-2 gap-4 w-full mt-4">
                          {trafficSource.map((source) => (
                            <div key={source.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-muted/30">
                               <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: source.color }} />
                               <span className="text-xs font-medium text-foreground">{source.name}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                 </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </>
  );
}
