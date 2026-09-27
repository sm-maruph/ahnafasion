import { ProductCardPrice, ProductCardReviews } from "./ProductCardMeta";
// src/components/SalePage.jsx — shows products from active sale campaigns (computed prices)
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getSaleProducts } from "../api";
import { useWishlist } from "../context/WishlistContext";
import QuickAddModal from "./QuickAddModal";
import "./SalePage.css";

const BRAND = "var(--brand)";
const SALE = "var(--brand)";

const pctOff = (p) => (p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) : 0);
const imgFallback = (e, label = "RAINZ") => { e.target.onerror = null; e.target.src = `https://placehold.co/600x800/f3f4f6/9ca3af?text=${encodeURIComponent(label)}`; };

function useCountdown(endDate) {
  const target = endDate ? new Date(endDate + "T23:59:59").getTime() : null;
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!target) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  if (!target) return null;
  const diff = Math.max(0, target - now);
  if (diff === 0) return null;
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const sec = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s: sec };
}
const pad = (n) => String(n).padStart(2, "0");

const THRESHOLDS = [
  { label: "All Deals", min: 0 }, { label: "10% +", min: 10 }, { label: "20% +", min: 20 }, { label: "30% +", min: 30 }, { label: "50% +", min: 50 },
];

function SaleCard({ product, onOpen, onAdd }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);
  const off = pctOff(product);
  const cd = useCountdown(product.saleEnds);
  return (
    <article className="sale-card group">
      {off > 0 && <span className="sale-badge">-{off}%</span>}
      <button onClick={(e) => { e.stopPropagation(); toggle(product); }} className="sale-wishlist" style={{ color: wished ? SALE : "var(--details)" }} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished}>
        {wished ? <FavoriteIcon style={{ fontSize: 17 }} /> : <FavoriteBorderIcon style={{ fontSize: 17 }} />}
      </button>

      <button type="button" className="sale-image" onClick={() => onOpen(product)} aria-label={`View ${product.name}`}>
        <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" onError={(e) => imgFallback(e, product.name)} />
      </button>

      <div className="sale-card-body">
        <button className="sale-product-name" onClick={() => onOpen(product)}>{product.name}</button>
        <ProductCardReviews product={product} />
        <ProductCardPrice product={product} />
        {cd && (
          <p className="sale-countdown">
            <AccessTimeIcon style={{ fontSize: 13 }} />
            {cd.d > 0 ? `${cd.d}d ` : ""}{pad(cd.h)}:{pad(cd.m)}:{pad(cd.s)} left
          </p>
        )}
        <button onClick={() => onAdd(product)} className="sale-add" style={{ backgroundColor: BRAND }}>
          <ShoppingBagOutlinedIcon style={{ fontSize: 15 }} /> Add to Bag
        </button>
      </div>
    </article>
  );
}

export default function SalePage() {
  const navigate = useNavigate();
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [minOff, setMinOff] = useState(0);
  const [sort, setSort] = useState("discount");
  const [quickSlug, setQuickSlug] = useState(null);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    getSaleProducts()
      .then((items) => { if (alive) setAll(items || []); })
      .catch(() => alive && setAll([]))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  const visible = useMemo(() => {
    let list = all.filter((p) => pctOff(p) >= minOff);
    if (sort === "discount") list = [...list].sort((a, b) => pctOff(b) - pctOff(a));
    else if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [all, minOff, sort]);

  const openProduct = (p) => navigate(`/product/${p.slug}`);
  const handleAdd = (p) => setQuickSlug(p.slug);
  const maxDiscount = all.reduce((max, product) => Math.max(max, pctOff(product)), 0);

  return (
    <div className="sale-page w-[92%] sm:w-[94%] max-w-[1300px] mx-auto py-6 sm:py-8">
      <header className="sale-hero">
        <div className="sale-hero-copy">
          <p className="sale-eyebrow"><LocalOfferOutlinedIcon style={{ fontSize: 15 }} /> The sale edit</p>
          <h1>Your favourites.<br /><span>For a little less.</span></h1>
          <p className="sale-intro">Discover special prices on styles you'll love to wear.</p>
          <a className="sale-hero-link" href="#sale-products">Explore the offers <span aria-hidden="true">&rarr;</span></a>
        </div>
        {maxDiscount > 0 && <div className="sale-hero-offer"><span>Save up to</span><strong>{maxDiscount}<span>%</span></strong><span>on selected styles</span></div>}
      </header>

      <div id="sale-products" className="sale-toolbar mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {THRESHOLDS.map((t) => {
            const active = minOff === t.min;
            return (
              <button key={t.min} onClick={() => setMinOff(t.min)} className={`sale-filter${active ? " is-active" : ""}`} aria-pressed={active}>
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label htmlFor="sale-sort" className="sale-sort-label">Sort by</label>
          <select id="sale-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="sale-sort">
            <option value="discount">Biggest discount</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {!loading && <p className="sale-result-count" aria-live="polite">{visible.length} product{visible.length !== 1 ? "s" : ""} on sale</p>}

      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {loading
          ? Array.from({ length: 10 }).map((_, i) => (
              <div key={i}>
                <div className="h-56 sm:h-60 rounded-xl bg-gray-100 animate-pulse" />
                <div className="h-3 bg-gray-100 rounded mt-2 w-3/4 animate-pulse" />
                <div className="h-8 bg-gray-100 rounded mt-2 animate-pulse" />
              </div>
            ))
          : visible.map((p) => <SaleCard key={p.id} product={p} onOpen={openProduct} onAdd={handleAdd} />)}
      </div>

      {!loading && visible.length === 0 && <div className="sale-empty"><p>{all.length ? "No offers match this discount." : "New offers are on their way."}</p>{all.length ? <button className="sale-filter" onClick={() => setMinOff(0)}>View all deals</button> : <span>Check back soon for special prices on your favourite styles.</span>}</div>}

      <QuickAddModal slug={quickSlug} onClose={() => setQuickSlug(null)} />
    </div>
  );
}
