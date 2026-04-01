"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash, Loader2, Save, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Product } from "@/types";

interface ProductFormProps {
  initialData?: Product | null;
}

const FIXED_CATEGORIES = [
  "Mobile",
  "Laptop",
  "Accessories",
  "Earphone",
  "Headphone",
  "Speakers"
];

export function ProductForm({ initialData }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData;

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category: "",
    brand: "",
    price: "",
    comparePrice: "",
    stock: "",
    description: "",
    sku: "",
    images: [""],
    colors: [] as string[],
    sizes: [] as string[],
    isFeatured: false
  });

  const [newColor, setNewColor] = useState("");
  const [newSize, setNewSize] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        slug: initialData.slug,
        category: initialData.category as string || "",
        brand: initialData.brand,
        price: initialData.price.toString(),
        comparePrice: initialData.comparePrice?.toString() || "",
        stock: initialData.stock.toString(),
        description: initialData.description,
        sku: initialData.sku || "",
        images: initialData.images.length > 0 ? initialData.images : [""],
        colors: initialData.colors || [],
        sizes: initialData.sizes || [],
        isFeatured: initialData.isFeatured || false
      });
    }
  }, [initialData]);

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor("");
    }
  };

  const removeColor = (color: string) => {
    setFormData(prev => ({ ...prev, colors: prev.colors.filter(c => c !== color) }));
  };

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, newSize] }));
      setNewSize("");
    }
  };

  const removeSize = (size: string) => {
    setFormData(prev => ({ ...prev, sizes: prev.sizes.filter(s => s !== size) }));
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      if (name === "name" && !isEditing) {
        updated.slug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      }
      return updated;
    });
  };

  const removeImageField = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      images: updatedImages.length > 0 ? updatedImages : [""]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category) {
      toast.error("Please select a category");
      return;
    }
    if (formData.images.filter(img => img !== "").length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const url = isEditing ? `/api/admin/products/${initialData._id}` : "/api/admin/products";
      const method = isEditing ? "PATCH" : "POST";

      const priceVal = formData.price ? Number(formData.price) : Number(formData.comparePrice);
      const comparePriceVal = Number(formData.comparePrice);

      const payload = {
        ...formData,
        price: priceVal,
        comparePrice: comparePriceVal > priceVal ? comparePriceVal : undefined,
        stock: Number(formData.stock),
        images: formData.images.filter(img => img.trim() !== ""),
        isFeatured: formData.isFeatured,
        isActive: true
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

      if (result.success) {
        toast.success(isEditing ? "Product updated!" : "Product created!");
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error(result.error || "Save failed");
      }
    } catch (error) {
      toast.error("Error saving product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-3 pb-20">
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
                <label className="text-sm font-semibold text-foreground">SKU</label>
                <Input 
                  name="sku"
                  placeholder="SPK-1234" 
                  value={formData.sku}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Description</label>
              <Textarea 
                name="description"
                placeholder="Describe the product details..." 
                className="min-h-[150px] resize-none"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid gap-6 sm:grid-cols-2 pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-muted/30">
                <div className="space-y-0.5">
                  <label className="text-sm font-bold text-foreground">Featured Product</label>
                  <p className="text-[10px] text-muted-foreground">Show in Home Page Featured section</p>
                </div>
                <Switch 
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: !!checked }))}
                />
              </div>
            </div>

            <Separator className="my-2 bg-border/50" />

            {/* Colors & Sizes in General Details */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Available Colors</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. Sage, Black" 
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
                    className="h-10"
                  />
                  <Button type="button" onClick={addColor} variant="secondary" size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.colors.map(color => (
                    <div key={color} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-[11px] font-bold">
                      {color}
                      <button type="button" onClick={() => removeColor(color)} className="hover:bg-primary/20 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Available Sizes</label>
                <div className="flex gap-2">
                  <Input 
                    placeholder="e.g. 256GB, XL" 
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSize())}
                    className="h-10"
                  />
                  <Button type="button" onClick={addSize} variant="secondary" size="sm">Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {formData.sizes.map(size => (
                    <div key={size} className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-md text-[11px] font-bold">
                      {size}
                      <button type="button" onClick={() => removeSize(size)} className="hover:bg-primary/20 rounded-full p-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>



        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Media & Images</CardTitle>
            <CardDescription>Upload high-quality photos of the product</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {formData.images.filter(img => img !== "").map((img, index) => (
                <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-border group bg-muted shadow-sm">
                  <Image 
                    src={img} 
                    alt={`Preview ${index}`} 
                    fill 
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <button
                    type="button"
                    onClick={() => removeImageField(index)}
                    className="absolute top-1.5 right-1.5 h-7 w-7 bg-destructive/90 text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm shadow-xl"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <div className="relative aspect-square rounded-xl border-2 border-dashed border-primary/20 hover:border-primary/60 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 cursor-pointer group bg-muted/30">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={async (e) => {
                    if (e.target.files) {
                      const files = Array.from(e.target.files);
                      for (const file of files) {
                        const uploadData = new FormData();
                        uploadData.append("file", file);
                        try {
                          const res = await fetch("/api/admin/upload", {
                            method: "POST",
                            body: uploadData
                          });
                          const result = await res.json();
                          if (result.success) {
                            setFormData(prev => ({
                              ...prev,
                              images: prev.images[0] === "" ? [result.url] : [...prev.images, result.url]
                            }));
                            toast.success(`Uploaded ${file.name}`);
                          } else {
                            toast.error(result.error || "Upload failed");
                          }
                        } catch (err) {
                          toast.error("Error during image upload");
                        }
                      }
                    }
                  }}
                />
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                  <Plus className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center">
                   <p className="text-[10px] font-bold uppercase text-primary tracking-wider">Add Image</p>
                   <p className="text-[8px] text-muted-foreground uppercase opacity-60">PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sidebar Settings */}
      <div className="space-y-6">
        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Organization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Category</label>
              <Select 
                value={formData.category} 
                onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}
              >
                <SelectTrigger className="h-11 shadow-sm">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {FIXED_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="h-10">{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Pricing & Stock</CardTitle>
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
               />
               <p className="text-[10px] text-muted-foreground italic">Leave empty if no discount exists.</p>
             </div>
             <div className="space-y-2">
               <label className="text-sm font-semibold text-foreground">Original Price (NPR)</label>
               <Input 
                 name="comparePrice"
                 type="number" 
                 placeholder="150000" 
                 value={formData.comparePrice}
                 onChange={handleInputChange}
                 required
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

        <div className="sticky bottom-6 pt-4 flex gap-2">
          <Button type="submit" className="w-full h-12 text-md font-bold shadow-lg" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
            {isEditing ? "Update Product" : "Save Product"}
          </Button>
        </div>
      </div>
    </form>
  );
}
