import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { BRAND } from "../data/site";
import { toFa, useScrolled } from "../hooks/useReveal";
import { IconBag, IconMenu, IconUser, IconX } from "./icons";

export const NAV_ROUTES = [
  { to: "/", label: "خانه" },
  { to: "/products", label: "محصولات" },
  { to: "/posts", label: "مجله" },
  { to: "/story", label: "داستان ما" },
  { to: "/reviews", label: "دیدگاه‌ها" },
];

interface HeaderProps { cartCount: number; onOpenCart: () => void; }

export default function Header({ cartCount, onOpenCart }: HeaderProps) {
  const scrolled = useScrolled(10);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useRouter();
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => { document.body.style.overflow = menuOpen ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [menuOpen]);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <div className="shell header-inner">
        <Link href="/" className="brand" aria-label="صمدی فارم — بازگشت به صفحه‌ی خانه">
          <span className="brand-hex">
            <Image src="/LOGO-HOSEINBEEKEEPER-Small.png" alt="هوشمند" width={40} height={40} />
          </span>
          <span><strong className="brand-name">{BRAND.name}</strong><span className="brand-tag">{BRAND.tagline}</span></span>
        </Link>
        <nav className="main-nav" aria-label="ناوبری اصلی">
          {NAV_ROUTES.map((l) => <Link key={l.to} href={l.to} className={`nav-link${pathname === l.to ? " is-active" : ""}`}>{l.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link href="/products" className="btn btn-primary btn-sm btn-hide-mobile">سفارش آنلاین</Link>
          <Link href="/account" className={`icon-btn account-btn${pathname === "/account" ? " is-active" : ""}`} aria-label="حساب کاربری"><IconUser size={18} /></Link>
          <button type="button" className="cart-btn" onClick={onOpenCart} aria-label={`باز کردن سبد خرید — ${toFa(cartCount)} قلم`}><IconBag size={19} />{cartCount > 0 && <span className="cart-count">{toFa(cartCount)}</span>}</button>
          <button type="button" className="menu-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen} aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}>{menuOpen ? <IconX size={23} /> : <IconMenu size={23} />}</button>
        </div>
      </div>
      <div className={`mobile-menu${menuOpen ? " is-open" : ""}`}>
        {NAV_ROUTES.map((l, i) => <Link key={l.to} href={l.to} style={{ "--d": `${i * .05}s` } as React.CSSProperties} className={`mobile-link${pathname === l.to ? " is-active" : ""}`}>{l.label}</Link>)}
        <div style={{ padding: "0 0 1rem" }}><Link href="/products" className="btn btn-primary" style={{ marginTop: ".6rem", width: "100%" }}>سفارش آنلاین</Link></div>
      </div>
    </header>
  );
}
