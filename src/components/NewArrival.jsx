// src/components/NewArrival.jsx — uniform cards, always-visible heart, quick-add popup
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { getNewArrivals } from "../api";
import { useWishlist } from "../context/WishlistContext";
import QuickAddModal from "./QuickAddModal";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";

const BRAND = "var(--brand)";
const BANNER_BG = "var(--primary)";
const BANNER_TEXT = "var(--title)";
const taka = (n) => `\u09F3${Number(n || 0).toLocaleString("en-BD")}`;
const imgFallback = (e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x800/f3f4f6/9ca3af?text=RAINZ"; };

function ProductTile({ product, onOpen, onAddToCart, onBuyNow, onToggleWishlist, isWishlisted }) {
  const discount = product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;


  function Stars({ rating = 0, size = 13 }) {
    const full = Math.round(rating);
    return (
      <span className="inline-flex text-amber-400">
        {Array.from({ length: 5 }).map((_, i) =>
          i < full
            ? <StarRoundedIcon key={i} style={{ fontSize: size }} />
            : <StarBorderRoundedIcon key={i} style={{ fontSize: size }} />
        )}
      </span>
    );
  }

  return (
    <div
      className="group relative rounded-xl border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer flex flex-col"
      style={{ backgroundColor: "var(--foreground)", borderColor: "var(--title)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold-light)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--gold-deep)"; }}
      onClick={() => onOpen(product)}
    >
      {discount > 0 && (
        <span className="absolute top-2 left-2 z-10 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: BRAND, color: "var(--button-text)" }}>-{discount}%</span>
      )}

      {/* Wishlist — always visible */}
      <button
        aria-label="Add to wishlist"
        onClick={(e) => { e.stopPropagation(); onToggleWishlist(product); }}
        className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full border backdrop-blur-sm shadow flex items-center justify-center transition-transform hover:scale-105"
        style={{
          backgroundColor: "rgba(11,11,11,.6)",
          borderColor: "var(--title)",
          color: isWishlisted ? BRAND : "var(--subtitle)",
        }}
      >
        {isWishlisted ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
      </button>

      {/* Image — FIXED height so every card is identical */}
      <div className="h-56 sm:h-60 w-full flex items-center justify-center" style={{ background: "linear-gradient(to bottom, #1F1F1F, #0F0F0F)" }}>
        <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" onError={imgFallback} />
      </div>

      {/* Info — fixed structure keeps all cards equal height */}
      <div className="w-full px-3 pt-2 pb-3 flex flex-col" style={{ backgroundColor: "var(--foreground)" }}>
        <p className="text-sm truncate" style={{ color: "var(--details)" }}>{product.name}</p>

        {/* Rating + review count */}
        <div className="flex items-center gap-1 mt-0.5 h-4">
          {product.reviews > 0 ? (
            <>
              <Stars rating={product.rating} />
              <span className="text-[11px]" style={{ color: "var(--subtitle)" }}>{Number(product.rating).toFixed(1)}</span>
              <span className="text-[11px]" style={{ color: "var(--subtitle)", opacity: 0.7 }}>({product.reviews})</span>
            </>
          ) : (
            <span className="text-[11px]" style={{ color: "var(--subtitle)", opacity: 0.5 }}>No reviews yet</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-0.5 h-5">
          <span className="text-sm font-bold" style={{ color: "var(--title)" }}>{taka(product.price)}</span>
          {product.oldPrice && <span className="text-xs line-through" style={{ color: "var(--subtitle)", opacity: 0.7 }}>{taka(product.oldPrice)}</span>}
        </div>

        <div className="mt-2 grid grid-cols-1 gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
            className="w-full flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: BRAND, color: "var(--button-text)" }}
          >
            <ShoppingBagOutlinedIcon style={{ fontSize: 15 }} /> Add to Bag
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onBuyNow(product); }}
            className="w-full rounded-md py-1.5 text-xs font-semibold border-2 transition-colors"
            style={{ borderColor: "var(--title)", color: BRAND, backgroundColor: "transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = BRAND;
              e.currentTarget.style.color = "var(--button-text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = BRAND;
            }}
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

function SkeletonTile() {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--foreground)", borderColor: "var(--border)" }}>
      <div className="h-56 sm:h-60 animate-pulse" style={{ backgroundColor: "rgba(212,175,55,.06)" }} />
      <div className="p-3 space-y-2">
        <div className="h-3 rounded w-3/4 animate-pulse" style={{ backgroundColor: "rgba(212,175,55,.06)" }} />
        <div className="h-7 rounded animate-pulse" style={{ backgroundColor: "rgba(212,175,55,.06)" }} />
        <div className="h-7 rounded animate-pulse" style={{ backgroundColor: "rgba(212,175,55,.06)" }} />
      </div>
    </div>
  );
}

export default function NewArrival({
  title = "our latest collection",
  products: productsProp,
  limit = 12,
  wishlistIds = [],
  onAddToCart,
  onToggleWishlist,
  onProductClick,
  viewAllPath = "/new-arrivals",
  showViewAll = true,
}) {
  const navigate = useNavigate();
  const { has, toggle } = useWishlist();

  const [fetched, setFetched] = useState([]);
  const [loading, setLoading] = useState(!productsProp);
  const [quickSlug, setQuickSlug] = useState(null);

  useEffect(() => {
    if (productsProp) return;
    let alive = true;
    setLoading(true);
    getNewArrivals(limit)
      .then((data) => alive && setFetched(data))
      .catch(() => alive && setFetched([]))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [productsProp, limit]);

  const products = productsProp ?? fetched;

  const handleOpen = (p) => (onProductClick ? onProductClick(p) : navigate(`/product/${p.slug}`));
  const handleAdd = (p) => (onAddToCart ? onAddToCart(p) : setQuickSlug(p.slug)); // open popup to pick size/color
  const handleBuyNow = (p) => navigate(`/product/${p.slug}`);
  const handleWish = (p) => (onToggleWishlist ? onToggleWishlist(p) : toggle(p));
  const isWished = (p) => (wishlistIds.length ? wishlistIds.includes(p.id) : has(p.id));



  return (
    <section
      className="w-full mt-1 md:mt-12 lg:mt-16 overflow-hidden"
      style={{ backgroundColor: "var(--primary)" }}
    >
      <div className="w-full pt-2 pb-1 px-4" style={{ backgroundColor: "var(--primary)" }}>
        <h2 className="text-center text-xs sm:text-base md:text-lg lg:text-xl font-serif italic font-semibold uppercase tracking-[0.08em] sm:tracking-[0.15em] md:tracking-[0.25em] leading-snug px-3" style={{ color: BRAND }}>
          {title}
        </h2>
      </div>

      <div className="w-[94%] max-w-[1500px] mx-auto px-1 pt-1 pb-2">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {loading
            ? Array.from({ length: limit }).map((_, i) => <SkeletonTile key={i} />)
            : products.map((product) => (
              <ProductTile
                key={product.id ?? product.slug}
                product={product}
                onOpen={handleOpen}
                onAddToCart={handleAdd}
                onBuyNow={handleBuyNow}
                onToggleWishlist={handleWish}
                isWishlisted={isWished(product)}
              />
            ))}
        </div>

        {!loading && products.length === 0 && <p className="text-center py-10" style={{ color: "var(--subtitle)" }}>No new arrivals yet.</p>}

        {showViewAll && !loading && products.length > 0 && (
          <div className="mt-8 flex justify-center">
            <button onClick={() => navigate(viewAllPath)} className="rounded-full border-2 px-8 py-2.5 text-sm font-semibold transition-colors hover:text-white"
              style={{ borderColor: "var(--title)", color: "var(--title)", backgroundColor: "transparent" }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--title)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--title)"; }}>
              View All New Arrivals &rarr;
            </button>
          </div>
        )}
      </div>

      <QuickAddModal slug={quickSlug} onClose={() => setQuickSlug(null)} />
    </section>
  );
}
