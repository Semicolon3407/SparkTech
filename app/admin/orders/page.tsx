"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Eye, MoreHorizontal, ArrowRight, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data to match what SparkTech uses in dashboard overview
const MOCK_ORDERS = [
  {
    id: "ord_001",
    customer: "John Doe",
    email: "john@example.com",
    amount: 185000,
    status: "processing",
    date: new Date("2024-02-15"),
    items: 4,
  },
  {
    id: "ord_002",
    customer: "Jane Smith",
    email: "jane@example.com",
    amount: 45000,
    status: "shipped",
    date: new Date("2024-02-14"),
    items: 1,
  },
  {
    id: "ord_003",
    customer: "Ram Sharma",
    email: "ram@example.com",
    amount: 295000,
    status: "delivered",
    date: new Date("2024-02-13"),
    items: 3,
  },
  {
    id: "ord_004",
    customer: "Sita Thapa",
    email: "sita@example.com",
    amount: 12500,
    status: "pending",
    date: new Date("2024-02-12"),
    items: 2,
  },
  {
    id: "ord_005",
    customer: "Bikash Nepal",
    email: "bikash@example.com",
    amount: 85000,
    status: "cancelled",
    date: new Date("2024-02-11"),
    items: 1,
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-emerald-500/10 text-emerald-500",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function AdminOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  // In a real application, you'd fetch this from your database and set loading to false.
  const [isLoading, setIsLoading] = useState(false);
  const [orders] = useState(MOCK_ORDERS);

  const filteredOrders = orders.filter(
    (order) =>
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AdminHeader
        title="Orders"
        description="Monitor and process all customer purchases"
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by order ID, name, or email..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              Export CSV
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Process Pending
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">Order Info</th>
                  <th className="px-6 py-4 whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Total</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 rounded-tr-xl whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                      <p className="mt-2 text-muted-foreground">Loading orders...</p>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No orders found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-muted/50 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-foreground">
                        {order.id.toUpperCase()}
                        <div className="text-xs text-muted-foreground font-normal mt-0.5">
                          {order.items} {order.items === 1 ? 'item' : 'items'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground line-clamp-1">{order.customer}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">{order.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                        {formatDate(order.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-right text-foreground">
                        {formatPrice(order.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={`${statusColors[order.status] || ""} capitalize font-semibold shadow-none border-0`}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Order Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer font-medium">
                              <Eye className="w-4 h-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Update Status</div>
                            <DropdownMenuItem className="cursor-pointer text-info focus:text-info focus:bg-info/10">
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-primary focus:text-primary focus:bg-primary/10">
                              Mark as Shipped
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-emerald-500 focus:text-emerald-500 focus:bg-emerald-500/10">
                              Mark as Delivered
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                              Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/20">
            <span className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{filteredOrders.length}</span> orders
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
