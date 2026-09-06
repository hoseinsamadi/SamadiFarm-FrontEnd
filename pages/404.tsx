import Link from "next/link";
import { IconArrow, IconHex } from "../src/components/icons";

export default function Custom404() {
  return (
    <section className="empty-page reveal is-visible">
      <span className="cat-icon"><IconHex size={30} /></span>
      <h1 className="page-title" style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", marginTop: "1rem" }}>
        این صفحه پیدا نشد
      </h1>
      <p style={{ color: "var(--ink-soft)", maxWidth: "28rem", margin: "1rem auto 1.8rem", lineHeight: 2 }}>
        ممکن است آدرس اشتباه باشد یا این صفحه جابه‌جا شده باشد. از اینجا می‌توانید به فروشگاه برگردید.
      </p>
      <Link href="/" className="btn btn-primary">بازگشت به خانه <IconArrow size={17} /></Link>
    </section>
  );
}
