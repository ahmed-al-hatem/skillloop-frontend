<div dir="rtl">

# 02 · هيكلية المشروع

[English](02-project-structure.md) · **العربية**

الكود مقسوم **حسب الميزة (feature)** مو حسب نوع الملف. كل شي بيخص "matching" موجود بـ `src/features/matching/`.

```
src/
├── app/                  # تجميع التطبيق بس، بدون منطق ميزات
│   ├── App.tsx
│   ├── providers.tsx     # QueryClientProvider (+ devtools وقت التطوير)
│   ├── router.tsx        # بيجمع routes كل feature
│   └── layouts/          # MainLayout (هيدر + تنقل)، AuthLayout (كرت بالنص)
├── features/
│   ├── auth/             # تسجيل، دخول، session
│   ├── profile/          # المهارات اللي بعلّمها واللي بدي اتعلمها
│   ├── matching/         # اقتراح الشركاء  ← مثال مرجعي كامل
│   ├── exchanges/        # اتفاقية التبادل + الجلسات
│   ├── time-bank/        # الرصيد وسجل الحركات
│   └── reviews/          # التقييم والشارات
├── shared/               # مشترك للكل، وما بيعرف شي عن الـ features
│   ├── api/              # client.ts (axios + interceptors)، types.ts (ApiResponse, ApiError, Paginated)
│   ├── components/       # EmptyState, ErrorState, PageHeader, ErrorBoundary
│   │   └── ui/           # Button, Input, Label, Card, Badge, Spinner
│   ├── hooks/            # useDebounce, useMediaQuery
│   ├── lib/              # cn(), formatDate(), formatHours(), tokenStorage
│   ├── schemas/          # UserSummarySchema, SkillSchema
│   └── constants/        # ROUTES، إعدادات الـ query
├── mocks/                # browser.ts (setupWorker)، handlers.ts (بيجمع handlers الـ features)
├── config/env.ts         # قراءة env والتحقق منها بـ Zod
├── styles/index.css      # Tailwind + الألوان والقيم (tokens)
└── main.tsx              # بيشغّل MSW إذا VITE_USE_MOCKS=true وبعدين بيعرض التطبيق
```

## من جوا الـ feature

```
features/matching/
├── api/
│   ├── matching.api.ts       # دوال الطلبات فقط (axios + تحقق Zod)
│   └── matching.queries.ts   # useSuggestions() بـ TanStack Query + مفاتيح الـ query
├── components/
│   ├── PartnerCard.tsx
│   └── SuggestionsList.tsx
├── pages/
│   └── MatchingPage.tsx
├── schemas/
│   └── match.schema.ts       # MatchSchema + type Match
├── mocks/
│   ├── matching.data.ts
│   └── matching.handlers.ts
├── routes.tsx                # export const matchingRoutes
└── index.ts                  # الواجهة العامة: شو مسموح للباقي يستورد
```

اعمل بس المجلدات اللي بتحتاجها. الـ feature الصغيرة بتكفيها ملفات (`types.ts`) بدل مجلدات.

## القواعد الأربعة (ESLint بيفرض أول قاعدتين)

1. **`shared/` ما بيستورد من `features/` أبداً.**
2. **الـ feature بتستورد من feature تانية بس عن طريق `index.ts` تبعها:** `import { useSuggestions } from '@/features/matching'` ✅، أما `'@/features/matching/api/matching.queries'` ❌. جوا نفس الـ feature استخدم استيراد نسبي (`../schemas/match.schema`).
3. **الملفات المركزية كل feature إلها سطر واحد.** `src/app/router.tsx` و`src/mocks/handlers.ts` بس بيجمعوا:
   ```ts
   children: [...exchangesRoutes, ...matchingRoutes, ...profileRoutes /* أبجدياً */];
   ```
   هيك الـ conflict نادر، وإذا صار بيكون سطر واحد.
4. **مجلد `mocks/` ما بينصدّر من `index.ts` تبع الـ feature.** ملف `src/mocks/handlers.ts` بيستورد الـ handlers مباشرة، لتضل البيانات الوهمية برّا نسخة الإنتاج.

## وين بحط ملفي؟

| عم اكتب…                            | حطه بـ                                   |
| ----------------------------------- | ---------------------------------------- |
| صفحة أو مكوّن بيستخدمه feature واحد  | `features/<f>/pages/` أو `components/`   |
| مكوّن واجهة أساسي (زر، modal…) للكل  | `shared/components/ui/` بـ PR صغير لحاله |
| طلب للباك إند                       | `features/<f>/api/<f>.api.ts`            |
| schema بيستخدمها 2 features أو أكتر | `shared/schemas/`                        |
| hook أو دالة مساعدة عامة            | `shared/hooks/` أو `shared/lib/`         |
| رابط (URL) جديد                     | `shared/constants/routes.ts` (`ROUTES`)  |

## مكونات مشتركة بدون تكرار

بدك مكوّن مشترك جديد؟ اعمله بـ **PR صغير لحاله** بـ `shared/components/ui/`، بينعمله merge بسرعة، وزميلك بيعمل pull لـ `main`. هيك ما بينعمل نفس المكوّن مرتين بمكانين.

</div>
