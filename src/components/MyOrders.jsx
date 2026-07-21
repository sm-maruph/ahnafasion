// src/components/MyOrders.jsx — customer order history (logged-in via API, guests via saved codes)
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import { getMyOrders, getGuestOrders } from "../api";
import { useAuth } from "../context/AuthContext";

const BRAND = "var(--brand)";
const taka = (n) => `\u09F3${Number(n || 0).toLocaleString("en-BD")}`;
const imgFallback = (e) => { e.target.onerror = null; e.target.src = "https://placehold.co/120x150/f3f4f6/9ca3af?text=RAINZ"; };

const STATUS_STYLE = {
  Pending:    { bg: "rgba(212,175,55,.15)", color: "#E7C46A" },  // gold
  Processing: { bg: "rgba(96,165,250,.15)", color: "#93C5FD" },  // blue
  Shipped:    { bg: "rgba(167,139,250,.15)", color: "#C4B5FD" }, // purple
  Delivered:  { bg: "rgba(74,222,128,.15)", color: "#4ADE80" },  // green
  Cancelled:  { bg: "rgba(248,113,113,.15)", color: "#F87171" }, // red
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";

function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || { bg: "rgba(255,255,255,.08)", color: "var(--subtitle)" };
  return (
    <span className="rounded-full px-2.5 py-0.5 text-[11px] font-bold" style={{ backgroundColor: s.bg, color: s.color }}>
      {status}
    </span>
  );
}

function OrderCard({ order }) {
  const [open, setOpen] = useState(false);
  const itemCount = order.items.reduce((s, it) => s + (it.qty || 1), 0);

  return (
    <div className="rounded-xl border overflow-hidden" style={{ backgroundColor: "var(--foreground)", borderColor: "var(--title)" }}>
      {/* Header */}
      <button onClick={() => setOpen((o) => !o)} className="w-full flex items-center justify-between gap-3 p-3 sm:p-4 text-left">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold" style={{ color: "var(--title)" }}>#{order.code}</span>
            <StatusPill status={order.status} />
          </div>
          <p className="text-xs mt-0.5" style={{ color: "var(--subtitle)" }}>
            {fmtDate(order.createdAt)} · {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm font-bold" style={{ color: "var(--title)" }}>{taka(order.total)}</span>
          <ExpandMoreIcon style={{ fontSize: 20, color: "var(--subtitle)", transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
        </div>
      </button>

      {/* Details */}
      {open && (
        <div className="border-t p-3 sm:p-4 space-y-4" style={{ borderColor: "var(--border)" }}>
          {/* Items */}
          <div className="space-y-3">
            {order.items.map((it, i) => (
              <div key={it.id ?? i} className="flex gap-3">
                <img src={it.image} alt={it.name} className="h-16 w-14 rounded object-cover shrink-0" style={{ backgroundColor: "#0F0F0F" }} onError={imgFallback} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ color: "var(--details)" }}>{it.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--subtitle)" }}>
                    {[it.size, it.color].filter(Boolean).join(" • ")}{(it.size || it.color) ? " • " : ""}Qty {it.qty || 1}
                  </p>
                </div>
                <p className="text-sm font-semibold shrink-0" style={{ color: "var(--title)" }}>{taka(it.price * (it.qty || 1))}</p>
              </div>
            ))}
          </div>

          {/* Delivery address */}
          <div className="rounded-lg p-3 text-xs space-y-0.5" style={{ backgroundColor: "rgba(255,255,255,.04)", color: "var(--subtitle)" }}>
            <p className="font-semibold mb-0.5" style={{ color: "var(--title)" }}>Delivery to</p>
            <p>{order.customerName} · {order.phone}</p>
            <p className="mt-0.5">{order.address}{order.city ? `, ${order.city}` : ""}</p>
          </div>

          {/* Totals */}
          <div className="space-y-1.5 text-sm border-t pt-3" style={{ borderColor: "var(--border)" }}>
            <div className="flex justify-between gap-2" style={{ color: "var(--subtitle)" }}><span>Subtotal</span><span className="shrink-0">{taka(order.subtotal)}</span></div>
            <div className="flex justify-between gap-2" style={{ color: "var(--subtitle)" }}><span>Delivery</span><span className="shrink-0">{taka(order.delivery)}</span></div>
            {order.discount > 0 && (
              <div className="flex justify-between gap-2" style={{ color: "#4ADE80" }}>
                <span className="min-w-0 truncate">Discount{order.couponCode ? ` (${order.couponCode})` : ""}</span>
                <span className="shrink-0">− {taka(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between gap-2 text-base font-bold pt-1.5 border-t" style={{ color: "var(--title)", borderColor: "var(--border)" }}>
              <span>Total</span><span className="shrink-0">{taka(order.total)}</span>
            </div>
          </div>

          <Link to={`/track-order?code=${order.code}`} className="inline-flex items-center gap-1.5 text-sm font-semibold no-underline" style={{ color: BRAND }}>
            <LocalShippingOutlinedIcon style={{ fontSize: 17 }} /> Track this order
          </Link>
        </div>
      )}
    </div>
  );
}

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth() || {};
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    let alive = true;
    setLoading(true);
    setError("");

    const load = user ? getMyOrders() : getGuestOrders();
    load
      .then((list) => alive && setOrders(list || []))
      .catch((e) => alive && setError(e.message || "Could not load your orders."))
      .finally(() => alive && setLoading(false));

    return () => { alive = false; };
  }, [user, authLoading]);

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 py-5 sm:py-8 overflow-x-hidden">
      {/* Breadcrumb */}
      <nav className="text-xs mb-3 flex items-center flex-wrap gap-y-1" style={{ color: "var(--title)" }}>
        <Link to="/" className="no-underline px-1.5 py-0.5 rounded" style={{ color: "var(--title)" }}>Home</Link>
        <ChevronRightIcon style={{ fontSize: 14, color: "var(--subtitle)" }} className="mx-0.5" />
        <span className="px-1.5 py-0.5" style={{ color: "var(--subtitle)" }}>My Orders</span>
      </nav>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold mb-1" style={{ color: "var(--title)" }}>My Orders</h1>
      <p className="text-sm mb-5" style={{ color: "var(--subtitle)" }}>
        {user ? "All orders placed with your account." : "Orders you placed on this device."}
      </p>

      {error && <div className="mb-5 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-3">{error}</div>}

      {loading || authLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl border border-gray-100 bg-white animate-pulse" style={{ borderColor: "var(--title)" }} />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 rounded-xl border" style={{ backgroundColor: "var(--foreground)", borderColor: "var(--title)" }}>
          <ReceiptLongOutlinedIcon style={{ fontSize: 52, color: "var(--subtitle)", opacity: 0.5 }} />
          <p className="mt-2 font-semibold" style={{ color: "var(--title)" }}>No orders yet</p>
          <p className="mt-1 text-sm" style={{ color: "var(--subtitle)" }}>
            {user
              ? "When you place an order it will show up here."
              : "Orders you place while signed out are remembered on this device only."}
          </p>

          <div className="mt-5 flex flex-col sm:flex-row justify-center gap-3 px-4">
            <Link to="/new-arrivals" className="rounded-full px-6 py-2.5 text-sm font-semibold text-center no-underline" style={{ backgroundColor: "var(--brand)", color: "var(--button-text)" }}>
              Start Shopping
            </Link>
            {!user && (
              <button onClick={() => navigate("/login")} className="rounded-full border-2 px-6 py-2.5 text-sm font-semibold" style={{ borderColor: "var(--brand)", color: "var(--brand)" }}>
                Sign in to see all orders
              </button>
            )}
          </div>

          {!user && (
            <p className="mt-5 text-xs text-gray-400 px-4">
              Have an order code?{" "}
              <Link to="/track-order" className="font-semibold no-underline" style={{ color: "var(--brand)" }}>Track it here</Link>
            </p>
          )}
        </div>
      ) : (
        <>
          {/* Guest hint */}
          {!user && (
            <div className="mb-4 rounded-lg border px-4 py-3 text-xs" style={{ backgroundColor: "rgba(212,175,55,.08)", borderColor: "var(--title)", color: "var(--gold-light)" }}>
              You're browsing as a guest — only orders placed on this device are shown.{" "}
              <button onClick={() => navigate("/login")} className="font-bold underline" style={{ color: "var(--title)" }}>Sign in</button> to see all your orders anywhere.
            </div>
          )}

          <div className="space-y-3">
            {orders.map((o) => <OrderCard key={o.code ?? o.id} order={o} />)}
          </div>
        </>
      )}
    </div>
  );
}
