'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  change?: number;
  subtext?: string;
}

export function MetricCard({
  label,
  value,
  icon,
  change,
  subtext,
}: MetricCardProps) {
  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 hover:border-[#00ff00]/30 transition-colors duration-200">
      <div className="flex items-start justify-between mb-4">
        <span className="metric-label">{label}</span>
        {icon && <div className="text-[#00ff00]">{icon}</div>}
      </div>

      <div className="flex items-baseline gap-3">
        <div className="metric-value">{value}</div>
        {change !== undefined && (
          <span className={`text-sm font-semibold ${
            change >= 0 ? 'text-[#00ff00]' : 'text-[#ff3333]'
          }`}>
            {change >= 0 ? '+' : ''}{change}%
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-[#888888] text-xs mt-3">{subtext}</p>
      )}
    </div>
  );
}
