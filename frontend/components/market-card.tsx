'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

interface MarketCardProps {
  id: string;
  title: string;
  price: number;
  change: number;
  createdAt: string;
  volume?: number;
}

export function MarketCard({
  id,
  title,
  price,
  change,
  createdAt,
  volume,
}: MarketCardProps) {
  const isPositive = change >= 0;

  return (
    <Link href={`/market/${id}`}>
      <div className="market-card cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-white font-bold text-sm truncate">{title}</h3>
            <p className="text-[#888888] text-xs mt-1">{createdAt}</p>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${
            isPositive 
              ? 'bg-[#00ff00]/10 text-[#00ff00]' 
              : 'bg-[#ff3333]/10 text-[#ff3333]'
          }`}>
            {isPositive ? (
              <TrendingUp size={14} />
            ) : (
              <TrendingDown size={14} />
            )}
            {Math.abs(change).toFixed(2)}%
          </div>
        </div>

        {/* Price and Stats */}
        <div className="flex-1">
          <div className="text-2xl font-bold text-[#00ff00] mb-2">
            ${price.toFixed(2)}
          </div>
          {volume && (
            <div className="text-xs text-[#888888]">
              Vol: ${(volume / 1000).toFixed(1)}K
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-1 text-[#888888] text-xs mt-4 pt-4 border-t border-[#1a1a1a]">
          <Clock size={12} />
          <span>24h ago</span>
        </div>
      </div>
    </Link>
  );
}
