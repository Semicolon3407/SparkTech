"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { PaymentMethod, type PaymentMethodType } from "@/components/checkout/payment-method";
import { OrderReview } from "@/components/checkout/order-review";
import { EmptyState } from "@/components/shared/empty-state";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";

type CheckoutStep = "shipping" | "payment" | "review";

interface ShippingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  postalCode?: string;
  notes?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<CheckoutStep>("shipping");
  const [shippingData, setShippingData] = useState<ShippingData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>("esewa");
  const [isProcessing, setIsProcessing] = useState(false);

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Cart", href: "/cart" },
    { label: "Checkout", href: "/checkout" },
  ];

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={breadcrumbItems} />
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some products to your cart before checking out."
          action={{
            label: "Browse Products",
            onClick: () => router.push("/products")
          }}
        />
      </div>
    );
  }

  const handleShippingSubmit = (data: ShippingData) => {
    setShippingData(data);
    setStep("payment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePaymentSelect = () => {
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    if (!shippingData) return;

    setIsProcessing(true);

    try {
      // Create order in database
      const orderData = {
        items: items.map(({ product, quantity }) => ({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: quantity,
          image: product.images?.[0] || '',
        })),
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          address: shippingData.address,
          city: shippingData.city,
          district: shippingData.district,
          postalCode: shippingData.postalCode,
        },
        paymentMethod,
        notes: shippingData.notes,
        total,
        userId: user?._id,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const { orderId, paymentUrl } = await response.json();

      // Handle payment based on method
      if (paymentMethod === "cod") {
        clearCart();
        toast.success("Order placed successfully!");
        router.push(`/orders/${orderId}/confirmation`);
      } else {
        // Redirect to payment gateway
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          // Fallback for demo
          clearCart();
          toast.success("Order placed! Payment simulation complete.");
          router.push(`/orders/${orderId}/confirmation`);
        }
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const shippingAddress = shippingData
    ? {
        name: `${shippingData.firstName} ${shippingData.lastName}`,
        address: shippingData.address,
        city: shippingData.city,
        district: shippingData.district,
        phone: shippingData.phone,
      }
    : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />

      {/* Progress Steps */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[
          { id: "shipping", label: "Shipping" },
          { id: "payment", label: "Payment" },
          { id: "review", label: "Review" },
        ].map((s, index) => (
          <div key={s.id} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step === s.id
                  ? "bg-primary text-primary-foreground"
                  : ["shipping", "payment", "review"].indexOf(step) >
                    ["shipping", "payment", "review"].indexOf(s.id)
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`ml-2 text-sm ${
                step === s.id ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
            {index < 2 && (
              <div
                className={`w-12 h-0.5 mx-4 ${
                  ["shipping", "payment", "review"].indexOf(step) > index
                    ? "bg-primary"
                    : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1">
          {step === "shipping" && (
            <CheckoutForm
              onSubmit={handleShippingSubmit}
              defaultValues={
                user
                  ? {
                      firstName: user.name?.split(" ")[0] || "",
                      lastName: user.name?.split(" ").slice(1).join(" ") || "",
                      email: user.email,
                      phone: user.phone || "",
                    }
                  : undefined
              }
            />
          )}

          {step === "payment" && (
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => setStep("shipping")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Shipping
              </Button>
              <PaymentMethod
                selectedMethod={paymentMethod}
                onMethodChange={setPaymentMethod}
              />
              <Button onClick={handlePaymentSelect} className="w-full" size="lg">
                Continue to Review
              </Button>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-6">
              <Button
                variant="ghost"
                onClick={() => setStep("payment")}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Payment
              </Button>

              {/* Summary Cards */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  {shippingAddress && (
                    <div className="text-sm text-muted-foreground">
                      <p>{shippingAddress.name}</p>
                      <p>{shippingAddress.address}</p>
                      <p>
                        {shippingAddress.city}, {shippingAddress.district}
                      </p>
                      <p>{shippingAddress.phone}</p>
                    </div>
                  )}
                </div>
                <div className="p-4 rounded-lg border border-border">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="text-sm text-muted-foreground capitalize">
                    {paymentMethod === "cod"
                      ? "Cash on Delivery"
                      : paymentMethod === "esewa"
                      ? "eSewa"
                      : "Khalti"}
                  </p>
                </div>
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                size="lg"
                disabled={isProcessing}
              >
                <Lock className="h-4 w-4 mr-2" />
                {isProcessing
                  ? "Processing..."
                  : paymentMethod === "cod"
                  ? "Place Order"
                  : `Pay with ${paymentMethod === "esewa" ? "eSewa" : "Khalti"}`}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By placing this order, you agree to our Terms of Service and
                Privacy Policy.
              </p>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:w-96">
          <OrderReview
            paymentMethod={paymentMethod}
            shippingAddress={shippingAddress}
          />
        </div>
      </div>
    </div>
  );
}
