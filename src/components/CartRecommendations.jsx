import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductBySlug, getProducts } from "../api";
import { loadCartRecommendations } from "../utils/cartRecommendations";
import QuickAddModal from "./QuickAddModal";
import "./CartRecommendations.css";

export default function CartRecommendations({ items }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickSlug, setQuickSlug] = useState(null);
  // Quantity changes do not change which products are relevant.
  const cartKey = JSON.stringify([...new Map(items.map(({ id, slug }) => [String(id), { id, slug }])).values()]);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setProducts([]);
    loadCartRecommendations(JSON.parse(cartKey), getProductBySlug, getProducts)
      .then((result) => { if (active) setProducts(result); })
      .catch(() => { if (active) setProducts([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [cartKey]);
  if (!loading && !products.length) return null;
  return <section className="af-cart-recommendations" aria-labelledby="cart-recommendation-title" aria-busy={loading}>
    <h2 id="cart-recommendation-title">You may also like</h2>
    <p>More from the categories and collections in your bag.</p>
    <div className="af-cart-recommendation-grid">
      {loading ? Array.from({ length: 4 }, (_, i) => <div key={i} className="af-cart-recommendation-skeleton" aria-hidden="true" />) : products.map((p) => <article key={p.id}>
        <Link to={`/product/${p.slug}`} className="af-cart-recommendation-photo"><img src={p.image} alt={p.name} loading="lazy" onError={(event) => { event.target.onerror = null; event.target.src = "https://placehold.co/300x400/171717/d4af37?text=Ahnaf+Fashion"; }} /></Link>
        <div className="af-cart-recommendation-info">
          <Link to={`/product/${p.slug}`} className="af-cart-recommendation-name">{p.name}</Link>
          <p>৳{Number(p.price).toLocaleString("en-BD")} {p.oldPrice > p.price && <del>৳{Number(p.oldPrice).toLocaleString("en-BD")}</del>}</p>
          <button type="button" onClick={() => setQuickSlug(p.slug)} aria-label={`Add ${p.name} to bag`}>+ Add to bag</button>
        </div>
      </article>)}
    </div>
    <QuickAddModal slug={quickSlug} onClose={() => setQuickSlug(null)} />
  </section>;
}
