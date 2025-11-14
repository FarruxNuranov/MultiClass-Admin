// src/hooks/useThemeMode.js
import { useEffect, useMemo, useState, useCallback } from "react";

const STORAGE_KEY = "theme-mode"; // "light" | "dark"
const THEME_EVENT = "theme-mode-changed";

function getSystemMode() {
  if (typeof window === "undefined") return "light";
  return window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useThemeMode() {
  const [mode, setMode] = useState(() => {
    if (typeof window === "undefined") return "light";
    const saved = window.localStorage
      ? window.localStorage.getItem(STORAGE_KEY)
      : null;
    return saved === "light" || saved === "dark" ? saved : getSystemMode();
  });

  // Persist to localStorage
  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  // React to system changes if user hasn't explicitly chosen
  useEffect(() => {
    const mql =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
    if (!mql || !mql.addEventListener) return;

    const handler = (e) => {
      const saved = window.localStorage
        ? window.localStorage.getItem(STORAGE_KEY)
        : null;
      if (saved !== "light" && saved !== "dark") {
        setMode(e.matches ? "dark" : "light");
      }
    };

    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  // Sync across app (same tab) without reload using a custom event
  useEffect(() => {
    const handler = (e) => {
      const next = e?.detail;
      if (next === "light" || next === "dark") {
        setMode(next);
        if (typeof document !== "undefined") {
          document.documentElement.setAttribute("data-theme", next);
        }
      }
    };
    window.addEventListener(THEME_EVENT, handler);
    return () => window.removeEventListener(THEME_EVENT, handler);
  }, []);

  const toggle = useCallback(() => {
    const next = mode === "dark" ? "light" : "dark";
    setMode(next);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", next);
    }
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
    // Broadcast change to all hook instances (same tab)
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: next }));
    }
  }, [mode]);

  const value = useMemo(() => ({ mode, setMode, toggle }), [mode, toggle]);
  return value;
}

export default useThemeMode;
