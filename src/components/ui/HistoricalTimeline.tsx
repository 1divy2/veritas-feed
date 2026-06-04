import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

type DataPoint = {
  date: string;
  value: number;
};

export function HistoricalTimeline({ data, color = "var(--color-accent)" }: { data: DataPoint[]; color?: string }) {
  return (
    <div className="h-[200px] w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            minTickGap={30}
          />
          <YAxis 
            tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "var(--color-card)", border: "1px solid var(--color-border)", fontSize: "11px", borderRadius: "2px" }}
            itemStyle={{ color: "var(--color-foreground)" }}
            labelStyle={{ color: "var(--color-muted-foreground)", marginBottom: "4px" }}
          />
          <Line 
            type="stepAfter"
            dataKey="value" 
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={{ r: 4, fill: color, stroke: "var(--color-background)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
