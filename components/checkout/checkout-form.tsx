"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, MapPin, Phone, Mail, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  district: z.string().min(2, "District is required"),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  saveAddress: z.boolean().default(false),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormData) => void;
  defaultValues?: Partial<CheckoutFormData>;
}

const DISTRICTS = [
  "Kathmandu",
  "Lalitpur",
  "Bhaktapur",
  "Pokhara",
  "Chitwan",
  "Biratnagar",
  "Birgunj",
  "Butwal",
  "Dharan",
  "Hetauda",
  "Janakpur",
  "Nepalgunj",
  "Other",
];

export function CheckoutForm({ onSubmit, defaultValues }: CheckoutFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      district: "",
      postalCode: "",
      notes: "",
      saveAddress: false,
      ...defaultValues,
    },
  });

  const saveAddress = watch("saveAddress");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstName"
                  placeholder="John"
                  className="pl-10"
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-destructive">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10"
                  {...register("email")}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="98XXXXXXXX"
                  className="pl-10"
                  {...register("phone")}
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Address Field */}
          <div className="space-y-2">
            <Label htmlFor="address">Street Address *</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="address"
                placeholder="House number, street name, landmark"
                className="pl-10 min-h-[80px]"
                {...register("address")}
              />
            </div>
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* City, District, Postal */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                placeholder="City/Tole"
                {...register("city")}
              />
              {errors.city && (
                <p className="text-sm text-destructive">
                  {errors.city.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">District *</Label>
              <Select
                onValueChange={(value) => setValue("district", value)}
                defaultValue={defaultValues?.district}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.district && (
                <p className="text-sm text-destructive">
                  {errors.district.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                placeholder="44600"
                {...register("postalCode")}
              />
            </div>
          </div>

          {/* Order Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Special instructions for delivery..."
              {...register("notes")}
            />
          </div>

          {/* Save Address */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveAddress"
              checked={saveAddress}
              onCheckedChange={(checked) =>
                setValue("saveAddress", checked as boolean)
              }
            />
            <Label htmlFor="saveAddress" className="text-sm font-normal">
              Save this address for future orders
            </Label>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Continue to Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
