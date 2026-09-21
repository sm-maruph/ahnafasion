// src/components/ProductDetail.jsx — wired to CartContext + WishlistContext
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderRoundedIcon from "@mui/icons-material/StarBorderRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { getProductBySlug, getProducts } from "../api";
import { useCart } from "../context/CartContext";
import ProductReviews from "./ProductReviews";
import { useWishlist } from "../context/WishlistContext";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import "./ProductGallery.css";
import { productColorImage } from "../utils/productColorImage";
import CheckoutLoader from "./CheckoutLoader";


const BRAND = "var(--brand)";
const taka = (n) => `\u09F3${Number(n || 0).toLocaleString("en-BD")}`;
const imgFallback = (e, label = "RAINZ") => {
  e.target.onerror = null;
  e.target.src = `https://placehold.co/600x800/f3f4f6/9ca3af?text=${encodeURIComponent(label)}`;
};

function Stars({ rating = 0 }) {
  const full = Math.round(rating);
  return (
    <span className="inline-flex text-amber-400 align-middle">
      {Array.from({ length: 5 }).map((_, i) =>
        i < full ? <StarRoundedIcon key={i} style={{ fontSize: 18 }} /> : <StarBorderRoundedIcon key={i} style={{ fontSize: 18 }} />
      )}
    </span>
  );
}

function MiniCard({ product, onOpen }) {
  const discount = product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;
  return (
    <div className="group cursor-pointer" onClick={() => onOpen(product)}>
      <div className="relative rounded-xl border overflow-hidden shadow-sm hover:shadow-lg transition-shadow" style={{ backgroundColor: "var(--foreground)", borderColor: "var(--border)" }}>
        {discount > 0 && <span className="absolute top-2 left-2 z-10 text-[10px] font-bold text-white px-1.5 py-0.5 rounded" style={{ backgroundColor: BRAND, color: "var(--button-text)" }}>-{discount}%</span>}
        <div className="aspect-[3/4] flex items-center justify-center p-3">
          <img src={product.image} alt={product.name} loading="lazy" className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" onError={(e) => imgFallback(e, product.name)} />
        </div>
      </div>
      <p className="text-sm text-gray-800 truncate mt-2 px-1">{product.name}</p>
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm font-bold text-gray-900">{taka(product.price)}</span>
        {product.oldPrice && <span className="text-xs text-gray-400 line-through">{taka(product.oldPrice)}</span>}
      </div>
    </div>
  );
}

function RelatedRow({ title, items, onOpen }) {
  if (!items?.length) return null;
  return (
    <section className="mt-12" >
      <h2 className="text-xl font-bold text-gray-900 mb-4">
        {title}
        <span className="ml-2 h-1.5 w-10 inline-block rounded-full align-middle" style={{ backgroundColor: BRAND }} />
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {items.map((p) => <MiniCard key={p.id} product={p} onOpen={onOpen} />)}
      </div>
    </section>
  );
}

function SizeChart({ chart }) {
  if (!chart?.columns?.length || !chart?.rows?.length) return null;
  return <details className="af-inline-size-chart" open>
    <summary><StraightenOutlinedIcon style={{ fontSize: 16 }} /> {chart.heading || "Size Chart"}</summary>
    <div className="border-t px-4 py-4" style={{ borderColor: "var(--border)" }}>
      <div className="af-size-chart-meta"><p>{chart.note}</p><span className="af-size-chart-unit">Measurements in cm</span></div>
      <div className="w-full overflow-hidden rounded-lg border" style={{ borderColor: "var(--border)" }}><table className="w-full table-fixed text-[10px] sm:text-xs"><thead><tr className="af-size-chart-header">{chart.columns.map((column) => <th key={column} className="px-1.5 sm:px-3 py-2.5 text-left font-bold break-words">{column}</th>)}</tr></thead><tbody>{chart.rows.map((row, index) => <tr key={index} className="border-t" style={{ borderColor: "var(--border)" }}>{chart.columns.map((column) => <td key={column} className="px-1.5 sm:px-3 py-2 break-words" style={{ color: "var(--details)" }}>{row[column]}</td>)}</tr>)}</tbody></table></div>
    </div>
  </details>;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const [checkoutItem, setCheckoutItem] = useState(null);
  const navigate = useNavigate();
  const { add } = useCart();
  const { has, toggle } = useWishlist();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [sameCategory, setSameCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [mainImg, setMainImg] = useState(null);
  const [size, setSize] = useState(null);
  const [color, setColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    setRelated([]); setSameCategory([]);
    window.scrollTo({ top: 0, behavior: "smooth" });

    getProductBySlug(slug)
      .then((p) => {
        if (!alive) return;
        setProduct(p);
        if (p) {
          setMainImg(p.images?.[0] || p.image);
          setColor(null);
          setSize(null);
          setQty(1);
          // Row 1 — same subcategory ("You may also like")
          const relatedIds = new Set();
          if (p.subcategory) {
            getProducts({ subcategory: p.subcategory, pageSize: 12 }).then((res) => {
              if (!alive) return;
              const rel = (res.items || []).filter((x) => x.id !== p.id).slice(0, 5);
              rel.forEach((r) => relatedIds.add(r.id));
              setRelated(rel);
              // Row 2 — same category, excluding current + the related ones above
              getProducts({ category: p.category, pageSize: 16 }).then((res2) => {
                if (!alive) return;
                setSameCategory((res2.items || []).filter((x) => x.id !== p.id && !relatedIds.has(x.id)).slice(0, 5));
              });
            });
          } else {
            setRelated([]);
            getProducts({ category: p.category, pageSize: 16 }).then((res2) => {
              if (!alive) return;
              setSameCategory((res2.items || []).filter((x) => x.id !== p.id).slice(0, 5));
            });
          }
        }
      })
      .catch(() => alive && setProduct(null))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [slug]);

  const openProduct = (p) => navigate(`/product/${p.slug}`);

  const needsSize = product?.sizes?.length > 0;
  const needsColor = product?.colors?.length > 0;
  const selectedVariant = product?.sizeVariants?.find((v) => v.name === size);
  const availableStock = selectedVariant ? selectedVariant.stock : Number(product?.stock || 0);

  const validate = () => {
    if (needsColor && !color) { setError("Please select a color first."); return false; }
    if (needsSize && !size) { setError("Please select a size first."); return false; }
    if (needsSize && selectedVariant && selectedVariant.stock < qty) { setError(`Only ${selectedVariant.stock} item(s) available in size ${size}.`); return false; }
    if (!qty || qty < 1) { setError("Please select a quantity."); return false; }
    setError("");
    return true;
  };

  const addToCart = async () => {
    if (adding || !validate()) return;
    setAdding(true);
    try { await add(product, { size, color, qty }); }
    catch (e) { setError(e.message || "Could not add this item. Please try again."); }
    finally { setAdding(false); }
  };

  const buyNow = () => {
    if (checkoutItem || !validate()) return;
    const item = {
      id: product.id, productId: product.id, slug: product.slug, name: product.name,
      image: productColorImage(product, color), price: product.price, oldPrice: product.oldPrice, size, color, qty,
    };
    setCheckoutItem(item);
  };

  const wished = product ? has(product.id) : false;

  if (loading) {
    return (
      <div className="w-[94%] max-w-[1300px] mx-auto py-10 grid lg:grid-cols-2 gap-10" style={{ backgroundColor: "var(--primary)" }}>
        <div className="aspect-[3/4] rounded-xl animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
        <div className="space-y-4">
          <div className="h-7 rounded w-2/3 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
          <div className="h-5 rounded w-1/3 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
          <div className="h-24 rounded animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
          <div className="h-10 rounded w-1/2 animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-[94%] max-w-[1300px] mx-auto py-24 text-center" style={{ backgroundColor: "var(--primary)" }}>
        <p className="text-gray-500">Sorry, this product could not be found.</p>
        <button onClick={() => navigate("/")} className="mt-4 rounded-full px-6 py-2 text-sm font-semibold text-white" style={{ backgroundColor: BRAND }}>Back to Home</button>
      </div>
    );
  }

  const discount = product.oldPrice && product.oldPrice > product.price ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0;


  const onZoomMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    const img = e.currentTarget.querySelector("img");
    if (img) img.style.transformOrigin = `${x}% ${y}%`;
  };

  return (
    <div className="af-product-page" style={{ backgroundColor: "var(--primary)" }}>
      <nav className="text-xs mb-5 flex items-center flex-wrap gap-y-1" style={{ color: "var(--title)" }}>
        <Crumb to="/">Home</Crumb>
        <ChevronRightIcon style={{ fontSize: 14, color: "var(--subtitle)" }} className="mx-0.5" />
        <Crumb to={`/${product.category}`}>{product.categoryName}</Crumb>
        {product.subcategory && (
          <>
            <ChevronRightIcon style={{ fontSize: 14, color: "var(--subtitle)" }} className="mx-0.5" />
            <Crumb to={`/${product.category}/${product.subcategory}`}>{product.subcategoryName}</Crumb>
          </>
        )}
      </nav>
      <div className="af-product-overview">
        {/* Gallery */}
        <div className="af-product-gallery">
          <div className="af-product-thumbnails" aria-label="Product images">
            {(product.images || [product.image]).map((src, i) => (
              <button
                key={i}
                type="button"
                aria-label={`View product image ${i + 1}`}
                aria-pressed={mainImg === src}
                onClick={() => setMainImg(src)}
                className="af-product-thumbnail"
                style={{ borderColor: mainImg === src ? BRAND : "#e5e7eb" }}
              >
                <img src={src} alt="" className="h-full w-full object-contain" onError={(e) => imgFallback(e)} />
              </button>
            ))}
          </div>

          <div
            className="af-product-main-image group"
            onMouseMove={onZoomMove}
          >
            <img
              src={mainImg}
              alt={product.name}
              className="w-full h-auto max-h-[760px] object-contain transition-transform duration-300 ease-out md:group-hover:scale-[2]"
              onError={(e) => imgFallback(e, product.name)}
            />
          </div>
        </div>

        {/* Info */}
        <div className="af-product-info">
          <p className="text-xs uppercase tracking-widest" style={{ color: "var(--button)" }}>{product.brand}</p>
          <div className="af-product-title-row"><h1 className="mt-1 text-2xl md:text-3xl font-bold" style={{ color: "var(--title)" }}>{product.name}</h1>
            <button type="button" onClick={() => toggle(product)} aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished} className="af-product-wishlist">{wished ? <FavoriteIcon /> : <FavoriteBorderIcon />}</button></div>

          <div className="mt-2 flex items-center gap-2 text-sm" style={{ color: "var(--subtitle)" }}>
            <Stars rating={product.rating} />
            <span>{product.rating}</span>
            <span className="text-gray-300">|</span>
            <span>{product.reviews} reviews</span>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-extrabold" style={{ color: "var(--button)" }}>{taka(product.price)}</span>
            {product.oldPrice && <span className="text-lg text-gray-400 line-through">{taka(product.oldPrice)}</span>}
            {discount > 0 && <span className="text-sm font-bold text-white px-2 py-0.5 rounded" style={{ backgroundColor: BRAND }}>-{discount}%</span>}
          </div>

          <p className={`mt-2 text-sm font-medium ${product.inStock ? "text-green-600" : "text-red-500"}`}>
            {product.inStock ? "In stock" : "Out of stock"}
          </p>

          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold" style={{ color: "var(--details)" }}>Color: <span className="font-normal" style={{ color: "var(--subtitle)" }}>{color || "Please select"}</span></p>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button key={c.name} onClick={() => { setColor(c.name); setMainImg(productColorImage(product, c.name)); setError(""); }} title={c.name} className="h-8 w-8 rounded-full border-2 transition-transform hover:scale-110" style={{ backgroundColor: c.hex, borderColor: color === c.name ? BRAND : "#e5e7eb" }} />
                ))}
              </div>
            </div>
          )}

          {needsSize && (
            <div className="mt-5">
              <div className="af-product-size-heading"><p className="text-sm font-semibold" style={{ color: "var(--details)" }}>Select size</p></div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => {
                  const variant = product.sizeVariants?.find((v) => v.name === s);
                  const soldOut = variant && variant.stock <= 0;
                  return <button key={s} disabled={soldOut} onClick={() => { setSize(s); setQty(1); setError(""); }} className="relative min-w-[44px] rounded-md border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    title={soldOut ? "Out of stock" : variant ? `${variant.stock} available` : ""}
                    style={size === s ? { backgroundColor: BRAND, borderColor: BRAND, color: "var(--button-text)" } : { backgroundColor: "var(--foreground)", borderColor: "var(--button)", color: "var(--button)" }}>
                    {s}{soldOut && <span className="absolute left-1 right-1 top-1/2 h-px rotate-[-18deg] bg-current" />}
                  </button>
                })}
              </div>
              {size && selectedVariant && <p className="mt-1 text-xs" style={{ color: "var(--subtitle)" }}>{selectedVariant.stock} available in size {size}</p>}
            </div>
          )}

          <div className="af-product-purchase-row">
          <div className="af-product-quantity" role="group" aria-label="Quantity">
            <div className="inline-flex items-center rounded-md border" style={{ borderColor: "var(--border)" }}>
              <button
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 transition-colors"
                style={{ color: "var(--subtitle)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--button)"; e.currentTarget.style.color = "var(--button-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--subtitle)"; }}
              >
                <RemoveIcon style={{ fontSize: 16 }} />
              </button>
              <span className="px-4 text-sm font-semibold" style={{ color: "var(--details)" }}>{qty}</span>
              <button
                aria-label="Increase quantity"
                onClick={() => setQty((q) => Math.min(availableStock || q + 1, q + 1))}
                disabled={availableStock > 0 && qty >= availableStock}
                className="px-3 py-2 transition-colors"
                style={{ color: "var(--subtitle)" }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--button)"; e.currentTarget.style.color = "var(--button-text)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--subtitle)"; }}
              >
                <AddIcon style={{ fontSize: 16 }} />
              </button>
            </div>
          </div>


          <div className="af-product-purchase-buttons">
            <button onClick={addToCart} disabled={!product.inStock || adding}
              className="w-full flex items-center justify-center gap-2 rounded-md border-2 text-sm font-bold transition-colors disabled:cursor-not-allowed"
              style={{ borderColor: product.inStock ? BRAND : "var(--border)", color: product.inStock ? BRAND : "var(--subtitle)", opacity: product.inStock ? 1 : 0.7 }}
              onMouseEnter={(e) => { if (product.inStock) { e.currentTarget.style.backgroundColor = BRAND; e.currentTarget.style.color = "var(--button-text)"; } }}
              onMouseLeave={(e) => { if (product.inStock) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = BRAND; } }}>
              <ShoppingBagOutlinedIcon style={{ fontSize: 18 }} /> {adding ? "Adding..." : "Add to Cart"}
            </button>
            <button onClick={buyNow} disabled={!product.inStock || !!checkoutItem} className="w-full rounded-md text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-not-allowed" style={{ backgroundColor: product.inStock ? BRAND : "var(--foreground)", color: product.inStock ? "var(--button-text)" : "var(--subtitle)", border: "1px solid var(--border)", opacity: product.inStock ? 1 : 0.7 }}>
              Buy Now
            </button>
          </div>

          </div>
          {error && <p role="alert" className="text-sm text-red-500">{error}</p>}
          <div className="mt-5 flex items-center gap-2 text-sm var(--details)" style={{ color: "var(--details)" }}>
            <LocalShippingOutlinedIcon style={{ fontSize: 18 }} />
            Cash on delivery available • Delivery in 2–5 days
          </div>
          <SizeChart chart={product.sizeChart} />
        </div>
      </div>
      <section className="af-product-description">
        <h2>Product description</h2>
        <p>{product.description || "Contact us for more information about this product."}</p>
      </section>
      {checkoutItem && <CheckoutLoader key={slug} item={checkoutItem} />}
      <ProductReviews productId={product.id} />
      <RelatedRow title="You may also like" items={related} onOpen={openProduct} />
      <RelatedRow title={`More from ${product.categoryName}`} items={sameCategory} onOpen={openProduct} />




    </div>
  );
  function Crumb({ to, children }) {
    return (
      <Link
        to={to}
        className="no-underline px-1.5 py-0.5 rounded transition-colors"
        style={{ color: "var(--title)" }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "var(--button)"; e.currentTarget.style.color = "var(--button-text)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "var(--title)"; }}
      >
        {children}
      </Link>
    );
  }
}
