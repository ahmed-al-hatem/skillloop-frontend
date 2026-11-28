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
├── admin-features/       # لوحة الأدمن (/admin/*)، نفس ترتيب وقواعد features/
│   └── core/             # هيكل الأدمن: adminRoutes، nav.config (الـ layout والـ guard جايين)
├── features/
│   └── auth/             # هيكل مجلدات فاضي، والـ features منبنيها من Figma و openapi.yaml
├── shared/               # مشترك للكل، وما بيعرف شي عن الـ features ولا admin-features
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

## قسم الأدمن: `src/admin-features/`

لوحة الأدمن موجودة بـ `src/admin-features/<feature>/` ومنبنيها **بالضبط متل** `src/features/` (نفس المجلدات، `routes.tsx`، `index.ts`). منستورد منها بـ `@/admin-features/<feature>`.

- `admin-features/core/` هو هيكل الأدمن. بيصدّر `adminRoutes` اللي بيجمع routes كل features الأدمن. ملف `src/app/router.tsx` بيستورد `adminRoutes` بس.
- الـ mock handlers تبع الأدمن بتتسجل بـ `src/mocks/handlers.ts` متل تبع الأعضاء (import واحد + spread واحد).
- قسم الأدمن بيقدر يستخدم feature تبع الأعضاء عن طريق `index.ts` تبعها (`@/features/auth`). أما features الأعضاء ما بتستورد من `admin-features/` أبداً.
- لتعمل feature أدمن جديدة استخدم skill الـ `new-feature` مع `--admin`.

## القواعد (ESLint بيفرض 1 و2 و5)

1. **`shared/` ما بيستورد من `features/` ولا من `admin-features/` أبداً.** وfeatures الأعضاء ما بتستورد من `admin-features/`.
2. **الـ feature بتستورد من feature تانية بس عن طريق `index.ts` تبعها:** `import { useCurrentUser } from '@/features/auth'` ✅، أما `'@/features/auth/api/auth.queries'` ❌. ونفس الشي لـ `@/admin-features/<f>`. جوا نفس الـ feature استخدم استيراد نسبي (`../schemas/auth.schema`)، بس أبداً `../../<feature-تانية>/...`.
3. **الملفات المركزية كل feature إلها سطر واحد.** `src/app/router.tsx` و`src/mocks/handlers.ts` بس بيجمعوا:
   ```ts
   children: [...authRoutes, ...bookingsRoutes, ...servicesRoutes /* أبجدياً */];
   ```
   هيك الـ conflict نادر، وإذا صار بيكون سطر واحد.
4. **مجلد `mocks/` ما بينصدّر من `index.ts` تبع الـ feature.** ملف `src/mocks/handlers.ts` بيستورد الـ handlers مباشرة، لتضل البيانات الوهمية برّا نسخة الإنتاج.
5. **`components/` و`pages/` و`hooks/` و`api/` ما بيستوردوا من مجلد `mocks/` أبداً.** البيانات الوهمية بتوصل للتطبيق بس عن طريق MSW.

## وين بحط ملفي؟

| عم اكتب…                            | حطه بـ                                   |
| ----------------------------------- | ---------------------------------------- |
| صفحة أو مكوّن بيستخدمه feature واحد  | `features/<f>/pages/` أو `components/`   |
| شاشة بلوحة الأدمن                   | `admin-features/<f>/pages/`              |
| مكوّن واجهة أساسي (زر، modal…) للكل  | `shared/components/ui/` بـ PR صغير لحاله |
| طلب للباك إند                       | `features/<f>/api/<f>.api.ts`            |
| schema بيستخدمها 2 features أو أكتر | `shared/schemas/` (اعمله وقت الحاجة)     |
| hook أو دالة مساعدة عامة            | `shared/hooks/` أو `shared/lib/`         |
| رابط (URL) جديد                     | `shared/constants/routes.ts` (`ROUTES`)  |

## مكونات مشتركة بدون تكرار

بدك مكوّن مشترك جديد؟ اعمله بـ **PR صغير لحاله** بـ `shared/components/ui/`، بينعمله merge بسرعة، وزميلك بيعمل pull لـ `main`. هيك ما بينعمل نفس المكوّن مرتين بمكانين.

</div>
