import React from "react";
import { Search, Heart, UserRound, SlidersHorizontal } from "lucide-react";
import type { SocialLinks } from "../socialLinks";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
  socialLinks?: SocialLinks;
}

export function Navbar({ searchQuery, onSearchChange, wishlistCount, onOpenWishlist, onOpenAdmin, socialLinks }: NavbarProps) {
  const social = [
    { label: "Facebook", href: socialLinks?.facebook || "#" },
    { label: "Instagram", href: socialLinks?.instagram || "#" },
    { label: "YouTube", href: socialLinks?.youtube || "#" },
    { label: "Telegram", href: socialLinks?.telegram || "#" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0b0b0d]/95 text-white backdrop-blur-xl shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-3 shrink-0" aria-label="A_2_Z_Fashion home">
            <img src="/a2z-logo.png" alt="A_2_Z_Fashion" className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#ff1686] shadow-[0_0_20px_rgba(255,22,134,.25)]" />
            <div className="hidden sm:block text-left">
              <div className="text-2xl sm:text-3xl font-black tracking-tight"><span className="text-white">A_2_Z_</span><span className="text-[#ff1686] italic">Fashion</span></div>
              <div className="text-[10px] tracking-[0.32em] text-neutral-300 mt-1">STYLE <span className="text-[#ff1686]">•</span> TRENDS <span className="text-[#ff1686]">•</span> YOU</div>
            </div>
          </button>

          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input id="a2z-search" type="search" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} placeholder="Search fashion products..." className="w-full h-12 sm:h-14 pl-11 pr-12 rounded-2xl bg-white text-neutral-900 placeholder:text-neutral-400 outline-none ring-0 focus:ring-2 focus:ring-[#ff1686] text-sm sm:text-base" />
            <SlidersHorizontal className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-700" />
          </div>

          <button onClick={onOpenWishlist} className="relative w-11 h-11 rounded-full flex items-center justify-center hover:bg-white/10" aria-label="Wishlist">
            <Heart className="w-7 h-7" />
            {wishlistCount > 0 && <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-[#ff1686] text-white text-[10px] font-black flex items-center justify-center">{wishlistCount}</span>}
          </button>
          <button onClick={onOpenAdmin} className="hidden sm:flex w-11 h-11 rounded-full items-center justify-center hover:bg-white/10" aria-label="Account">
            <UserRound className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-neutral-300">
          <span className="text-neutral-500">Connect with us</span>
          {social.map(s => <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-[#ff1686] transition">{s.label}</a>)}
        </div>
      </div>
    </header>
  );
}
