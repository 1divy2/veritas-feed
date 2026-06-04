export function Sparkline({
  values, height = 28, width = 120, stroke = "currentColor",
}: { values: number[]; height?: number; width?: number; stroke?: string }) {
  if (!values.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / Math.max(1, values.length - 1);
  const d = values
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i * step).toFixed(1)},${(height - ((v - min) / range) * height).toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="block">
      <path d={d} fill="none" stroke={stroke} strokeWidth="1" />
    </svg>
  );
}
