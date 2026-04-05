import Link from "next/link";
import Image from "next/image";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  CreditCard,
  ArrowLeft,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { OrderService } from "@/lib/services/order-service";
import { notFound } from "next/navigation";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

const statusColors: Record<string, string> = {
  pending: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  processing: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  shipped: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-destructive/10 text-destructive border-destructive/20",
};

import { InvoiceButton } from "@/components/orders/invoice-button";

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const order = await OrderService.getOrderById(orderId);

  if (!order) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "My Orders", href: "/account/orders" },
    { label: order.orderNumber, href: `/orders/${orderId}` },
  ];

  // Map database status history to UI timeline
  const timelineSteps = [
    { status: "pending", label: "Order Placed" },
    { status: "confirmed", label: "Payment Confirmed" },
    { status: "processing", label: "Processing" },
    { status: "shipped", label: "Shipped" },
    { status: "delivered", label: "Delivered" },
  ];

  const timeline = timelineSteps.map(step => {
    const historyItem = order.statusHistory?.find((h: any) => h.status === step.status);
    let completed = !!historyItem;
    
    // Automatically mark payment confirmed if paymentStatus is paid
    if (step.status === 'confirmed' && order.paymentStatus === 'paid') {
      completed = true;
    }
    
    // Mark as completed if the current orderStatus implies this step was reached
    // e.g. if status is 'shipped', then 'pending', 'confirmed', and 'processing' should be considered done
    const statusOrder = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
    const currentStatusIndex = statusOrder.indexOf(order.orderStatus);
    const stepIndex = statusOrder.indexOf(step.status);
    if (stepIndex <= currentStatusIndex && stepIndex !== -1) {
      completed = true;
    }

    return {
      status: step.label,
      date: historyItem ? new Date(historyItem.date) : (completed ? (order.paymentDetails?.paidAt || order.createdAt) : null),
      completed: completed,
      note: historyItem?.note
    };
  });

  // Handle cancelled state separately in timeline if it exists
  if (order.orderStatus === 'cancelled') {
    const cancelItem = order.statusHistory.find((h: any) => h.status === 'cancelled');
    timeline.push({
      status: "Cancelled",
      date: cancelItem ? new Date(cancelItem.date) : new Date(),
      completed: true,
      note: cancelItem?.note || "Order was cancelled"
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 mt-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Button asChild variant="ghost" size="sm" className="pl-0 h-auto hover:bg-transparent text-muted-foreground hover:text-primary transition-colors">
              <Link href="/account/orders" className="flex items-center">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                Back to Orders
              </Link>
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">{order.orderNumber}</h1>
            <Badge variant="outline" className={`${statusColors[order.orderStatus] || ""} capitalize font-bold px-3 py-0.5 border shadow-none`}>
              {order.orderStatus}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-2">
            Placed on <span className="text-foreground font-medium">{formatDate(order.createdAt)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <InvoiceButton order={order} />
          <Button asChild className="shadow-sm font-semibold h-10 bg-primary text-primary-foreground hover:bg-primary/90">
            <Link href={`/support?orderId=${order.orderNumber}`}>
              <MessageSquare className="h-4 w-4 mr-2" />
              Support
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Timeline */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Truck className="h-5 w-5 text-primary" />
                Delivery Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.orderStatus === 'cancelled' && (
                <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-destructive">Order Cancelled</p>
                    <p className="text-sm text-destructive/80">
                      {order.statusHistory.find((h: any) => h.status === 'cancelled')?.note || "This order has been cancelled and will not be processed further."}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="relative pt-2 pl-2">
                {timeline.map((step, index) => (
                  <div key={index} className="flex gap-6 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ring-4 ring-background ${
                          step.completed
                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <Clock className="h-5 w-5" />
                        )}
                      </div>
                      {index < timeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 mb-[-8px] ${
                            step.completed ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <p
                        className={`font-bold text-lg leading-none ${
                          step.completed ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {step.status}
                      </p>
                      {step.date && (
                        <p className="text-sm text-muted-foreground mt-1 font-medium">
                          {formatDate(step.date)}
                        </p>
                      )}
                      {step.note && step.completed && (
                         <p className="text-sm text-muted-foreground/70 mt-1 italic italic">
                           {step.note}
                         </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="shadow-sm border-border/60 overflow-hidden">
            <CardHeader className="pb-4 bg-muted/30 border-b">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Package className="h-5 w-5 text-primary" />
                Purchased Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/60">
                {order.items.map((item: any) => (
                  <div
                    key={item.product}
                    className="flex flex-col sm:flex-row gap-6 p-6 transition-colors hover:bg-muted/10"
                  >
                    <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border shadow-sm mx-auto sm:mx-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2 text-center sm:text-left">
                      <h3 className="font-bold text-lg leading-snug hover:text-primary transition-colors cursor-default">{item.name}</h3>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                        <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-muted text-xs font-bold text-muted-foreground">
                          Qty: {item.quantity}
                        </div>
                        <div className="text-primary font-extrabold text-lg">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>
                    <div className="text-center sm:text-right flex flex-col justify-center border-t sm:border-t-0 p-4 sm:p-0 mt-4 sm:mt-0 pt-4">
                      <p className="text-sm text-muted-foreground font-medium mb-1">Total</p>
                      <p className="font-extrabold text-xl text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Order Summary */}
          <Card className="shadow-sm border-border/60 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="text-xl font-bold">Financial Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between text-base leading-none">
                <span className="text-muted-foreground font-medium">Subtotal</span>
                <span className="font-bold text-foreground">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-base leading-none">
                <span className="text-muted-foreground font-medium">Shipping</span>
                <span className="font-bold text-emerald-500">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
              </div>
              <div className="flex justify-between text-base leading-none">
                <span className="text-muted-foreground font-medium">Tax</span>
                <span className="font-bold text-foreground">{formatPrice(order.tax)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
                <span className="font-extrabold text-lg text-primary">Final Total</span>
                <span className="text-2xl font-black text-primary tracking-tight">
                  {formatPrice(order.total)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <MapPin className="h-5 w-5 text-primary" />
                Shipping Destination
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="p-4 rounded-xl border bg-muted/10 space-y-2">
                <p className="font-extrabold text-foreground text-lg">
                  {order.shippingAddress.fullName}
                </p>
                <div className="space-y-1 text-muted-foreground font-medium leading-relaxed">
                  <p>{order.shippingAddress.street}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </p>
                  <p className="border-t border-border/40 pt-2 mt-2 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    {order.shippingAddress.phone}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="shadow-sm border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <CreditCard className="h-5 w-5 text-primary" />
                Transaction Status
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="p-4 rounded-xl border bg-muted/10 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Provider</span>
                  <span className="capitalize font-bold bg-primary/10 px-3 py-1 rounded-md text-primary text-xs tracking-wider">
                    {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium text-sm">Status</span>
                  <Badge
                    variant={order.paymentStatus === "paid" ? "default" : "secondary"}
                    className={cn(
                      "capitalize font-bold border-0 shadow-none",
                      order.paymentStatus === "paid" ? "bg-emerald-500 text-white" : ""
                    )}
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card className="bg-primary text-primary-foreground shadow-xl border-0 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform">
               <MessageSquare className="h-24 w-24" />
            </div>
            <CardContent className="pt-8 relative z-10">
              <h3 className="text-xl font-black mb-2 tracking-tight">Need Assistance?</h3>
              <p className="text-sm text-primary-foreground/80 mb-6 font-medium leading-snug">
                Our support team is available 24/7 to help you with any questions regarding this order.
              </p>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full font-bold h-11" asChild>
                  <Link href="/contact">Contact Support Team</Link>
                </Button>
                {order.orderStatus === 'pending' && (
                  <Button variant="ghost" className="w-full text-white/70 hover:text-white hover:bg-white/10 font-bold border border-white/20">
                    Cancel Order Request
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
