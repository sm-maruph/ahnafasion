// src/components/CategoryPage.jsx — uniform cards, always-visible Add to Bag, size/color info, loading
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { getProducts, getCategories } from "../api";
import { useWishlist } from "../context/WishlistContext";
import QuickAddModal from "./QuickAddModal";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const BRAND = "var(--brand)"; const taka = (n) => `\u09F3${Number(n || 0).toLocaleString("en-BD")}`;
const prettify = (s = "") => s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
const imgFallback = (e, label = "RAINZ") => { e.target.onerror = null; e.target.src = `https://placehold.co/600x800/f3f4f6/9ca3af?text=${encodeURIComponent(label)}`; };

const SORTS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

function ProductCard({ product, accent, onOpen, onAdd }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const discount = product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  const sizes = product.sizes || [];
  const colors = product.colors || [];

  return (
    <div className="group flex flex-col rounded-xl border shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
      style={{ backgroundColor: "var(--foreground)", borderColor: "var(--button)" }}>
      <div className="relative cursor-pointer" onClick={() => onOpen(product)}>
        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--button)", color: "var(--button-text)" }}>-{discount}%</span>
        )}
        <button aria-label="Add to wishlist" onClick={(e) => { e.stopPropagation(); toggle(product); }}
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full border backdrop-blur-sm shadow flex items-center justify-center transition-transform hover:scale-105"
          style={{
            backgroundColor: "rgba(11,11,11,.6)",
            borderColor: "var(--border)",
            color: wished ? "var(--button)" : "var(--subtitle)",
          }}>
          {wished ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </button>

        {/* Fixed-height image keeps every card identical */}
        <div className="h-56 sm:h-60 flex items-center justify-center" style={{ background: "linear-gradient(to bottom, #1F1F1F, #0F0F0F)" }}>
          <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" onError={(e) => imgFallback(e, product.name)} />
        </div>
      </div>

      {/* Info */}
      <div className="px-3 pt-2 pb-3 flex flex-col flex-1">
        {product.brand && <p className="text-[11px] uppercase tracking-wide truncate" style={{ color: "var(--button)", opacity: 0.7 }}>{product.brand}</p>}
        <p className="text-sm truncate cursor-pointer hover:underline" style={{ color: "var(--details)" }} onClick={() => onOpen(product)}>{product.name}</p>

        <div className="flex items-center gap-2 mt-0.5 h-5">
          <span className="text-sm font-bold" style={{ color: "var(--button)" }}>{taka(product.price)}</span>
          {product.oldPrice && <span className="text-xs line-through" style={{ color: "var(--button)", opacity: 0.7 }}>{taka(product.oldPrice)}</span>}
        </div>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5 h-4">
            {colors.slice(0, 5).map((c) => (
              <span key={c.name} title={c.name} className="h-3.5 w-3.5 rounded-full border" style={{ backgroundColor: c.hex || "#9ca3af", borderColor: "rgba(255,255,255,.25)" }} />
            ))}
            {colors.length > 5 && <span className="text-[10px]" style={{ color: "var(--subtitle)" }}>+{colors.length - 5}</span>}
          </div>
        )}

        {/* Sizes */}
        {sizes.length > 0 && (
          <p className="text-[11px] mt-1 truncate" style={{ color: "var(--subtitle)" }}>Sizes: {sizes.join(", ")}</p>
        )}

        {/* Stock */}
        <p className="text-[11px] font-medium mt-1" style={{ color: product.inStock ? "#4ADE80" : "#F87171" }}>
          {product.inStock ? "In stock" : "Out of stock"}
        </p>

        {/* Add to Bag — always visible (mobile + desktop) */}
        <button
          onClick={(e) => { e.stopPropagation(); onAdd(product); }}
          disabled={!product.inStock}
          className="mt-2 w-full flex items-center justify-center gap-1.5 rounded-md py-2 text-xs font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
          style={{ backgroundColor: "var(--button)", color: "var(--button-text)" }}>
          <ShoppingBagOutlinedIcon style={{ fontSize: 15 }} /> Add to Bag
        </button>
      </div>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-xl border shadow-sm overflow-hidden" style={{ backgroundColor: "var(--foreground)", borderColor: "var(--border)" }}>
      <div className="h-56 sm:h-60 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
      <div className="p-3 space-y-2">
        <div className="h-2.5 rounded w-1/3 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
        <div className="h-3 rounded w-3/4 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
        <div className="h-3 rounded w-1/3 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
        <div className="h-8 rounded animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
      </div>
    </div>
  );
}

export default function CategoryPage() {
  const { category, subcategory } = useParams();
  const navigate = useNavigate();

  const isNewArrivals = category === "new-arrivals";

  const [tree, setTree] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("newest");
  const [visible, setVisible] = useState(12);
  const [quickSlug, setQuickSlug] = useState(null);

  const cat = useMemo(() => tree.find((c) => c.slug === category), [tree, category]);
  const accent = cat?.accent || BRAND;
  const subChips = useMemo(() => {
    if (!cat) return [];
    const seen = new Map();
    (cat.groups || []).flatMap((g) => g.items).forEach((it) => {
      const slug = it.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      if (!seen.has(slug)) seen.set(slug, { name: it, slug });
    });
    return [...seen.values()];
  }, [cat]);

  const title = isNewArrivals ? "New Arrivals" : subcategory ? prettify(subcategory) : cat?.name || prettify(category);

  useEffect(() => {
    let alive = true;
    getCategories().then((t) => alive && setTree(t));
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setVisible(12);
    const query = isNewArrivals ? { sort } : { category, subcategory, sort };
    getProducts(query)
      .then((res) => alive && setProducts(res.items))
      .catch(() => alive && setProducts([]))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [category, subcategory, sort, isNewArrivals]);

  const shown = products.slice(0, visible);
  const openProduct = (p) => navigate(`/product/${p.slug}`);
  const handleAdd = (p) => setQuickSlug(p.slug); // popup enforces size/color/qty

  return (
    <div className="w-[94%] max-w-[1500px] mx-auto py-8 min-h-screen" style={{ backgroundColor: "var(--primary)" }}>
      {/* Breadcrumb */}
      <nav className="text-xs mb-3 flex items-center flex-wrap gap-y-1" style={{ color: "var(--title)" }}>
        <Crumb to="/">Home</Crumb>
        {!isNewArrivals && category && (
          <>
            <ChevronRightIcon style={{ fontSize: 14, color: "var(--subtitle)" }} className="mx-0.5" />
            <Crumb to={`/${category}`} className="capitalize">{cat?.name || prettify(category)}</Crumb>
          </>
        )}
        {subcategory && (
          <>
            <ChevronRightIcon style={{ fontSize: 14, color: "var(--subtitle)" }} className="mx-0.5" />
            <span className="px-1.5 py-0.5 capitalize" style={{ color: "var(--subtitle)" }}>{prettify(subcategory)}</span>
          </>
        )}
      </nav>

      {/* Title + count */}
      <div className="flex items-end justify-between flex-wrap gap-2">
        <h1 className="text-2xl md:text-3xl font-heading font-extrabold" style={{ color: "var(--title)" }}>
          {title}
          <span className="ml-2 h-1.5 w-10 inline-block rounded-full align-middle" style={{ backgroundColor: accent }} />
        </h1>
        <p className="text-sm" style={{ color: "var(--subtitle)" }}>{loading ? "Loading…" : `${products.length} products`}</p>
      </div>

      {/* Toolbar */}
      <div className="mt-5 flex items-center justify-between gap-4 flex-wrap">
        {!isNewArrivals && subChips.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => navigate(`/${category}`)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={!subcategory
                ? { backgroundColor: "var(--button)", borderColor: "var(--button)", color: "var(--button-text)" }
                : { backgroundColor: "transparent", borderColor: "var(--border)", color: "var(--subtitle)" }}
            >
              All {cat?.name || prettify(category)}
            </button>
            {subChips.map((s) => {
              const active = subcategory === s.slug;
              return (
                <button
                  key={s.slug}
                  onClick={() => navigate(`/${category}/${s.slug}`)}
                  className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
                  style={
                    active
                      ? { backgroundColor: "var(--brand)", borderColor: "var(--brand)", color: "#fff" }
                      : { backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--subtitle)" }
                  }
                  onMouseEnter={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "var(--brand)";
                      e.currentTarget.style.borderColor = "var(--brand)";
                      e.currentTarget.style.color = "#fff";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!active) {
                      e.currentTarget.style.backgroundColor = "var(--background)";
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--subtitle)";
                    }
                  }}
                >
                  {s.name}
                </button>
              );
            })}
          </div>
        ) : (<span />)}

        <label className="flex items-center gap-2 text-sm" style={{ color: "var(--subtitle)" }}>
          Sort:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-md border px-2 py-1.5 text-sm outline-none"
            style={{ backgroundColor: "var(--foreground)", borderColor: "var(--border)", color: "var(--details)" }}
          >
            {SORTS.map((s) => <option key={s.value} value={s.value} style={{ backgroundColor: "#171717", color: "#F8F6F2" }}>{s.label}</option>)}
          </select>
        </label>
      </div>

      {/* Grid */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => <CardSkeleton key={i} />)
          : shown.map((p) => <ProductCard key={p.id} product={p} accent={accent} onOpen={openProduct} onAdd={handleAdd} />)}
      </div>

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500">No products found in this collection yet.</p>
          <button onClick={() => navigate("/")} className="mt-4 rounded-full px-6 py-2 text-sm font-semibold text-white" style={{ backgroundColor: accent }}>Back to Home</button>
        </div>
      )}

      {/* Load more */}
      {!loading && visible < products.length && (
        <div className="mt-10 flex justify-center">
          <button onClick={() => setVisible((v) => v + 12)} className="rounded-full border-2 px-8 py-2.5 text-sm font-semibold transition-colors hover:text-white"
            style={{ borderColor: BRAND, color: BRAND, backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = BRAND;
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = BRAND;
            }}>
            Load More ({shown.length} of {products.length})
          </button>
        </div>
      )}

      {/* Quick-add popup */}
      <QuickAddModal slug={quickSlug} onClose={() => setQuickSlug(null)} />
    </div>
  );

  function Crumb({ to, children, className = "" }) {
    return (
      <Link
        to={to}
        className={`no-underline px-1.5 py-0.5 rounded transition-colors ${className}`}
        style={{ color: "var(--title)" }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--button)"; e.currentTarget.style.color = "var(--button-text)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--title)"; }}
      >
        {children}
      </Link>
    );
  }
}
