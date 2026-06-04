import { useTheme, type Appearance } from "@/lib/theme";

const ORDER: Appearance[] = ["light", "dark", "contrast"];
const GLYPH: Record<Appearance, string> = { light: "lt", dark: "dk", contrast: "hi" };

export function AppearanceToggle({ compact = false }: { compact?: boolean }) {
  void compact;
  const { appearance, setAppearance } = useTheme();
  const next = () => {
    const i = ORDER.indexOf(appearance);
    setAppearance(ORDER[(i + 1) % ORDER.length]);
  };
  return (
    <button
      onClick={next}
      title={`appearance: ${appearance} (click to cycle)`}
      aria-label="cycle appearance"
      className="inline-flex items-center gap-1 border border-border px-2 py-1 font-mono text-[10px] uppercase tracking-widest hover:bg-secondary"
    >
      <span className="text-muted-foreground">ui</span>
      <span className="bg-foreground px-1 text-background">{GLYPH[appearance]}</span>
    </button>
  );
}
