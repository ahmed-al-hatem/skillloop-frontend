<div dir="rtl">

# 02 · هيكلية المشروع

[English](02-project-structure.md) · **العربية**

الكود مقسوم **حسب الميزة (feature)** مو حسب نوع الملف. كل شي بيخص "auth" موجود بـ `src/features/auth/`.

```
src/
├── app/                  # تجميع التطبيق بس، بدون منطق ميزات
│   ├── App.tsx
│   ├── providers.tsx     # QueryClientProvider (+ devtools وقت التطوير)
│   ├── router.tsx        # بيجمع routes كل feature
│   └── layouts/          # MainLayout (هيدر)، AuthLayout (كرت بالنص)
├── features/
│   ├── admin/            # هيكل لوحة الإدارة (MUI) — شوف "منطقة الإدارة" تحت
│   └── auth/             # هيكل مجلدات فاضي، والـ features منبنيها من Figma و openapi.yaml
├── shared/               # مشترك للكل، وما بيعرف شي عن الـ features
│   ├── api/              # client.ts (axios + interceptors)، types.ts (PageMeta, Paginated, listSchema, paginatedSchema, ApiError)
│   ├── assets/brand/     # ملفات اللوغو SVG (شوف design/README.ar.md)
│   ├── components/       # EmptyState, ErrorState, PageHeader, ErrorBoundary
│   │   └── ui/           # Button, Input, Label, Card, Badge, Spinner
│   ├── hooks/            # useDebounce, useMediaQuery
│   ├── lib/              # cn(), formatDate(), formatDateTime(), tokenStorage
│   └── constants/        # ROUTES، إعدادات الـ query
├── mocks/                # browser.ts (setupWorker)، handlers.ts (بيجمع handlers الـ features)
├── config/env.ts         # قراءة env والتحقق منها بـ Zod
├── styles/index.css      # Tailwind + الألوان والقيم (tokens)
└── main.tsx              # بيشغّل MSW إذا VITE_USE_MOCKS=true وبعدين بيعرض التطبيق
```

## من جوا الـ feature

هلق `features/auth/` فيه بس مجلدات فاضية (`.gitkeep`). لما ننبنيه رح يصير هيك:

```
features/auth/
├── api/
│   ├── auth.api.ts           # دوال الطلبات فقط (axios + تحقق Zod)
│   └── auth.queries.ts       # useLogin() / useCurrentUser() بـ TanStack Query + مفاتيح الـ query
├── components/
│   └── LoginForm.tsx
├── pages/
│   └── LoginPage.tsx
├── schemas/
│   └── auth.schema.ts        # LoginSchema + type Login
├── mocks/
│   ├── auth.data.ts
│   └── auth.handlers.ts
├── routes.tsx                # export const authRoutes
└── index.ts                  # الواجهة العامة: شو مسموح للباقي يستورد
```

اعمل بس المجلدات اللي بتحتاجها. الـ feature الصغيرة بتكفيها ملفات (`types.ts`) بدل مجلدات.

## منطقة الإدارة

لوحة الإدارة (`/admin`) مبنية بـ **MUI** (من [قالب MUI dashboard](https://mui.com/material-ui/getting-started/templates/dashboard/))، وباقي التطبيق Tailwind. الـ MUI بينحمّل بس لما حدا يفتح `/admin`، فالأعضاء ما بينزلوه أبداً، وESLint بيمنع استيراد MUI برّا `src/features/admin*`.

```
features/admin/                  # الهيكل المشترك لكل أقسام الإدارة
├── theme/
│   ├── AdminThemeProvider.tsx   # Emotion cache بيدعم RTL + ثيم MUI
│   ├── createAdminCache.ts      # stylis-plugin-rtl + `@layer mui` (ليما يتضاربوا Tailwind و MUI)
│   ├── createAdminTheme.ts      # ثيم غامق: كحلي + ألوان الهوية من متغيرات styles/index.css
│   ├── customizations/          # تخصيص المكونات، ملف لكل مجموعة (inputs، navigation، surfaces…)
│   └── flipInRtl.ts             # بيقلب أيقونات الأسهم بالـ RTL
├── components/                  # AdminLayout، SideMenu، SideMenuMobile، AppNavbar، Header، المسار…
├── config/navigation.ts         # ADMIN_NAV — عنصر لكل قسم
├── index.ts                     # بيصدّر adminRoute بس — بدون MUI (الـ router بيحمّله فوراً)
├── strings.ts                   # نصوص الهيكل (جاهزة للترجمة)
└── routes.tsx                   # adminRoute: الـ route تبع /admin (lazy)

features/admin-ui/               # مكونات MUI مشتركة بين الأقسام: SectionCard، MetricItem، LegendItem…
                                 # (بتستوردها صفحات الإدارة الـ lazy بس — أبداً من src/app)

features/admin-<section>/        # feature لكل قسم: admin-dashboard، admin-categories…
└── (api/، components/، pages/، schemas/، mocks/، routes.tsx، index.ts — متل أي feature)
```

**إضافة قسم إدارة:** اعمل `features/admin-<section>/`، وزيد سطر spread واحد جوا بلوك `...adminRoute` بـ `src/app/router.tsx`، وعنصر واحد بـ `ADMIN_NAV`.

## القواعد الأربعة (ESLint بيفرض أول قاعدتين)

1. **`shared/` ما بيستورد من `features/` أبداً.**
2. **الـ feature بتستورد من feature تانية بس عن طريق `index.ts` تبعها:** `import { useCurrentUser } from '@/features/auth'` ✅، أما `'@/features/auth/api/auth.queries'` ❌. جوا نفس الـ feature استخدم استيراد نسبي (`../schemas/auth.schema`).
3. **الملفات المركزية كل feature إلها سطر واحد.** `src/app/router.tsx` و`src/mocks/handlers.ts` بس بيجمعوا:
   ```ts
   children: [...authRoutes, ...bookingsRoutes, ...servicesRoutes /* أبجدياً */];
   ```
   هيك الـ conflict نادر، وإذا صار بيكون سطر واحد.
4. **مجلد `mocks/` ما بينصدّر من `index.ts` تبع الـ feature.** ملف `src/mocks/handlers.ts` بيستورد الـ handlers مباشرة، لتضل البيانات الوهمية برّا نسخة الإنتاج.

## وين بحط ملفي؟

| عم اكتب…                            | حطه بـ                                   |
| ----------------------------------- | ---------------------------------------- |
| صفحة أو مكوّن بيستخدمه feature واحد  | `features/<f>/pages/` أو `components/`   |
| مكوّن واجهة أساسي (زر، modal…) للكل  | `shared/components/ui/` بـ PR صغير لحاله |
| طلب للباك إند                       | `features/<f>/api/<f>.api.ts`            |
| schema بيستخدمها 2 features أو أكتر | `shared/schemas/` (اعمله وقت الحاجة)     |
| hook أو دالة مساعدة عامة            | `shared/hooks/` أو `shared/lib/`         |
| رابط (URL) جديد                     | `shared/constants/routes.ts` (`ROUTES`)  |

## مكونات مشتركة بدون تكرار

بدك مكوّن مشترك جديد؟ اعمله بـ **PR صغير لحاله** بـ `shared/components/ui/`، بينعمله merge بسرعة، وزميلك بيعمل pull لـ `main`. هيك ما بينعمل نفس المكوّن مرتين بمكانين.

</div>
