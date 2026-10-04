import React from 'react';
import { Marketplace } from '../types';

interface MarketplaceBadgeProps {
  marketplace: Marketplace;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const MarketplaceBadge: React.FC<MarketplaceBadgeProps> = ({
  marketplace,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 tracking-wider font-semibold',
    md: 'text-xs px-2.5 py-1 tracking-wider font-semibold',
    lg: 'text-sm px-3.5 py-1.5 tracking-wider font-bold',
  };

  switch (marketplace) {
    case 'Meesho':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-600 to-rose-700 text-white shadow-sm border border-pink-400/30 uppercase ${sizeClasses[size]} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-pink-200 animate-pulse" />
          Meesho
        </span>
      );
    case 'Flipkart':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-[#2874f0] text-white shadow-sm border border-blue-400/30 uppercase ${sizeClasses[size]} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
          Flipkart
        </span>
      );
    case 'Myntra':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#ff3f6c] to-[#ff6045] text-white shadow-sm border border-rose-300/30 uppercase ${sizeClasses[size]} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-200" />
          Myntra
        </span>
      );
    default:
      return (
        <span
          className={`inline-flex items-center gap-1 rounded-full bg-neutral-900 text-white shadow-sm ${sizeClasses[size]} ${className}`}
        >
          {marketplace}
        </span>
      );
  }
};
