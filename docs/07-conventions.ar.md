<div dir="rtl">

# 07 · الاصطلاحات

[English](07-conventions.md) · **العربية**

التنسيق أوتوماتيكي (Prettier وEditorConfig، بيتنسّق مع الحفظ). هون الأشياء اللي الأدوات ما بتقرّرها عنك.

## التسمية

| الشي              | الأسلوب                  | مثال                                   |
| ----------------- | ------------------------ | -------------------------------------- |
| ملف المكوّن واسمه  | PascalCase               | `ServiceCard.tsx` → `ServiceCard`      |
| نوع الـ Props     | `<Component>Props`       | `ServiceCardProps`                     |
| Hook              | `useX` بـ camelCase      | `useServices`                          |
| باقي الملفات      | kebab-case + لاحقة الدور | `service.schema.ts`، `services.api.ts` |
| مجلد الـ feature  | kebab-case               | `admin-members/`                       |
| Zod schema ونوعها | `XSchema` و`X`           | `MatchSchema` و`Match`                 |
| الثوابت           | UPPER_SNAKE_CASE         | `ROUTES`، `QUERY_STALE_TIME`           |

- **Named exports بس** (`export function X`)، بدون `export default`.
- مكوّن واحد بكل ملف (دوال مساعدة صغيرة خاصة بنفس الملف ما في مشكلة).

## TypeScript والبيانات

- الأنواع بتطلع من Zod: `export type Match = z.infer<typeof MatchSchema>`. لا تكتب نفس النوع يدوياً.
- ممنوع `any`. إذا فعلاً ما بتعرف النوع استخدم `unknown` وتحقق منه.
- بيانات السيرفر مكانها TanStack Query، لا تنسخها لـ `useState`.
- مفاتيح الـ query: object واحد لكل feature (`servicesKeys`) بـ `features/<f>/api/<f>.queries.ts`.

## الفورمز

react-hook-form مع Zod:

```tsx
const form = useForm<LoginInput>({ resolver: zodResolver(LoginInputSchema) });

<Input id="email" {...form.register('email')} error={form.formState.errors.email?.message} />;
```

أخطاء التحقق من السيرفر (422) بتجي بـ `ApiRequestError.errors`، اعرضها بـ `form.setError(field, …)`.

## التنسيق (Styling)

- **Tailwind بس**، ومنجمع الكلاسات بـ `cn()`: `cn('p-4', isActive && 'bg-accent')`.
- استخدم **الـ tokens** مو ألوان مباشرة: `bg-primary`، `text-muted-foreground`، `border-border`، `bg-card`، `text-destructive`. موجودين بـ `src/styles/index.css` ومأخوذين من ألوان الهوية — شوف [design/README.ar.md](../design/README.ar.md).
- ممنوع `style={{}}` وممنوع CSS modules.

## RTL (العربي أولاً)

التطبيق `dir="rtl"`. استخدم كلاسات **منطقية** ليشتغل كمان بـ LTR:

| ❌ لا                | ✅ نعم              |
| -------------------- | ------------------- |
| `ml-2` / `mr-2`      | `ms-2` / `me-2`     |
| `pl-4` / `pr-4`      | `ps-4` / `pe-4`     |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left`          | `text-start`        |
| `rounded-l-md`       | `rounded-s-md`      |

الأيقونات اللي إلها اتجاه (أسهم) بدها `rtl:rotate-180`.

## حالات الواجهة

كل شاشة بتجيب بيانات لازم تعالج: **التحميل** (`Spinner`)، **الخطأ** (`ErrorState` مع إعادة المحاولة)، **الفاضي** (`EmptyState`).

## shadcn/ui (اختياري)

ملف `components.json` جاهز والـ tokens تبعنا بأسماء shadcn، يعني:

```bash
npx shadcn@latest add dialog
```

بيحط المكوّن بـ `src/shared/components/ui/`. غيّر اسم الملف لـ PascalCase (`Dialog.tsx`) وافتحه بـ PR صغير لحاله. تأكد قبل إنه المكوّن مو موجود.

## النصوص

نصوص الواجهة بالعربي حالياً ومكتوبة مباشرة بالمكونات. إذا قررنا i18n لاحقاً منستخرجها، لا تبني نظام ترجمة قبل ما ينتقرر.

</div>
