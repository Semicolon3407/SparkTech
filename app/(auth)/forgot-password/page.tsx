"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Logo } from "@/components/shared/logo";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

const resetPasswordSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const forgotForm = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: "", password: "", confirmPassword: "" },
  });

  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setUserEmail(data.email);
        setStep("otp");
        toast.success("OTP sent to your email!");
      } else {
        toast.error(result.error || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const onResetSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          otp: data.otp,
          newPassword: data.password,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsSuccess(true);
        toast.success("Password reset successfully!");
      } else {
        toast.error(result.error || "Invalid or expired OTP");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12">
        <Card className="w-full max-w-md text-center p-6">
          <div className="flex justify-center mb-6 text-emerald-500">
            <CheckCircle2 className="h-16 w-16" />
          </div>
          <CardTitle className="text-2xl mb-2">Password Reset!</CardTitle>
          <CardDescription className="mb-6">
            Your password has been successfully updated. You can now log in with your new password.
          </CardDescription>
          <Button className="w-full" asChild>
            <Link href="/login">Proceed to Login</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="flex justify-center mb-4">
            <Logo className="scale-125" />
          </Link>
          <CardTitle className="text-2xl">
            {step === "email" ? "Forgot Password?" : "Verify OTP"}
          </CardTitle>
          <CardDescription>
            {step === "email" 
              ? "Enter your email and we'll send you a 4-digit code to reset your password"
              : `We've sent a 4-digit code to ${userEmail}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "email" ? (
            <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    placeholder="name@example.com"
                    className="pl-10 h-11"
                    {...forgotForm.register("email")}
                  />
                </div>
                {forgotForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{forgotForm.formState.errors.email.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Send OTP
              </Button>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/login" className="flex items-center">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </Link>
              </Button>
            </form>
          ) : (
            <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">4-Digit OTP</Label>
                  <Input
                    id="otp"
                    placeholder="0000"
                    maxLength={4}
                    className="text-center text-2xl tracking-[1.5em] font-bold h-14"
                    {...resetForm.register("otp")}
                  />
                  {resetForm.formState.errors.otp && (
                    <p className="text-sm text-destructive">{resetForm.formState.errors.otp.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 pr-10"
                      {...resetForm.register("password")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {resetForm.formState.errors.password && (
                    <p className="text-sm text-destructive">{resetForm.formState.errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="h-11 pr-10"
                      {...resetForm.register("confirmPassword")}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {resetForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">{resetForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>

              <Button type="submit" className="w-full h-11 mt-4" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Reset Password
              </Button>
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => setStep("email")}
                disabled={isLoading}
              >
                Change Email
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
