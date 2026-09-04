import Link from "next/link";
import { useRouter } from "next/router";
import Products, { type Filter } from "../components/Products";
import OrderSection from "../components/OrderSection";
import { PRODUCTS, type Product } from "../data/site";
import { toFa, useReveal } from "../hooks/useReveal";
import { IconHex } from "../components/icons";
const VALID_FILTERS:Filter[]=["single","multi","hive"];
interface ProductsPageProps{onAdd:(p:Product)=>void;justAddedId:string|null}
export default function ProductsPage({onAdd,justAddedId}:ProductsPageProps){const router=useRouter();const raw=typeof router.query.cat==="string"?router.query.cat:null;const filter:Filter=VALID_FILTERS.includes(raw as Filter)?raw as Filter:"all";useReveal([filter]);const shown=filter==="all"?PRODUCTS.length:PRODUCTS.filter(p=>p.cat===filter).length;const setFilter=(f:Filter)=>void router.push(f==="all"?"/products":`/products?cat=${f}`,undefined,{shallow:true});return <><section className="page-opener"><div className="honeycomb pattern-abs"/><div className="shell" style={{position:"relative"}}><nav className="breadcrumb" aria-label="مسیر صفحه"><Link href="/">خانه</Link><span>/</span><span>محصولات</span></nav><div className="opener-flex"><div><h1 className="page-title">برداشتِ تازه‌ی کندوها</h1><p className="page-desc">همه‌ی شیشه‌ها همان روزِ برداشت درب‌موم می‌شوند و همراه با برگه‌ی آزمایش ساکارز و رطوبت به دست شما می‌رسند.</p></div><div className="opener-facts"><span className="fact"><IconHex size={15}/>{toFa(shown)} محصول آماده‌ی ارسال</span></div></div></div></section><Products filter={filter} onFilter={setFilter} onAdd={onAdd} justAddedId={justAddedId}/><OrderSection/></>}
