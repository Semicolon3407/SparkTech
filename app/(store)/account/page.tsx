"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Calendar, Loader2, Camera, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "sonner";
import { formatDate } from "@/lib/utils/format";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Please enter a valid phone number").optional().or(z.literal("")),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

interface AccountStats {
  orderCount: number;
  wishlistCount: number;
  reviewCount: number;
}

export default function ProfilePage() {
  const { user, updateProfile, setUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
  const [isAvatarLoading, setIsAvatarLoading] = useState(false);
  const [stats, setStats] = useState<AccountStats | null>(null);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  // Keep form in sync with user state
  useEffect(() => {
    if (user) {
      setValue("name", user.name);
      setValue("email", user.email);
      setValue("phone", user.phone || "");
    }
  }, [user, setValue]);

  // Fetch Stats
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/account/stats');
        const result = await res.json();
        if (result.success) {
          setStats(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setIsStatsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const onSubmit = async (data: ProfileFormData) => {
    setIsLoading(true);
    try {
      const result = await updateProfile(data);
      if (result.success) {
        toast.success("Profile updated successfully");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const onPasswordSubmit = async (data: PasswordFormData) => {
    setIsPasswordLoading(true);
    try {
      const response = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.success) {
        toast.success("Password changed successfully");
        resetPassword();
      } else {
        toast.error(result.error || "Failed to change password");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsPasswordLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAvatarLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/auth/avatar', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setUser(result.data);
        toast.success('Profile photo updated!');
      } else {
        toast.error(result.error || 'Upload failed');
      }
    } catch {
      toast.error('Upload failed');
    } finally {
      setIsAvatarLoading(false);
      // Reset input so same file can be re-selected
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
         {/* Profile Info Section - Left */}
         <div className="lg:col-span-2 space-y-6">
            {/* Profile Picture Section */}
            <Card className="border-gray-100 shadow-sm overflow-hidden">
               <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                  <CardTitle className="text-lg">Profile Picture</CardTitle>
               </CardHeader>
               <CardContent className="pt-6">
                  {/* Hidden file input */}
                  <input
                     ref={fileInputRef}
                     type="file"
                     accept="image/jpeg,image/png,image/gif,image/webp"
                     className="hidden"
                     onChange={handleAvatarUpload}
                  />
                  <div className="flex items-center gap-6">
                     <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                        {/* Avatar: photo or initial */}
                        <div className="h-24 w-24 rounded-full overflow-hidden bg-primary flex items-center justify-center text-white font-black text-4xl shadow-2xl border-4 border-white">
                           {user?.avatar ? (
                              <Image
                                 src={user.avatar}
                                 alt={user.name}
                                 width={96}
                                 height={96}
                                 className="object-cover w-full h-full"
                              />
                           ) : (
                              <span>{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                           )}
                        </div>
                        {/* Loading / Camera overlay */}
                        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                           {isAvatarLoading
                              ? <Loader2 className="h-6 w-6 text-white animate-spin" />
                              : <Camera className="h-6 w-6 text-white" />
                           }
                        </div>
                        {/* Small camera badge */}
                        <div className="absolute -bottom-1 -right-1 h-9 w-9 rounded-full bg-white shadow-lg border-2 border-white flex items-center justify-center">
                           <Camera className="h-4 w-4 text-gray-600" />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           disabled={isAvatarLoading}
                           onClick={() => fileInputRef.current?.click()}
                           className="font-bold px-5 border-gray-200 hover:bg-gray-50 transition-all"
                        >
                           {isAvatarLoading ? (
                              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Uploading...</>
                           ) : 'Upload New Picture'}
                        </Button>
                        <p className="text-xs text-gray-400 font-medium">
                           JPG, PNG or GIF. Max size 2MB.
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="border-gray-100 shadow-sm overflow-hidden">
               <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                  <CardTitle className="text-lg">Personal Information</CardTitle>
               </CardHeader>
               <CardContent className="pt-8">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                     <div className="grid gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                           <Label htmlFor="name" className="text-[13px] font-bold text-gray-700 ml-1">Full Name</Label>
                           <div className="relative group">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                              <Input
                                 id="name"
                                 className="pl-11 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-primary transition-all rounded-xl"
                                 {...register("name")}
                              />
                           </div>
                           {errors.name && (
                              <p className="text-xs font-bold text-red-500 ml-1">{errors.name.message}</p>
                           )}
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="email" className="text-[13px] font-bold text-gray-700 ml-1">Email Address</Label>
                           <div className="relative group">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                              <Input
                                 id="email"
                                 type="email"
                                 className="pl-11 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-primary transition-all rounded-xl"
                                 {...register("email")}
                              />
                           </div>
                           {errors.email && (
                              <p className="text-xs font-bold text-red-500 ml-1">{errors.email.message}</p>
                           )}
                        </div>

                        <div className="space-y-2">
                           <Label htmlFor="phone" className="text-[13px] font-bold text-gray-700 ml-1">Phone Number</Label>
                           <div className="relative group">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                              <Input
                                 id="phone"
                                 className="pl-11 h-12 bg-gray-50/50 border-gray-100 focus:bg-white focus:border-primary transition-all rounded-xl"
                                 placeholder="98XXXXXXXX"
                                 {...register("phone")}
                              />
                           </div>
                           {errors.phone && (
                              <p className="text-xs font-bold text-red-500 ml-1">{errors.phone.message}</p>
                           )}
                        </div>

                        <div className="space-y-2">
                           <Label className="text-[13px] font-bold text-gray-700 ml-1">Member Since</Label>
                           <div className="relative">
                              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                              <Input
                                 value={user?.createdAt ? formatDate(new Date(user.createdAt)) : "N/A"}
                                 className="pl-11 h-12 bg-gray-100/50 border-gray-100 text-gray-400 cursor-not-allowed rounded-xl font-medium"
                                 disabled
                              />
                           </div>
                        </div>
                     </div>

                     <div className="flex justify-end pt-4">
                        <Button 
                           type="submit" 
                           disabled={isLoading || !isDirty}
                           className="bg-primary hover:bg-primary/90 text-white font-black px-10 h-12 rounded-xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5"
                        >
                           {isLoading ? (
                              <>
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                 Saving...
                              </>
                           ) : (
                              "Update Profile"
                           )}
                        </Button>
                     </div>
                  </form>
               </CardContent>
            </Card>
         </div>

         {/* Right Sidebar - Security & Stats */}
         <div className="space-y-6">
            {/* Change Password Card */}
            <Card className="border-gray-100 shadow-sm overflow-hidden">
               <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                  <CardTitle className="text-lg">Security</CardTitle>
               </CardHeader>
               <CardContent className="p-6">
                  <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="space-y-4">
                     <div className="space-y-1.5">
                        <Label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">Current Password</Label>
                        <div className="relative">
                           <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                           <Input 
                              type="password"
                              className="pl-10 h-11 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl"
                              {...registerPassword("currentPassword")}
                           />
                        </div>
                        {passwordErrors.currentPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{passwordErrors.currentPassword.message}</p>}
                     </div>

                     <div className="space-y-1.5">
                        <Label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">New Password</Label>
                        <div className="relative">
                           <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                           <Input 
                              type="password" 
                              className="pl-10 h-11 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl"
                              {...registerPassword("newPassword")}
                           />
                        </div>
                        {passwordErrors.newPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{passwordErrors.newPassword.message}</p>}
                     </div>

                     <div className="space-y-1.5">
                        <Label className="text-[12px] font-bold uppercase tracking-widest text-gray-400">Confirm New Password</Label>
                        <div className="relative">
                           <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                           <Input 
                              type="password" 
                              className="pl-10 h-11 bg-gray-50/50 border-gray-100 focus:bg-white rounded-xl"
                              {...registerPassword("confirmPassword")}
                           />
                        </div>
                        {passwordErrors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{passwordErrors.confirmPassword.message}</p>}
                     </div>

                     <Button 
                        type="submit" 
                        disabled={isPasswordLoading}
                        className="w-full bg-gray-950 hover:bg-gray-800 text-white font-bold h-11 rounded-xl transition-all"
                     >
                        {isPasswordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Change Password"}
                     </Button>
                  </form>
               </CardContent>
            </Card>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 gap-4">
               {[
                  { label: "Total Orders", value: stats?.orderCount ?? 0, bg: "bg-blue-50", color: "text-blue-600" },
                  { label: "Wishlist Items", value: stats?.wishlistCount ?? 0, bg: "bg-red-50", color: "text-red-600" },
               ].map((stat) => (
                  <div key={stat.label} className={`p-6 rounded-2xl ${stat.bg} flex flex-col items-center shadow-sm`}>
                    <p className={`text-4xl font-black ${stat.color} mb-1`}>
                       {isStatsLoading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : stat.value}
                    </p>
                    <p className="text-[11px] font-extrabold uppercase tracking-widest text-gray-400">{stat.label}</p>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
