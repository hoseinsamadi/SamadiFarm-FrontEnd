import { useState } from "react";
import type React from "react";
import Link from "next/link";
import { RATING_DIST, RATING_SUMMARY, TESTIMONIALS, type Testimonial } from "../data/site";
import { formatToman, toFa } from "../hooks/useReveal";
import { IconCheck, IconQuote, IconSend, IconStar } from "../components/icons";
import { submitReview, type ApiReview } from "../lib/reviewsApi";

interface ReviewsPageProps { reviews: ApiReview[]; }

function QuoteCard({ t }: { t: Testimonial }) {
  return <figure className="quote-card reveal"><span className="quote-mark"><IconQuote size={30}/></span><div className="quote-stars">{Array.from({length:5}).map((_,s)=><IconStar key={s} size={14} className={s<t.stars?"":"star-off"}/>)}</div><blockquote>{t.text}</blockquote><figcaption className="quote-who"><span className="quote-avatar" style={{background:t.tone}}>{t.name[0]}</span><span><strong>{t.name}</strong><span>{t.city}</span></span></figcaption></figure>;
}

function ApiQuoteCard({ review }: { review: ApiReview }) {
  return <figure className="quote-card reveal"><span className="quote-mark"><IconQuote size={30}/></span><div className="quote-stars">{Array.from({length:5}).map((_,s)=><IconStar key={s} size={14} className={s<review.stars?"":"star-off"}/>)}</div><blockquote>{review.text}</blockquote><figcaption className="quote-who"><span className="quote-avatar" style={{background:"linear-gradient(135deg,#d89521,#b85d16)"}}>{review.name[0]}</span><span><strong>{review.name}</strong><span>{review.city}</span></span></figcaption></figure>;
}

export default function ReviewsPage({ reviews }: ReviewsPageProps) {
  const [name,setName]=useState("");
  const [city,setCity]=useState("");
  const [stars,setStars]=useState(5);
  const [text,setText]=useState("");
  const [errors,setErrors]=useState<{name?:string;text?:string;submit?:string}>({});
  const [showToast,setShowToast]=useState(false);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();const errs:{name?:string;text?:string}={};if(name.trim().length<2)errs.name="نام خود را کامل بنویسید.";if(text.trim().length<10)errs.text="دیدگاه باید حداقل ۱۰ حرف باشد.";setErrors(errs);if(Object.keys(errs).length)return;try{await submitReview({name:name.trim(),city:city.trim()||"ایران",stars,text:text.trim()});setName("");setCity("");setText("");setStars(5);setErrors({});setShowToast(true);window.setTimeout(()=>setShowToast(false),4200)}catch(error){setErrors({submit:error instanceof Error?error.message:"ثبت دیدگاه انجام نشد."})}};
  const totalReviews=RATING_SUMMARY.total+reviews.length;
  return <><section className="page-opener"><div className="shell"><nav className="breadcrumb"><Link href="/">خانه</Link><span>/</span><span>دیدگاه‌ها</span></nav><h1 className="page-title">حرفِ کسانی که چشیده‌اند</h1><p className="page-desc">نظرهای تأییدشده‌ی مشتریان را بخوانید و تجربه‌ی خودتان را ثبت کنید. دیدگاه شما پس از بررسی نمایش داده می‌شود.</p></div></section><section className="shell" style={{paddingTop:"3.5rem"}}><div className="rating-panel reveal"><div className="rating-num-block"><span className="rating-big">{RATING_SUMMARY.avg}</span><div className="star-row">{Array.from({length:5}).map((_,i)=><IconStar key={i} size={19}/>)}</div><span className="rating-of">از مجموع {formatToman(totalReviews)} دیدگاه ثبت‌شده</span></div><div className="dist-list">{RATING_DIST.map(d=><div className="dist-row" key={d.stars}><span>{toFa(d.stars)} ستاره</span><div className="dist-bar"><div className="dist-fill" style={{"--w":`${d.pct}%`} as React.CSSProperties}/></div><span>{toFa(d.pct)}٪</span></div>)}</div></div><div id="all-reviews" className="quotes-grid" style={{marginTop:"3rem"}}>{reviews.map(review=><ApiQuoteCard key={`api-${review.id}`} review={review}/>)}{TESTIMONIALS.map(t=><QuoteCard key={t.name} t={t}/>)}</div><div className="review-form-wrap"><form className="review-form reveal" onSubmit={submit} noValidate><h3>شما هم از عسل ما چشیده‌اید؟</h3><p>دیدگاه‌تان را بنویسید؛ پس از تأیید، در همین صفحه نمایش داده می‌شود.</p><div className="star-picker" role="radiogroup" aria-label="امتیاز شما">{[1,2,3,4,5].map(n=><button type="button" key={n} className={`star-pick${n<=stars?" on":""}`} onClick={()=>setStars(n)}><IconStar size={27}/></button>)}<span className="star-hint">{toFa(stars)} ستاره از ۵</span></div><div className="form-row"><div><label htmlFor="rv-name">نام و نام خانوادگی</label><input id="rv-name" className="input" value={name} onChange={e=>setName(e.target.value)} placeholder="مثلاً رضا محمدی"/>{errors.name&&<span className="form-error">{errors.name}</span>}</div><div><label htmlFor="rv-city">شهر (اختیاری)</label><input id="rv-city" className="input" value={city} onChange={e=>setCity(e.target.value)} placeholder="مثلاً اصفهان"/></div></div><div className="field"><label htmlFor="rv-text">دیدگاه شما</label><textarea id="rv-text" className="textarea" value={text} onChange={e=>setText(e.target.value)} placeholder="طعم، بسته‌بندی، ارسال…"/>{errors.text&&<span className="form-error">{errors.text}</span>}</div>{errors.submit&&<span className="form-error">{errors.submit}</span>}<button type="submit" className="btn btn-primary" style={{marginTop:"1.3rem"}}><IconSend size={17}/>ثبت دیدگاه</button></form></div></section><section className="shell" style={{padding:"4.5rem 1.25rem"}}><div className="cta-band reveal"><h2>هنوز نچشیده‌اید؟ برداشت تازه منتظر نمی‌ماند</h2><Link href="/products" className="btn btn-primary">دیدن محصولات</Link></div></section><div className={`toast${showToast?" is-show":""}`} role="status">{showToast&&<><IconCheck size={18}/>دیدگاه شما ثبت شد و پس از تأیید نمایش داده می‌شود.</>}</div></>;
}
