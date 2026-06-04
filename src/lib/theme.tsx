import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Appearance = "light" | "dark" | "contrast";

type ThemeContextType = {
  appearance: Appearance;
  setAppearance: (a: Appearance) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [appearance, setAppearance] = useState<Appearance>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("veritas_appearance") as Appearance;
    if (saved && ["light", "dark", "contrast"].includes(saved)) {
      setAppearance(saved);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("light", "dark", "contrast");
    
    if (appearance !== "light") {
      root.classList.add(appearance);
    }
    
    localStorage.setItem("veritas_appearance", appearance);
  }, [appearance]);

  return (
    <ThemeContext.Provider value={{ appearance, setAppearance }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * White-label theming utility.
 * Allows organizations to inject custom CSS variables at runtime
 * to override the default VERITAS branding.
 */
export type OrganizationTheme = {
  primaryColor: string;
  logoUrl?: string;
  fontFamily?: string;
};

export function applyTheme(theme: OrganizationTheme) {
  const root = document.documentElement;

  if (theme.primaryColor) {
    root.style.setProperty('--color-brand-hex', theme.primaryColor);
  }
  if (theme.fontFamily) {
    root.style.setProperty('--font-primary', theme.fontFamily);
  }

  localStorage.setItem('veritas_theme', JSON.stringify(theme));
}

export function loadTheme() {
  const saved = localStorage.getItem('veritas_theme');
  if (saved) {
    try {
      applyTheme(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to load organization theme", e);
    }
  }
}
