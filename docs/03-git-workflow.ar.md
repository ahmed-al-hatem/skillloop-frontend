<div dir="rtl">

# 03 · سير عمل Git

[English](03-git-workflow.md) · **العربية**

> بتستخدم Claude Code أو Codex؟ ما في داعي تحفظ هالأوامر: `/start-task 12` و`/finish-task` بيعملوها عنك. شوف [08 · المساعدات الذكية](08-ai-assistants.ar.md).

## الفكرة

- `main` **محمي ودايماً شغّال**، وما حدا بيعمل push عليه مباشرة.
- ما في فرع `dev` (لأننا شخصين). كل مهمة = **issue واحد**، و**فرع قصير** بيطلع من `main`، و**PR واحد**.
- الـ PR بينعمله **Squash and merge** وبعدين بينحذف الفرع.

## أسماء الفروع

`<النوع>/<رقم-الـ-issue>-<اسم-قصير>`: أحرف صغيرة، بشرطات، من 2 لـ 4 كلمات إنجليزي.

| النوع       | لـ                            | مثال                             |
| ----------- | ----------------------------- | -------------------------------- |
| `feat/`     | ميزة جديدة                    | `feat/12-matching-list`          |
| `fix/`      | تصليح خطأ                     | `fix/18-login-error-message`     |
| `chore/`    | أدوات، مكتبات، إعدادات        | `chore/3-add-msw-exchanges`      |
| `docs/`     | توثيق بس                      | `docs/7-api-contract-auth`       |
| `refactor/` | إعادة ترتيب بدون تغيير السلوك | `refactor/21-split-profile-form` |

## رسائل الـ commit (Conventional Commits)

```
feat(matching): add partner card
fix(auth): show server error on login
chore: add msw handlers for exchanges
docs: describe wallet endpoints
```

الشكل: `type(scope): شو عملت، بصيغة الأمر، أحرف صغيرة، بالإنجليزي`. الـ scope هو اسم مجلد الـ feature.

## الدورة الكاملة لمهمة

```bash
# 1. ابدأ من main محدّث
git switch main
git pull

# 2. افتح فرع للمهمة
git switch -c feat/12-matching-list

# 3. اشتغل واعمل commits صغيرة
git add .
git commit -m "feat(matching): add suggestions list"

# 4. قبل ما تفتح PR: جيب آخر تحديثات main وحل أي conflict عندك بفرعك
git fetch origin
git merge origin/main
npm run check

# 5. ارفع الفرع وافتح PR
git push -u origin feat/12-matching-list
gh pr create --fill        # أو افتحه من GitHub، عبّي القالب واكتب "Closes #12"
```

بعدها زميلك بيراجع، بتعمل **Squash and merge** من GitHub، بتحذف الفرع، ومنرجع للخطوة 1.

## قواعد ذهبية

- خلّي الـ PR **صغير** (تقريباً أقل من 400 سطر) لينراجع بسرعة.
- **لا تشتغلوا على نفس الملف بنفس الوقت.** وإذا اضطريتوا احكوا مع بعض قبل.
- إذا طوّل الفرع أكتر من يوم، اعمل `git merge origin/main` **كل يوم**.
- `.env` ما بينرفع أبداً، بس `.env.example`.
- ممنوع `git push --force`، وممنوع تعدّل تاريخ commits مرفوعة.
- منستخدم merge مو rebase (أبسط وأأمن لفريق من شخصين).

## حل الـ conflict

1. `git merge origin/main` بيقلك `CONFLICT in <file>`.
2. افتح الملف بـ VS Code واختار لكل جزء **Accept Current** أو **Incoming** أو **Both**. خلّي الطرفين إذا الاتنين لازمين (متل `router.tsx`: خلّي سطري الـ spread).
3. شغّل `npm run check`، وبعدين:
   ```bash
   git add <file>
   git commit        # بيكمّل الـ merge
   ```
4. مو متأكد مين تعديله الصح؟ **اسأل زميلك** قبل ما تعمل commit.
5. بدك تلغي وتبلّش من جديد؟ `git merge --abort`.

</div>
