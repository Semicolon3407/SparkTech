"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, X, Plus, Trash, Image as ImageIcon, Loader2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export default function AddProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    brand: "",
    price: "",
    comparePrice: "",
    stock: "",
    description: "",
    images: [""]
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "name") {
        updated.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      }
      return updated;
    });
  };

  const handleImageChange = (index: number, value: string) => {
    const updatedImages = [...formData.images];
    updatedImages[index] = value;
    setFormData(prev => ({ ...prev, images: updatedImages }));
  };

  const addImageField = () => {
    setFormData(prev => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate real delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success("Product created successfully!");
    router.push("/admin/products");
    setIsSubmitting(false);
  };

  return (
    <>
      <AdminHeader
        title="Add New Product"
        description="Create a new listing for your store's collection"
      />

      <div className="p-6 max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/products">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
             <h2 className="text-xl font-bold text-foreground">Product Information</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link href="/admin/products">Cancel</Link>
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">General Details</CardTitle>
                <CardDescription>Core product identifying information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Product Name</label>
                  <Input 
                    name="name"
                    placeholder="e.g. iPhone 15 Pro Max" 
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Slug</label>
                    <Input 
                      name="slug"
                      placeholder="iphone-15-pro-max" 
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-foreground">Brand</label>
                    <Input 
                      name="brand"
                      placeholder="e.g. Apple" 
                      value={formData.brand}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Description</label>
                  <Textarea 
                    name="description"
                    placeholder="Describe the product details and key features..." 
                    className="min-h-[150px] resize-none"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Media & Images</CardTitle>
                <CardDescription>Add high-quality photos of the product</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.images.map((img, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <Input 
                        placeholder="https://images.unsplash.com/..." 
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                      />
                    </div>
                    {formData.images.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:bg-destructive/10"
                        onClick={() => removeImageField(index)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button variant="outline" type="button" onClick={addImageField} className="w-full dashed border-dashed">
                   <Plus className="h-4 w-4 mr-2" />
                   Add another image URL
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Sidebar Settings */}
          <div className="space-y-6">
            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Organization</CardTitle>
                <CardDescription>Set placement and availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Category</label>
                  <Select onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobiles">Mobiles</SelectItem>
                      <SelectItem value="laptops">Laptops</SelectItem>
                      <SelectItem value="earphones">Earphones</SelectItem>
                      <SelectItem value="accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border bg-card shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Pricing & Stock</CardTitle>
                <CardDescription>Configure financial data</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-foreground">Sale Price (NPR)</label>
                   <Input 
                     name="price"
                     type="number" 
                     placeholder="125000" 
                     value={formData.price}
                     onChange={handleInputChange}
                     required
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-foreground">Original Price (NPR)</label>
                   <Input 
                     name="comparePrice"
                     type="number" 
                     placeholder="150000" 
                     value={formData.comparePrice}
                     onChange={handleInputChange}
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-semibold text-foreground">Inventory Count</label>
                   <Input 
                     name="stock"
                     type="number" 
                     placeholder="50" 
                     value={formData.stock}
                     onChange={handleInputChange}
                     required
                   />
                 </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </>
  );
}
