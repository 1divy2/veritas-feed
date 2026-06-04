import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: any[];
  xKey: string;
  yKeys: { key: string; color: string }[];
  height?: number;
}

export function ActivityTimelineChart({ data, xKey, yKeys, height = 200 }: Props) {
  return (
    <div style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            {yKeys.map((y, i) => (
              <linearGradient key={y.key} id={`color-${y.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={y.color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={y.color} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <XAxis 
            dataKey={xKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: 'var(--color-muted-foreground)', fontSize: 10, fontFamily: 'var(--font-mono)' }}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'var(--color-card)', borderColor: 'var(--color-border)', borderRadius: '2px', fontSize: '11px', fontFamily: 'var(--font-mono)' }}
            itemStyle={{ color: 'var(--color-foreground)' }}
          />
          {yKeys.map((y, i) => (
            <Area
              key={y.key}
              type="monotone"
              dataKey={y.key}
              stroke={y.color}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${y.key})`}
              isAnimationActive={true}
              animationDuration={1000}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
