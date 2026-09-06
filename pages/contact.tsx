import Link from "next/link";
import { CONTACT } from "../src/data/site";
import { IconClock, IconInstagram, IconPhone, IconPin, IconWhatsApp } from "../src/components/icons";

export default function ContactPage() {
  return (
    <>
      <section className="page-opener">
        <div className="shell">
          <nav className="breadcrumb" aria-label="مسیر صفحه">
            <Link href="/">خانه</Link><span>/</span><span>تماس با ما</span>
          </nav>
          <h1 className="page-title">تماس با صمدی فارم</h1>
          <p className="page-desc">برای سؤال درباره‌ی محصولات، سفارش عمده یا هر موضوع دیگری، مستقیم با زنبوردار در تماس باشید.</p>
        </div>
      </section>

      <section className="shell" style={{ paddingTop: "3rem", paddingBottom: "5rem" }}>
        <aside className="contact-card reveal is-visible" style={{ maxWidth: "34rem", margin: "0 auto" }}>
          <h3>گفتگوی مستقیم با زنبوردار</h3>
          <p>سؤال درباره‌ی برداشت فصل، آزمایش عسل یا سفارش عمده؟ هر روز پاسخگو هستیم — خودِ زنبوردار، نه اپراتور.</p>
          <div className="contact-row"><IconPhone size={19} /><a href={CONTACT.phoneHref} dir="ltr">{CONTACT.phone}</a></div>
          <div className="contact-row"><IconInstagram size={19} /><a href={CONTACT.YOUTUBEHref} target="_blank" rel="noreferrer" dir="ltr">@{CONTACT.YOUTUBE}</a></div>
          <div className="contact-row"><IconPin size={19} /><span>{CONTACT.address}</span></div>
          <div className="contact-row"><IconClock size={19} /><span>{CONTACT.hours}</span></div>
          <div className="contact-actions">
            <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-wa">
              <IconWhatsApp size={19} />پیام در واتساپ
            </a>
            <a href={CONTACT.phoneHref} className="btn btn-cream"><IconPhone size={18} />تماس تلفنی</a>
          </div>
        </aside>
      </section>
    </>
  );
}
