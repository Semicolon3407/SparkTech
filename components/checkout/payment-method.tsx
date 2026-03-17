"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, Truck, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type PaymentMethodType = "esewa" | "khalti" | "cod";

interface PaymentMethodProps {
  selectedMethod: PaymentMethodType;
  onMethodChange: (method: PaymentMethodType) => void;
}

const paymentMethods = [
  {
    id: "esewa" as const,
    name: "eSewa",
    description: "Pay securely with your eSewa wallet",
    icon: "/images/payment/esewa.png",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    borderColor: "border-green-500",
  },
  {
    id: "khalti" as const,
    name: "Khalti",
    description: "Pay using Khalti digital wallet",
    icon: "/images/payment/khalti.png",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    borderColor: "border-purple-500",
  },
  {
    id: "cod" as const,
    name: "Cash on Delivery",
    description: "Pay when you receive your order",
    icon: null,
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    borderColor: "border-orange-500",
  },
];

export function PaymentMethod({
  selectedMethod,
  onMethodChange,
}: PaymentMethodProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5" />
          Payment Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => onMethodChange(value as PaymentMethodType)}
          className="space-y-3"
        >
          {paymentMethods.map((method) => (
            <Label
              key={method.id}
              htmlFor={method.id}
              className={cn(
                "flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all",
                selectedMethod === method.id
                  ? `${method.bgColor} ${method.borderColor}`
                  : "border-border hover:border-muted-foreground/30"
              )}
            >
              <RadioGroupItem value={method.id} id={method.id} />
              <div className="flex items-center gap-3 flex-1">
                {method.icon ? (
                  <div className="relative h-10 w-16 bg-white rounded overflow-hidden">
                    <Image
                      src={method.icon}
                      alt={method.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                ) : (
                  <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                    <Truck className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
                <div>
                  <p className="font-medium">{method.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {method.description}
                  </p>
                </div>
              </div>
            </Label>
          ))}
        </RadioGroup>

        {selectedMethod === "cod" && (
          <div className="mt-4 p-3 bg-warning/10 text-warning-foreground rounded-lg text-sm">
            <p className="font-medium">Cash on Delivery Terms:</p>
            <ul className="list-disc list-inside mt-1 text-muted-foreground">
              <li>Rs. 100 additional COD charge applies</li>
              <li>Please keep exact change ready</li>
              <li>Available within Kathmandu Valley only</li>
            </ul>
          </div>
        )}

        {(selectedMethod === "esewa" || selectedMethod === "khalti") && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
            <p>
              You will be redirected to {selectedMethod === "esewa" ? "eSewa" : "Khalti"} to complete your payment securely.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
