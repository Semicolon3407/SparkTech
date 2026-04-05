import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format } from "date-fns";
// @ts-ignore
import { formatPrice } from "@/lib/utils/format";

export const generateInvoiceBuffer = async (order: any) => {
  const doc = new jsPDF() as any;

  // Header Colors & Styling
  const primaryColor: [number, number, number] = [67, 97, 238]; // #4361EE
  const accentColor: [number, number, number] = [248, 250, 252]; // #f8fafc
  const textColor: [number, number, number] = [15, 23, 42]; // #0f172a
  const mutedTextColor: [number, number, number] = [100, 116, 139]; // #64748b

  // Add Logo / Brand Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text("SPARK TECH", 20, 25);

  // Invoice Label
  doc.setFontSize(36);
  doc.setTextColor(240, 240, 240);
  doc.text("INVOICE", 140, 30);

  // Order Info Header
  doc.setDrawColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.setLineWidth(1);
  doc.line(20, 40, 190, 40);

  // Bill To & Invoice Info
  doc.setFontSize(10);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("BILL TO:", 20, 55);
  doc.text("INVOICE INFO:", 130, 55);

  doc.setFontSize(12);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.setFont("helvetica", "bold");
  doc.text(order.shippingAddress.fullName, 20, 62);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(order.shippingAddress.street, 20, 68);
  doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode || ""}`, 20, 74);
  doc.text(`Phone: ${order.shippingAddress.phone}`, 20, 80);

  // Invoice Details Side
  doc.setFontSize(10);
  doc.text("Order Number:", 130, 62);
  doc.setFont("helvetica", "bold");
  doc.text(order.orderNumber, 165, 62);

  doc.setFont("helvetica", "normal");
  doc.text("Order Date:", 130, 68);
  doc.text(format(new Date(order.createdAt), "MMM dd, yyyy"), 165, 68);

  doc.text("Payment Status:", 130, 74);
  const payStatus = order.paymentStatus.toUpperCase();
  if (payStatus === "PAID") doc.setTextColor(16, 185, 129); // Emerald
  else doc.setTextColor(249, 115, 22); // Orange
  doc.setFont("helvetica", "bold");
  doc.text(payStatus, 165, 74);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);

  // Order Items Table
  const tableRows = order.items.map((item: any) => [
    item.name,
    formatPrice(item.price),
    item.quantity.toString(),
    formatPrice(item.price * item.quantity),
  ]);

  autoTable(doc, {
    startY: 95,
    head: [["Item Description", "Price", "Qty", "Total"]],
    body: tableRows,
    theme: "striped",
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 11,
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: 90 },
      1: { halign: "right" },
      2: { halign: "center" },
      3: { halign: "right", fontStyle: "bold" },
    },
    styles: {
      fontSize: 10,
      cellPadding: 6,
    },
  });

  // Totals Calculation
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  const totalBoxWidth = 70;
  const totalBoxX = 190 - totalBoxWidth;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  
  doc.text("Subtotal:", totalBoxX, finalY);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(formatPrice(order.subtotal), 190, finalY, { align: "right" });

  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("Shipping:", totalBoxX, finalY + 7);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost), 190, finalY + 7, { align: "right" });

  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("Tax:", totalBoxX, finalY + 14);
  doc.setTextColor(textColor[0], textColor[1], textColor[2]);
  doc.text(formatPrice(order.tax), 190, finalY + 14, { align: "right" });

  // Final Total Highlight
  doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.rect(totalBoxX - 5, finalY + 19, totalBoxWidth + 5, 12, "F");
  
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("TOTAL AMOUNT:", totalBoxX, finalY + 27);
  doc.text(formatPrice(order.total), 185, finalY + 27, { align: "right" });

  // Footer Message
  const pageHeight = doc.internal.pageSize.height;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text("Thank you for choosing Spark Tech! If you have any questions, contact support@sparktech.com", 105, pageHeight - 20, { align: "center" });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`SparkTech Digital Evolution - Kathmandu, Nepal`, 105, pageHeight - 14, { align: "center" });

  // Return buffer for nodemailer
  return Buffer.from(doc.output('arraybuffer'));
};
