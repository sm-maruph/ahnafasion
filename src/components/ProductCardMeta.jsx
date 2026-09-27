import { Star, Tag } from "lucide-react";
import "./ProductCardMeta.css";

const taka = (value) => `\u09F3${Number(value).toLocaleString("en-BD", { maximumFractionDigits: 2 })}`;

export function ProductCardReviews({ product }) {
  const count = Math.max(0, Number(product.reviews) || 0);
  const rating = Math.min(5, Math.max(0, Number(product.rating) || 0));
  return (
    <div className="af-card-reviews">
      <Star size={13} fill={count ? "currentColor" : "none"} aria-hidden="true" />
      {count > 0 ? <><strong>{rating.toFixed(1)}</strong><span>({count} {count === 1 ? "review" : "reviews"})</span></> : <span>No reviews yet</span>}
    </div>
  );
}

export function ProductCardPrice({ product }) {
  const price = Number(product.price) || 0;
  const oldPrice = Number(product.oldPrice) || 0;
  const saved = Math.round((oldPrice - price) * 100) / 100;
  return (
    <div className="af-card-price">
      <strong>{taka(price)}</strong>
      {saved > 0 && <><del>{taka(oldPrice)}</del><span className="af-card-savings"><Tag aria-hidden="true" /><span>Save {taka(saved)}</span></span></>}
    </div>
  );
}
