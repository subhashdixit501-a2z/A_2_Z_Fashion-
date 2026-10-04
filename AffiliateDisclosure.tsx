import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

export const AffiliateDisclosure: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-neutral-50 rounded-2xl p-4 sm:p-5 border border-neutral-200/80 text-neutral-600 text-xs sm:text-sm">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-neutral-900">
            Affiliate Transparency & Disclaimer
          </span>
        </div>
        <button
          type="button"
          aria-label="Toggle disclosure details"
          className="text-neutral-400 hover:text-neutral-700"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <p className="mt-2 text-neutral-600 text-xs leading-relaxed">
        <b>A_2_Z_Fashion</b> is an independent fashion curation and affiliate shopping portal.
        When you click the <b>BUY NOW</b> button on any item, you are securely redirected to the
        official partner store (<b>Meesho</b>, <b>Flipkart</b>, or <b>Myntra</b>) to complete your order.
      </p>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-neutral-200/60 space-y-2 text-neutral-500 text-[11px] leading-normal animate-in fade-in duration-150">
          <p>
            • <b>Zero Cost to You:</b> Purchasing through our links never incurs any additional charges or fees.
            In fact, we highlight active promotional discounts, coupons, and flash sales.
          </p>
          <p>
            • <b>Commissions:</b> As an affiliate partner, A_2_Z_Fashion may earn a small referral commission
            from qualifying purchases. This helps support our servers and curation team.
          </p>
          <p>
            • <b>Logistics & Customer Support:</b> Payment processing, delivery, returns, and customer care
            are handled directly by the respective platforms (Meesho, Flipkart, or Myntra).
          </p>
        </div>
      )}
    </div>
  );
};
