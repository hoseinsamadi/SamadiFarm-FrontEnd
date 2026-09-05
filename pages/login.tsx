import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IconArrow, IconShield } from "../src/components/icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

export default function LoginPage() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [mode, setMode] = useState<"otp" | "password">("otp");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validPhone = /^09\d{9}$/.test(phone.replace(/\D/g, ""));

  const request = async (path: string, body: Record<string, unknown>) => {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error("auth_failed");
    return response.json().catch(() => ({}));
  };

  const sendOtp = async () => {
    setError("");
    if (!validPhone) return setError("لطفاً شماره موبایل معتبر وارد کنید.");
    setLoading(true);
    try {
      await request("/api/auth/send-otp", { phone });
      setOtpSent(true);
    } catch {
      setError("ارسال کد تأیید انجام نشد. اتصال API احراز هویت را بررسی کنید.");
    } finally { setLoading(false); }
  };

  const loginWithPhone = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    if (!validPhone) return setError("لطفاً شماره موبایل معتبر وارد کنید.");
    setLoading(true);
    try {
      if (mode === "otp") {
        if (!otpSent) return await sendOtp();
        if (!/^\d{4,6}$/.test(otp)) return setError("کد تأیید را وارد کنید.");
        await request("/api/auth/verify-otp", { phone, otp });
      } else {
        if (!password) return setError("رمز عبور را وارد کنید.");
        await request("/api/auth/login", { phone, password });
      }
      const next = typeof router.query.next === "string" ? router.query.next : "/address";
      await router.push(next);
    } catch {
      setError("ورود انجام نشد. شماره موبایل، کد تأیید یا رمز عبور را بررسی کنید.");
    } finally { setLoading(false); }
  };

  const loginWithGoogle = () => {
    const next = typeof router.query.next === "string" ? router.query.next : "/address";
    window.location.href = `${API_BASE}/api/auth/google/?next=${encodeURIComponent(next)}`;
  };

  return (
    <section className="auth-page">
      <div className="auth-head reveal is-visible">
        <span className="eyebrow">حساب کاربری صمدی فارم</span>
        <h1>ورود به حساب</h1>
        <p>برای ادامه خرید، وارد حساب کاربری خود شوید یا حساب جدید بسازید.</p>
      </div>

      <div className="auth-card reveal is-visible">
        <button type="button" className="google-login" onClick={loginWithGoogle} disabled={loading}>
          <span className="google-mark">G</span>
          <span>ادامه با حساب Google</span>
        </button>

        <div className="auth-divider"><span>یا ورود با شماره موبایل</span></div>

        <form onSubmit={loginWithPhone} className="auth-form">
          <label>
            <span>شماره موبایل</span>
            <input value={phone} onChange={(e) => { setPhone(e.target.value.replace(/[^0-9۰-۹]/g, "")); setOtpSent(false); }} inputMode="numeric" autoComplete="tel" placeholder="۰۹۱۲۱۲۳۴۵۶۷" dir="ltr" />
          </label>

          <div className="auth-mode">
            <button type="button" className={mode === "otp" ? "active" : ""} onClick={() => { setMode("otp"); setOtpSent(false); }}>ورود با کد پیامکی</button>
            <button type="button" className={mode === "password" ? "active" : ""} onClick={() => setMode("password")}>ورود با رمز عبور</button>
          </div>

          {mode === "otp" && otpSent && (
            <label>
              <span>کد تأیید پیامک‌شده</span>
              <input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="کد ۶ رقمی" dir="ltr" />
            </label>
          )}

          {mode === "password" && (
            <label>
              <span>رمز عبور</span>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="رمز عبور شما" dir="ltr" />
            </label>
          )}

          {error && <div className="auth-error">{error}</div>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? "در حال بررسی..." : mode === "otp" && !otpSent ? "دریافت کد تأیید" : "ورود و ادامه خرید"}
            {!loading && <IconArrow size={17} />}
          </button>
        </form>

        <div className="auth-security"><IconShield size={17} /> اطلاعات حساب شما فقط از طریق اتصال امن به API احراز هویت ارسال می‌شود.</div>
      </div>

      <p className="auth-back"><Link href="/checkout">بازگشت به سبد و پرداخت</Link></p>
    </section>
  );
}
