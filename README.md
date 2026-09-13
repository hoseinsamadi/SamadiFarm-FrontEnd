# Samadi Farm Frontend

Frontend فروشگاه صمدی فارم با **Next.js + React + TypeScript**.

## صفحات

- `/` — خانه
- `/products` — محصولات و فیلتر دسته‌بندی
- `/story` — داستان ما و ویدیوهای یوتیوب
- `/reviews` — دیدگاه‌ها و ثبت دیدگاه در مرورگر

## اجرا

```bash
npm install
npm run dev
```

سپس `http://localhost:3000` را باز کنید.

برای نمایش خودکار ویدیوهای کانال یوتیوب در `/story`، متغیرهای `.env.example` را در `.env.local` قرار دهید و مقدار `YOUTUBE_API_KEY` را تنظیم کنید. مقدار `YOUTUBE_CHANNEL_HANDLE` به صورت پیش‌فرض `SAmadiFarm` است. هر صفحه ۲۰ ویدیو دارد و صفحه‌بندی با token یوتیوب انجام می‌شود.

برای بررسی production:

```bash
npm run build
npm start
```

## ساختار

- `pages/` — routing رسمی Next.js
- `src/pages/` — محتوای صفحات
- `src/components/` — کامپوننت‌های سایت
- `src/data/site.ts` — محتوا، محصولات و لینک‌ها
- `src/styles/` — استایل سایت
