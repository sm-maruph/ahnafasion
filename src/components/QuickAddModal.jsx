// src/components/QuickAddModal.jsx — choose size/color/qty before adding to the bag
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { getProductBySlug } from "../api";
import { useCart } from "../context/CartContext";

const BRAND = "var(--brand)";
const taka = (n) => `\u09F3${Number(n || 0).toLocaleString("en-BD")}`;
const imgFallback = (e, label = "RAINZ") => { e.target.onerror = null; e.target.src = `https://placehold.co/300x400/f3f4f6/9ca3af?text=${encodeURIComponent(label)}`; };

export default function QuickAddModal({ slug, onClose }) {
  const { add } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let alive = true;
    setLoading(true); setError(""); setProduct(null);
    setSize(null); setColor(null); setQty(1); setDone(false);
    getProductBySlug(slug)
      .then((p) => { if (alive) setProduct(p); })
      .catch(() => alive && setError("Could not load this product."))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [slug]);

  if (!slug) return null;

  const needsSize = product?.sizes?.length > 0;
  const needsColor = product?.colors?.length > 0;

  const confirm = () => {
    if (needsColor && !color) { setError("Please select a color."); return; }
    if (needsSize && !size) { setError("Please select a size."); return; }
    add(product, { size, color, qty });
    setDone(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="rounded-2xl w-full max-w-md shadow-2xl border" style={{ backgroundColor: "var(--foreground)", borderColor: "var(--border)" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "var(--border)" }}>
          <h3 className="text-base font-bold font-heading" style={{ color: "var(--title)" }}>Add to Bag</h3>
          <button onClick={onClose} className="transition-colors hover:opacity-70" style={{ color: "var(--subtitle)" }}><CloseIcon /></button>
        </div>

        {loading ? (
          <div className="p-5 flex gap-4">
            <div className="h-32 w-24 rounded-lg animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
            <div className="flex-1 space-y-3">
              <div className="h-4 rounded w-2/3 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
              <div className="h-4 rounded w-1/3 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
              <div className="h-8 rounded animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
            </div>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-sm" style={{ color: "#F87171" }}>{error}</div>
        ) : done ? (
          <div className="p-8 text-center">
            <CheckCircleRoundedIcon style={{ fontSize: 48, color: "#4ADE80" }} />
            <p className="mt-2 text-sm font-semibold" style={{ color: "var(--details)" }}>Added to your bag</p>
          </div>
        ) : product ? (
          <>
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="flex gap-4">
                <img src={product.image} alt={product.name} className="h-32 w-24 rounded-lg object-cover" style={{ backgroundColor: "#0F0F0F" }} onError={(e) => imgFallback(e, product.name)} />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-widest" style={{ color: "var(--subtitle)", opacity: 0.7 }}>{product.brand}</p>
                  <p className="text-sm font-semibold" style={{ color: "var(--details)" }}>{product.name}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-bold" style={{ color: "var(--title)" }}>{taka(product.price)}</span>
                    {product.oldPrice && <span className="text-sm line-through" style={{ color: "var(--subtitle)", opacity: 0.7 }}>{taka(product.oldPrice)}</span>}
                  </div>
                  <p className="mt-1 text-xs font-medium" style={{ color: product.inStock ? "#4ADE80" : "#F87171" }}>{product.inStock ? "In stock" : "Out of stock"}</p>
                </div>
              </div>

              {needsColor && (
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--details)" }}>Color: <span className="font-normal" style={{ color: "var(--subtitle)" }}>{color || "Please select"}</span></p>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((c) => (
                      <button key={c.name} onClick={() => { setColor(c.name); setError(""); }} title={c.name} className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110" style={{ backgroundColor: c.hex, borderColor: color === c.name ? BRAND : "rgba(255,255,255,.25)" }} />
                    ))}
                  </div>
                </div>
              )}

              {needsSize && (
                <div>
                  <p className="text-sm font-semibold mb-2" style={{ color: "var(--details)" }}>Select Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button key={s} onClick={() => { setSize(s); setError(""); }} className="min-w-[44px] rounded-md border px-3 py-2 text-sm font-medium transition-colors"
                        style={size === s
                          ? { backgroundColor: BRAND, borderColor: BRAND, color: "var(--button-text)" }
                          : { backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--subtitle)" }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-semibold mb-2" style={{ color: "var(--details)" }}>Quantity</p>
                <div className="inline-flex items-center rounded-md border" style={{ borderColor: "var(--border)" }}>
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-2 transition-colors hover:bg-white/5" style={{ color: "var(--subtitle)" }}><RemoveIcon style={{ fontSize: 16 }} /></button>
                  <span className="px-4 text-sm font-semibold" style={{ color: "var(--details)" }}>{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="px-3 py-2 transition-colors hover:bg-white/5" style={{ color: "var(--subtitle)" }}><AddIcon style={{ fontSize: 16 }} /></button>
                </div>
              </div>

              {error && <p className="text-sm font-medium" style={{ color: "#F87171" }}>{error}</p>}
            </div>

            <div className="flex items-center gap-3 px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
              <button onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-white/5" style={{ color: "var(--subtitle)" }}>Cancel</button>
              <button onClick={confirm} disabled={!product.inStock} className="flex-1 flex items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-bold disabled:opacity-50" style={{ backgroundColor: "var(--button)", color: "var(--button-text)" }}>
                <ShoppingBagOutlinedIcon style={{ fontSize: 18 }} /> Add to Bag
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
