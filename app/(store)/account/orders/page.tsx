"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight, Search, Filter } from "lucide-react";
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
import type { Order } from "@/types";

// Demo orders data
const demoOrders: Order[] = [
  {
    id: "ord_001",
    orderNumber: "ORD-2024-001",
    userId: "user_001",
    items: [
      {
        productId: "prod_001",
        name: "iPhone 15 Pro Max",
        price: 185000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=200",
      },
      {
        productId: "prod_002",
        name: "Apple AirPods Pro",
        price: 35000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=200",
      },
    ],
    subtotal: 220000,
    shipping: 0,
    tax: 28600,
    total: 248600,
    status: "delivered",
    paymentStatus: "paid",
    paymentMethod: "esewa",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "9841234567",
      address: "Kathmandu, Nepal",
      city: "Kathmandu",
      district: "Kathmandu",
    },
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: "ord_002",
    orderNumber: "ORD-2024-002",
    userId: "user_001",
    items: [
      {
        productId: "prod_003",
        name: "MacBook Pro M3",
        price: 295000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=200",
      },
    ],
    subtotal: 295000,
    shipping: 0,
    tax: 38350,
    total: 333350,
    status: "processing",
    paymentStatus: "paid",
    paymentMethod: "khalti",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "9841234567",
      address: "Lalitpur, Nepal",
      city: "Lalitpur",
      district: "Lalitpur",
    },
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export default function OrdersPage() {
  const [orders] = useState<Order[]>(demoOrders);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items.some((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No orders yet"
        description="When you place orders, they will appear here for easy tracking."
        action={
          <Button asChild>
            <Link href="/products">Start Shopping</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          Track and manage your order history
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Orders</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <Card key={order.id}>
            <CardContent className="p-0">
              {/* Order Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b border-border">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <p className="font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge className={statusColors[order.status] || ""}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">
                    {formatPrice(order.total)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>

              {/* Order Items Preview */}
              <div className="p-4">
                <div className="flex gap-4">
                  <div className="flex -space-x-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={item.productId}
                        className="relative h-14 w-14 rounded-lg border-2 border-background overflow-hidden bg-muted"
                        style={{ zIndex: order.items.length - index }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="relative h-14 w-14 rounded-lg border-2 border-background bg-muted flex items-center justify-center text-sm font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {order.items[0].name}
                      {order.items.length > 1 &&
                        ` and ${order.items.length - 1} more`}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Payment: {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.charAt(0).toUpperCase() + order.paymentMethod.slice(1)}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/orders/${order.id}`}>
                      View Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">No orders found matching your criteria</p>
        </div>
      )}
    </div>
  );
}
