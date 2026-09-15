export const COLOR_HEX = {
  black: "#111827", white: "#f9fafb", red: "#ef4444", blue: "#3b82f6", navy: "#1e3a8a",
  green: "#22c55e", grey: "#9ca3af", gray: "#9ca3af", pink: "#ec4899", yellow: "#eab308",
  purple: "#8b5cf6", brown: "#92400e", beige: "#e7d8b1", olive: "#6b7280", maroon: "#7f1d1d",
};

export const normalizeHex = (value) => {
  const hex = String(value || "").trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(hex)) return "#" + hex.split("").map((c) => c + c).join("").toUpperCase();
  return /^[0-9a-f]{6}$/i.test(hex) ? "#" + hex.toUpperCase() : null;
};
export const toColorVariants = (colors = []) => colors.map((color) => {
  const name = typeof color === "string" ? color : color.name || "";
  return { name, hex: normalizeHex(color.hex) || COLOR_HEX[name.toLowerCase()] || "#9CA3AF" };
});
export const colorError = (colors) => {
  if (colors.some((c) => !c.name.trim())) return "Enter a name for every color variant.";
  if (colors.some((c) => !normalizeHex(c.hex))) return "Enter a valid hex code, such as #D4AF37, for every color.";
  if (new Set(colors.map((c) => c.name.trim().toLowerCase())).size !== colors.length) return "Each color variant needs a unique name.";
  return "";
};
