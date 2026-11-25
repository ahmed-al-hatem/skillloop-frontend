<div dir="rtl">

# 09 · إعداد الريبو (مرة وحدة)

[English](09-repo-setup.md) · **العربية**

بيعملها صاحب الريبو مرة وحدة. علّم على كل خطوة بتخلصها.

## 1. دعوة الزميل

- [ ] **Settings → Collaborators → Add people** واكتب اسم المستخدم تبعه على GitHub (صلاحية Write).
- [ ] بدّل `<teammate-username>` بـ `AGENTS.md` باسم المستخدم تبعه (بـ PR صغير).

## 2. حماية `main`

**Settings → Branches → Add branch ruleset** (أو _branch protection rule_ القديمة) على `main`:

- [ ] Require a pull request before merging
  - [ ] Required approvals: **1**
  - [ ] Dismiss stale approvals when new commits are pushed
- [ ] Require status checks to pass، وضيف **`check`** (بيطلع بعد ما يشتغل الـ CI أول مرة)، وخلّي الفرع لازم يكون محدّث
- [ ] Block force pushes · Restrict deletions
- [ ] **لا** تضيف bypass list، القواعد بتنطبق على صاحب الريبو كمان

## 3. إعدادات الـ Merge

**Settings → General → Pull Requests:**

- [ ] اسمح بـ **squash merging** بس (شيل merge commits وrebase merging)، والرسالة الافتراضية: _Pull request title_
- [ ] **Automatically delete head branches**

## 4. الـ Labels

اعمل: `feature`، `bug`، `chore`، `docs`، `shared-ui`، `blocked`، وواحد لكل feature: `auth`، `profile`، `matching`، `exchanges`، `time-bank`، `reviews`.

## 5. لوحة المشروع

**Projects → New project → Board**، اربطها بالريبو، وخلّي الأعمدة:
**Todo ← In progress ← Review ← Done**.

- كل مهمة إلها issue (القالب: **Task**). ضيفها عاللوحة.
- نقل الكروت: لما تبلّش ← _In progress_، لما تفتح PR ← _Review_، بعد الـ merge ← _Done_ (فعّل الـ workflows الجاهزة "Item closed → Done" و"Pull request merged → Done").

## 6. أول المهام (اقتراح)

بعد ما ينعمل merge للـ scaffold، تقسّموا حسب الـ feature لحتى ما تلمسوا نفس الملفات:

| المطوّر A              | المطوّر B                      |
| --------------------- | ----------------------------- |
| `auth`                | `profile` / المهارات          |
| `exchanges` / الجلسات | `reviews`                     |
| `time-bank`           | `matching` (الواجهة الحقيقية) |

أي مكوّن مشترك (modal، select، avatar…) بيكون بـ PR صغير لحاله بـ label `shared-ui` أول.

</div>
