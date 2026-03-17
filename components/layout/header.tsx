'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Search,
  ChevronDown,
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Phone,
  Menu,
  X,
  Plus,
  Minus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/cart-context';
import { CATEGORIES, APP_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { Logo } from '@/components/shared/logo';


// Custom icons for TikTok and X
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.89-.6-4.13-1.47V13.3c0 2.15-1.29 4.18-3.39 4.88-2.15.7-4.64.13-6.22-1.51-1.58-1.65-2.03-4.27-1.12-6.32.91-2.03 3.19-3.32 5.4-3.15.11-.29.45-.19.67-.3V12c-1.14-.04-2.25.68-2.61 1.77-.36 1.08.06 2.37.98 3.03.92.65 2.22.56 3.06-.23.83-.8 1.1-2.14 1.1-3.23V.02h.27z"/>
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none" className="h-4 w-4">
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z"/>
  </svg>
);

export function Header() {
  const router = useRouter();
  const { itemCount } = useCart();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white relative z-50">
      {/* Top Bar */}
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-6 text-[10px] md:text-[11px] font-medium tracking-wide">
            <Link href="/locations" className="hover:opacity-80">Our Locations</Link>
            <Link href="/about" className="hover:opacity-80 whitespace-nowrap">About Us</Link>
            <Link href="/contact" className="hover:opacity-80 whitespace-nowrap">Contact</Link>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="#" className="hover:scale-110 transition-transform"><Instagram className="h-3.5 w-3.5 md:h-4 md:w-4" /></Link>
            <Link href="#" className="hover:scale-110 transition-transform"><Youtube className="h-3.5 w-3.5 md:h-4 md:w-4" /></Link>
            <Link href="#" className="hover:scale-110 transition-transform scale-90 md:scale-100"><TikTokIcon /></Link>
            <Link href="#" className="hover:scale-110 transition-transform scale-90 md:scale-100"><XIcon /></Link>
            <Link href="#" className="hover:scale-110 transition-transform"><Facebook className="h-3.5 w-3.5 md:h-4 md:w-4" /></Link>
            <Link href="#" className="hover:scale-110 transition-transform"><Linkedin className="h-3.5 w-3.5 md:h-4 md:w-4" /></Link>
          </div>
        </div>
      </div>

      {/* Main Header Area */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-4 md:py-6 flex items-center justify-between gap-4 md:gap-8">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0 overflow-y-auto">
              <SheetHeader className="p-6 border-b text-left">
                <SheetTitle>
                  <Logo showText={true} className="mt-2" />
                </SheetTitle>

              </SheetHeader>
              <MobileNav onClose={() => setMobileMenuOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo Section */}
          <Link href="/" className="group shrink-0">
            <Logo className="group-hover:scale-105 transition-all duration-300" />
          </Link>


          {/* Search Bar - Hidden on Mobile, shown via separate toggle or just in nav */}
          <div className="hidden lg:flex flex-1 max-w-xl relative group">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full h-11 px-6 pr-12 rounded-full border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  router.push(`/search?q=${e.currentTarget.value}`);
                }
              }}
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <a href="tel:+977" className="hidden sm:flex text-gray-950 hover:text-primary transition-colors items-center gap-1">
              <Phone className="h-6 w-6 stroke-[1.5px]" />
            </a>
            <Link href="/cart" className="relative group">
              <ShoppingCart className="h-6 w-6 md:h-7 md:w-7 stroke-[1.5px] text-gray-950 group-hover:text-primary transition-colors" />
              <span className="absolute -top-1 -right-1 md:-top-1.5 md:-right-1.5 h-4 w-4 md:h-5 md:w-5 rounded-full bg-primary text-white text-[8px] md:text-[10px] font-black flex items-center justify-center shadow-lg border-2 border-white">
                {itemCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Bar - Desktop Only */}
      <nav className="border-b relative hidden lg:block">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-1">
            {CATEGORIES.map((category) => (
              <li 
                key={category.slug}
                className="group/item"
                onMouseEnter={() => setActiveMenu(category.slug)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <Link 
                  href={`/category/${category.slug}`}
                  className={cn(
                    "relative px-4 py-4 text-[13px] font-bold tracking-tight inline-flex items-center gap-1.5 transition-all",
                    (category as any).highlight ? "text-[#E63946]" : "text-gray-950 hover:text-primary"
                  )}
                >
                  {category.name}
                  {(category as any).hasDropdown && <ChevronDown className="h-3.5 w-3.5 opacity-40 group-hover/item:rotate-180 transition-transform" />}
                </Link>

                {/* Mega Menu for Apple */}
                {category.slug === 'apple' && activeMenu === 'apple' && (
                  <div className="fixed left-0 right-0 top-[170px] bg-white border-b shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="container mx-auto px-4 py-10">
                      <div className="grid grid-cols-6 gap-8">
                        {(category as any).items?.map((column: any) => (
                          <div key={column.title} className="flex flex-col gap-4">
                            <h4 className="text-[15px] font-black tracking-tight text-gray-950 px-2">{column.title}</h4>
                            <ul className="flex flex-col gap-2">
                              {column.links.map((link: any) => (
                                <li key={link.label}>
                                  <Link 
                                    href={link.href}
                                    className="text-[13px] text-gray-500 hover:text-primary hover:bg-gray-50 px-2 py-1 rounded transition-all block"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  return (
    <div className="pb-10">
      <div className="p-4 bg-gray-50">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full h-10 px-4 pr-10 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        </div>
      </div>

      <nav className="flex flex-col">
        {CATEGORIES.map((category) => (
          <div key={category.slug} className="border-b border-gray-100 italic-none">
            <div className="flex items-center justify-between">
              <Link
                href={`/category/${category.slug}`}
                onClick={onClose}
                className={cn(
                  "flex-1 py-4 px-6 text-[15px] font-black tracking-tight",
                  (category as any).highlight ? "text-[#E63946]" : "text-gray-950"
                )}
              >
                {category.name}
              </Link>
              {(category as any).hasDropdown && (
                <button
                  onClick={() => setExpandedCategory(expandedCategory === category.slug ? null : category.slug)}
                  className="p-4 border-l border-gray-100 text-gray-400"
                >
                  {expandedCategory === category.slug ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                </button>
              )}
            </div>

            {expandedCategory === category.slug && (category as any).items && (
              <div className="bg-gray-50 px-6 py-4 animate-in slide-in-from-top-2 duration-200">
                {(category as any).items.map((column: any) => (
                  <div key={column.title} className="mb-6 last:mb-0">
                    <h4 className="text-[13px] font-black uppercase tracking-widest text-gray-400 mb-3">{column.title}</h4>
                    <ul className="flex flex-col gap-3">
                      {column.links.map((link: any) => (
                        <li key={link.label}>
                          <Link
                            href={link.href}
                            onClick={onClose}
                            className="text-[14px] font-medium text-gray-600 hover:text-primary transition-colors"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        
        {/* Additional Links */}
        <div className="p-6 space-y-4">
          <Link href="/locations" onClick={onClose} className="block text-sm font-bold text-gray-500 hover:text-primary">Our Locations</Link>
          <Link href="/about" onClick={onClose} className="block text-sm font-bold text-gray-500 hover:text-primary">About Us</Link>
          <Link href="/contact" onClick={onClose} className="block text-sm font-bold text-gray-500 hover:text-primary">Contact</Link>
        </div>
      </nav>
    </div>
  );
}
