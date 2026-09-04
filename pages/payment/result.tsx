import Link from "next/link";
import { useRouter } from "next/router";
import { IconArrow, IconCheck, IconX } from "../../src/components/icons";

export default function PaymentResultPage() {
  const router = useRouter();
  const failed = router.query.Status === "NOK" || router.query.status === "failed";

  return (
    <section className="checkout-page">
      <div className="checkout-empty reveal is-visible">
        <span className="checkout-empty-icon">
          {failed ? <IconX size={34} /> : <IconCheck size={34} />}
        </span>
        <h1>{failed ? "پرداخت ناموفق بود" : "نتیجه پرداخت"}</h1>
        <p>
          {failed
            ? "پرداخت تکمیل نشد. می‌توانید دوباره به صفحه پرداخت برگردید و روش دیگری را امتحان کنید."
            : "پس از اتصال بک‌اند، نتیجه نهایی پرداخت زرین‌پال یا رمزارز در این صفحه نمایش داده می‌شود."}
        </p>
        <Link href="/checkout" className="btn btn-primary">بازگشت به پرداخت <IconArrow size={17} /></Link>
      </div>
    </section>
  );
}
