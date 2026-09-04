import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { IconCheck } from "../src/components/icons";
import { useReveal } from "../src/hooks/useReveal";
import type { CartEntry } from "../src/components/CartDrawer";
import type { Product } from "../src/data/site";
import "../styles/globals.css";

const CartDrawer = dynamic(() => import("../src/components/CartDrawer"), {
  ssr: false,
  loading: () => null,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onComplete = () => window.scrollTo(0, 0);
    router.events.on("routeChangeComplete", onComplete);
    return () => router.events.off("routeChangeComplete", onComplete);
  }, [router.events]);

  useReveal([router.asPath]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!justAddedId) return;
    const timer = window.setTimeout(() => setJustAddedId(null), 1500);
    return () => window.clearTimeout(timer);
  }, [justAddedId]);

  const add = useCallback((product: Product) => {
    setEntries((prev) => {
      const existing = prev.find((entry) => entry.product.id === product.id);
      return existing
        ? prev.map((entry) => entry.product.id === product.id ? { ...entry, qty: entry.qty + 1 } : entry)
        : [...prev, { product, qty: 1 }];
    });
    setJustAddedId(product.id);
    setToast(`«${product.name}» به سبد اضافه شد`);
  }, []);

  const inc = (id: string) => setEntries((prev) => prev.map((entry) => entry.product.id === id ? { ...entry, qty: entry.qty + 1 } : entry));
  const dec = (id: string) => setEntries((prev) => prev.map((entry) => entry.product.id === id ? { ...entry, qty: entry.qty - 1 } : entry).filter((entry) => entry.qty > 0));
  const remove = (id: string) => setEntries((prev) => prev.filter((entry) => entry.product.id !== id));

  const count = entries.reduce((sum, entry) => sum + entry.qty, 0);
  const total = entries.reduce((sum, entry) => sum + entry.qty * entry.product.price, 0);

  return (
    <div className="page">
      <Header cartCount={count} onOpenCart={() => setCartOpen(true)} />
      <main>
        <div key={router.asPath} className="page-in">
          <Component {...pageProps} onAdd={add} justAddedId={justAddedId} />
        </div>
      </main>
      <Footer />
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        entries={entries}
        total={total}
        onInc={inc}
        onDec={dec}
        onRemove={remove}
        onCheckout={() => setEntries([])}
      />
      <div className={`toast${toast ? " is-show" : ""}`} role="status" aria-live="polite">
        {toast && <><IconCheck size={18} />{toast}</>}
      </div>
    </div>
  );
}
