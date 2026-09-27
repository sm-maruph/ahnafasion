// src/components/ScrollToTop.jsx
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaFacebookMessenger, FaWhatsapp } from "react-icons/fa";
import CartFeedback from "../CartFeedback";
const BRAND = "var(--brand)";

const ScrollToTop = ({ showCart = true }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div className="af-floating-actions fixed bottom-20 right-4 sm:right-6 z-40 flex flex-col items-center gap-3" role="group" aria-label="Contact and page navigation">
      {showCart && <CartFeedback docked />}
      <a
        href="https://m.me/Ahnaffashionoffical"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ahnaf Fashion on Messenger"
        title="Chat on Messenger"
        className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)] motion-reduce:transition-none"
        style={{ background: "linear-gradient(145deg, #168AFF, #635BFF)" }}
      >
        <FaFacebookMessenger size={22} aria-hidden="true" />
      </a>
      <a
        href="https://wa.me/8801714177717"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Ahnaf Fashion on WhatsApp"
        title="Chat on WhatsApp"
        className="flex h-11 w-11 items-center justify-center rounded-full text-white shadow-lg transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)] motion-reduce:transition-none"
        style={{ backgroundColor: "#128C4A" }}
      >
        <FaWhatsapp size={22} aria-hidden="true" />
      </a>
      {visible && (
      <button
        onClick={scrollToTop}
        className="flex h-11 w-11 items-center justify-center rounded-full shadow-lg transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--brand)]"
        style={{ backgroundColor: BRAND, color: "var(--button-text)" }} aria-label="Scroll to top"
      >
        <FaArrowUp size={22} aria-hidden="true" />
      </button>
      )}
    </div>
  );
};

export default ScrollToTop;
