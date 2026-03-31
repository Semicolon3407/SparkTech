"use client";

import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateInvoice } from "@/lib/utils/invoice-generator";
import { useState } from "react";
import { toast } from "sonner";

interface InvoiceButtonProps {
  order: any;
  className?: string;
}

export function InvoiceButton({ order, className }: InvoiceButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      // Small delay for better UX feel
      await new Promise(resolve => setTimeout(resolve, 800));
      generateInvoice(order);
      toast.success("Invoice downloaded successfully!");
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      toast.error("Failed to generate invoice. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleDownload} 
      disabled={isGenerating}
      className={`shadow-sm font-semibold h-10 ${className}`}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Preparing...
        </>
      ) : (
        <>
          <Download className="h-4 w-4 mr-2 text-primary" />
          Invoice
        </>
      )}
    </Button>
  );
}
