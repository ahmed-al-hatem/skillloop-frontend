<div dir="rtl">

# 05 · عقد الـ API

[English](05-api-contract.md) · **العربية**

الاتفاق بين الفرونت والباك هو **ملف OpenAPI** تبع فريق الباك إند (`openapi.yaml`، نسخة API v1). فيه كل الـ endpoints: الطلب والرد والأخطاء. **ما منستدعي إلا الـ endpoints الموجودة بهالملف.** إذا شاشة بدها شي مو موجود، اطلب من فريق الباك يضيفه لـ `openapi.yaml` أول، وبعدين ابنيه.

## وين لاقيه

- اطلب آخر نسخة من `openapi.yaml` من فريق الباك، وخلّي نسخة عندك بـ `local-docs/api/openapi.yaml`. مجلد `local-docs/` موجود بـ `.gitignore`، يعني **ما بينرفع** على هالريبو.
- لتقراه بسهولة، افتحه بـ VS Code مع إضافة OpenAPI preview، أو الصقه بـ https://editor.swagger.io.
- كل endpoint مكتوب جنبه مين بيقدر يستدعيه (أي حدا / عضو / عضو موثّق / أدمن) وأي متطلب من الـ SRS بينفّذ.

## الأساسيات (من `openapi.yaml`)

| الموضوع         | القاعدة                                                                                           |
| --------------- | ------------------------------------------------------------------------------------------------- |
| العنوان الأساسي | `VITE_API_URL` وبينتهي بـ `/api/v1` (مثلاً `http://localhost:3000/api/v1`)                         |
| الصيغة          | JSON، و`multipart/form-data` بس لرفع الصور                                                        |
| المصادقة        | `Authorization: Bearer <accessToken>` (15 دقيقة)، وبيتجدد بـ `POST /auth/refresh`                 |
| الـ IDs         | نصوص UUID                                                                                         |
| التواريخ        | ISO 8601 بتوقيت UTC، مثلاً `2026-11-27T18:30:00Z`                                                  |
| اللغة           | `Accept-Language: ar` أو `en` (رسائل الأخطاء بتجي مترجمة)                                         |
| القوائم         | `?page=1&pageSize=20` (أكتر شي 50) ← `{ "data": [...], "meta": { "page", "pageSize", "total" } }` |
| النقاط          | دايماً أرقام صحيحة. الأرصدة والأسعار بيحسبها الباك إند، والفرونت بس بيعرضها                        |

### الخطأ (كل 4xx و5xx)

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Some fields are invalid",
    "details": [{ "field": "phone", "message": "Phone number is already used" }]
  }
}
```

الـ `code` ثابت، فاستخدمه بالكود. الـ `message` مترجم جاهز، فاعرضه للمستخدم. والـ `details` بيجي بس مع `VALIDATION_ERROR`، وفيه عنصر لكل حقل. القائمة الكاملة للأكواد موجودة بأول `openapi.yaml`.

> ⚠️ ملفات `src/shared/api/client.ts` و`src/shared/api/types.ts` لسا ماشيين على المسودة الأولى (خطأ مسطّح فيه `errors`، و`perPage`). لازم نظبطهم على هالصيغة لما نبني أول endpoint حقيقي (auth).

## بناء endpoint

1. لاقيه بـ `openapi.yaml`.
2. شغّل `/add-endpoint` بـ Claude Code أو Codex، أو امشِ على [06 · البيانات الوهمية](06-mocking.ar.md). هيك بينكتب الـ Zod schema (مطابق لـ schema الـ OpenAPI)، ودالة الـ api، والـ query hook، والـ mock تبع MSW.
3. لما يشتغل الباك الحقيقي، جرّب مع `VITE_USE_MOCKS=false`.

</div>
