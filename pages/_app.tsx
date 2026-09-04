import type { AppProps } from "next/app";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import CartDrawer, { type CartEntry } from "../src/components/CartDrawer";
import { IconCheck } from "../src/components/icons";
import { useReveal } from "../src/hooks/useReveal";
import type { Product } from "../src/data/site";
import "../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [entries, setEntries] = useState<CartEntry[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => { const onComplete = () => window.scrollTo(0,0); router.events.on("routeChangeComplete",onComplete); return () => router.events.off("routeChangeComplete",onComplete); }, [router.events]);
  useReveal([router.asPath]);
  useEffect(() => { if(!toast)return; const t=window.setTimeout(()=>setToast(null),2600); return()=>window.clearTimeout(t); },[toast]);
  useEffect(() => { if(!justAddedId)return; const t=window.setTimeout(()=>setJustAddedId(null),1500); return()=>window.clearTimeout(t); },[justAddedId]);
  const add=useCallback((product:Product)=>{setEntries(prev=>{const existing=prev.find(e=>e.product.id===product.id);return existing?prev.map(e=>e.product.id===product.id?{...e,qty:e.qty+1}:e):[...prev,{product,qty:1}]});setJustAddedId(product.id);setToast(`«${product.name}» به سبد اضافه شد`);},[]);
  const inc=(id:string)=>setEntries(prev=>prev.map(e=>e.product.id===id?{...e,qty:e.qty+1}:e));
  const dec=(id:string)=>setEntries(prev=>prev.map(e=>e.product.id===id?{...e,qty:e.qty-1}:e).filter(e=>e.qty>0));
  const remove=(id:string)=>setEntries(prev=>prev.filter(e=>e.product.id!==id));
  const count=entries.reduce((sum,e)=>sum+e.qty,0);const total=entries.reduce((sum,e)=>sum+e.qty*e.product.price,0);
  return <div className="page"><Header cartCount={count} onOpenCart={()=>setCartOpen(true)}/><main><div key={router.asPath} className="page-in"><Component {...pageProps} onAdd={add} justAddedId={justAddedId}/></div></main><Footer/><CartDrawer open={cartOpen} onClose={()=>setCartOpen(false)} entries={entries} total={total} onInc={inc} onDec={dec} onRemove={remove} onCheckout={()=>setEntries([])}/><div className={`toast${toast?" is-show":""}`} role="status">{toast&&<><IconCheck size={18}/>{toast}</>}</div></div>;
}
