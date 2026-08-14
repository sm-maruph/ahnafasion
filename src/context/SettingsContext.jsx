// src/context/SettingsContext.jsx — load settings once + apply theme colors as CSS variables
import { createContext, useContext, useEffect, useState } from "react";
import { getSettings } from "../api";

const SettingsContext = createContext(null);

const DEFAULT_THEME = {
  brand: "#D4AF37", men: "#D4AF37", women: "#D4AF37",
  kids: "#F59E0B", accessories: "#0D9488", sale: "#7C3AED",
};

const safeAccent = (value, fallback = "#D4AF37") => {
  if (!/^#[0-9a-f]{6}$/i.test(String(value || ""))) return fallback;
  const hex = value.slice(1);
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  // Prevent near-black accents from disappearing against the storefront.
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) < 70 ? fallback : value;
};

const FALLBACK = {
  storeName: "Ahnaf Fashion", tagline: "", currency: "BDT", supportEmail: "", supportPhone: "",
  logo: "", address: "", city: "", hours: "",
  delivery: { inside: 80, outside: 120, freeThreshold: 0 },
  payments: [], social: {}, maintenance: false, theme: DEFAULT_THEME,
};

// Write the theme onto :root so the whole site can use var(--brand) etc.
export function applyTheme(theme = {}) {
  const t = { ...DEFAULT_THEME, ...theme };
  t.brand = safeAccent(t.brand);
  const root = document.documentElement;
  root.style.setProperty("--brand", t.brand);
  root.style.setProperty("--accent-men", t.men);
  root.style.setProperty("--accent-women", t.women);
  root.style.setProperty("--accent-kids", t.kids);
  root.style.setProperty("--accent-accessories", t.accessories);
  root.style.setProperty("--accent-sale", t.sale);
}

export function SettingsProvider({ children }) {
  const [settings, setSettingsState] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  // wrap setter so updating settings also re-applies the theme immediately
  const setSettings = (next) => {
    setSettingsState(next);
    if (next?.theme) applyTheme(next.theme);
  };

  useEffect(() => {
    // apply defaults instantly so there's no flash before the API responds
    applyTheme(DEFAULT_THEME);
    let alive = true;
    getSettings()
      .then((s) => { if (alive) { setSettingsState(s); applyTheme(s.theme); } })
      .catch(() => alive && setSettingsState(FALLBACK))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  return ctx || { settings: FALLBACK, loading: false, setSettings: () => {} };
}
