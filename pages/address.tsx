import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IconArrow, IconCheck } from "../src/components/icons";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  plaque: string;
  unit: string;
}

const STORAGE_KEY = "samadiFarm.shippingAddress";

const emptyAddress: ShippingAddress = {
  fullName: "",
  phone: "",
  province: "",
  city: "",
  address: "",
  postalCode: "",
  plaque: "",
  unit: "",
};

export default function AddressPage() {
  const router = useRouter();
  const [form, setForm] = useState<ShippingAddress>(emptyAddress);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) setForm({ ...emptyAddress, ...JSON.parse(saved) });
    } catch {
      // Ignore invalid local data and keep the empty form.
    }
  }, []);

  const update = (field: keyof ShippingAddress, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const required: Array<keyof ShippingAddress> = ["fullName", "phone", "province", "city", "address", "postalCode"];
    if (required.some((field) => !form[field].trim())) {
      setError("لطفاً همه فیلدهای ضروری را کامل کنید.");
      return;
    }
    if (!/^09\d{9}$/.test(form.phone.replace(/\s/g, ""))) {
      setError("شماره تلفن باید با 09 شروع شود و 11 رقم باشد.");
      return;
    }
    if (!/^\d{10}$/.test(form.postalCode.replace(/\s/g, ""))) {
      setError("کد پستی باید ۱۰ رقم باشد.");
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    router.push("/checkout");
  };

  return (
    <section className="address-page">
      <div className="address-head reveal is-visible">
        <span className="eyebrow">اطلاعات ارسال سفارش</span>
        <h1>آدرس ارسال</h1>
        <p>لطفاً مشخصات گیرنده را وارد کنید تا هزینه و روش ارسال در مرحله پرداخت محاسبه شود.</p>
      </div>

      <form className="address-card reveal is-visible" onSubmit={submit}>
        <div className="checkout-card-title">
          <span>۱</span>
          <div><h2>مشخصات گیرنده</h2><p>اطلاعات تماس و نشانی تحویل</p></div>
        </div>

        <div className="address-form-grid">
          <label><span>نام و نام خانوادگی *</span><input value={form.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="مثلاً حسین صمدی" autoComplete="name" /></label>
          <label><span>شماره تلفن *</span><input value={form.phone} onChange={(e) => update("phone", e.target.value.replace(/\D/g, "").slice(0, 11))} placeholder="09123456789" inputMode="tel" autoComplete="tel" dir="ltr" /></label>
          <label><span>استان *</span><input value={form.province} onChange={(e) => update("province", e.target.value)} placeholder="مثلاً تهران" autoComplete="address-level1" /></label>
          <label><span>شهر *</span><input value={form.city} onChange={(e) => update("city", e.target.value)} placeholder="مثلاً تهران" autoComplete="address-level2" /></label>
          <label className="address-field-wide"><span>آدرس کامل *</span><textarea value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="خیابان، کوچه، نام ساختمان و سایر جزئیات" rows={4} autoComplete="street-address" /></label>
          <label><span>کد پستی *</span><input value={form.postalCode} onChange={(e) => update("postalCode", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="۱۰ رقم" inputMode="numeric" autoComplete="postal-code" dir="ltr" /></label>
          <label><span>پلاک</span><input value={form.plaque} onChange={(e) => update("plaque", e.target.value)} placeholder="مثلاً ۲۵" inputMode="numeric" /></label>
          <label><span>واحد</span><input value={form.unit} onChange={(e) => update("unit", e.target.value)} placeholder="مثلاً ۳" inputMode="numeric" /></label>
        </div>

        {error && <div className="address-error">{error}</div>}

        <div className="address-actions">
          <button type="submit" className="btn btn-primary">ذخیره آدرس و ادامه <IconArrow size={17} /></button>
          <button type="button" className="address-back" onClick={() => router.push("/checkout")}>بازگشت</button>
        </div>
      </form>

      <div className="address-note reveal is-visible"><IconCheck size={17} /> اطلاعات آدرس فقط برای تکمیل سفارش استفاده می‌شود.</div>
    </section>
  );
}
