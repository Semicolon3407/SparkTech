"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Eye, MoreHorizontal, Loader2, RefreshCw, XCircle, CheckCircle, Truck, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors: Record<string, string> = {
  pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  processing: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0
  });

  const fetchOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders?page=${page}&limit=10`);
      const result = await response.json();
      if (result.success) {
        setOrders(result.data);
        setPagination(result.pagination);
      } else {
        toast.error(result.error || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("An error occurred while fetching orders");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();

      if (result.success) {
        toast.success(`Order status updated to ${status}`);
        // Update local state instead of refetching everything
        setOrders(orders.map(order => 
          order._id === orderId ? { ...order, orderStatus: status } : order
        ));
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(
    (order) =>
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.user?.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdminHeader
        title="Order Management"
        description="Monitor, process, and update customer purchases in real-time."
      />

      <div className="p-4 md:p-8 space-y-6 max-w-[1600px] mx-auto w-full">
        {/* Filters and Actions */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Order #, Customer, or Email..."
              className="pl-10 h-10 border-muted-foreground/20 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchOrders(pagination.page)}
              className="h-10 px-4"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button size="sm" className="h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 hidden sm:flex">
              Export History
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="px-6 py-4 font-semibold text-muted-foreground whitespace-nowrap">Order Info</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground whitespace-nowrap">Date</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-right whitespace-nowrap">Total Amount</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 font-semibold text-muted-foreground text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                        <p className="text-lg font-medium text-muted-foreground">Retrieving active orders...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-24 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Package className="h-12 w-12 mb-4 opacity-20" />
                        <p className="text-lg">No orders found matching your search.</p>
                        <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">Clear filters</Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-muted/30 transition-colors group cursor-default"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground tracking-tight">{order.orderNumber}</span>
                          <span className="text-xs text-muted-foreground mt-1">
                            {order.items.length} {order.items.length === 1 ? 'Product' : 'Products'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                             <span className="font-semibold text-foreground line-clamp-1">
                              {order.user?.name || "Guest User"}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground line-clamp-1">{order.user?.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap font-bold text-right text-foreground">
                        <span className="text-xs font-normal text-muted-foreground mr-1">Rs.</span>
                        {formatPrice(order.total).replace('Rs.', '')}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <Badge 
                          variant="outline"
                          className={`${statusColors[order.orderStatus] || ""} capitalize font-bold px-2.5 py-0.5 border shadow-none`}
                        >
                          {order.orderStatus}
                        </Badge>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1">
                           <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted rounded-full">
                                <MoreHorizontal className="h-5 w-5 text-muted-foreground" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px] p-2">
                              <DropdownMenuLabel className="px-2 py-1.5 text-xs text-muted-foreground uppercase font-bold tracking-wider">
                                Management Actions
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator className="-mx-2" />
                              <DropdownMenuItem 
                                className="rounded-md cursor-pointer flex items-center gap-2 py-2.5"
                                onClick={() => router.push(`/admin/orders/${order._id}`)}
                              >
                                <Eye className="w-4 h-4 text-primary" /> View Full Details
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator className="-mx-2" />
                              <div className="px-2 py-1.5 text-[10px] font-bold text-muted-foreground uppercase mt-1">Status Transitions</div>
                              
                              <DropdownMenuItem 
                                className="rounded-md cursor-pointer flex items-center gap-2 py-2.5 text-indigo-500 focus:bg-indigo-500/10 focus:text-indigo-500"
                                onClick={() => handleUpdateStatus(order._id, 'processing')}
                              >
                                <RefreshCw className="w-4 h-4" /> Start Processing
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                className="rounded-md cursor-pointer flex items-center gap-2 py-2.5 text-purple-500 focus:bg-purple-500/10 focus:text-purple-500"
                                onClick={() => handleUpdateStatus(order._id, 'shipped')}
                              >
                                <Truck className="w-4 h-4" /> Mark as Shipped
                              </DropdownMenuItem>
                              
                              <DropdownMenuItem 
                                className="rounded-md cursor-pointer flex items-center gap-2 py-2.5 text-emerald-500 focus:bg-emerald-500/10 focus:text-emerald-500"
                                onClick={() => handleUpdateStatus(order._id, 'delivered')}
                              >
                                <CheckCircle className="w-4 h-4" /> Mark as Delivered
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator className="-mx-2" />
                              <DropdownMenuItem 
                                className="rounded-md cursor-pointer flex items-center gap-2 py-2.5 text-destructive focus:bg-destructive focus:text-destructive"
                                onClick={() => handleUpdateStatus(order._id, 'cancelled')}
                              >
                                <XCircle className="w-4 h-4" /> Cancel This Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          <div className="border-t border-border px-6 py-5 flex items-center justify-between bg-muted/10">
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              Total <span className="font-bold text-foreground">{pagination.total}</span> Orders | Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-4 font-medium"
                disabled={pagination.page <= 1 || isLoading}
                onClick={() => fetchOrders(pagination.page - 1)}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 px-4 font-medium border-primary/20 text-primary hover:bg-primary/5"
                disabled={pagination.page >= pagination.totalPages || isLoading}
                onClick={() => fetchOrders(pagination.page + 1)}
              >
                Next Page
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
