import { ProductCardPrice, ProductCardReviews } from "./ProductCardMeta";
// src/components/FeaturedCategories.jsx — real API, uniform cards, wishlist + Buy Now + Quick-Add
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { getProducts, getCategories } from "../api";
import { useWishlist } from "../context/WishlistContext";
import QuickAddModal from "./QuickAddModal";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const BRAND = "var(--brand)";

const slugify = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const imgFallback = (e, label = "RAINZ") => { e.target.onerror = null; e.target.src = `https://placehold.co/600x600/f3f4f6/9ca3af?text=${encodeURIComponent(label)}`; };
const CATEGORY_PLACEHOLDER = (label) => `https://placehold.co/800x1000/f3f4f6/9ca3af?text=${encodeURIComponent(label || "RAINZ")}`;

function ProductMini({ product, isViewMore, categoryLabel, accent, onOpen, onViewMore, onAdd, onBuyNow }) {
  const { has, toggle } = useWishlist();

  if (isViewMore) {
    return (
      <button
        type="button"
        onClick={onViewMore}
        aria-label={`View more ${categoryLabel || "products"}`}
        className="group relative flex h-full min-h-[320px] w-full flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border border-[var(--border)] px-4 py-8 text-center transition-colors duration-300 hover:border-[var(--brand)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
        style={{ background: "radial-gradient(ellipse at top, rgba(212,175,55,0.10), transparent 70%), var(--foreground)", color: "var(--details)" }}
      >
        <span className="text-[10px] font-medium uppercase tracking-[0.2em]" style={{ color: "var(--subtitle)" }}>
          More to discover
        </span>
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--brand)] text-[var(--brand)] transition-colors duration-300 group-hover:bg-[var(--brand)] group-hover:text-[var(--button-text)]">
          <ArrowForwardRoundedIcon aria-hidden="true" className="transition-transform duration-300 motion-safe:group-hover:translate-x-1" />
        </span>
        <span className="text-xl font-semibold">View more</span>
        <span className="max-w-[180px] text-xs leading-relaxed" style={{ color: "var(--subtitle)" }}>
          Explore the {categoryLabel || "full"} collection
        </span>
      </button>
    );
  }

  const wished = has(product.id);
  const discount = product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;

  return (
    <div className="group flex flex-col rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      style={{ background: "var(--card-surface)", boxShadow: "var(--surface-shadow)", borderColor: "var(--border)" }}>
      <div className="relative cursor-pointer" onClick={() => onOpen(product)}>
        {discount > 0 && (
          <span className="absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: BRAND, color: "var(--button-text)" }}>-{discount}%</span>
        )}
        <button aria-label="Add to wishlist" onClick={(e) => { e.stopPropagation(); toggle(product); }}
          className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full border backdrop-blur-sm shadow flex items-center justify-center transition-transform hover:scale-105"
          style={{
            backgroundColor: "rgba(11,11,11,.6)",
            borderColor: "var(--border)",
            color: wished ? accent : "var(--subtitle)",
          }}>
          {wished ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
        </button>
        {/* Fixed-height image keeps all cards uniform */}
        <div className="h-44 sm:h-48 flex items-center justify-center" style={{ background: "var(--image-surface)" }}>
          <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" onError={(e) => imgFallback(e, product.name)} />
        </div>
      </div>

      <div className="px-3 pt-2 pb-1 flex flex-col">
        <p className="text-sm truncate cursor-pointer hover:underline" style={{ color: "var(--details)" }} onClick={() => onOpen(product)}>{product.name}</p>

        <ProductCardReviews product={product} />

        <ProductCardPrice product={product} />

        <div className="mt-2 grid grid-cols-1 gap-1.5">
          <button onClick={(e) => { e.stopPropagation(); onAdd(product); }} className="w-full flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-opacity hover:opacity-90" style={{ backgroundColor: accent, color: "var(--button-text)" }}>
            <ShoppingBagOutlinedIcon style={{ fontSize: 15 }} /> Add to Bag
          </button>
          <button onClick={(e) => { e.stopPropagation(); onBuyNow(product); }} className="w-full rounded-md py-1.5 text-xs font-semibold border-2 transition-colors"
            style={{ borderColor: accent, color: accent, backgroundColor: "transparent" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = accent; e.currentTarget.style.color = "var(--button-text)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = accent; }}>
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

function Spotlight({ spotlight, products, loading, onOpen, onGo, onAdd, onBuyNow }) {
  const count = spotlight.count || 8;
  const accent = spotlight.accent || BRAND;
  const [activeSub, setActiveSub] = useState(null);

  // Fixed subcategory filtering: match by subcategory slug (product.subcategory is the slug)
  const filtered = useMemo(
    () => (activeSub ? products.filter((p) => p.subcategory === activeSub) : products),
    [products, activeSub]
  );
  const slots = filtered.slice(0, count);
  const chips = [{ name: "All", slug: null }, ...(spotlight.subcategories || [])];
  const chipStyle = (isActive) => isActive ? { backgroundColor: accent, borderColor: accent, color: "#fff" } : { backgroundColor: "#f9fafb", borderColor: "#e5e7eb", color: "#4b5563" };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={() => onGo(spotlight.link)}
          className="flex items-center gap-1 text-lg md:text-xl font-bold hover:opacity-80"
          style={{ color: "var(--title)" }}
        >
          {spotlight.label}
          {activeSub && <span className="font-medium  text-gray-400"> / {chips.find((c) => c.slug === activeSub)?.name}</span>}
          <ChevronRightIcon style={{ color: accent, fontSize: 22 }} />
        </button>
        <button onClick={() => onGo(activeSub ? `${spotlight.link}/${activeSub}` : spotlight.link)} className="text-sm font-semibold hover:underline" style={{ color: accent }}>View All &rarr;</button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map((sub) => {
          const isActive = activeSub === sub.slug;
          return (
            <button
              key={sub.slug ?? "all"}
              onClick={() => setActiveSub(sub.slug)}
              className="rounded-full border px-3 py-1 text-xs font-medium transition-colors"
              style={
                isActive
                  ? { backgroundColor: "var(--brand)", borderColor: "var(--brand)", color: "#fff" }
                  : { backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--subtitle)" }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--brand)";
                  e.currentTarget.style.borderColor = "var(--brand)";
                  e.currentTarget.style.color = "#fff";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "var(--background)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--subtitle)";
                }
              }}
            >
              {sub.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Feature card from real category image */}
        <div className="relative col-span-2 lg:row-span-2 rounded-lg overflow-hidden cursor-pointer group h-56 sm:h-72 lg:h-full" onClick={() => onGo(spotlight.link)}>
          <img src={spotlight.featureImage || CATEGORY_PLACEHOLDER(spotlight.label)} alt={spotlight.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => imgFallback(e, spotlight.label)} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute top-0 left-0 h-1 w-full" style={{ backgroundColor: accent }} />
          <h3 className="absolute bottom-4 left-4 text-white text-lg md:text-xl font-bold drop-shadow">{spotlight.label}</h3>
        </div>

        {loading ? (
          Array.from({ length: count }).map((_, i) => <div key={i} className="h-44 sm:h-48 rounded-lg bg-gray-100 animate-pulse" />)
        ) : slots.length === 0 ? (
          <div className="col-span-2 lg:col-span-4 flex items-center justify-center text-gray-400 text-sm py-10">No products in this subcategory yet.</div>
        ) : (
          slots.map((p, i) => (
            <ProductMini
              key={p.id ?? i}
              product={p}
              categoryLabel={spotlight.label}
              accent={accent}
              isViewMore={!activeSub && i === slots.length - 1 && products.length > count}
              onOpen={onOpen}
              onViewMore={() => onGo(spotlight.link)}
              onAdd={onAdd}
              onBuyNow={onBuyNow}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function FeaturedCategories({
  brandName = "Ahnaf Fashion",
  brandLink = "/new-arrivals",
  tagline = "Because comfort and confidence go hand in hand.",
  description = "We focus on carefully selecting the best clothing that is comfortable, looks great, and makes you confident. Beyond fabric, design, and fit, every piece passes strict quality checks — because the right outfit changes how you see yourself.",
  spotlightsProp,
  perCategory = 8,
  onProductClick,
}) {
  const navigate = useNavigate();
  const [spotlights, setSpotlights] = useState(spotlightsProp ?? []);
  const [productsBySpot, setProductsBySpot] = useState({});
  const [loading, setLoading] = useState(true);
  const [quickSlug, setQuickSlug] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);

    const resolveSpots = spotlightsProp
      ? Promise.resolve(spotlightsProp)
      : getCategories().then((cats) =>
        cats
          .filter((c) => c.slug !== "sale")
          .map((c) => ({
            id: c.slug, label: c.name, accent: c.accent,
            featureImage: c.image || null, // real category image from backend
            category: c.slug, link: `/${c.slug}`, count: perCategory,
            subcategories: Array.from(new Map((c.groups || []).flatMap((g) => g.items).map((it) => [slugify(it), { name: it, slug: slugify(it) }])).values()),
          }))
      );

    resolveSpots
      .then((spots) => {
        if (!alive) return;
        setSpotlights(spots);
        return Promise.all(spots.map((s) => getProducts({ category: s.category, pageSize: 24 }).then((res) => [s.id, res.items]))).then((entries) => alive && setProductsBySpot(Object.fromEntries(entries)));
      })
      .catch(() => { })
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spotlightsProp, perCategory]);

  const go = (link) => navigate(link || "/");
  const openProduct = (p) => (onProductClick ? onProductClick(p) : navigate(`/product/${p.slug}`));
  const handleAdd = (p) => setQuickSlug(p.slug);
  const handleBuyNow = (p) => navigate(`/product/${p.slug}`);

  return (
    <section className="w-full" >
      <div className="w-[94%] max-w-[1500px] mx-auto py-10">
        <div className="relative">
          <div className="max-w-3xl">
            <button onClick={() => go(brandLink)} className="flex items-center gap-1 text-2xl md:text-3xl font-semibold text-gray-800 hover:opacity-80" style={{ color: BRAND }}>
              {brandName}<ChevronRightIcon style={{ color: BRAND }} />
            </button>
            <p className="mt-2 text-lg md:text-xl font-medium" style={{ color: "var(--subtitle)" }}>{tagline}</p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--subtitle)" }}>{description}</p>
          </div>
        </div>

        <div className="mt-8 space-y-10">
          {(spotlights.length ? spotlights : Array.from({ length: 2 })).map((s, i) => (
            <Spotlight
              key={s?.id ?? i}
              spotlight={s || { count: perCategory, label: "", link: "/" }}
              products={s ? productsBySpot[s.id] || [] : []}
              loading={loading}
              onOpen={openProduct}
              onGo={go}
              onAdd={handleAdd}
              onBuyNow={handleBuyNow}
            />
          ))}
        </div>
      </div>

      <QuickAddModal slug={quickSlug} onClose={() => setQuickSlug(null)} />
    </section>
  );
}
