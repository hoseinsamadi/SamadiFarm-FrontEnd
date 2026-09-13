import Link from "next/link";
import { useRouter } from "next/router";
import { IconArrow, IconCheck, IconX } from "../../src/components/icons";

export default function PaymentResultPage() {
  const router = useRouter();
  const successful = router.query.status === "success";
  const failed = router.query.Status === "NOK" || router.query.status === "failed";
  const refId = typeof router.query.ref_id === "string" ? router.query.ref_id : null;

  return (
    <section className="checkout-page">
      <div className="checkout-empty reveal is-visible">
        <span className="checkout-empty-icon">
          {failed ? <IconX size={34} /> : <IconCheck size={34} />}
        </span>
        <h1>{failed ? "پرداخت ناموفق بود" : successful ? "پرداخت با موفقیت انجام شد" : "نتیجه پرداخت"}</h1>
        <p>
          {failed
            ? "پرداخت تکمیل نشد. می‌توانید دوباره به صفحه پرداخت برگردید و روش دیگری را امتحان کنید."
            : successful
              ? `پرداخت شما تأیید شد.${refId ? ` شماره پیگیری: ${refId}` : ""}`
              : "در حال بررسی نتیجه پرداخت هستیم."}
        </p>
        <Link href="/checkout" className="btn btn-primary">بازگشت به پرداخت <IconArrow size={17} /></Link>
      </div>
    </section>
  );
}
