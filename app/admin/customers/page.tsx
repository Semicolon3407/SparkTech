"use client";

import { useState } from "react";
import { Search, MoreHorizontal, Mail, Phone, Calendar, Loader2, ArrowUpDown } from "lucide-react";
import { AdminHeader } from "@/components/admin/admin-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils/format";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MOCK_CUSTOMERS = [
  {
    _id: "user_001",
    name: "John Doe",
    email: "john@example.com",
    phone: "+977 9841234567",
    joinedAt: new Date("2024-01-10"),
    totalOrders: 12,
    totalSpent: 450000,
    status: "active",
  },
  {
    _id: "user_002",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+977 9801234567",
    joinedAt: new Date("2024-01-15"),
    totalOrders: 5,
    totalSpent: 125000,
    status: "active",
  },
  {
    _id: "user_003",
    name: "Ram Sharma",
    email: "ram@example.com",
    phone: "+977 9861234567",
    joinedAt: new Date("2024-02-01"),
    totalOrders: 8,
    totalSpent: 295000,
    status: "active",
  },
  {
    _id: "user_004",
    name: "Sita Thapa",
    email: "sita@example.com",
    phone: "+977 9851234567",
    joinedAt: new Date("2024-02-05"),
    totalOrders: 2,
    totalSpent: 18500,
    status: "inactive",
  },
  {
    _id: "user_005",
    name: "Bikash Nepal",
    email: "bikash@example.com",
    phone: "+977 9811234567",
    joinedAt: new Date("2024-02-12"),
    totalOrders: 1,
    totalSpent: 5000,
    status: "active",
  },
];

export default function AdminCustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [customers] = useState(MOCK_CUSTOMERS);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  return (
    <>
      <AdminHeader
        title="Customers"
        description="View and manage your customer accounts and their history"
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            Export Customer List
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4 rounded-tl-xl whitespace-nowrap">Customer</th>
                  <th className="px-6 py-4 whitespace-nowrap">Contact Info</th>
                  <th className="px-6 py-4 whitespace-nowrap">Status</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Orders</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Total Spent</th>
                  <th className="px-6 py-4 rounded-tr-xl whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                      <p className="mt-2 text-muted-foreground">Loading customers...</p>
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                      No customers found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer._id} className="hover:bg-muted/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-foreground">{customer.name}</p>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                              <Calendar className="h-3 w-3" />
                              Joined {formatDate(customer.joinedAt)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-foreground">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                            <span className="truncate max-w-[180px]">{customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground text-xs">
                            <Phone className="h-3 w-3" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={customer.status === 'active' ? 'default' : 'secondary'} 
                               className={customer.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-0" : ""}>
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-medium">
                        {customer.totalOrders}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">
                        {formatPrice(customer.totalSpent)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>Customer Details</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              View Orders
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive focus:bg-destructive focus:text-destructive-foreground cursor-pointer">
                              Deactivate Account
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="border-t border-border px-6 py-4 flex items-center justify-between bg-muted/20">
            <span className="text-sm text-muted-foreground">
              Total <span className="font-medium text-foreground">{filteredCustomers.length}</span> customers
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
