'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface MarketChartProps {
  data: Array<{ time: string; price: number }>;
  title?: string;
}

export function MarketChart({ data, title }: MarketChartProps) {
  return (
    <div className="chart-container">
      {title && (
        <h3 className="text-white font-bold mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
          <XAxis
            dataKey="time"
            stroke="#888888"
            tick={{ fill: '#888888', fontSize: 12 }}
          />
          <YAxis
            stroke="#888888"
            tick={{ fill: '#888888', fontSize: 12 }}
            domain="dataMin - 1000"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0a0a0a',
              border: '1px solid #1a1a1a',
              borderRadius: '6px',
            }}
            labelStyle={{ color: '#ffffff' }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'Price']}
            cursor={{ stroke: '#00ff00', strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#00ff00"
            strokeWidth={2}
            dot={false}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
