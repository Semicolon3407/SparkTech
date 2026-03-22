"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Calendar, 
  Loader2, 
  UserPlus, 
  Trash2, 
  Edit,
  ShieldCheck,
  ShieldAlert,
  User as UserIcon
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { User } from "@/types";
import { toast } from "sonner";
import { UserDialog } from "@/components/admin/user-dialog";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

export default function AdminCustomersPage() {
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/users");
      const result = await response.json();
      if (result.success) {
        setUsers(result.data);
      } else {
        toast.error(result.error || "Failed to fetch users");
      }
    } catch (error) {
      toast.error("An error occurred while fetching users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery))
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/users/${deleteId}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        toast.success("User deleted successfully");
        fetchUsers();
      } else {
        toast.error(result.error || "Failed to delete user");
      }
    } catch (error) {
      toast.error("Error deleting user");
    } finally {
      setIsDeleting(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'superadmin': return <ShieldAlert className="h-3.5 w-3.5 mr-1" />;
      case 'admin': return <ShieldCheck className="h-3.5 w-3.5 mr-1" />;
      default: return <UserIcon className="h-3.5 w-3.5 mr-1" />;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'superadmin': return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'admin': return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-slate-500/10 text-slate-500 border-slate-500/20";
    }
  };

  return (
    <>
      <AdminHeader
        title="User Management"
        description="View and manage administrative and customer accounts"
      />

      <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email or phone..."
              className="pl-10 h-10 shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={openAddDialog} className="h-10 shadow-sm">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="rounded-xl border border-border bg-card shadow-lg overflow-hidden transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] tracking-wider font-bold">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap">User</th>
                  <th className="px-6 py-4 whitespace-nowrap">Role</th>
                  <th className="px-6 py-4 whitespace-nowrap">Contact Info</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Joined</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {isLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center space-y-3">
                         <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <div className="absolute inset-0 flex items-center justify-center">
                               <UserIcon className="h-5 w-5 text-primary/50" />
                            </div>
                         </div>
                         <p className="text-muted-foreground animate-pulse">Fetching global directory...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      <div className="flex flex-col items-center justify-center space-y-2 opacity-60">
                         <Search className="h-10 w-10 mb-2" />
                         <p>No users found matching your search.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-muted/30 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm border border-border/40",
                            user.role === 'superadmin' ? "bg-red-500/10 text-red-500" :
                            user.role === 'admin' ? "bg-blue-500/10 text-blue-500" :
                            "bg-primary/10 text-primary"
                          )}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                               <p className="font-bold text-foreground">{user.name}</p>
                               {user._id === currentUser?._id && (
                                 <Badge variant="outline" className="text-[9px] py-0 h-4 bg-muted/40">YOU</Badge>
                               )}
                            </div>
                            <span className="text-[11px] text-muted-foreground uppercase tracking-tight">ID: {user._id.slice(-6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                         <Badge variant="outline" className={cn("px-2 py-0.5 text-[10px] font-bold uppercase", getRoleBadgeClass(user.role))}>
                            {getRoleIcon(user.role)}
                            {user.role}
                         </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors cursor-pointer group/mail">
                            <Mail className="h-3.5 w-3.5 text-muted-foreground group-hover/mail:text-primary" />
                            <span className="truncate max-w-[200px] text-[13px]">{user.email}</span>
                          </div>
                          {user.phone && (
                            <div className="flex items-center gap-2 text-muted-foreground text-xs">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right font-medium text-muted-foreground text-xs">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                             onClick={() => handleEdit(user)}
                             title="Edit User"
                           >
                             <Edit className="h-4 w-4" />
                           </Button>
                           <Button 
                             variant="ghost" 
                             size="icon" 
                             className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                             onClick={() => setDeleteId(user._id)}
                             disabled={user.role === 'superadmin' || user._id === currentUser?._id}
                             title="Delete User"
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <UserDialog 
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        user={selectedUser}
        onSuccess={fetchUsers}
        currentUserRole={currentUser?.role}
      />

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              and remove their access to the store.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
