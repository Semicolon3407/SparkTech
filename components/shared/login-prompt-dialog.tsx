'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, LogIn, UserPlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface LoginPromptDialogProps {
  isOpen: boolean;
  onClose: () => void;
  actionType?: 'cart' | 'wishlist';
}

export function LoginPromptDialog({ isOpen, onClose, actionType = 'cart' }: LoginPromptDialogProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push('/login');
  };

  const handleRegister = () => {
    onClose();
    router.push('/register');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden border-none rounded-[32px] shadow-2xl">
        <div className="relative p-8 pt-12 text-center space-y-6">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mx-auto w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center relative">
             <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping opacity-20" />
             {actionType === 'cart' ? (
               <ShoppingBag className="w-10 h-10 text-primary" strokeWidth={1.5} />
             ) : (
               <Heart className="w-10 h-10 text-primary fill-primary/10" strokeWidth={1.5} />
             )}
          </div>

          <div className="space-y-2">
            <DialogTitle className="text-2xl font-black tracking-tight text-gray-950">
               Join the community
            </DialogTitle>
            <DialogDescription className="text-[15px] font-medium text-gray-400 leading-relaxed px-4">
               Please log in to your account to {actionType === 'cart' ? 'add this device to your bag' : 'save this item to your wishlist'}.
            </DialogDescription>
          </div>

          <div className="space-y-3 pt-4">
            <Button 
               onClick={handleLogin}
               className="w-full h-14 rounded-2xl bg-gray-950 hover:bg-gray-800 text-white font-bold text-base shadow-xl shadow-black/10 flex items-center justify-center gap-2 group transition-all"
            >
               <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" /> 
               Login to your account
            </Button>
            <Button 
               onClick={handleRegister}
               variant="ghost"
               className="w-full h-14 rounded-2xl text-gray-500 font-bold text-base hover:bg-gray-50 hover:text-gray-950 flex items-center justify-center gap-2"
            >
               <UserPlus className="w-5 h-5" /> 
               Don&apos;t have an account? Sign Up
            </Button>
          </div>
          
          <p className="text-[11px] font-bold text-gray-300 uppercase tracking-widest pt-4">
            Personalized experience await you
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
