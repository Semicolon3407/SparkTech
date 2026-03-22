"use client";

import { useState } from "react";
import { Save, Settings2, Shield, Bell, Upload, Globe, Palette } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1500));
    toast.success("Settings saved successfully!");
    setIsSaving(false);
  };

  return (
    <>
      <AdminHeader
        title="Settings"
        description="Configure your store's global parameters and preferences"
      />

      <div className="p-6 max-w-[1000px] mx-auto space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid grid-cols-3 md:w-[400px] mb-8">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Store Design</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings2 className="h-5 w-5" />
                  Store Profile
                </CardTitle>
                <CardDescription>Main public information for your storefront</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Store Name</label>
                    <Input defaultValue="SparkTech Nepal" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Support Email</label>
                    <Input defaultValue="support@sparktech.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold">Store Description (SEO)</label>
                  <Textarea placeholder="Premium electronics and gadgets in Nepal..." />
                </div>
                <div className="pt-4 flex justify-end">
                   <Button onClick={handleSave} disabled={isSaving}>
                      {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      Save Changes
                   </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Localization
                </CardTitle>
                <CardDescription>Manage currency and region defaults</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Default Currency</label>
                    <Input disabled value="Nepalese Rupee (NPR)" />
                  </div>
                  <div className="space-y-2">
                     <label className="text-sm font-semibold">Timezone</label>
                     <Input disabled value="Kathmandu (GMT+5:45)" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Authentication Preferences
                  </CardTitle>
                  <CardDescription>Manage how users log in and security levels</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="flex items-center justify-between">
                     <div>
                        <p className="font-semibold">Email Verification</p>
                        <p className="text-sm text-muted-foreground">Require customers to verify email before ordering</p>
                     </div>
                     <Switch defaultChecked />
                   </div>
                   <div className="flex items-center justify-between border-t pt-4">
                     <div>
                        <p className="font-semibold">Two-Factor Auth</p>
                        <p className="text-sm text-muted-foreground">Add extra security layer for admin logins</p>
                     </div>
                     <Switch />
                   </div>
                </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
             <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Branding
                  </CardTitle>
                  <CardDescription>Customize the look and feel of your storefront</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-sm font-semibold">Store Logo</p>
                    <div className="h-32 w-32 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground">
                       <Upload className="h-8 w-8 mb-2" />
                       <span className="text-xs">Upload Logo</span>
                    </div>
                  </div>
                </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

// Helper for saving state
function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
}
