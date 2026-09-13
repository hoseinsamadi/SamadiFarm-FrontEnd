import { useEffect, useState } from "react";
import type React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { IconArrow, IconCheck, IconUser, IconWallet } from "../src/components/icons";
import type { ShippingAddress } from "./address";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";
const ADDRESS_KEY = "samadiFarm.shippingAddress";

interface AccountUser {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
}

interface OrderItem { name?: string; qty?: number; }
interface UserOrder {
  id: number;
  amount: string;
  currency: string;
  payment_status_label: string;
  order_status: string;
  order_status_label: string;
  method_label: string;
  transaction_hash: string;
  items: OrderItem[];
  created_at: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<AccountUser | null>(null);
  const [address, setAddress] = useState<ShippingAddress | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", phone: "", password: "", passwordConfirm: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
        if (!active) return;
        if (response.ok) {
          const loadedUser = await response.json() as AccountUser;
          setUser(loadedUser);
          setProfile((current) => ({ ...current, firstName: loadedUser.first_name || "", lastName: loadedUser.last_name || "", phone: loadedUser.phone || "" }));
          const ordersResponse = await fetch(`${API_BASE}/api/payments/my-orders`, { credentials: "include" });
          if (ordersResponse.ok) {
            const ordersPayload = await ordersResponse.json() as { orders?: UserOrder[] };
            if (active) setOrders(ordersPayload.orders || []);
          }
        } else {
          router.replace(`/login?next=${encodeURIComponent("/account")}`);
          return;
        }
      } catch {
        if (active) router.replace(`/login?next=${encodeURIComponent("/account")}`);
        return;
      } finally {
        if (active) setOrdersLoading(false);
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

  const saveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setProfileError("");
    setProfileMessage("");
    if (profile.password && profile.password !== profile.passwordConfirm) {
      setProfileError("تکرار رمز ثابت با رمز اصلی یکسان نیست.");
      return;
    }
    setSavingProfile(true);
    try {
      const response = await fetch(`${API_BASE}/api/auth/profile`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ first_name: profile.firstName, last_name: profile.lastName, phone: profile.phone, password: profile.password }),
      });
      const payload = await response.json().catch(() => ({})) as { detail?: string; user?: AccountUser };
      if (!response.ok) throw new Error(payload.detail || "ذخیره مشخصات انجام نشد.");
      if (payload.user) setUser(payload.user);
      setProfile((current) => ({ ...current, password: "", passwordConfirm: "" }));
      setProfileMessage("مشخصات حساب با موفقیت ذخیره شد.");
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : "ذخیره مشخصات انجام نشد.");
    } finally {
      setSavingProfile(false);
    }
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

      <nav className="account-nav address-card reveal is-visible" aria-label="منوی حساب کاربری">
        <strong>داشبورد</strong>
        <Link href="/products">خرید محصولات</Link>
        <button type="button" onClick={logout} disabled={loggingOut}>{loggingOut ? "در حال خروج..." : "خروج"}</button>
      </nav>

      <form className="address-card reveal is-visible" onSubmit={saveProfile}>
        <div className="checkout-card-title">
          <span><IconUser size={18} /></span>
          <div><h2>مشخصات کاربر</h2><p>اطلاعات حساب و رمز ورود خود را مدیریت کنید.</p></div>
        </div>
        <div className="address-form-grid">
          <label><span>نام *</span><input value={profile.firstName} onChange={(event) => setProfile({ ...profile, firstName: event.target.value })} placeholder="نام" /></label>
          <label><span>نام خانوادگی *</span><input value={profile.lastName} onChange={(event) => setProfile({ ...profile, lastName: event.target.value })} placeholder="نام خانوادگی" /></label>
          <label><span>شماره تماس</span><input value={profile.phone} disabled={Boolean(user.phone)} onChange={(event) => setProfile({ ...profile, phone: event.target.value.replace(/\D/g, "").slice(0, 11) })} placeholder="09123456789" dir="ltr" /></label>
          <label><span>رمز ثابت جدید</span><input type="password" value={profile.password} onChange={(event) => setProfile({ ...profile, password: event.target.value })} placeholder="حداقل ۶ کاراکتر" dir="ltr" /></label>
          <label><span>تکرار رمز ثابت</span><input type="password" value={profile.passwordConfirm} onChange={(event) => setProfile({ ...profile, passwordConfirm: event.target.value })} placeholder="تکرار رمز" dir="ltr" /></label>
        </div>
        {profileError && <div className="address-error">{profileError}</div>}
        {profileMessage && <div className="profile-success">{profileMessage}</div>}
        <div className="address-actions"><button type="submit" className="btn btn-primary" disabled={savingProfile}>{savingProfile ? "در حال ذخیره..." : "ذخیره مشخصات"}</button></div>
      </form>

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

      <div className="address-card reveal is-visible orders-card" style={{ marginTop: "1.25rem" }}>
        <div className="checkout-card-title">
          <span><IconCheck size={18} /></span>
          <div><h2>سفارش‌های من</h2><p>وضعیت سفارش‌ها از همین‌جا قابل پیگیری است.</p></div>
        </div>
        {ordersLoading ? <p className="orders-muted">در حال دریافت سفارش‌ها...</p> : orders.length === 0 ? <p className="orders-muted">هنوز سفارشی برای این حساب ثبت نشده است.</p> : <div className="orders-list">{orders.map((order) => <article className="order-card" key={order.id}><div className="order-card-head"><strong>سفارش شماره {order.id}</strong><time>{new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(new Date(order.created_at))}</time></div><div className="order-card-meta"><span>پرداخت: {order.payment_status_label}</span><span>روش: {order.method_label}</span><strong>{order.amount} {order.currency}</strong></div><div className="order-status-row"><span className={`order-status order-status--${order.order_status}`}>{order.order_status_label}</span>{order.items?.length > 0 && <span className="order-items-preview">{order.items.map((item) => `${item.name || "محصول"} × ${item.qty || 1}`).join("، ")}</span>}</div>{order.transaction_hash && <small className="order-hash">هش تراکنش: {order.transaction_hash}</small>}</article>)}</div>}
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
