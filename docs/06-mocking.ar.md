<div dir="rtl">

# 06 · البيانات الوهمية بـ MSW

[English](06-mocking.md) · **العربية**

[MSW](https://mswjs.io) بيلقط طلبات `axios` الحقيقية بالمتصفح وبيرد عليها ببيانات وهمية. الكود تبعنا ما بيعرف الفرق، ولما يجهز الباك إند منغيّر بس `VITE_USE_MOCKS=false` وما بيتغيّر شي تاني.

## كيف مربوط

```
main.tsx ──(VITE_USE_MOCKS=true)──► mocks/browser.ts ──► mocks/handlers.ts
                                                         ├─ ...authHandlers
                                                         └─ ...<feature>Handlers
```

- ملف `public/mockServiceWorker.js` بيولّده MSW (`npx msw init public`)، لا تعدّل عليه.
- الطلبات اللي ما إلها handler بتروح عالـ API الحقيقي.
- بنسخة الإنتاج مع `VITE_USE_MOCKS=false` ما بينحمّل MSW ولا البيانات الوهمية.

## إضافة mock لـ feature

الأسهل: `/add-endpoint` بـ Claude Code أو Codex. أو يدوياً:

**1. البيانات**: `features/services/mocks/services.data.ts`

```ts
import type { Service } from '../schemas/service.schema';

export const services: Service[] = [/* بيانات واقعية، أسماء عربي وإنجليزي */];
```

**2. الـ Handler**: `features/services/mocks/services.handlers.ts`

```ts
import { delay, http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { services } from './services.data';

export const servicesHandlers = [
  http.get(`${env.API_URL}/services`, async () => {
    await delay(400);
    return HttpResponse.json({
      data: services,
      meta: { page: 1, pageSize: 20, total: services.length },
    });
  }),
];
```

**3. التسجيل**: سطر واحد بـ `src/mocks/handlers.ts`:

```ts
import { servicesHandlers } from '@/features/services/mocks/services.handlers';

export const handlers: RequestHandler[] = [...authHandlers, ...servicesHandlers];
```

## أدوات مشتركة (`src/mocks/utils.ts`)

| الأداة                             | شو بتعمل                                                                                          |
| ---------------------------------- | ------------------------------------------------------------------------------------------------- |
| `paginate(items, url)`             | بترجع `{ data, meta: { page, pageSize, total } }` حسب `?page` و `?pageSize` (افتراضي 20، أقصى 50) |
| `apiError(code, status, details?)` | رد خطأ بشكل `{ error: { code, message, details } }` بكود من عقد الـ API                           |
| `withScenario(request)`            | تأخير واقعي + الحالة التجريبية المختارة بـ `?__mock=…`                                            |

```ts
http.get(`${env.API_URL}/services`, async ({ request }) => {
  const { response, empty } = await withScenario(request);
  if (response) return response;
  return HttpResponse.json(paginate(empty ? [] : services, request.url));
}),
```

زيد `?__mock=empty|error|slow|forbidden` على رابط **الصفحة** (مثلاً `/admin/members?__mock=empty`)، أو اكتب بالـ console `localStorage.__mock = 'slow'` (و `delete localStorage.__mock` لترجع طبيعي). `error` ← 500 `INTERNAL_ERROR`، `forbidden` ← 403 `FORBIDDEN`، `slow` ← تأخير 3 ثواني، `empty` ← الـ handler بيرجع بلا بيانات.

## تجريب حالات الخطأ والقائمة الفاضية يدوياً

لباقي الحالات، غيّر الـ handler مؤقتاً (ولا ترفع التغيير):

```ts
// خطأ
return HttpResponse.json(
  { error: { code: 'INTERNAL_ERROR', message: 'Server error' } },
  { status: 500 },
);
// خطأ بالبيانات
return HttpResponse.json(
  {
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Some fields are invalid',
      details: [{ field: 'email', message: 'Already taken' }],
    },
  },
  { status: 400 },
);
// قائمة فاضية
return HttpResponse.json({ data: [], meta: { page: 1, pageSize: 20, total: 0 } });
```

## القواعد

- الرد لازم يطابق [05 · عقد الـ API](05-api-contract.ar.md) بالضبط (نفس الغلاف ونفس الحقول).
- اعطِ البيانات نوع الـ schema تبع الـ feature لتضل مطابقة.
- **ممنوع** تستورد `*.data.ts` بالمكونات أو الصفحات.
- **ممنوع** تصدّر `mocks/` من `index.ts` تبع الـ feature.

</div>
