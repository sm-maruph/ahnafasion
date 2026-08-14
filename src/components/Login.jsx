import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";

const BRAND = "var(--brand)";

export default function Login() {
  const { settings } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, refresh } = useAuth();
  const [form, setForm] = useState({ email: "", password: "", remember: true });
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      const profile = await refresh();
      const target = location.state?.from || (profile?.role === "admin" ? "/admin" : "/");
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100svh-4rem)] overflow-hidden px-3 py-6 sm:px-6 sm:py-10 lg:px-10" style={{ backgroundColor: "var(--primary)" }}>
      <div className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full blur-3xl" style={{ backgroundColor: "rgba(212,175,55,.08)" }} />
      <div className="pointer-events-none absolute -right-28 bottom-0 h-80 w-80 rounded-full blur-3xl" style={{ backgroundColor: "rgba(212,175,55,.06)" }} />

      <div className="relative mx-auto grid w-full max-w-6xl overflow-hidden rounded-2xl border shadow-2xl md:grid-cols-[.94fr_1.06fr]" style={{ backgroundColor: "var(--foreground)", borderColor: "rgba(231,196,106,.34)", boxShadow: "0 30px 80px rgba(0,0,0,.55)" }}>
        <section className="relative overflow-hidden px-6 py-8 sm:px-10 sm:py-10 md:min-h-[620px] md:px-12 md:py-14 lg:px-16" style={{ background: "linear-gradient(145deg, #211b0e 0%, #0b0b0b 56%, #17130b 100%)" }}>
          <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full border" style={{ borderColor: "rgba(212,175,55,.12)" }} />
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full border" style={{ borderColor: "rgba(212,175,55,.18)" }} />
          <div className="pointer-events-none absolute bottom-0 left-0 h-px w-full" style={{ background: "linear-gradient(90deg, transparent, var(--brand), transparent)" }} />

          <div className="relative z-10 flex h-full max-w-md flex-col justify-center">
            <Link to="/" className="mb-8 inline-flex w-fit items-center gap-3 no-underline md:mb-14" aria-label="Go to homepage">
              {settings.logo ? (
                <img src={settings.logo} alt={settings.storeName} className="h-11 w-11 rounded-full object-cover ring-1 ring-yellow-500/40" />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-full border font-heading text-xl font-bold" style={{ color: BRAND, borderColor: "var(--border)" }}>A</span>
              )}
              <span className="font-heading text-lg font-semibold uppercase tracking-[.14em] sm:text-xl" style={{ color: "var(--details)" }}>{settings.storeName || "Ahnaf Fashion"}</span>
            </Link>

            <p className="text-[11px] font-semibold uppercase tracking-[.28em]" style={{ color: BRAND }}>Members access</p>
            <h1 className="mt-3 text-3xl font-semibold leading-[1.08] sm:text-4xl lg:text-[2.65rem]" style={{ color: "var(--details)" }}>
              <span className="block">Welcome back</span>
              <span className="mt-1 block">to <span style={{ color: BRAND }}>refined style.</span></span>
            </h1>
            <p className="mt-4 max-w-sm text-sm leading-6 sm:text-base" style={{ color: "var(--subtitle)" }}>
              Sign in for a seamless shopping experience, from saved favorites to effortless order tracking.
            </p>

            <ul className="mt-7 hidden space-y-3 text-sm sm:block" style={{ color: "var(--subtitle)" }}>
              {["Save favorites to your wishlist", "Track every order in one place", "Faster, pre-filled checkout"].map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "rgba(212,175,55,.12)", color: BRAND }}><CheckRoundedIcon style={{ fontSize: 14 }} /></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-9 sm:px-10 sm:py-12 lg:px-16">
          <form onSubmit={submit} className="w-full max-w-md" noValidate>
            <p className="text-[11px] font-semibold uppercase tracking-[.25em]" style={{ color: BRAND }}>Welcome back</p>
            <h2 className="mt-2 text-3xl font-semibold sm:text-4xl" style={{ color: "var(--details)" }}>Sign in</h2>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--subtitle)" }}>Enter your account details to continue shopping.</p>

            {error && (
              <div className="mt-5 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm" style={{ color: "#FCA5A5", backgroundColor: "rgba(127,29,29,.18)", borderColor: "rgba(248,113,113,.3)" }} role="alert">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />{error}
              </div>
            )}

            <div className="mt-7 space-y-5">
              <div>
                <label htmlFor="login-email" className="block text-sm font-medium" style={{ color: "var(--details)" }}>Email address</label>
                <div className="mt-2 flex items-center rounded-xl border px-4 transition focus-within:border-yellow-500/60 focus-within:ring-2 focus-within:ring-yellow-500/10" style={{ backgroundColor: "#121212", borderColor: "var(--border)" }}>
                  <MailOutlineRoundedIcon className="shrink-0" style={{ fontSize: 19, color: "var(--subtitle)" }} />
                  <input id="login-email" type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(e) => set("email", e.target.value)} className="login-input w-full border-0 bg-transparent px-3 py-3.5 text-sm outline-none" style={{ backgroundColor: "transparent", color: "var(--details)" }} placeholder="you@example.com" />
                </div>
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium" style={{ color: "var(--details)" }}>Password</label>
                <div className="mt-2 flex items-center rounded-xl border px-4 transition focus-within:border-yellow-500/60 focus-within:ring-2 focus-within:ring-yellow-500/10" style={{ backgroundColor: "#121212", borderColor: "var(--border)" }}>
                  <LockOutlinedIcon className="shrink-0" style={{ fontSize: 19, color: "var(--subtitle)" }} />
                  <input id="login-password" type={show ? "text" : "password"} autoComplete="current-password" value={form.password} onChange={(e) => set("password", e.target.value)} className="login-input min-w-0 flex-1 border-0 bg-transparent px-3 py-3.5 text-sm outline-none" style={{ backgroundColor: "transparent", color: "var(--details)" }} placeholder="Enter your password" />
                  <button type="button" onClick={() => setShow((current) => !current)} className="shrink-0 p-1 transition hover:opacity-80" style={{ color: "var(--subtitle)" }} aria-label={show ? "Hide password" : "Show password"}>
                    {show ? <VisibilityOffOutlinedIcon style={{ fontSize: 20 }} /> : <VisibilityOutlinedIcon style={{ fontSize: 20 }} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2" style={{ color: "var(--subtitle)" }}>
                <input type="checkbox" checked={form.remember} onChange={(e) => set("remember", e.target.checked)} className="h-4 w-4 rounded" style={{ accentColor: BRAND }} />
                Remember me
              </label>
              <Link to="/forgot-password" className="font-medium underline-offset-4 transition hover:underline" style={{ color: BRAND }}>Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="group mt-7 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60" style={{ backgroundColor: BRAND, color: "var(--button-text)", boxShadow: "0 12px 30px rgba(212,175,55,.12)" }}>
              {loading ? (
                <><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />Signing in...</>
              ) : (
                <>Sign in <ArrowForwardRoundedIcon className="transition-transform group-hover:translate-x-1" style={{ fontSize: 19 }} /></>
              )}
            </button>

            <div className="my-7 flex items-center gap-3"><span className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} /><span className="text-[10px] uppercase tracking-[.2em]" style={{ color: "var(--subtitle)" }}>New here?</span><span className="h-px flex-1" style={{ backgroundColor: "var(--border)" }} /></div>
            <p className="text-center text-sm" style={{ color: "var(--subtitle)" }}>
              Join {settings.storeName || "Ahnaf Fashion"}.{" "}<Link to="/register" className="font-semibold underline-offset-4 transition hover:underline" style={{ color: BRAND }}>Create an account</Link>
            </p>
          </form>
        </section>
      </div>
    </div>
  );
}
