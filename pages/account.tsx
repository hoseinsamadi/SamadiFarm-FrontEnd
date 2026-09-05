import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { formatToman, toFa } from "../src/hooks/useReveal";
import { IconArrow, IconChevron, IconCircleCheck, IconClock, IconLogout, IconPackage, IconPin, IconShield, IconTruck, IconUser } from "../src/components/icons";

const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
type OrderStatus = "delivered" | "shipping" | "processing";
interface Order { id: string; date: string; items: string; total: number; status: OrderStatus; statusLabel: string; progress: number; }

const demoOrders: Order[] = [
  { id: "SF-۱۴۰۵۰۸۲۴", date: "۲۴ مرداد ۱۴۰۵", items: "عسل آویشن دماوند، عسل چندگیاه ییلاقی", total: 1230000, status: "shipping", statusLabel: "در حال ارسال", progress: 72 },
  { id: "SF-۱۴۰۵۰۷۱۱", date: "۱۱ مرداد ۱۴۰۵", items: "شهد با موم طبیعی", total: 790000, status: "delivered", statusLabel: "تحویل شده", progress: 100 },
  { id: "SF-۱۴۰۵۰۶۰۳", date: "۳ خرداد ۱۴۰۵", items: "عسل گون سبلان، گرده‌ی گل تازه", total: 980000, status: "delivered", statusLabel: "تحویل شده", progress: 100 },
];

const statusIcon = (status: OrderStatus) => status === "delivered" ? <IconCircleCheck size={17} /> : status === "shipping" ? <IconTruck size={17} /> : <IconClock size={17} />;

export default function AccountPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  const [name, setName] = useState("حسین صمدی");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const me = await fetch(`${API_BASE}/api/auth/me`, { credentials: "include" });
        if (me.ok) {
          const profile = await me.json();
          if (active && profile?.name) setName(profile.name);
          const response = await fetch(`${API_BASE}/api/orders`, { credentials: "include" });
          if (response.ok) {
            const data = await response.json();
            if (active && Array.isArray(data?.orders)) setOrders(data.orders);
          }
        }
      } catch { /* Keep preview data until the API is connected. */ }
      if (active) setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  const activeOrder = orders.find((order) => order.status !== "delivered") || orders[0] || demoOrders[0];
  return <section className="account-page shell" dir="rtl">
    <div className="account-welcome reveal is-visible"><div><span className="eyebrow">پنل مشتری صمدی فارم</span><h1>سلام {name.split(" ")[0]}، به خانه‌ات خوش آمدی</h1><p>اینجا می‌توانی وضعیت سفارش‌ها و اطلاعات ارسال خودت را یک‌جا ببینی.</p></div><Link href="/products" className="btn btn-primary">خرید دوباره <IconArrow size={17} /></Link></div>
    <div className="account-stats"><div className="account-stat"><span className="account-stat-icon honey"><IconPackage size={20} /></span><div><strong>{toFa(orders.length)}</strong><small>کل سفارش‌ها</small></div></div><div className="account-stat"><span className="account-stat-icon olive"><IconTruck size={20} /></span><div><strong>{toFa(orders.filter((order) => order.status !== "delivered").length)}</strong><small>در حال پیگیری</small></div></div><div className="account-stat"><span className="account-stat-icon cream"><IconCircleCheck size={20} /></span><div><strong>{toFa(orders.filter((order) => order.status === "delivered").length)}</strong><small>تحویل شده</small></div></div></div>
    <div className="account-grid"><div className="account-main">
      <div className="account-card active-order-card reveal is-visible"><div className="account-card-head"><div><span className="eyebrow">آخرین وضعیت</span><h2>سفارش در مسیر شما</h2></div><span className={`order-status ${activeOrder.status}`}>{statusIcon(activeOrder.status)}{activeOrder.statusLabel}</span></div><div className="active-order-meta"><strong>سفارش #{activeOrder.id}</strong><span>{activeOrder.date}</span><span>{activeOrder.items}</span></div><div className="progress-track"><span style={{ width: `${activeOrder.progress}%` }} /></div><div className="progress-labels"><span>ثبت سفارش</span><span>آماده‌سازی</span><span>تحویل به پست</span><span>تحویل به شما</span></div><div className="active-order-footer"><p><IconTruck size={18} /> مرسوله‌تان به مرکز توزیع قزوین رسیده است.</p><button type="button" className="text-action">جزئیات سفارش <IconChevron size={16} /></button></div></div>
      <div className="account-card orders-card reveal is-visible"><div className="account-card-head"><div><span className="eyebrow">سوابق خرید</span><h2>سفارش‌های من</h2></div><span className="muted-count">{toFa(orders.length)} سفارش</span></div><div className="orders-list">{orders.map((order) => <div className="order-row" key={order.id}><span className={`order-row-icon ${order.status}`}>{statusIcon(order.status)}</span><div className="order-row-info"><strong>#{order.id}</strong><span>{order.date} · {order.items}</span></div><div className="order-row-total"><strong>{formatToman(order.total)} تومان</strong><span className={`order-status ${order.status}`}>{order.statusLabel}</span></div><button type="button" className="order-more" aria-label={`جزئیات سفارش ${order.id}`}><IconChevron size={18} /></button></div>)}</div><Link href="/products" className="account-secondary-link">مشاهده محصولات و ثبت سفارش جدید <IconArrow size={16} /></Link></div>
    </div><aside className="account-side"><div className="account-card profile-card reveal is-visible"><div className="profile-top"><span className="profile-avatar"><IconUser size={24} /></span><div><h2>{name}</h2><span>مشتری صمدی فارم</span></div></div><div className="profile-detail"><span>شماره موبایل</span><strong dir="ltr">۰۹۳۸ ۲۸۶ ۶۴۰۸</strong></div><Link href="/address" className="profile-edit">ویرایش اطلاعات <IconChevron size={16} /></Link></div><div className="account-card address-card-mini reveal is-visible"><div className="account-card-head"><div><span className="eyebrow">آدرس پیش‌فرض</span><h2>محل تحویل</h2></div><IconPin size={20} /></div><strong>حسین صمدی</strong><p>قزوین، شهرک عارف، فروشگاه صمدی فارم<br />پلاک ۲۵، واحد ۳</p><Link href="/address" className="profile-edit">مدیریت آدرس‌ها <IconChevron size={16} /></Link></div><div className="account-help reveal is-visible"><IconShield size={20} /><div><strong>پشتیبانی سفارش</strong><p>اگر درباره مرسوله‌تان سوالی دارید، مستقیم با ما در تماس باشید.</p><a href="tel:+989382866408">تماس با صمدی فارم</a></div></div></aside></div>
    {loading && <span className="account-loading">در حال همگام‌سازی اطلاعات حساب...</span>}<button type="button" className="account-logout" onClick={() => router.push("/login")}><IconLogout size={16} /> خروج از حساب</button>
  </section>;
}
