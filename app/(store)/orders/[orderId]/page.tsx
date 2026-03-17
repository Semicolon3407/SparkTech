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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { formatPrice, formatDate } from "@/lib/utils/format";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

// Demo order data
const getOrder = async (orderId: string) => {
  return {
    id: orderId,
    orderNumber: "ORD-2024-001",
    userId: "user_001",
    items: [
      {
        productId: "prod_001",
        name: "iPhone 15 Pro Max 256GB - Natural Titanium",
        price: 185000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?w=400",
      },
      {
        productId: "prod_002",
        name: "Apple AirPods Pro (2nd Generation)",
        price: 35000,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400",
      },
    ],
    subtotal: 220000,
    shipping: 0,
    tax: 28600,
    total: 248600,
    status: "shipped",
    paymentStatus: "paid",
    paymentMethod: "esewa",
    trackingNumber: "NP123456789",
    shippingAddress: {
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "9841234567",
      address: "Baluwatar, Near US Embassy",
      city: "Kathmandu",
      district: "Kathmandu",
      postalCode: "44600",
    },
    timeline: [
      { status: "Order Placed", date: new Date("2024-02-01T10:30:00"), completed: true },
      { status: "Payment Confirmed", date: new Date("2024-02-01T10:35:00"), completed: true },
      { status: "Processing", date: new Date("2024-02-01T14:00:00"), completed: true },
      { status: "Shipped", date: new Date("2024-02-02T09:00:00"), completed: true },
      { status: "Out for Delivery", date: null, completed: false },
      { status: "Delivered", date: null, completed: false },
    ],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-02"),
  };
};

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-info/10 text-info",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  cancelled: "bg-destructive/10 text-destructive",
};

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { orderId } = await params;
  const order = await getOrder(orderId);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "My Orders", href: "/account/orders" },
    { label: order.orderNumber, href: `/orders/${orderId}` },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button asChild variant="ghost" size="sm" className="p-0 h-auto">
              <Link href="/account/orders">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={statusColors[order.status] || ""}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Invoice
          </Button>
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Support
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.trackingNumber && (
                <div className="mb-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">Tracking Number</p>
                  <p className="font-mono font-medium">{order.trackingNumber}</p>
                </div>
              )}
              <div className="relative">
                {order.timeline.map((step, index) => (
                  <div key={step.status} className="flex gap-4 pb-6 last:pb-0">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          step.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <Clock className="h-4 w-4" />
                        )}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 mt-2 ${
                            step.completed ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p
                        className={`font-medium ${
                          step.completed ? "" : "text-muted-foreground"
                        }`}
                      >
                        {step.status}
                      </p>
                      {step.date && (
                        <p className="text-sm text-muted-foreground">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex gap-4 p-4 rounded-lg border border-border"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-medium text-primary mt-1">
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
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
        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (13% VAT)</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.district}
                </p>
                {order.shippingAddress.postalCode && (
                  <p className="text-muted-foreground">{order.shippingAddress.postalCode}</p>
                )}
                <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="capitalize">
                    {order.paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    variant={order.paymentStatus === "paid" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {order.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Need Help */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                If you have any questions about your order, please contact our support team.
              </p>
              <div className="space-y-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
                <Button variant="ghost" className="w-full text-destructive hover:text-destructive">
                  Cancel Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
