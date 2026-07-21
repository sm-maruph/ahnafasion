// src/components/LoadingRainz.jsx — full-screen centered luxury loader (Ahnaf Fashion BD)
// Gold-on-black, animated, responsive. No logo image — typographic wordmark.
import { useSettings } from "../../context/SettingsContext";

export default function LoadingRainz({ label = "Loading", fullscreen = true }) {
  const { settings } = useSettings();
  const raw = settings?.storeName || "AHNAF FASHION BD";
  const parts = raw.trim().split(/\s+/);
  const main = parts.slice(0, 2).join(" ") || "AHNAF FASHION";
  const sub = parts.slice(2).join(" ");

  return (
    <div
      className={`afl-root ${fullscreen ? "afl-fixed" : "afl-block"}`}
      role="status"
      aria-live="polite"
    >
      {/* floating gold orbs */}
      <div className="afl-orb afl-orb-1" />
      <div className="afl-orb afl-orb-2" />

      <div className="afl-center">
        {/* rotating rings around a monogram */}
        <div className="afl-rings">
          <span className="afl-ring afl-ring-a" />
          <span className="afl-ring afl-ring-b" />
          <span className="afl-ring afl-ring-c" />
          <span className="afl-monogram">{(main[0] || "A")}</span>
        </div>

        {/* wordmark */}
        <div className="afl-textwrap">
          <span className="afl-rule" />
          <h1 className="afl-name">{main}</h1>
          {sub && <p className="afl-sub">{sub}</p>}
          <span className="afl-rule" />
        </div>

        {/* dots */}
        <div className="afl-dots" aria-hidden="true"><span /><span /><span /></div>
      </div>

      <span className="afl-sronly">{label}…</span>

      <style>{`
        .afl-root {
          position: relative;
          width: 100%;
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(1200px 600px at 50% -10%, #16121f 0%, transparent 60%),
            linear-gradient(160deg, #0B0B0B 0%, #100C16 55%, #0B0B0B 100%);
        }
        .afl-fixed { position: fixed; inset: 0; z-index: 9999; min-height: 100vh; min-height: 100svh; }
        .afl-block { min-height: 60vh; border-radius: 16px; }

        /* floating blurred gold orbs */
        .afl-orb { position: absolute; border-radius: 9999px; filter: blur(80px); opacity: .16; pointer-events: none; }
        .afl-orb-1 { width: 340px; height: 340px; background: #D4AF37; top: -80px; left: -60px; animation: aflFloatA 12s ease-in-out infinite; }
        .afl-orb-2 { width: 300px; height: 300px; background: #B88A2D; bottom: -80px; right: -60px; animation: aflFloatB 15s ease-in-out infinite; }
        @keyframes aflFloatA { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(50px,40px) } }
        @keyframes aflFloatB { 0%,100%{ transform:translate(0,0) } 50%{ transform:translate(-45px,-35px) } }

        .afl-center {
          position: relative; z-index: 1;
          display: flex; flex-direction: column; align-items: center;
          padding: 0 24px; text-align: center;
          animation: aflIn .8s cubic-bezier(.2,.8,.2,1) both;
        }
        @keyframes aflIn { from{ opacity:0; transform:translateY(14px) } to{ opacity:1; transform:none } }

        /* ---- rotating rings + monogram ---- */
        .afl-rings {
          position: relative;
          width: clamp(90px, 22vw, 130px);
          height: clamp(90px, 22vw, 130px);
          display: grid; place-items: center;
          margin-bottom: clamp(22px, 5vw, 34px);
        }
        .afl-ring { position: absolute; border-radius: 9999px; }
        .afl-ring-a {
          inset: 0; border: 2px solid transparent;
          border-top-color: #D4AF37; border-right-color: #E7C46A;
          animation: aflSpin 1.5s linear infinite;
        }
        .afl-ring-b {
          inset: 10px; border: 2px solid transparent;
          border-bottom-color: #B88A2D; border-left-color: #D4AF37;
          animation: aflSpin 2.2s linear infinite reverse;
        }
        .afl-ring-c {
          inset: 20px; border: 1px solid rgba(212,175,55,.25);
          animation: aflPulseRing 2s ease-in-out infinite;
        }
        @keyframes aflSpin { to { transform: rotate(360deg); } }
        @keyframes aflPulseRing { 0%,100%{ transform:scale(1); opacity:.4 } 50%{ transform:scale(1.08); opacity:.9 } }

        .afl-monogram {
          font-family: 'Cinzel', serif; font-weight: 700;
          font-size: clamp(28px, 7vw, 44px);
          background: linear-gradient(135deg,#E7C46A,#D4AF37,#B88A2D);
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          filter: drop-shadow(0 0 14px rgba(212,175,55,.35));
          animation: aflGlow 2.4s ease-in-out infinite;
        }
        @keyframes aflGlow { 0%,100%{ filter:drop-shadow(0 0 10px rgba(212,175,55,.25)) } 50%{ filter:drop-shadow(0 0 22px rgba(212,175,55,.55)) } }

        /* ---- wordmark ---- */
        .afl-textwrap { display: flex; flex-direction: column; align-items: center; gap: 12px; }
        .afl-rule {
          height: 1px; width: clamp(140px, 40vw, 240px);
          background: linear-gradient(90deg, transparent, #D4AF37, transparent);
          animation: aflRule 1.6s ease-in-out infinite alternate;
        }
        @keyframes aflRule { from{ opacity:.4; transform:scaleX(.6) } to{ opacity:1; transform:scaleX(1) } }

        .afl-name {
          font-family: 'Cinzel', serif; font-weight: 700;
          font-size: clamp(24px, 6.5vw, 48px);
          letter-spacing: .16em; text-transform: uppercase; line-height: 1.08; margin: 0;
          background: linear-gradient(90deg,#B88A2D 0%,#D4AF37 25%,#E7C46A 50%,#D4AF37 75%,#B88A2D 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          animation: aflShine 3s linear infinite;
        }
        @keyframes aflShine { to { background-position: 200% center; } }

        .afl-sub {
          margin: 0;
          font-family: 'Cinzel', serif;
          font-size: clamp(10px, 2.6vw, 14px);
          letter-spacing: .55em; text-indent: .55em; text-transform: uppercase;
          color: #BDBDBD;
        }

        .afl-dots { margin-top: clamp(20px, 5vw, 30px); display: flex; gap: 7px; }
        .afl-dots span {
          height: 7px; width: 7px; border-radius: 9999px; background: #D4AF37;
          animation: aflBounce 1.2s ease-in-out infinite;
        }
        .afl-dots span:nth-child(2){ animation-delay:.15s; background:#E7C46A }
        .afl-dots span:nth-child(3){ animation-delay:.30s; background:#B88A2D }
        @keyframes aflBounce { 0%,60%,100%{ transform:translateY(0); opacity:.35 } 30%{ transform:translateY(-8px); opacity:1 } }

        .afl-sronly {
          position:absolute; width:1px; height:1px; padding:0; margin:-1px;
          overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0;
        }

        @media (prefers-reduced-motion: reduce) {
          .afl-orb, .afl-ring-a, .afl-ring-b, .afl-ring-c, .afl-monogram,
          .afl-name, .afl-rule, .afl-dots span, .afl-center { animation: none !important; }
          .afl-name, .afl-monogram { -webkit-text-fill-color:#D4AF37; color:#D4AF37; }
          .afl-ring-a { border-color:#D4AF37; opacity:.6; }
          .afl-rule { transform:scaleX(1); opacity:1; }
        }
      `}</style>
    </div>
  );
}