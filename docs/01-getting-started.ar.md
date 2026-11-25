<div dir="rtl">

# 01 · البداية

[English](01-getting-started.md) · **العربية**

## المتطلبات

- **Node.js 22 أو أحدث** (`node -v`)
- **Git** و**GitHub CLI** (اعمل `gh auth login` مرة وحدة)
- **VS Code**: افتح الريبو ووافق على الإضافات المقترحة (ESLint، Prettier، Tailwind CSS، EditorConfig)
- اختياري: **Claude Code** أو **Codex** (شوف [08 · المساعدات الذكية](08-ai-assistants.ar.md))

## أول تشغيل

```bash
git clone https://github.com/ahmed-al-hatem/skillloop-frontend.git
cd skillloop-frontend
npm install
cp .env.example .env        # PowerShell: Copy-Item .env.example .env
npm run dev
```

افتح http://localhost:5173، رح توصل لصفحة **/matching** وفيها 3 كروت شركاء وهميين. هيك بتعرف إنه React والراوتر وTanStack Query وaxios وMSW كلهم شغالين.

## متغيرات البيئة

| المتغير          | مثال                           | المعنى                                 |
| ---------------- | ------------------------------ | -------------------------------------- |
| `VITE_API_URL`   | `http://localhost:8000/api/v1` | عنوان الباك إند                        |
| `VITE_USE_MOCKS` | `true`                         | `true` يعني MSW بيزيّف الـ API بالمتصفح |

بنتحقق منها بـ Zod بملف `src/config/env.ts`، وإذا في قيمة ناقصة أو غلط بيطلع خطأ واضح أول ما يشتغل التطبيق.
ملف `.env` **ما بينرفع أبداً**، بس `.env.example`. إذا ضفت متغير جديد، ضيفه على `.env.example` و`src/config/env.ts` و`src/vite-env.d.ts` وعلى هالجدول.

## الأوامر اليومية

| الأمر            | إيمتى                                   |
| ---------------- | --------------------------------------- |
| `npm run dev`    | وقت الشغل                               |
| `npm run check`  | قبل كل PR، بيشغّل نفس اللي بيشغّله الـ CI |
| `npm run format` | لما `check` يقول التنسيق غلط            |

## مدير الحزم

**npm بس.** لا تستخدم yarn ولا pnpm، ودايماً ارفع `package-lock.json`. إذا ضفت مكتبة خبّر زميلك (واذكرها بالـ PR) ليعمل `npm install`.

## مشاكل شائعة

- **صفحة بيضا أو خطأ env**: نسيت ملف `.env`.
- **الطلبات رايحة عالسيرفر الحقيقي**: لازم `VITE_USE_MOCKS` يكون `true` بالضبط، وأعد تشغيل `npm run dev` بعد ما تعدّل `.env`.
- **"Port 5173 is in use"**: Vite بياخد البورت اللي بعده، اقرأ الرابط بالتيرمنال.

</div>
