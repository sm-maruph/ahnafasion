// src/components/Cart.jsx — wired to CartContext (real API when logged in, localStorage for guests)
import { useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useCart } from "../context/CartContext";

const BRAND = "var(--brand)";
const taka = (n) => `\u09F3${Number(n || 0).toLocaleString("en-BD")}`;
const imgFallback = (e, label = "RAINZ") => {
  e.target.onerror = null;
  e.target.src = `https://placehold.co/120x150/f3f4f6/9ca3af?text=${encodeURIComponent(label)}`;
};

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

export default function Cart() {
  const navigate = useNavigate();
  const { items, loading, setQty, remove } = useCart();

  const { subtotal, savings, count } = useMemo(() => {
    let sub = 0, save = 0, c = 0;
    items.forEach((it) => {
      const q = it.qty || 1;
      sub += it.price * q;
      if (it.oldPrice) save += (it.oldPrice - it.price) * q;
      c += q;
    });
    return { subtotal: sub, savings: save, count: c };
  }, [items]);

  const dec = (it) => setQty(it, Math.max(1, (it.qty || 1) - 1));
  const inc = (it) => setQty(it, (it.qty || 1) + 1);
  const checkout = () => navigate("/checkout");

  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 py-8 sm:py-10">
        <div className="h-8 w-40 rounded animate-pulse mb-6" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
        <div className="grid lg:grid-cols-3 gap-5 lg:gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-28 rounded-xl animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />)}
          </div>
          <div className="h-64 rounded-xl animate-pulse" style={{ backgroundColor: "rgba(255,255,255,.05)" }} />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full max-w-[600px] mx-auto px-4 py-24 text-center">
        <ShoppingBagOutlinedIcon style={{ fontSize: 56, color: "var(--subtitle)", opacity: 0.5 }} />
        <h1 className="mt-3 text-xl font-bold" style={{ color: "var(--title)" }}>Your bag is empty</h1>
        <p className="mt-1 text-sm" style={{ color: "var(--subtitle)" }}>Looks like you haven't added anything yet.</p>
        <Link to="/new-arrivals" className="inline-block mt-5 rounded-full px-6 py-2.5 text-sm font-semibold" style={{ backgroundColor: BRAND, color: "var(--button-text)" }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-5 sm:py-8 overflow-x-hidden">
      <nav className="text-xs mb-3 flex items-center flex-wrap gap-y-1" style={{ color: "var(--title)" }}>
        <Crumb to="/">Home</Crumb>
        <ChevronRightIcon style={{ fontSize: 14, color: "var(--subtitle)" }} className="mx-0.5" />
        <span className="px-1.5 py-0.5" style={{ color: "var(--subtitle)" }}>Cart</span>
      </nav>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-4 sm:mb-6" style={{ color: "var(--title)" }}>
        Shopping Bag <span className="text-sm sm:text-base font-medium" style={{ color: "var(--subtitle)" }}>({count} item{count !== 1 ? "s" : ""})</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 min-w-0">
          {items.map((it) => (
            <div key={it.cartId} className="flex gap-3 sm:gap-4 rounded-xl border border-gray-100 p-2.5 sm:p-3" style={{ borderColor: "var(--title)", backgroundColor: "var(--foreground)" }}>
              <img
                src={it.image}
                alt={it.name}
                className="h-24 w-20 sm:h-28 sm:w-24 rounded-lg object-cover bg-gray-100 cursor-pointer flex-shrink-0"
                onClick={() => it.slug && navigate(`/product/${it.slug}`)}
                onError={(e) => imgFallback(e, it.name)}
              />
              <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex justify-between gap-2">
                  <p className="text-sm font-semibold" style={{ color: "var(--title)" }} onClick={() => it.slug && navigate(`/product/${it.slug}`)}>
                    {it.name}
                  </p>
                  <button onClick={() => remove(it)} className="text-gray-400 hover:text-rose-600 flex-shrink-0" aria-label="Remove">
                    <DeleteOutlineIcon style={{ fontSize: 20 }} />
                  </button>
                </div>
                <p className="text-xs" style={{ color: "var(--subtitle)" }} className="mt-0.5 truncate">
                  {[it.size, it.color].filter(Boolean).join(" • ")}
                </p>

                <div className="mt-auto flex items-center justify-between gap-2 pt-2">
                  <div className="inline-flex items-center rounded-md border shrink-0" style={{ borderColor: "var(--border)" }}>
                    <button onClick={() => dec(it)} className="px-2 sm:px-2.5 py-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--subtitle)" }} aria-label="Decrease"><RemoveIcon style={{ fontSize: 15 }} /></button>
                    <span className="px-2.5 sm:px-3 text-sm font-semibold" style={{ color: "var(--details)" }}>{it.qty || 1}</span>
                    <button onClick={() => inc(it)} className="px-2 sm:px-2.5 py-1.5 transition-colors hover:bg-white/5" style={{ color: "var(--subtitle)" }} aria-label="Increase"><AddIcon style={{ fontSize: 15 }} /></button>
                  </div>
                  <div className="text-right min-w-0">
                    <p className="text-sm font-bold" style={{ color: "var(--title)" }}>{taka(it.price * (it.qty || 1))}</p>
                    {it.oldPrice && <p className="text-xs text-gray-400 line-through" style={{ color: "var(--subtitle)" }}>{taka(it.oldPrice * (it.qty || 1))}</p>}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <Link to="/new-arrivals" className="inline-block text-sm font-semibold" style={{ color: BRAND }}>&larr; Continue Shopping</Link>
        </div>

        {/* Summary */}
        <aside className="lg:col-span-1 min-w-0">
          <div className="rounded-xl border border-gray-200 p-4 sm:p-5 lg:sticky lg:top-24" style={{ borderColor: "var(--title)", backgroundColor: "var(--foreground)" }}>
            <h2 className="text-lg font-bold" style={{ color: "var(--title)" }}>Order Summary</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between gap-2" style={{ color: "var(--subtitle)" }}><span className="min-w-0 truncate">Subtotal ({count} items)</span><span className="shrink-0">{taka(subtotal)}</span></div>
              {savings > 0 && <div className="flex justify-between gap-2 text-green-600"><span>You save</span><span className="shrink-0">- {taka(savings)}</span></div>}
              <div className="flex justify-between gap-2" style={{ color: "var(--subtitle)" }}><span>Delivery</span><span className="text-gray-400 shrink-0">Calculated at checkout</span></div>
              <div className="flex justify-between gap-2 text-base font-bold" style={{ color: "var(--title)", borderColor: "var(--border)" }}><span>Total</span><span className="shrink-0">{taka(subtotal)}</span></div>
            </div>

            {/* Desktop checkout button (mobile uses sticky bar) */}
            <button onClick={checkout} className="mt-5 w-full rounded-md py-3 text-sm font-bold text-white transition-opacity hover:opacity-90" style={{ backgroundColor: "var(--brand)", color: "var(--button-text)" }}>
              Proceed to Checkout
            </button>

            <div className="mt-3 flex items-start gap-2 text-xs text-gray-500">
              <LocalShippingOutlinedIcon style={{ fontSize: 16 }} className="shrink-0 mt-0.5" />
              <span>Delivery charge (৳80 inside / ৳120 outside Dhaka) added at checkout.</span>
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}