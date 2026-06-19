import { useEffect, useCallback, useRef } from "react";

type KeyHandler = (e: KeyboardEvent) => void;

const listeners = new Map<string, Set<KeyHandler>>();

function getBinding(e: KeyboardEvent): string | null {
  const parts: string[] = [];
  if (e.metaKey || e.ctrlKey) parts.push("mod");
  if (e.shiftKey) parts.push("shift");
  if (e.altKey) parts.push("alt");
  parts.push(e.key.toLowerCase());
  return parts.join("+");
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) {
    return;
  }
  const binding = getBinding(e);
  if (!binding) return;
  const handlers = listeners.get(binding);
  if (handlers && handlers.size > 0) {
    e.preventDefault();
    handlers.forEach(fn => fn(e));
  }
}

/**
 * Register a keyboard shortcut.
 *
 * Bindings use "+" syntax: "mod+k", "shift+j", "mod+shift+p"
 * "mod" maps to Meta on Mac, Ctrl on other platforms.
 *
 * @example
 * useKeyboardNav("mod+k", () => openPalette());
 * useKeyboardNav("j", () => moveDown());
 * useKeyboardNav("shift+?", () => showHelp());
 */
export function useKeyboardNav(binding: string, handler: KeyHandler, deps: unknown[] = []) {
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const stable = useCallback((e: KeyboardEvent) => {
    handlerRef.current(e);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (listeners.size === 0) {
      document.addEventListener("keydown", handleKeyDown);
    }
    const normalized = binding.replace(/mod/g, navigator.platform.includes("Mac") ? "meta" : "ctrl");
    if (!listeners.has(normalized)) {
      listeners.set(normalized, new Set());
    }
    listeners.get(normalized)!.add(stable);
    return () => {
      listeners.get(normalized)?.delete(stable);
      if (listeners.get(normalized)?.size === 0) {
        listeners.delete(normalized);
      }
      if (listeners.size === 0) {
        document.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [binding, stable]);
}
