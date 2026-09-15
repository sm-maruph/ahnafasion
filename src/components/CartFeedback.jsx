import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import "./CartFeedback.css";

const clampPosition = (position) => ({
  x: Math.max(12, Math.min(position.x, window.innerWidth - 70)),
  y: Math.max(12, Math.min(position.y, window.innerHeight - (window.innerWidth < 768 ? 130 : 80))),
});

export default function CartFeedback() {
  const { count, confirmation, dismissConfirmation } = useCart();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const dialog = useRef(null);
  const dismiss = useRef(dismissConfirmation);
  dismiss.current = dismissConfirmation;
  const drag = useRef(null);
  const moved = useRef(false);
  const [position, setPosition] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("af-cart-position"));
      if (Number.isFinite(saved?.x) && Number.isFinite(saved?.y)) return clampPosition(saved);
    } catch { /* Storage is optional. */ }
    return clampPosition({ x: window.innerWidth - 82, y: window.innerHeight - 180 });
  });

  useEffect(() => {
    const resize = () => setPosition((p) => clampPosition(p));
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  useEffect(() => {
    try { localStorage.setItem("af-cart-position", JSON.stringify(position)); } catch { /* Storage is optional. */ }
  }, [position]);

  useEffect(() => {
    if (!confirmation) return;
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => dismiss.current(), 2400);
    return () => {
      clearTimeout(timer);
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [confirmation]);

  const move = (event) => {
    const start = drag.current;
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.hypot(dx, dy) > 6) moved.current = true;
    if (moved.current) setPosition(clampPosition({ x: start.position.x + dx, y: start.position.y + dy }));
  };

  return createPortal(<>
    {count > 0 && pathname !== "/cart" && <button
      className="af-floating-cart"
      style={{ left: position.x, top: position.y }}
      aria-label={`Open bag, ${count} items. Use arrow keys to move this button.`}
      title="Open bag · Drag to move"
      onPointerDown={(event) => {
        if (event.button !== 0) return;
        moved.current = false;
        drag.current = { x: event.clientX, y: event.clientY, position };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={move}
      onPointerUp={() => { drag.current = null; }}
      onPointerCancel={() => { drag.current = null; moved.current = true; }}
      onClick={(event) => { if (event.detail === 0 || !moved.current) navigate("/cart"); }}
      onKeyDown={(event) => {
        const direction = { ArrowLeft: [-20, 0], ArrowRight: [20, 0], ArrowUp: [0, -20], ArrowDown: [0, 20] }[event.key];
        if (!direction) return;
        event.preventDefault();
        setPosition((p) => clampPosition({ x: p.x + direction[0], y: p.y + direction[1] }));
      }}
    >
      <ShoppingBag size={24} aria-hidden="true" />
      {count > 0 && <span className="af-floating-cart-count">{count > 99 ? "99+" : count}</span>}
    </button>}
    {confirmation && <dialog ref={dialog} className="af-cart-confirmation" aria-labelledby="af-cart-added-title"
      onCancel={() => dismiss.current()}
      onClick={(event) => { if (event.target === event.currentTarget) dismiss.current(); }}>
      <div className="af-cart-confirmation-content">
        <button autoFocus className="af-cart-confirmation-close" aria-label="Close confirmation" onClick={() => dismiss.current()}><X size={16} /></button>
        <div className="af-cart-success-icon"><ShoppingBag size={28} aria-hidden="true" /><span className="af-cart-success-check" aria-hidden="true">?</span></div>
        <h2 id="af-cart-added-title">Added to your bag</h2>
        <p className="af-cart-confirmation-product">{confirmation.name}</p>
        <p>{confirmation.qty || 1} item{confirmation.qty > 1 ? "s" : ""} added. Your next look is coming together.</p>
        <span className="af-cart-progress" aria-hidden="true"><span /></span>
      </div>
    </dialog>}
  </>, document.body);
}
