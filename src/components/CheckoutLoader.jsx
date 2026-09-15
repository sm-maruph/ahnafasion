import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { CarFront } from "lucide-react";
import "./CheckoutLoader.css";

export default function CheckoutLoader({ item }) {
  const navigate = useNavigate();
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      navigate("/checkout", { state: { items: [item] } });
    }, 1400);
    return () => {
      clearTimeout(timer);
      element.close();
      document.body.style.overflow = previousOverflow;
    };
  }, [item, navigate]);

  return createPortal(
    <dialog ref={dialog} className="af-checkout-loader" aria-labelledby="af-checkout-loader-title" onCancel={(event) => event.preventDefault()}>
      <div className="af-checkout-road" aria-hidden="true">
        <span className="af-checkout-road-lines" />
        <CarFront className="af-checkout-car" size={66} strokeWidth={1.5} />
      </div>
      <div role="status" aria-live="polite">
        <h2 id="af-checkout-loader-title">On the way to checkout</h2>
        <p>Taking your selection with us…</p>
      </div>
    </dialog>, document.body
  );
}
