# 07 · Conventions

**English** · [العربية](07-conventions.ar.md)

Formatting is automatic (Prettier + EditorConfig, format on save). These are the things tools can't decide for you.

## Naming

| Thing                 | Style                    | Example                                |
| --------------------- | ------------------------ | -------------------------------------- |
| Component file + name | PascalCase               | `ServiceCard.tsx` → `ServiceCard`      |
| Props type            | `<Component>Props`       | `ServiceCardProps`                     |
| Hook                  | `useX`, camelCase        | `useServices`                          |
| Other files           | kebab-case + role suffix | `service.schema.ts`, `services.api.ts` |
| Feature folder        | kebab-case               | `admin-members/`                       |
| Zod schema / type     | `XSchema` / `X`          | `MatchSchema` / `Match`                |
| Constants             | UPPER_SNAKE_CASE         | `ROUTES`, `QUERY_STALE_TIME`           |

- **Named exports only** (`export function X`), no `export default`.
- One component per file (small private helpers in the same file are fine).

## TypeScript & data

- Types come from Zod: `export type Match = z.infer<typeof MatchSchema>`. Don't write the same type by hand.
- No `any`. If you really don't know the type, use `unknown` and parse it.
- Server data lives in TanStack Query — don't copy it into `useState`.
- Query keys: one object per feature (`servicesKeys`) in `features/<f>/api/<f>.queries.ts`.

## Forms

react-hook-form + Zod:

```tsx
const form = useForm<LoginInput>({ resolver: zodResolver(LoginInputSchema) });

<Input id="email" {...form.register('email')} error={form.formState.errors.email?.message} />;
```

Show server validation errors (422) from `ApiRequestError.errors` with `form.setError(field, …)`.

## Styling

- **Tailwind only**, combined with `cn()`: `cn('p-4', isActive && 'bg-accent')`.
- Use **tokens**, never raw colors: `bg-primary`, `text-muted-foreground`, `border-border`, `bg-card`, `text-destructive`. Tokens live in `src/styles/index.css` and come from the brand palette — see [design/README.md](../design/README.md).
- No inline `style={{}}`, no CSS modules.
- **Exception — admin area** (`src/features/admin*`): MUI components with the admin theme (`sx={{ p: 2, color: 'text.secondary' }}`). Write `sx` in LTR terms; the RTL plugin flips them. Don't mix Tailwind classes into MUI. See [02 · The admin area](02-project-structure.md#the-admin-area).

## RTL (Arabic first)

The app is `dir="rtl"`. Use **logical** classes so it also works in LTR:

| ❌ Don't             | ✅ Do               |
| -------------------- | ------------------- |
| `ml-2` / `mr-2`      | `ms-2` / `me-2`     |
| `pl-4` / `pr-4`      | `ps-4` / `pe-4`     |
| `left-0` / `right-0` | `start-0` / `end-0` |
| `text-left`          | `text-start`        |
| `rounded-l-md`       | `rounded-s-md`      |

Icons that point a direction (arrows, chevrons) need `rtl:rotate-180`.

## UI states

Every screen that loads data handles: **loading** (`Spinner`) · **error** (`ErrorState` with retry) · **empty** (`EmptyState`).

## shadcn/ui (optional)

`components.json` is ready and our tokens use shadcn names, so:

```bash
npx shadcn@latest add dialog
```

puts the component in `src/shared/components/ui/`. Rename the file to PascalCase (`Dialog.tsx`) and open it as its own small PR. Check that a component doesn't already exist first.

## Text

UI text is Arabic for now, written directly in components. If we add i18n later we'll extract it — don't build an i18n system before it's decided.
