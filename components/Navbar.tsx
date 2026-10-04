import React from "react";
import {
  Search,
  Heart,
  Shield,
  ShoppingBag,
} from "lucide-react";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export function Navbar({
  searchQuery,
  onSearchChange,
  wishlistCount,
  onOpenWishlist,
  onOpenAdmin,
  isAdminLoggedIn,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="h-16 flex items-center gap-3">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-xs">
