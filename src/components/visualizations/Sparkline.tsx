import { LineChart, Line, ResponsiveContainer } from "recharts";

export function Sparkline({ data, color = "var(--color-accent)" }: { data: number[]; color?: string }) {
  const chartData = data.map((d, i) => ({ value: d, index: i }));
  return (
    <div className="h-6 w-16">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color} 
            strokeWidth={1.5} 
            dot={false} 
            isAnimationActive={true}
            animationDuration={1500}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
