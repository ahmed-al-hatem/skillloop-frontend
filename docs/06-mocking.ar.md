<div dir="rtl">

# 06 · البيانات الوهمية بـ MSW

[English](06-mocking.md) · **العربية**

[MSW](https://mswjs.io) بيلقط طلبات `axios` الحقيقية بالمتصفح وبيرد عليها ببيانات وهمية. الكود تبعنا ما بيعرف الفرق، ولما يجهز الباك إند منغيّر بس `VITE_USE_MOCKS=false` وما بيتغيّر شي تاني.

## كيف مربوط

```
main.tsx ──(VITE_USE_MOCKS=true)──► mocks/browser.ts ──► mocks/handlers.ts
                                                         ├─ ...matchingHandlers
                                                         └─ ...<feature>Handlers
```

- ملف `public/mockServiceWorker.js` بيولّده MSW (`npx msw init public`)، لا تعدّل عليه.
- الطلبات اللي ما إلها handler بتروح عالـ API الحقيقي.
- بنسخة الإنتاج مع `VITE_USE_MOCKS=false` ما بينحمّل MSW ولا البيانات الوهمية.

## إضافة mock لـ feature

الأسهل: `/add-endpoint` بـ Claude Code أو Codex. أو يدوياً:

**1. البيانات**: `features/exchanges/mocks/exchanges.data.ts`

```ts
import type { Exchange } from '../schemas/exchange.schema';

export const exchanges: Exchange[] = [/* بيانات واقعية، أسماء عربي وإنجليزي */];
```

**2. الـ Handler**: `features/exchanges/mocks/exchanges.handlers.ts`

```ts
import { delay, http, HttpResponse } from 'msw';
import { env } from '@/config/env';
import { exchanges } from './exchanges.data';

export const exchangesHandlers = [
  http.get(`${env.API_URL}/exchanges`, async () => {
    await delay(400);
    return HttpResponse.json({ data: exchanges });
  }),
];
```

**3. التسجيل**: سطر واحد بـ `src/mocks/handlers.ts`:

```ts
import { exchangesHandlers } from '@/features/exchanges/mocks/exchanges.handlers';

export const handlers: RequestHandler[] = [...exchangesHandlers, ...matchingHandlers];
```

## تجريب حالات الخطأ والقائمة الفاضية

غيّر الـ handler مؤقتاً (ولا ترفع التغيير):

```ts
// خطأ
return HttpResponse.json({ message: 'Server error', code: 'SERVER_ERROR' }, { status: 500 });
// خطأ بالبيانات
return HttpResponse.json(
  { message: 'Invalid', code: 'VALIDATION_ERROR', errors: { email: ['Already taken'] } },
  { status: 422 },
);
// قائمة فاضية
return HttpResponse.json({ data: [] });
```

## القواعد

- الرد لازم يطابق [05 · عقد الـ API](05-api-contract.ar.md) بالضبط (نفس الغلاف ونفس الحقول).
- اعطِ البيانات نوع الـ schema تبع الـ feature لتضل مطابقة.
- **ممنوع** تستورد `*.data.ts` بالمكونات أو الصفحات.
- **ممنوع** تصدّر `mocks/` من `index.ts` تبع الـ feature.

</div>
