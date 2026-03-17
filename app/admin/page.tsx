"use client";

import Link from "next/link";
import Image from "next/image";
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { StatCard } from "@/components/admin/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils/format";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

// Demo data
const revenueData = [
  { name: "Jan", revenue: 450000 },
  { name: "Feb", revenue: 520000 },
  { name: "Mar", revenue: 480000 },
  { name: "Apr", revenue: 610000 },
  { name: "May", revenue: 590000 },
  { name: "Jun", revenue: 720000 },
  { name: "Jul", revenue: 680000 },
];

const categoryData = [
  { name: "Mobiles", sales: 45 },
  { name: "Laptops", sales: 28 },
  { name: "Earphones", sales: 35 },
  { name: "Accessories", sales: 52 },
];

const recentOrders = [
  {
    id: "ord_001",
    customer: "John Doe",
    email: "john@example.com",
    amount: 185000,
    status: "processing",
    date: new Date("2024-02-15"),
  },
  {
    id: "ord_002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 45000,
    status: "shipped",
    date: new Date("2024-02-14"),
  },
  {
    id: "ord_003",
    customer: "Ram Sharma",
    email: "ram@example.com",
    amount: 295000,
    status: "delivered",
    date: new Date("2024-02-13"),
  },
  {
    id: "ord_004",
    customer: "Sita Thapa",
    email: "sita@example.com",
    amount: 12500,
    status: "pending",
    date: new Date("2024-02-12"),
  },
];

const topProducts = [
  {
    id: "1",
    name: "iPhone 15 Pro Max",
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=100",
    sold: 124,
    revenue: 22940000,
  },
  {
    id: "2",
    name: "MacBook Pro M3",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=100",
    sold: 89,
    revenue: 26255000,
  },
  {
    id: "3",
    name: "AirPods Pro",
    image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=100",
    sold: 256,
    revenue: 8960000,
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader
        title="Dashboard"
        description="Overview of your store performance"
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={formatPrice(4250000)}
            icon={DollarSign}
            trend={{ value: 12.5, isPositive: true }}
            description="from last month"
          />
          <StatCard
            title="Orders"
            value="384"
            icon={ShoppingCart}
            trend={{ value: 8.2, isPositive: true }}
            description="from last month"
          />
          <StatCard
            title="Customers"
            value="1,429"
            icon={Users}
            trend={{ value: 15.3, isPositive: true }}
            description="new this month"
          />
          <StatCard
            title="Products"
            value="256"
            icon={Package}
            description="12 low in stock"
          />
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Revenue Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                      tickFormatter={(value) => `${value / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: number) => [formatPrice(value), "Revenue"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Category Sales */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Sales by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                    <XAxis
                      dataKey="name"
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      className="text-xs"
                      tick={{ fill: "hsl(var(--muted-foreground))" }}
                    />
                    <Tooltip
                      formatter={(value: number) => [value, "Sales"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar
                      dataKey="sales"
                      fill="hsl(var(--primary))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/orders">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{order.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.date)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatPrice(order.amount)}</p>
                      <Badge className={statusColors[order.status] || ""}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Products */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Selling Products
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/products">
                  View All <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-4 py-2 border-b border-border last:border-0"
                  >
                    <span className="text-lg font-bold text-muted-foreground w-6">
                      #{index + 1}
                    </span>
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.sold} sold
                      </p>
                    </div>
                    <p className="font-medium text-primary">
                      {formatPrice(product.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
