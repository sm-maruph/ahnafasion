import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Clock, ArrowUpRight } from "lucide-react";
import { useSettings } from "../context/SettingsContext";
import "./Footer.css";

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

const SHOP_LINKS = [
  ["New arrivals", "/new-arrivals"],
  ["Men", "/men"],
  ["Women", "/women"],
  ["Teens", "/teens"],
  ["Kids", "/kids"],
];
const HELP_LINKS = [
  ["About us", "/about-us"],
  ["Contact us", "/contact-us"],
  ["Find a store", "/stores"],
  ["Track your order", "/track-order"],
  ["My orders", "/account/orders"],
];

function FooterLinks({ title, links }) {
  return (
    <nav className="af-footer-links" aria-label={`Footer ${title}`}>
      <h3>{title}</h3>
      <ul>{links.map(([label, to]) => <li key={to}><Link to={to}>{label}</Link></li>)}</ul>
    </nav>
  );
}

export default function Footer() {
  const { settings } = useSettings();
  const storeName = settings.storeName || "Ahnaf Fashion";
  const social = settings.social || {};
  const socials = SOCIAL_ORDER.flatMap(({ key, label }) => {
    const value = String(social[key] || "").trim();
    if (!value) return [];
    const digits = value.replace(/\D/g, "");
    const href = key === "whatsapp" ? (digits ? `https://wa.me/${digits}` : "") : value;
    return /^https?:\/\//i.test(href) ? [{ key, label, href }] : [];
  });
  const address = [settings.address, settings.city].filter(Boolean).join(", ");

  return (
    <footer className="af-footer">
      <div className="af-footer-inner">
        <div className="af-footer-intro">
          <div>
            <h2>Everyday style. <span>Beautifully chosen.</span></h2>
          </div>
          <Link className="af-footer-cta" to="/new-arrivals">Explore new arrivals <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>

        <div className="af-footer-grid">
          <div className="af-footer-brand">
            <Link to="/" className="af-footer-logo">
              {settings.logo ? <img src={settings.logo} alt="" loading="lazy" /> : <span className="af-footer-monogram">{storeName[0]}</span>}
              <span>{storeName}</span>
            </Link>
            <p>{settings.tagline || "Considered styles for every day and every occasion. Find your next favourite at Ahnaf Fashion."}</p>
            {socials.length > 0 && (
              <div className="af-footer-socials" aria-label="Follow us">
                {socials.map(({ key, label, href }) => (
                  <a key={key} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${label}`}>
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">{ICONS[key]}</svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          <FooterLinks title="Explore" links={SHOP_LINKS} />
          <FooterLinks title="We're here to help" links={HELP_LINKS} />

          <section className="af-footer-contact" aria-labelledby="footer-contact-title">
            <h3 id="footer-contact-title">Get in touch</h3>
            <ul>
              {address && <li><MapPin aria-hidden="true" /><div><span>Visit us</span><p>{address}</p></div></li>}
              {settings.hours && <li><Clock aria-hidden="true" /><div><span>Opening hours</span><p>{settings.hours}</p></div></li>}
              {settings.supportEmail && <li><Mail aria-hidden="true" /><div><span>Email</span><a href={`mailto:${settings.supportEmail}`}>{settings.supportEmail}</a></div></li>}
              {settings.supportPhone && <li><Phone aria-hidden="true" /><div><span>Call us</span><a href={`tel:${settings.supportPhone.replace(/\s/g, "")}`}>{settings.supportPhone}</a></div></li>}
              {!address && !settings.hours && !settings.supportEmail && !settings.supportPhone && <li><Mail aria-hidden="true" /><Link to="/contact-us">Talk to our team <ArrowUpRight size={14} aria-hidden="true" /></Link></li>}
            </ul>
          </section>
        </div>

        <div className="af-footer-bottom">
          <p>&copy; {new Date().getFullYear()} {storeName}. All rights reserved.</p>
          <p>Developed by <a href="https://theatives.com/" target="_blank" rel="noopener noreferrer">Theatives <ArrowUpRight size={12} aria-hidden="true" /></a></p>
        </div>
      </div>
    </footer>
  );
}
