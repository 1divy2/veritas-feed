import { useState, useEffect } from "react";

type MemoryItem = {
  id: string;
  type: "investigation" | "narrative" | "source";
  label: string;
  timestamp: number;
  url: string;
};

export function useMemory() {
  const [recent, setRecent] = useState<MemoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("veritas:memory");
      if (stored) {
        setRecent(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse memory", e);
    }
  }, []);

  const addToMemory = (item: Omit<MemoryItem, "timestamp">) => {
    setRecent((prev) => {
      const filtered = prev.filter((p) => p.id !== item.id);
      const updated = [{ ...item, timestamp: Date.now() }, ...filtered].slice(0, 10);
      localStorage.setItem("veritas:memory", JSON.stringify(updated));
      return updated;
    });
  };

  const clearMemory = () => {
    localStorage.removeItem("veritas:memory");
    setRecent([]);
  };

  return { recent, addToMemory, clearMemory };
}
