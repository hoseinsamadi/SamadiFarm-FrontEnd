import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IconArrow, IconCheck, IconUser, IconWallet } from "../src/components/icons";
import type { ShippingAddress } from "./address";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
const ADDRESS_KEY = "samadiFarm.shippingAddress";

interface AccountUser {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
        if (!active) return;
        if (response.ok) {
          setUser(await response.json());
        } else {
          router.replace(`/login?next=${encodeURIComponent("/account")}`);
          return;
        }
      } catch {
        if (active) router.replace(`/login?next=${encodeURIComponent("/account")}`);
        return;
      } finally {
        if (active) setLoading(false);
      }
    })();

    try {
      const saved = window.localStorage.getItem(ADDRESS_KEY);
      if (saved) setAddress(JSON.parse(saved));
    } catch {
      setAddress(null);
    }

    return () => {
      active = false;
    };
  }, [router]);

  const logout = async () => {
    setLoggingOut(true);
    try {
      await fetch(`${API_BASE}/api/auth/logout`, { method: "POST", credentials: "include" });
    } catch {
      // اگر بک‌اند در دسترس نباشد هم کاربر را از صفحه خارج می‌کنیم
    }
    setLoggingOut(false);
    router.push("/");
  };

  if (loading) {
    return (
      <section className="address-page">
        <div className="empty-page reveal is-visible">
          <p>در حال بررسی حساب کاربری...</p>
        </div>
      </section>
    );
  }

  if (!user) return null;

  return (
    <section className="address-page">
      <div className="address-head reveal is-visible">
        <span className="eyebrow">حساب کاربری صمدی فارم</span>
        <h1>سلام {user.name || "کاربر عزیز"} 👋</h1>
        <p>مشخصات حساب و آخرین آدرس ثبت‌شده‌ی شما اینجاست.</p>
      </div>

      <div className="address-card reveal is-visible">
        <div className="checkout-card-title">
          <span><IconUser size={18} /></span>
          <div><h2>مشخصات حساب</h2><p>اطلاعاتی که هنگام ورود ثبت شده</p></div>
        </div>
        <div style={{ display: "grid", gap: ".6rem", fontSize: ".9rem", color: "var(--ink-soft)" }}>
          {user.phone && <span>📞 {user.phone}</span>}
          {user.email && <span>✉️ {user.email}</span>}
          {!user.phone && !user.email && <span>هنوز اطلاعات تماسی ثبت نشده است.</span>}
        </div>
      </div>

      <div className="address-card reveal is-visible" style={{ marginTop: "1.25rem" }}>
        <div className="checkout-card-title">
          <span><IconWallet size={18} /></span>
          <div><h2>آدرس ارسال ذخیره‌شده</h2><p>برای سفارش‌های بعدی استفاده می‌شود</p></div>
        </div>
        {address ? (
          <div className="shipping-address-card">
            <div className="shipping-address-main">
              <strong>{address.fullName}</strong>
              <span>📞 {address.phone}</span>
              <span>📍 {address.province}، {address.city}</span>
              <span>{address.address}{address.plaque ? `، پلاک ${address.plaque}` : ""}{address.unit ? `، واحد ${address.unit}` : ""}</span>
            </div>
            <button type="button" className="address-edit" onClick={() => router.push("/address")}>ویرایش آدرس</button>
          </div>
        ) : (
          <div className="address-required">
            <p>هنوز آدرسی ثبت نکرده‌اید.</p>
            <button type="button" className="btn btn-primary" onClick={() => router.push("/address")}>ثبت آدرس <IconArrow size={17} /></button>
          </div>
        )}
      </div>

      <div className="address-card reveal is-visible" style={{ marginTop: "1.25rem" }}>
        <div className="checkout-card-title">
          <span><IconCheck size={18} /></span>
          <div><h2>سفارش‌های من</h2><p>در حال حاضر پیگیری سفارش از طریق واتساپ انجام می‌شود</p></div>
        </div>
        <p style={{ color: "var(--ink-soft)", fontSize: ".85rem", lineHeight: 2, margin: 0 }}>
          به‌زودی امکان مشاهده‌ی تاریخچه‌ی سفارش‌ها مستقیماً همین‌جا اضافه می‌شود. تا آن زمان برای پیگیری سفارش با شماره‌ی تماس صمدی فارم در ارتباط باشید.
        </p>
      </div>

      <div className="address-actions" style={{ marginTop: "1.5rem" }}>
        <button type="button" className="address-back" onClick={logout} disabled={loggingOut}>
          {loggingOut ? "در حال خروج..." : "خروج از حساب"}
        </button>
        <Link href="/products" className="btn btn-ghost">بازگشت به فروشگاه</Link>
      </div>
    </section>
  );
}
