<div dir="rtl">

# 05 · عقد الـ API

[English](05-api-contract.md) · **العربية**

الاتفاق بين الفرونت والباك. **ما منستدعي إلا الـ endpoints المكتوبة هون.** أي endpoint جديد منتفق عليه مع الباك إند أولاً، بعدين منضيفه هون (باللغتين)، وبعدين منبنيه.

## الاصطلاحات

- **العنوان الأساسي:** `VITE_API_URL` (مثلاً `http://localhost:8000/api/v1`)
- **المصادقة:** `Authorization: Bearer <token>`، بينضاف تلقائياً من `shared/api/client.ts`
- **JSON** بالطلب والرد، أسماء الحقول `camelCase`، التواريخ ISO 8601 بتوقيت UTC (`2026-11-25T10:00:00Z`)، والـ IDs نصوص.

### النجاح

```json
{ "data": { ... }, "meta": { ... } }
```

### قائمة مقسّمة لصفحات

```json
{
  "data": [ ... ],
  "meta": { "page": 1, "perPage": 20, "total": 57, "totalPages": 3 }
}
```

الـ Query: `?page=1&perPage=20`. النوع بالفرونت: `Paginated<T>` أو `paginatedSchema(item)`.

### الخطأ (كل 4xx و5xx)

```json
{
  "message": "The given data was invalid.",
  "code": "VALIDATION_ERROR",
  "errors": { "email": ["The email has already been taken."] }
}
```

`errors` بتجي بس مع 422. بالفرونت أي فشل بيتحوّل لـ `ApiRequestError` (`message`، `code`، `status`، `errors`).

| الحالة | المعنى                       | شو بيعمل الفرونت                     |
| ------ | ---------------------------- | ------------------------------------ |
| 401    | مو مسجّل دخول أو انتهت الجلسة | بيمسح التوكن وبيشغّل handler الـ auth |
| 403    | غير مسموح                    | بيعرض رسالة                          |
| 404    | مو موجود                     | `EmptyState` أو صفحة غير موجود       |
| 422    | خطأ بالبيانات                | بيعرض `errors` تحت حقول الفورم       |
| 5xx    | خطأ بالسيرفر                 | `ErrorState` مع زر إعادة المحاولة    |

## الـ Endpoints

حالة الفرونت: `—` ما بلّشنا · `mocked` في MSW handler · `live` مجرّب مع الباك إند الحقيقي.

| Method | Path                   | Feature  | الـ `data` بالرد | حالة الباك | الفرونت |
| ------ | ---------------------- | -------- | ---------------- | ---------- | ------- |
| GET    | `/matches/suggestions` | matching | `Match[]`        | draft      | mocked  |

> `GET /matches/suggestions` **مثال مبدئي** لتوضيح الشكل، لازم نأكده مع فريق الباك إند.
> ضيفوا الباقي (auth، profile، exchanges، time-bank، reviews) أول ما ينتفق عليه.

## تفاصيل الـ Endpoints

### GET `/matches/suggestions`

الشركاء المقترحين للمستخدم الحالي.

```json
{
  "data": [
    {
      "id": "m1",
      "partner": { "id": "u1", "name": "Sara", "avatarUrl": null, "rating": 4.8 },
      "theyOffer": [{ "id": "s1", "name": "Photoshop", "category": "design" }],
      "theyWant": [{ "id": "s2", "name": "React", "category": "programming" }],
      "score": 92
    }
  ]
}
```

الـ Schema: `features/matching/schemas/match.schema.ts`.

## إضافة endpoint (قالب)

```md
### METHOD `/path`

شو بيعمل، ومين بيقدر يستدعيه.

Request body / query: …
Response `data`: … (مثال JSON)
Errors: 404 …، 422 …
```

بعدها: ضيف السطر عالجدول، ثم `/add-endpoint` (أو اتبع [06 · البيانات الوهمية](06-mocking.ar.md))، ثم غيّر حالة الفرونت لـ `mocked`.

</div>
