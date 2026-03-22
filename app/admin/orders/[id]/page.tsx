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
  Download,
  MessageSquare,
  AlertCircle,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { OrderService } from "@/lib/services/order-service";
import { notFound } from "next/navigation";

interface AdminOrderDetailPageProps {
  params: Promise<{
    id: string;
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

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  const { id } = await params;
  const order = await OrderService.getOrderById(id);

  if (!order) {
    notFound();
  }

  // Helper for type-safe user access
  const userData = order.user && typeof order.user === 'object' ? (order.user as any) : null;

  // Map database status history to UI timeline
  const timelineSteps = [
    { status: "pending", label: "Order Placed" },
    { status: "confirmed", label: "Payment Confirmed" },
    { status: "processing", label: "Processing" },
    { status: "shipped", label: "Shipped" },
    { status: "delivered", label: "Delivered" },
  ];

  const timeline = timelineSteps.map(step => {
    const historyItem = order.statusHistory.find((h: any) => h.status === step.status);
    return {
      status: step.label,
      date: historyItem ? new Date(historyItem.date) : null,
      completed: !!historyItem,
      note: historyItem?.note
    };
  });

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
    <div className="flex flex-col min-h-screen bg-background">
      <div className="p-6 md:p-10 space-y-8 w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-3">
               <Button asChild variant="ghost" size="sm" className="pl-0 h-auto hover:bg-transparent text-muted-foreground hover:text-primary transition-colors">
                <Link href="/admin/orders" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back to All Orders
                </Link>
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">{order.orderNumber}</h1>
              <Badge variant="outline" className={`${statusColors[order.orderStatus] || ""} capitalize font-semibold px-2.5 py-0.5 border shadow-none`}>
                {order.orderStatus}
              </Badge>
              <Badge variant="outline" className={order.paymentStatus === 'paid' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"}>
                {order.paymentStatus.toUpperCase()}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-2 font-medium">
              Registered Transaction on <span className="text-foreground">{formatDate(order.createdAt)}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" className="font-semibold h-10 border-border hover:bg-muted transition-all">
              <Download className="h-4 w-4 mr-2" />
              Generate Invoice
            </Button>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8 text-foreground/90">
            {/* Delivery/Status Tracking */}
            <Card className="shadow-sm border-border/60 overflow-hidden">
               <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Truck className="h-5 w-5 text-primary" />
                  Lifecycle & Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-8">
                 {order.orderStatus === 'cancelled' && (
                  <div className="mb-8 p-5 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-destructive">Cancellation Logged</p>
                      <p className="text-sm text-destructive/80 leading-relaxed font-medium">
                        {order.statusHistory.find((h: any) => h.status === 'cancelled')?.note || "This transaction has been terminated internally."}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="relative pl-2">
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
                        <p className={`font-bold text-base leading-none ${step.completed ? "text-foreground" : "text-muted-foreground"}`}>
                          {step.status}
                        </p>
                        {step.date && (
                          <p className="text-sm text-muted-foreground mt-1 font-medium">
                            {formatDate(step.date)}
                          </p>
                        )}
                        {step.note && step.completed && (
                           <p className="text-sm text-muted-foreground/80 mt-1 italic border-l-2 border-primary/20 pl-3">
                             {step.note}
                           </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Manifest */}
            <Card className="shadow-sm border-border/60 overflow-hidden">
               <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Package className="h-5 w-5 text-primary" />
                  Product Inventory Match
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/60">
                  {order.items.map((item: any) => (
                    <div
                      key={item.product}
                      className="flex flex-col sm:flex-row gap-6 p-6 transition-colors hover:bg-muted/10 cursor-default"
                    >
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border shadow-sm mx-auto sm:mx-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-1.5 text-center sm:text-left">
                        <h3 className="font-bold text-lg leading-tight text-foreground">{item.name}</h3>
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4">
                          <div className="flex items-center gap-1.5 py-1 px-3 rounded-full bg-primary/10 text-[11px] font-bold text-primary border border-primary/20 uppercase tracking-tighter">
                            QTY: {item.quantity}
                          </div>
                          <div className="text-foreground/70 font-medium text-sm">
                            Unit Cost: {formatPrice(item.price)}
                          </div>
                        </div>
                      </div>
                      <div className="text-center sm:text-right flex flex-col justify-center border-t sm:border-t-0 p-4 sm:p-0 mt-4 sm:mt-0 pt-4">
                        <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Row Total</p>
                        <p className="font-bold text-lg text-primary tracking-tight">
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
            {/* Customer Insight */}
            <Card className="shadow-sm border-border/60 overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-primary">
                  <User className="h-5 w-5" />
                  Customer Intelligence
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {userData?.name ? userData.name.charAt(0) : 'G'}
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-base leading-none">{userData?.name || "Guest Checkout"}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 font-medium">Loyalty Level: Standard</p>
                    </div>
                  </div>
                  <Separator className="bg-border/40" />
                  <div className="space-y-3 font-medium text-sm">
                    <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      <Mail className="h-4 w-4" />
                      {userData?.email || "No email available"}
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
                      <Phone className="h-4 w-4" />
                      {order.shippingAddress.phone}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Financial Reconciliation */}
            <Card className="shadow-sm border-border/60 overflow-hidden">
              <CardHeader className="bg-muted/30 border-b">
                <CardTitle className="text-lg font-semibold">Revenue Ledger</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between text-base leading-none">
                  <span className="text-muted-foreground font-medium">Net Subtotal</span>
                   <span className="font-bold text-foreground">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-base leading-none">
                  <span className="text-muted-foreground font-medium">Logistics Cost</span>
                  <span className="font-bold text-emerald-600">{order.shippingCost === 0 ? "Free Shipping" : formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-base leading-none">
                  <span className="text-muted-foreground font-medium">Tax Assessment</span>
                  <span className="font-bold text-foreground">{formatPrice(order.tax)}</span>
                </div>
                <Separator className="my-2 bg-border/40" />
                <div className="flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <span className="font-bold text-primary text-lg">Total Revenue</span>
                  <span className="text-xl font-bold text-primary tracking-tight">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Routing */}
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <MapPin className="h-5 w-5 text-primary" />
                  Routing Manifest
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="p-5 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/5 space-y-3">
                  <p className="font-bold text-foreground text-lg leading-tight">
                    {order.shippingAddress.fullName}
                  </p>
                  <div className="space-y-1 text-muted-foreground font-medium leading-relaxed text-sm">
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                    <p className="bg-primary/5 text-primary px-3 py-1 rounded-lg mt-3 inline-flex items-center gap-2 w-full text-xs font-semibold">
                       <MapPin className="h-3.5 w-3.5" /> Area Code: {order.shippingAddress.zipCode}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Audit */}
            <Card className="shadow-sm border-border/60">
              <CardHeader className="pb-4 border-b">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <CreditCard className="h-5 w-5 text-primary" />
                  Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 pt-6">
                <div className="space-y-4 font-semibold text-sm">
                  <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg">
                    <span className="text-muted-foreground">Gateway</span>
                    <span className="capitalize font-bold text-primary tracking-wide">
                      {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-muted/20 p-3 rounded-lg">
                    <span className="text-muted-foreground text-[10px] uppercase tracking-widest">Financial Status</span>
                    <Badge
                      className={order.paymentStatus === "paid" ? "bg-emerald-600 hover:bg-emerald-600 font-bold shadow-none border-0" : "bg-orange-600 hover:bg-orange-600 font-bold shadow-none border-0 text-[10px]"}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
