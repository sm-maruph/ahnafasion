/** tailwind.config.js — Ahnaf Fashion BD
 *  Maps the CSS variables from index.css so you can use
 *  bg-brand, text-title, bg-foreground, font-heading, etc.
 */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand:        "var(--brand)",
        primary:      "var(--primary)",   // Rich Black — page background
        secondary:    "var(--secondary)",
        tertiary:     "var(--tertiary)",

        title:        "var(--title)",
        subtitle:     "var(--subtitle)",
        details:      "var(--details)",

        background:   "var(--background)",
        foreground:   "var(--foreground)",

        button:       "var(--button)",
        "button-text":"var(--button-text)",

        // named brand colours straight from the guide
        "rich-black":      "#0B0B0B",
        "charcoal":        "#171717",
        "luxury-gold":     "#D4AF37",
        "antique-gold":    "#B88A2D",
        "champagne-gold":  "#E7C46A",
        "ivory-white":     "#F8F6F2",
        "soft-grey":       "#BDBDBD",
        bronze:            "#6E5424",
      },
      fontFamily: {
        heading: ["Cinzel", "serif"],
        body:    ["Poppins", "sans-serif"],
        sans:    ["Poppins", "sans-serif"], // make Poppins the default
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(90deg, #B88A2D 0%, #D4AF37 50%, #E7C46A 100%)",
      },
      borderColor: {
        gold: "rgba(212, 175, 55, 0.22)",
      },
    },
  },
  plugins: [],
};