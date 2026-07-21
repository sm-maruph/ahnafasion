// src/components/Footer.jsx — contact + socials driven by store settings
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, ArrowRight, Sparkles } from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const BRAND = "var(--brand)";

const COLORS = {
  bg: "#0f0f0f",
  surface: "#1a1a1a",
  accent: BRAND,
  text: "#e0e0e0",
  textMuted: "#a0a0a0",
  textSubtle: "#888888",
  border: "rgba(255,255,255,0.08)",
  borderLight: "rgba(255,255,255,0.06)",
  cartisy: "#ff4d4d",
  white: "#ffffff",
};

const NAV_LINKS = [
  { label: "About RainzLifestyle", href: "#" },
  { label: "Terms & Conditions", href: "#" },
  { label: "Privacy Policy", href: "#" },
  { label: "Cancellation & Return Policy", href: "#" },
  { label: "FAQs", href: "#" },
  { label: "Contact Us", href: "#" },
];

/* ---- Social icons (SVG paths unchanged) ---- */
const SocialIcon = ({ path, href = "#", viewBox = "0 0 24 24", label }) => (
  <a
    href={href}
    target={href !== "#" ? "_blank" : undefined}
    rel={href !== "#" ? "noopener noreferrer" : undefined}
    aria-label={label}
    className="group flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
    style={{
      color: COLORS.textMuted,
      borderColor: COLORS.border,
      backgroundColor: "transparent",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.color = COLORS.white;
      e.currentTarget.style.borderColor = COLORS.accent;
      e.currentTarget.style.backgroundColor = `${COLORS.accent}15`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.color = COLORS.textMuted;
      e.currentTarget.style.borderColor = COLORS.border;
      e.currentTarget.style.backgroundColor = "transparent";
    }}
  >
    <svg viewBox={viewBox} className="h-4.5 w-4.5 transition-transform duration-300 group-hover:scale-110" fill="currentColor">
      {path}
    </svg>
  </a>
);

const ICONS = {
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.21 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.07-1.1.05-1.7.24-2.1.4-.5.2-.9.43-1.3.83-.4.4-.63.8-.83 1.3-.16.4-.35 1-.4 2.1C2.6 9.9 2.6 10.3 2.6 13.4v-2.8c0-3.1 0-3.5.07-4.7zM12 7.1a4.9 4.9 0 100 9.8 4.9 4.9 0 000-9.8zm0 8.1a3.2 3.2 0 110-6.4 3.2 3.2 0 010 6.4zm5-8.3a1.15 1.15 0 11-2.3 0 1.15 1.15 0 012.3 0z" />
  ),
  tiktok: (
    <path d="M16.6 5.8a4.9 4.9 0 01-1.1-2.8h-3v12.2a2.5 2.5 0 11-2.5-2.5c.26 0 .5.04.74.11V9.7a5.6 5.6 0 00-.74-.05 5.55 5.55 0 105.55 5.55V9.06a8 8 0 004.55 1.42V7.4a4.9 4.9 0 01-3.5-1.6z" />
  ),
  facebook: (
    <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.76-1.6 1.5V12h2.8l-.45 2.9h-2.35v7A10 10 0 0022 12z" />
  ),
  whatsapp: (
    <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm0 1.8a8.2 8.2 0 11-4.2 15.2l-.3-.2-2.9.8.8-2.8-.2-.3A8.2 8.2 0 0112 3.8zm4.7 10.3c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.6.8-.8 1-.1.2-.3.2-.5.1-.7-.3-1.4-.7-2-1.5-.4-.5-.7-1-.8-1.4-.1-.2 0-.4.1-.5l.4-.4c.1-.2.2-.3.2-.5s0-.4-.1-.5c-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1s.9 2.5 1 2.6c.1.2 1.8 2.7 4.3 3.8 1.6.7 2.2.7 3 .6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3z" />
  ),
  x: (
    <path d="M18.2 2.5h3.3l-7.2 8.2L23 21.5h-6.6l-5.2-6.8-6 6.8H1.9l7.7-8.8L1.5 2.5h6.8l4.7 6.2 5.2-6.2zm-1.2 17h1.8L7.1 4.4H5.2L17 19.5z" />
  ),
  youtube: (
    <path d="M23.5 7.2a3 3 0 00-2.1-2.1C19.5 4.5 12 4.5 12 4.5s-7.5 0-9.4.6A3 3 0 00.5 7.2 31 31 0 000 12a31 31 0 00.5 4.8 3 3 0 002.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 002.1-2.1A31 31 0 0024 12a31 31 0 00-.5-4.8zM9.6 15.5V8.5l6.3 3.5-6.3 3.5z" />
  ),
};

const SOCIAL_ORDER = [
  { key: "instagram", label: "Instagram" },
  { key: "tiktok", label: "TikTok" },
  { key: "facebook", label: "Facebook" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "youtube", label: "YouTube" },
];

const StoreButton = ({ top, bottom, icon }) => (
  <a
    href="#"
    className="flex items-center gap-2.5 rounded-xl border px-4 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    style={{
      backgroundColor: COLORS.surface,
      borderColor: COLORS.border,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.borderColor = COLORS.accent;
      e.currentTarget.style.boxShadow = `0 4px 16px ${COLORS.accent}20`;
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.borderColor = COLORS.border;
      e.currentTarget.style.boxShadow = "none";
    }}
  >
    <span className="text-white">{icon}</span>
    <span className="flex flex-col leading-tight">
      <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: COLORS.textSubtle }}>
        {top}
      </span>
      <span className="text-sm font-semibold text-white">{bottom}</span>
    </span>
  </a>
);

const Footer = () => {
  const { settings } = useSettings();
  const [email, setEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState(null); // 'success' | null

  const handleSubscribe = () => {
    if (!email) return;
    console.log("Subscribe:", email);
    setSubscribeStatus("success");
    setEmail("");
    setTimeout(() => setSubscribeStatus(null), 3000);
  };

  const storeName = settings.storeName || "RainzLifestyle";
  const social = settings.social || {};

  const socialHref = (key, val) => {
    if (!val) return null;
    if (key === "whatsapp") {
      const digits = String(val).replace(/\D/g, "");
      return digits ? `https://wa.me/${digits}` : null;
    }
    return val;
  };

  const activeSocials = SOCIAL_ORDER.map((s) => ({
    ...s,
    href: socialHref(s.key, social[s.key]),
  })).filter((s) => s.href);

  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: COLORS.bg, color: COLORS.text }}>
      {/* ---- Top accent line ---- */}
      <div style={{ height: "3px", background: `linear-gradient(90deg, ${COLORS.accent} 0%, ${COLORS.accent}88 50%, transparent 100%)` }} />

      {/* ---- Main footer content ---- */}
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          {/* ---- Column 1: Brand + Nav ---- */}
          <div className="lg:col-span-3">
            {/* Brand */}
            <div className="mb-7 flex items-center gap-3">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={storeName}
                  className="h-10 w-auto object-contain sm:h-11"
                />
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-lg font-black text-white shadow-md sm:h-11 sm:w-11 sm:text-xl"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  {storeName[0]}
                </div>
              )}
              <span className="text-lg font-bold tracking-tight text-white sm:text-xl">
                {storeName}
              </span>
            </div>

            {/* Short tagline */}
            <p className="mb-7 text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
              Your destination for premium lifestyle products, curated with care and delivered with love.
            </p>

            {/* Navigation */}
            <nav>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textSubtle }}>
                Quick Links
              </h4>
              <ul className="space-y-2.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group inline-flex items-center gap-1.5 text-sm transition-colors duration-200 hover:text-white"
                      style={{ color: COLORS.textMuted }}
                    >
                      <span className="block h-1 w-1 rounded-full opacity-0 transition-all duration-200 group-hover:opacity-100" style={{ backgroundColor: COLORS.accent }} />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ---- Column 2: Contact Info ---- */}
          <div className="lg:col-span-4">
            <h4 className="mb-5 text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textSubtle }}>
              Get in Touch
            </h4>

            <div className="space-y-5">
              {/* Address */}
              <div className="flex gap-3">
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${COLORS.accent}18` }}
                >
                  <MapPin className="h-4 w-4" style={{ color: COLORS.accent }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Our Address</p>
                  <p className="mt-0.5 text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                    {settings.address || "Setu Homes, 55-Box Nagar, Zoo Road, Mirpur-1, Dhaka-1216"}
                    {settings.city ? `, ${settings.city}` : ""}
                  </p>
                </div>
              </div>

              {/* Hours */}
              {settings.hours && (
                <div className="flex gap-3">
                  <div
                    className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${COLORS.accent}18` }}
                  >
                    <Clock className="h-4 w-4" style={{ color: COLORS.accent }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Business Hours</p>
                    <p className="mt-0.5 text-sm" style={{ color: COLORS.textMuted }}>
                      {settings.hours}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="flex gap-3">
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${COLORS.accent}18` }}
                >
                  <Mail className="h-4 w-4" style={{ color: COLORS.accent }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Email Us</p>
                  <a
                    href={`mailto:${settings.supportEmail || "support@rainzlifestyle.com"}`}
                    className="mt-0.5 block text-sm transition-colors hover:text-white"
                    style={{ color: COLORS.textMuted }}
                  >
                    {settings.supportEmail || "support@rainzlifestyle.com"}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-3">
                <div
                  className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${COLORS.accent}18` }}
                >
                  <Phone className="h-4 w-4" style={{ color: COLORS.accent }} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Call Us</p>
                  <a
                    href={`tel:${(settings.supportPhone || "+880 9677 666888").replace(/\s/g, "")}`}
                    className="mt-0.5 block text-sm transition-colors hover:text-white"
                    style={{ color: COLORS.textMuted }}
                  >
                    {settings.supportPhone || "+880 9677 666888"}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Column 3: Newsletter + Follow + Apps ---- */}
          <div className="lg:col-span-5">
            {/* Newsletter */}
            <div className="mb-8">
              <div className="mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" style={{ color: COLORS.accent }} />
                <h4 className="text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textSubtle }}>
                  Newsletter
                </h4>
              </div>
              <p className="mb-4 text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                Subscribe to get special offers, free giveaways, and exclusive deals.
              </p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubscribeStatus(null);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    placeholder="your@email.com"
                    className="w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-gray-500 outline-none transition-all duration-300 focus:border-transparent focus:ring-2"
                    style={{
                      backgroundColor: COLORS.surface,
                      borderColor: subscribeStatus === "success" ? "#22c55e" : COLORS.border,
                      "--tw-ring-color": COLORS.accent,
                    }}
                  />
                </div>
                <button
                  onClick={handleSubscribe}
                  className="group flex shrink-0 items-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:shadow-lg active:scale-95"
                  style={{ backgroundColor: COLORS.accent }}
                >
                  {subscribeStatus === "success" ? (
                    <>
                      <span className="text-lg leading-none">✓</span>
                      Subscribed
                    </>
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
              {subscribeStatus === "success" && (
                <p className="mt-2 text-xs text-green-400">🎉 You're in! Check your inbox for a welcome gift.</p>
              )}
            </div>

            {/* Follow Us */}
            <div className="mb-7">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textSubtle }}>
                Follow Us
              </h4>
              {activeSocials.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {activeSocials.map((s) => (
                    <SocialIcon key={s.key} path={ICONS[s.key]} href={s.href} label={s.label} />
                  ))}
                </div>
              ) : (
                <p className="text-xs" style={{ color: COLORS.textSubtle }}>
                  Social links can be added in admin settings.
                </p>
              )}
            </div>

            {/* App Store Buttons */}
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: COLORS.textSubtle }}>
                Download Our App
              </h4>
              <div className="flex flex-wrap gap-3">
                <StoreButton
                  top="Get it on"
                  bottom="Google Play"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M3.6 2.3c-.2.2-.3.5-.3.9v17.6c0 .4.1.7.3.9l.1.1L13.5 12 3.7 2.2l-.1.1z" />
                      <path d="M17 15.3l-3.5-3.3 3.5-3.3 4 2.3c1.1.6 1.1 1.7 0 2.3l-4 2z" />
                      <path d="M3.7 21.7l9.8-9.7 3.5 3.3-11 6.3c-.9.5-1.7.4-2.3.1z" />
                      <path d="M3.7 2.3l13.3 7.6-3.5 3.3L3.7 2.3z" opacity=".85" />
                    </svg>
                  }
                />
                <StoreButton
                  top="Download on the"
                  bottom="App Store"
                  icon={
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                      <path d="M16.4 12.7c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8s-1.6-.7-2.7-.7c-1.4 0-2.7.8-3.4 2-1.5 2.5-.4 6.3 1 8.4.7 1 1.5 2.1 2.6 2.1s1.5-.7 2.8-.7 1.6.7 2.7.7 1.8-1 2.5-2c.8-1.1 1.1-2.2 1.1-2.3-.1 0-2.3-.9-2.3-3.5zM14.3 6.3c.6-.7 1-1.7.9-2.7-.9 0-1.9.6-2.5 1.3-.6.6-1 1.6-.9 2.6 1 .1 1.9-.5 2.5-1.2z" />
                    </svg>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Bottom bar ---- */}
      <div style={{ borderTop: `1px solid ${COLORS.border}` }}>
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs sm:flex-row sm:px-6 md:px-8 lg:px-10">
          <p style={{ color: COLORS.textMuted }}>
            Copyright &copy; {year}{" "}
            <span className="font-semibold text-white">{storeName}</span>
            . All rights reserved.
          </p>
          <p style={{ color: COLORS.textMuted }}>
            Developed by{" "}
            <a
              href="https://theatives.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold transition-colors hover:underline"
              style={{ color: COLORS.cartisy }}
            >
              Theatives
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;