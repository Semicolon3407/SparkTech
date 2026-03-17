import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface OrderConfirmationPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { orderId } = await params;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-lg mx-auto text-center">
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-success" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
        <p className="text-muted-foreground mb-6">
          Thank you for your purchase. Your order has been placed successfully.
        </p>

        {/* Order Details Card */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Order Number</span>
                <span className="font-mono font-medium">#{orderId.slice(0, 8).toUpperCase()}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning/10 text-warning">
                  <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                  Processing
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-muted-foreground">Estimated Delivery</span>
                <span className="font-medium">3-5 Business Days</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What's Next */}
        <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5" />
            What happens next?
          </h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                1
              </span>
              <span>
                You will receive an order confirmation email with your order details.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                2
              </span>
              <span>
                Once your order ships, we will send you a tracking number via email and SMS.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">
                3
              </span>
              <span>
                Your package will be delivered to your doorstep within the estimated timeframe.
              </span>
            </li>
          </ol>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline">
            <Link href={`/orders/${orderId}`}>
              View Order Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        {/* Support Info */}
        <p className="mt-8 text-sm text-muted-foreground">
          Need help?{" "}
          <Link href="/contact" className="text-primary hover:underline">
            Contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
