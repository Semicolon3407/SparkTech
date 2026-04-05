"use client";

import { useEffect, useState } from "react";
import { Tag, Copy, CheckCircle2, XCircle, Clock, Ticket, ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";

interface Coupon {
  _id: string;
  code: string;
  discountPercent: number;
  isUsed: boolean;
  usedAt?: string;
  expiresAt: string;
  awardedForOrderCount: number;
  createdAt: string;
}

const milestones = [
  { count: 5, discount: 10, description: "Buy any 5 items (across any orders)" },
  { count: 10, discount: 20, description: "Buy any 10 items (across any orders)" },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [couponsRes, progressRes] = await Promise.all([
          fetch("/api/coupons"),
          fetch("/api/coupons/progress"),
        ]);
        const [couponsData, progressData] = await Promise.all([
          couponsRes.json(),
          progressRes.json(),
        ]);
        if (couponsData.success) setCoupons(couponsData.data);
        if (progressData.success) setTotalItems(progressData.totalItems);
      } catch (err) {
        console.error("Failed to fetch coupons:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(`Coupon code "${code}" copied!`);
  };

  const isExpired = (expiresAt: string) => new Date(expiresAt) < new Date();
  const activeCoupons = coupons.filter((c) => !c.isUsed && !isExpired(c.expiresAt));
  const usedOrExpiredCoupons = coupons.filter((c) => c.isUsed || isExpired(c.expiresAt));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Ticket className="h-6 w-6 text-primary" />
          My Coupons
        </h1>
        <p className="text-muted-foreground mt-1">Your loyalty rewards and discount codes</p>
      </div>

      {/* Progress Section */}
      <div className="rounded-xl border bg-card p-5 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-sm">Your Purchase Progress</h2>
          <span className="text-sm font-bold text-primary">
            {isLoading ? "..." : totalItems} item{totalItems !== 1 ? "s" : ""} purchased
          </span>
        </div>

        {!isLoading && (() => {
          // Calculate dynamic milestones:
          // Target 10% (5, 15, 25...)
          let target10Percent = 5;
          while (target10Percent < totalItems) target10Percent += 10;
          
          // Target 20% (10, 20, 30...)
          let target20Percent = 10;
          while (target20Percent < totalItems) target20Percent += 10;

          const dynamicMilestones = [
            { count: target10Percent, discount: 10, description: "Buy any items to reach milestone" },
            { count: target20Percent, discount: 20, description: "Buy any items to reach milestone" },
          ];

          return dynamicMilestones.map((m) => {
            const earned = coupons.some((c) => c.awardedForOrderCount === m.count);
            // If they haven't earned it, they are working from the last milestone. 
            // e.g. If totalItems is 12, target is 15. The "base" is 10. Progress is (12-10)/(15-10).
            const base = m.discount === 10 ? m.count - 5 : m.count - 10;
            const progressRange = m.count - base;
            const currentProgress = totalItems - base;
            const progress = earned ? 100 : Math.min(100, Math.max(0, Math.round((currentProgress / progressRange) * 100)));
            const remaining = Math.max(0, m.count - totalItems);

            return (
              <div key={m.count} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${earned ? "text-primary" : ""}`}>
                      {m.discount}% OFF Coupon
                    </span>
                    {earned && (
                      <Badge variant="secondary" className="text-xs py-0">Earned ✓</Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    {earned
                      ? `${m.count}/${m.count} items`
                      : `${totalItems}/${m.count} items`}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      earned
                        ? "bg-primary"
                        : "bg-gradient-to-r from-blue-400 to-primary"
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {earned
                    ? `🎉 Unlocked! Check your active coupons below.`
                    : `${remaining} more item${remaining !== 1 ? "s" : ""} to unlock milestone ${m.count}`}
                </p>
              </div>
            );
          });
        })()}

        {totalItems === 0 && !isLoading && (
          <div className="pt-2 text-center">
            <Button size="sm" variant="outline" asChild>
              <Link href="/products">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Start Shopping
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Active Coupons */}
      <div>
        <h2 className="text-base font-semibold mb-3 text-muted-foreground uppercase tracking-wide text-xs">
          Active Coupons ({activeCoupons.length})
        </h2>
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-36 rounded-xl border bg-muted/30 animate-pulse" />
            ))}
          </div>
        ) : activeCoupons.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center text-muted-foreground">
            <Tag className="mx-auto h-10 w-10 mb-3 opacity-30" />
            <p className="font-medium">No active coupons yet</p>
            <p className="text-sm mt-1">Keep buying items to earn loyalty discounts!</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {activeCoupons.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                onCopy={copyCode}
                isExpired={isExpired(coupon.expiresAt)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Used / Expired Coupons */}
      {usedOrExpiredCoupons.length > 0 && (
        <div>
          <h2 className="text-base font-semibold mb-3 text-muted-foreground uppercase tracking-wide text-xs">
            Used / Expired
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 opacity-60">
            {usedOrExpiredCoupons.map((coupon) => (
              <CouponCard
                key={coupon._id}
                coupon={coupon}
                onCopy={copyCode}
                isExpired={isExpired(coupon.expiresAt)}
                dimmed
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CouponCard({
  coupon,
  onCopy,
  isExpired,
  dimmed = false,
}: {
  coupon: Coupon;
  onCopy: (code: string) => void;
  isExpired: boolean;
  dimmed?: boolean;
}) {
  const statusColor =
    coupon.isUsed
      ? "text-muted-foreground"
      : isExpired
      ? "text-destructive"
      : "text-emerald-500";

  const StatusIcon = coupon.isUsed ? CheckCircle2 : isExpired ? XCircle : Clock;

  return (
    <div
      className={`relative rounded-xl border overflow-hidden transition-all ${
        dimmed ? "bg-muted/20" : "bg-card hover:shadow-md"
      }`}
    >
      {/* Colored stripe */}
      <div
        className={`h-1.5 w-full ${
          coupon.discountPercent >= 20
            ? "bg-gradient-to-r from-violet-500 to-fuchsia-500"
            : "bg-gradient-to-r from-blue-500 to-primary"
        }`}
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-3xl font-black text-primary">{coupon.discountPercent}%</p>
            <p className="text-sm font-medium">Discount on next order</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center gap-1 text-xs ${statusColor}`}>
              <StatusIcon className="h-3.5 w-3.5" />
              {coupon.isUsed ? "Used" : isExpired ? "Expired" : "Active"}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {coupon.isUsed && coupon.usedAt
                ? `Used ${format(new Date(coupon.usedAt), "MMM d, yyyy")}`
                : `Expires ${format(new Date(coupon.expiresAt), "MMM d, yyyy")}`}
            </p>
          </div>
        </div>

        {/* Code + copy */}
        <div className="mt-4 flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-2">
          <code className="flex-1 text-sm font-mono font-bold tracking-widest">
            {coupon.code}
          </code>
          {!coupon.isUsed && !isExpired && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 shrink-0"
              onClick={() => onCopy(coupon.code)}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Rewarded after {coupon.awardedForOrderCount} items purchased
        </p>
      </div>
    </div>
  );
}
