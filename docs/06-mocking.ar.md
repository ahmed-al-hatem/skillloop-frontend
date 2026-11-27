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

## تجريب حالات الخطأ والقائمة الفاضية

غيّر الـ handler مؤقتاً (ولا ترفع التغيير):

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
