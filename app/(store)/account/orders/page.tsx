"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Search, Filter, Loader2, Truck, CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { formatPrice, formatDate } from "@/lib/utils/format";
import type { Order, OrderStatus } from "@/types";

const statusConfig: Record<OrderStatus, { color: string; icon: any; label: string }> = {
  pending: { color: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock, label: "Pending" },
  confirmed: { color: "bg-blue-50 text-blue-600 border-blue-200", icon: CheckCircle2, label: "Confirmed" },
  processing: { color: "bg-blue-50 text-blue-600 border-blue-200", icon: Loader2, label: "Processing" },
  shipped: { color: "bg-indigo-50 text-indigo-600 border-indigo-200", icon: Truck, label: "Shipped" },
  delivered: { color: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: CheckCircle2, label: "Delivered" },
  cancelled: { color: "bg-rose-50 text-rose-600 border-rose-200", icon: XCircle, label: "Cancelled" },
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders');
        const result = await res.json();
        if (result.success) {
          setOrders(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesSearch =
      (order.orderNumber || order._id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">Syncing Order History...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place orders, they will appear here for easy tracking."
        action={{
           label: "Start Shopping",
           onClick: () => router.push("/products")
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-muted-foreground text-sm">
          Track and manage your order history
        </p>
      </div>

      {/* Filters Hub */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-11 bg-gray-50/50 border-none focus:ring-0 focus:bg-white transition-all rounded-xl text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-56 h-11 border-none bg-gray-50/50 hover:bg-white transition-all rounded-xl text-[13px] font-bold">
            <div className="flex items-center gap-2">
               <Filter className="h-4 w-4 text-gray-400" />
               <SelectValue placeholder="All Orders" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-100 shadow-2xl p-1">
            <SelectItem value="all" className="rounded-lg font-bold text-[13px]">📦 All Orders</SelectItem>
            <SelectItem value="pending" className="rounded-lg font-bold text-[13px]">⏳ Pending</SelectItem>
            <SelectItem value="processing" className="rounded-lg font-bold text-[13px]">⚙️ Processing</SelectItem>
            <SelectItem value="shipped" className="rounded-lg font-bold text-[13px]">🚚 Shipped</SelectItem>
            <SelectItem value="delivered" className="rounded-lg font-bold text-[13px]">✅ Delivered</SelectItem>
            <SelectItem value="cancelled" className="rounded-lg font-bold text-[13px]">❌ Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Dynamic List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => {
           const status = statusConfig[order.orderStatus as OrderStatus] || statusConfig.pending;
           const StatusIcon = status.icon;

           return (
              <Card key={order._id} className="border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 border-l-4 border-l-transparent hover:border-l-primary/40">
                <CardContent className="p-0">
                  {/* Order Masthead */}
                  <div className="flex flex-wrap items-center justify-between gap-6 p-6 bg-gray-50/10 border-b border-gray-50">
                    <div className="flex flex-wrap items-center gap-8">
                      <div className="space-y-1">
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">Order ID</p>
                        <p className="text-[14px] font-black text-gray-900">{order.orderNumber || order._id.toString().slice(-8).toUpperCase()}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">Placed On</p>
                        <p className="text-[14px] font-bold text-gray-700">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className="space-y-1">
                        <Badge className={`${status.color} border py-1.5 px-4 rounded-full font-black text-[10px] uppercase tracking-wider flex items-center gap-2`}>
                          <StatusIcon className={`h-3 w-3 ${order.orderStatus === 'processing' ? 'animate-spin' : ''}`} />
                          {status.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-[18px] font-black text-primary">
                        {formatPrice(order.total)}
                      </p>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                        {order.items.length} {order.items.length === 1 ? "Item" : "Items"}
                      </p>
                    </div>
                  </div>

                  {/* Order Fulfillment Preview */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      {/* Dynamic Multi-Item Stack */}
                      <div className="flex -space-x-4">
                        {order.items.slice(0, 3).map((item) => (
                          <div
                            key={item.product}
                            className="relative h-20 w-20 rounded-2xl border-4 border-white overflow-hidden bg-gray-50 shadow-lg group-hover:scale-105 transition-all"
                          >
                            <Image
                              src={item.image || "/images/placeholder.png"}
                              alt={item.name}
                              fill
                              className="object-contain p-2"
                            />
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <div className="relative h-20 w-20 rounded-2xl border-4 border-white bg-gray-950 flex items-center justify-center text-xs font-black text-white shadow-lg z-0">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>

                      {/* Summary Data */}
                      <div className="flex-1 min-w-0 space-y-1 text-center md:text-left">
                        <h4 className="text-[13px] font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
                          {order.items[0]?.name}
                          {order.items.length > 1 &&
                            ` and ${order.items.length - 1} more devices`}
                        </h4>
                        <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                           Mtd: {order.paymentMethod === "cod" ? "COD" : order.paymentMethod.toUpperCase()} • {order.paymentStatus.toUpperCase()}
                        </p>
                      </div>

                      {/* High Intensity CTAs */}
                      <div className="flex gap-3 shrink-0 w-full md:w-auto">
                        <Button asChild variant="outline" className="flex-1 md:flex-initial h-11 rounded-xl border-gray-200 font-bold text-[12px] hover:bg-gray-50 uppercase tracking-widest transition-all">
                          <Link href={`/orders/${order._id}`}>
                            Track Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
           );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-20 bg-gray-50/30 rounded-3xl border border-dashed border-gray-200">
          <AlertCircle className="h-12 w-12 mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">No orders found for this criteria</p>
        </div>
      )}
    </div>
  );
}
