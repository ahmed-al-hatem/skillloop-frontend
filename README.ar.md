<div dir="rtl">

# SkillLoop — الواجهة الأمامية

[English](README.md) · **العربية**

SkillLoop منصة لتبادل المهارات بمهارات: قدّم اللي بتعرفه، احجز اللي بدك تتعلّمه، وادفع **بالنقاط** بدل المصاري. هالريبو هو واجهة الويب، وشاشاته منبنيها من تصاميم Figma.

**الستاك:** Vite · React · TypeScript · Tailwind CSS · React Router · TanStack Query · axios · Zod · react-hook-form · MSW

## بداية سريعة

```bash
npm install
cp .env.example .env     # على PowerShell: Copy-Item .env.example .env
npm run dev
```

افتح http://localhost:5173. لما يكون `VITE_USE_MOCKS=true` الـ API بيكون وهمي عن طريق MSW، يعني ما بتحتاج باك إند.

## الأوامر

| الأمر            | شو بيعمل                                            |
| ---------------- | --------------------------------------------------- |
| `npm run dev`    | سيرفر التطوير                                       |
| `npm run check`  | lint + typecheck + فحص التنسيق + build (نفس الـ CI) |
| `npm run format` | تصليح التنسيق بـ Prettier                           |
| `npm run build`  | build للإنتاج بمجلد `dist/`                         |

## التوثيق

كل شي بمجلد [`docs/`](docs/README.ar.md): البداية، هيكلية المشروع، سير عمل Git، المراجعة، عقد الـ API، البيانات الوهمية، الاصطلاحات، والشغل مع Claude Code وCodex.

أدوات الذكاء الاصطناعي بتقرأ [`AGENTS.md`](AGENTS.md) (القواعد)، و`CLAUDE.md` بيستورده.

</div>
